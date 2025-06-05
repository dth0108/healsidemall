import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

// JWT 인증 미들웨어
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    // JWT 비밀 키
    const secret = process.env.JWT_SECRET || 'default_secret_key_change_in_production';
    
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: '인증 실패: 유효하지 않은 토큰' });
      }
      
      // 토큰에서 사용자 ID 추출
      const userId = (decoded as any).userId;
      
      // 사용자 정보를 가져와 요청 객체에 추가
      storage.getUser(userId)
        .then(user => {
          if (!user) {
            return res.status(401).json({ message: '인증 실패: 사용자를 찾을 수 없음' });
          }
          
          // req.user에 사용자 정보 추가 (비밀번호 제외)
          const { password, ...userWithoutPassword } = user;
          (req as any).user = userWithoutPassword;
          
          next();
        })
        .catch(error => {
          console.error('인증 중 오류:', error);
          res.status(500).json({ message: '서버 오류' });
        });
    });
  } else {
    res.status(401).json({ message: '인증 필요' });
  }
};

// 관리자 권한 확인 미들웨어
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 먼저 JWT 인증 수행
  authenticateJWT(req, res, () => {
    const user = (req as any).user;
    
    // 관리자 권한 확인
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: '관리자 권한 필요' });
    }
    
    next();
  });
};

// API 키 인증 미들웨어 (모바일 앱용)
export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API 키 필요' });
  }
  
  // 실제 구현에서는 DB에서 API 키 유효성 검사 필요
  // 임시 구현: 정해진 API 키와 비교
  const validApiKey = process.env.API_KEY || 'test_api_key';
  
  if (apiKey !== validApiKey) {
    return res.status(401).json({ message: '유효하지 않은 API 키' });
  }
  
  next();
};