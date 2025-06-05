import { useQuery } from "@tanstack/react-query";
import ProductCard, { ProductType } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

interface ProductGridProps {
  category?: string | null;
}

const ProductGrid = ({ category }: ProductGridProps) => {
  // 디버깅용 콘솔 로그 추가
  console.log("ProductGrid rendering with category:", category);
  
  const {
    data: products,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      let url = "/api/products";
      
      if (category) {
        url = `/api/products?category=${encodeURIComponent(category)}`;
      }
      
      console.log("Fetching products from URL:", url);
      
      // URL이 정상적으로 전달되는지 확인
      console.log("REQUEST URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log("Fetched products:", data);
      return data;
    },
    staleTime: 0 // 데이터를 항상 새로 가져오도록 설정
  });
  
  // 카테고리가 변경될 때마다 데이터를 다시 가져옵니다
  useEffect(() => {
    console.log("Category changed, refetching products:", category);
    refetch();
  }, [category, refetch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
            <Skeleton className="w-full h-64" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/6" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10 w-1/3 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading products</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center">No products found</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: ProductType, index: number) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
