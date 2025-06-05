import React, { useState } from 'react';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit2, Trash2, MoreHorizontal, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
  supplier: string | null;
  origin: string | null;
  inStock: boolean | null;
  stockQuantity: number | null;
  lowStockThreshold: number | null;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    description: '',
    category: 'Relaxation',
    imageUrl: '',
    supplier: '',
    origin: '',
    inStock: true,
    stockQuantity: 0,
    lowStockThreshold: 5
  });

  // 제품 목록 가져오기
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/products'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/products');
      return response.json() as Promise<Product[]>;
    }
  });

  // 제품 추가 뮤테이션
  const addProductMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const response = await apiRequest('POST', '/api/admin/products', product);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: '제품 추가 성공',
        description: '새로운 제품이 추가되었습니다.',
      });
      refetch();
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: '제품 추가 실패',
        description: '제품 추가 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // 제품 수정 뮤테이션
  const updateProductMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const response = await apiRequest('PUT', `/api/admin/products/${product.id}`, product);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: '제품 수정 성공',
        description: '제품 정보가 업데이트되었습니다.',
      });
      refetch();
      setOpenDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: '제품 수정 실패',
        description: '제품 수정 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // 제품 삭제 뮤테이션
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/products/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: '제품 삭제 성공',
        description: '제품이 삭제되었습니다.',
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: '제품 삭제 실패',
        description: '제품 삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
      console.error(error);
    }
  });

  // 폼 초기화
  const resetForm = () => {
    setCurrentProduct({
      name: '',
      price: '',
      description: '',
      category: 'Relaxation',
      imageUrl: '',
      supplier: '',
      origin: '',
      inStock: true,
      stockQuantity: 0,
      lowStockThreshold: 5
    });
    setIsEditing(false);
  };

  // 제품 편집 시작
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검사
    if (!currentProduct.name || !currentProduct.price || !currentProduct.description || !currentProduct.category || !currentProduct.imageUrl) {
      toast({
        title: '입력 오류',
        description: '모든 필수 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    if (isEditing) {
      updateProductMutation.mutate(currentProduct);
    } else {
      addProductMutation.mutate(currentProduct);
    }
  };

  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  // 선택 필드 변경 처리
  const handleSelectChange = (name: string, value: string) => {
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

  // 재고 상태 변경 처리
  const handleStockChange = (value: string) => {
    setCurrentProduct(prev => ({ ...prev, inStock: value === 'true' }));
  };

  // 제품 삭제 처리
  const handleDelete = (id: number) => {
    if (window.confirm('정말 이 제품을 삭제하시겠습니까?')) {
      deleteProductMutation.mutate(id);
    }
  };

  // 검색어로 제품 필터링
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return <div className="py-4">제품 정보를 불러오는 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">제품 관리</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setOpenDialog(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" />
              새 제품 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? '제품 수정' : '새 제품 추가'}</DialogTitle>
              <DialogDescription>
                {isEditing ? '제품 정보를 수정하세요.' : '새로운 제품을 추가하세요.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">제품명</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">가격</Label>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    value={currentProduct.price}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="예: 25.99"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">카테고리</Label>
                  <Select 
                    value={currentProduct.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Relaxation">Relaxation</SelectItem>
                      <SelectItem value="Meditation">Meditation</SelectItem>
                      <SelectItem value="Spirituality">Spirituality</SelectItem>
                      <SelectItem value="Skincare">Skincare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">이미지 URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={currentProduct.imageUrl}
                    onChange={handleChange}
                    className="col-span-3"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">설명</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentProduct.description}
                    onChange={handleChange}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">공급업체</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={currentProduct.supplier || ''}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="origin" className="text-right">원산지</Label>
                  <Input
                    id="origin"
                    name="origin"
                    value={currentProduct.origin || ''}
                    onChange={handleChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inStock" className="text-right">재고 상태</Label>
                  <Select 
                    value={currentProduct.inStock ? 'true' : 'false'} 
                    onValueChange={handleStockChange}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="재고 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">재고 있음</SelectItem>
                      <SelectItem value="false">재고 없음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                  취소
                </Button>
                <Button type="submit">
                  {isEditing ? '수정하기' : '추가하기'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center border rounded-md px-3 py-2 max-w-sm mb-4">
        <Search className="h-4 w-4 mr-2 opacity-50" />
        <Input 
          className="border-0 p-0 shadow-none focus-visible:ring-0" 
          placeholder="제품명, 카테고리, 공급업체 검색..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이미지</TableHead>
              <TableHead>제품명</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>재고</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? '재고 있음' : '재고 없음'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {searchTerm ? '검색 결과가 없습니다.' : '제품이 없습니다.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}