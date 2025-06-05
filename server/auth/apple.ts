import { Request, Response } from 'express';
import appleSignin from 'apple-signin-auth';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

// JWT 시크릿 키 환경 변수나 기본값 사용
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Apple Login 초기화
export const appleAuthInit = (req: Request, res: Response) => {
  // Generate a random state value for CSRF protection
  const state = uuidv4();
  
  // Store state in a cookie for verification (secure in production)
  res.cookie('apple_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    sameSite: 'lax'
  });
  
  // Generate authorization URL
  const redirectUri = `${req.protocol}://${req.hostname}/auth/apple/callback`;
  
  // Redirect to Apple's OAuth page
  // Note: In a production app, you'd use the complete Apple Sign-In configuration
  res.redirect(
    `https://appleid.apple.com/auth/authorize?` +
    `client_id=${process.env.APPLE_CLIENT_ID || 'com.healside.service'}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=name email` +
    `&response_mode=form_post` +
    `&state=${state}`
  );
};

// Apple Login 콜백 처리
export const appleAuthCallback = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body;
    const cookies = req.cookies || {};
    
    // Verify state to prevent CSRF attacks
    if (!cookies.apple_auth_state || cookies.apple_auth_state !== state) {
      console.error('Apple auth callback: Invalid state parameter');
      return res.redirect('/login?error=invalid_state');
    }
    
    // Clear state after use
    res.clearCookie('apple_auth_state');
    
    // Get redirect URI (same as in the init function)
    const redirectUri = `${req.protocol}://${req.hostname}/auth/apple/callback`;
    
    // Exchange code for tokens using the Apple Sign In library
    const appleAuthClientId = process.env.APPLE_CLIENT_ID || 'com.healside.service';
    const appleAuthTeamId = process.env.APPLE_TEAM_ID || 'ABCDEF1234';
    const appleAuthKeyId = process.env.APPLE_KEY_ID || 'ABCDEF1234';
    const appleAuthPrivateKey = process.env.APPLE_PRIVATE_KEY || '';
    
    // In a real implementation, client secret would be generated with proper keys
    // This is just a demonstration - actual implementation requires Apple Developer credentials
    const clientSecret = await appleSignin.getClientSecret({
      clientID: appleAuthClientId,
      teamID: appleAuthTeamId,
      keyIdentifier: appleAuthKeyId,
      privateKey: appleAuthPrivateKey,
    });
    
    // Exchange code for tokens
    const tokenResponse = await appleSignin.getAuthorizationToken(code, {
      clientID: appleAuthClientId,
      clientSecret,
      redirectUri: redirectUri,
    });
    
    // Verify id token
    const { sub: appleUserId, email } = await appleSignin.verifyIdToken(
      tokenResponse.id_token,
      {
        audience: appleAuthClientId,
        // Not using nonce for this implementation
      }
    );
    
    // Check if user exists
    let user = await storage.getUserByAppleId(appleUserId);
    
    if (user) {
      // Update user info if needed
      user = await storage.updateUser(user.id, {
        email: email || user.email, // Apple might not always provide email on subsequent logins
      });
    } else if (email) {
      // Check if user exists with this email
      const existingEmailUser = await storage.getUserByEmail(email);
      
      if (existingEmailUser) {
        // Link Apple ID to existing account
        user = await storage.updateUser(existingEmailUser.id, {
          appleId: appleUserId,
        });
      } else {
        // Create new user
        const username = `apple_${Math.floor(Math.random() * 1000000)}`;
        
        user = await storage.createUser({
          username,
          email,
          appleId: appleUserId,
          name: req.body.user ? JSON.parse(req.body.user).name?.firstName || null : null,
        });
      }
    } else {
      console.error('Apple auth callback: No email provided');
      return res.redirect('/login?error=no_email');
    }
    
    // Generate JWT
    const token = jwt.sign(
      { 
        id: user?.id,
        email: user?.email,
        isAdmin: user?.isAdmin || false 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Redirect to home
    res.redirect('/');
  } catch (error) {
    console.error('Apple auth callback error:', error);
    res.redirect('/login?error=authentication_failed');
  }
};