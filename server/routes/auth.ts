import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from '../storage';
import jwt from 'jsonwebtoken';
import { appleAuthInit, appleAuthCallback } from '../auth/apple';

export const authRouter = Router();

// JWT 시크릿 키 환경 변수나 기본값 사용
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;

// Passport 설정
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

// Google 전략 설정
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log("Google OAuth credentials found, setting up strategy");
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 구글 ID로 사용자 확인
          const existingUser = await storage.getUserByGoogleId(profile.id);
          
          if (existingUser) {
            // 필요시 사용자 정보 업데이트
            const updatedUser = await storage.updateUser(existingUser.id, {
              name: profile.displayName,
              profileImageUrl: profile.photos?.[0]?.value || null,
            });
            return done(null, updatedUser || existingUser);
          }
          
          // 새 사용자인 경우 이메일 확인
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('Google account has no email address'), null);
          }
          
          // 이메일로 기존 사용자 확인
          const existingEmailUser = await storage.getUserByEmail(email);
          
          if (existingEmailUser) {
            // 기존 사용자에 구글 ID 연결
            const updatedUser = await storage.updateUser(existingEmailUser.id, {
              googleId: profile.id,
              profileImageUrl: profile.photos?.[0]?.value || null,
            });
            return done(null, updatedUser);
          }
          
          // 새 사용자 생성
          const username = email.split('@')[0] + '-' + Math.floor(Math.random() * 1000);
          
          const newUser = await storage.createUser({
            username,
            email,
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
}

// 인증 라우트
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    try {
      console.log("Google OAuth callback received");
      
      // JWT 토큰 생성
      const user = req.user as any;
      
      if (!user || !user.id) {
        console.error("Google callback: User data not available", user);
        return res.redirect('/login?error=auth_failed');
      }
      
      console.log("Creating JWT for user:", user.id);
      
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin || false 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // 쿠키에 토큰 저장 또는 클라이언트로 응답
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      });

      // 홈페이지로 리디렉션
      res.redirect('/');
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect('/login?error=server_error');
    }
  }
);

// Apple 로그인 라우트
authRouter.get('/apple', (req: Request, res: Response) => {
  appleAuthInit(req, res);
});

authRouter.post('/apple/callback', (req: Request, res: Response) => {
  appleAuthCallback(req, res);
});

// 로그아웃
authRouter.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.redirect('/');
});

// 현재 인증된 사용자 정보
authRouter.get('/user', async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // 필요한 사용자 정보만 반환
  const { id, username, email, name, profileImageUrl, isAdmin } = req.user as any;
  
  res.json({
    id,
    username,
    email,
    name,
    profileImageUrl,
    isAdmin
  });
});

// 미들웨어 - 인증 확인
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// 미들웨어 - 관리자 확인
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user as any).isAdmin) {
    return next();
  }
  res.status(403).json({ message: 'Forbidden - Admin access required' });
};