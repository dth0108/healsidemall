import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';
import { Request, Response, NextFunction } from 'express';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials missing - Google auth will be disabled');
}

export const setupGoogleAuth = () => {
  // Passport session setup
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Use the GoogleStrategy within Passport
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: '/auth/google/callback',
        passReqToCallback: true,
      },
      async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          // Check if user already exists with this Google ID
          const existingUser = await storage.getUserByGoogleId(profile.id);
          
          if (existingUser) {
            // Update user's profile data if needed
            const updatedUser = await storage.updateUser(existingUser.id, {
              name: profile.displayName,
              profileImageUrl: profile.photos?.[0]?.value || null,
            });
            return done(null, updatedUser || existingUser);
          }
          
          // Generate a unique username based on email if this is a new user
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google account has no email address'), null);
          }
          
          const username = email.split('@')[0] + '-' + Math.floor(Math.random() * 1000);
          
          // Create new user
          const newUser = await storage.createUser({
            username: username,
            email: email,
            name: profile.displayName,
            googleId: profile.id,
            profileImageUrl: profile.photos?.[0]?.value || null,
          });
          
          return done(null, newUser);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

// Authentication middleware
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Admin authentication middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as any)?.isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden - Admin access required' });
};