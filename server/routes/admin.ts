import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { authenticateJWT } from '../middleware/auth';
import { z } from 'zod';
import { insertProductSchema } from '@shared/schema';

export const adminRouter = Router();

// 모든 관리자 요청에 인증 미들웨어 적용
adminRouter.use(authenticateJWT);

// 관리자 권한 확인 미들웨어
const requireAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: '관리자 권한이 없습니다' });
  }
  next();
};

// 모든 요청에 관리자 권한 확인
adminRouter.use(requireAdmin);

// 대시보드 통계 정보
adminRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // 제품 수 조회
    const products = await storage.getProducts();
    
    // 주문 수 조회
    const orders = await storage.getOrders(0); // 모든 주문 (임시 구현)
    
    // 사용자 수 조회
    const users = await storage.getUsers();
    
    // 총 매출 계산
    const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    // 인기 제품 (임시 데이터)
    const topProducts = products.slice(0, 5).map(product => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 50) + 1 // 임시 판매량 데이터
    }));
    
    // 최근 주문 (최신 5건)
    const recentOrders = orders.slice(0, 5);
    
    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalSales,
      topProducts,
      recentOrders
    });
  } catch (error) {
    console.error('대시보드 통계 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 제품 목록 조회
adminRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error('제품 목록 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 제품 상세 조회
adminRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await storage.getProduct(id);
    
    if (!product) {
      return res.status(404).json({ message: '제품을 찾을 수 없습니다' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('제품 상세 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 제품 추가
adminRouter.post('/products', async (req: Request, res: Response) => {
  try {
    // 입력 데이터 검증
    const productData = insertProductSchema.parse(req.body);
    
    // 제품 추가
    const newProduct = await storage.createProduct(productData);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('제품 추가 중 오류:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: '잘못된 입력 데이터', errors: error.errors });
    } else {
      res.status(500).json({ message: '서버 오류' });
    }
  }
});

// 제품 수정
adminRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // 제품 존재 확인
    const existingProduct = await storage.getProduct(id);
    if (!existingProduct) {
      return res.status(404).json({ message: '제품을 찾을 수 없습니다' });
    }
    
    // 업데이트 데이터 검증
    const updateData = req.body;
    
    // 제품 수정
    const updatedProduct = await storage.updateProduct(id, updateData);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error('제품 수정 중 오류:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: '잘못된 입력 데이터', errors: error.errors });
    } else {
      res.status(500).json({ message: '서버 오류' });
    }
  }
});

// 제품 삭제
adminRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    // 제품 존재 확인
    const existingProduct = await storage.getProduct(id);
    if (!existingProduct) {
      return res.status(404).json({ message: '제품을 찾을 수 없습니다' });
    }
    
    // 제품 삭제
    const deleted = await storage.deleteProduct(id);
    
    if (deleted) {
      res.json({ success: true, message: '제품이 삭제되었습니다' });
    } else {
      res.status(500).json({ message: '제품 삭제 실패' });
    }
  } catch (error) {
    console.error('제품 삭제 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 모바일 앱 정보 조회
adminRouter.get('/mobile/app-info', (req: Request, res: Response) => {
  // 실제 구현에서는 DB에서 정보를 조회해야 함
  res.json({
    version: '1.0.0',
    lastSync: new Date().toISOString(),
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx', // 실제로는 DB에서 가져와야 함
    syncEnabled: true,
    connectionStatus: 'connected'
  });
});

// API 키는 환경 변수에서 가져오거나 동적으로 생성
const apiKey = process.env.ADMIN_API_KEY;
if (!apiKey) {
  throw new Error("ADMIN_API_KEY environment variable is required");
}

// API 키 생성
adminRouter.post('/mobile/api-key', async (req: Request, res: Response) => {
  try {
    // 실제 구현에서는 안전한 API 키 생성 로직 필요
    const apiKey = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // 키를 사용자 정보에 저장 (실제로는 DB에 저장해야 함)
    res.json({ apiKey });
  } catch (error) {
    console.error('API 키 생성 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 모바일 앱에서 제품 추가
adminRouter.post('/mobile/products', async (req: Request, res: Response) => {
  try {
    // API 키 확인 (실제 구현에서는 검증 로직 필요)
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ message: 'API 키가 필요합니다' });
    }
    
    // 입력 데이터 검증
    const productData = insertProductSchema.parse(req.body);
    
    // 제품 추가
    const newProduct = await storage.createProduct(productData);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('모바일 앱에서 제품 추가 중 오류:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: '잘못된 입력 데이터', errors: error.errors });
    } else {
      res.status(500).json({ message: '서버 오류' });
    }
  }
});

// 동기화 설정 변경
adminRouter.post('/mobile/toggle-sync', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    // 실제 구현에서는 DB에 설정 저장 필요
    
    res.json({ syncEnabled: enabled });
  } catch (error) {
    console.error('동기화 설정 변경 중 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});