import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import CategoryFilter from "@/components/products/CategoryFilter";

const Products = () => {
  const [location] = useLocation();
  const [category, setCategory] = useState<string>('all');
  
  // 로케이션 변경 시 카테고리 추출
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const categoryParam = urlParams.get('category') || 'all';
    console.log("Location changed, extracted category:", categoryParam);
    setCategory(categoryParam);
  }, [location]);
  
  // Set page title based on category
  const getPageTitle = () => {
    if (category === 'all') return 'All Products';
    return `${category} Products`;
  };

  // 디버깅을 위한 로그
  console.log("Products page rendering with category:", category);

  // 카테고리 별로 필터링된 제품 목록을 직접 로딩
  const handleCategorySelect = (selectedCategory: string) => {
    console.log("Category selected directly:", selectedCategory);
    if (selectedCategory === 'all') {
      setCategory('all');
      window.history.pushState(null, '', '/products');
    } else {
      setCategory(selectedCategory);
      window.history.pushState(null, '', `/products?category=${selectedCategory}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()} | Healside</title>
        <meta name="description" content={`Explore our collection of ${category !== 'all' ? category + ' ' : ''}wellness products, ethically sourced from around the world.`} />
      </Helmet>

      <section className="py-16 bg-secondary">
        <div className="healside-container">
          <h1 className="font-poppins font-bold text-3xl md:text-4xl text-center mb-4">{getPageTitle()}</h1>
          <p className="text-center text-foreground/80 max-w-2xl mx-auto mb-12">
            Discover wellness products handpicked for quality and effectiveness from healing traditions worldwide.
          </p>
          
          {/* 직접 연결한 카테고리 필터 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: "all", name: "All" },
              { id: "Relaxation", name: "Relaxation" },
              { id: "Meditation", name: "Meditation" },
              { id: "Skincare", name: "Skincare" },
              { id: "Spirituality", name: "Spirituality" }
            ].map((cat) => (
              <button
                key={cat.id}
                className={`px-6 py-2 rounded-full font-poppins text-sm font-medium transition-all ${
                  cat.id === category
                    ? "bg-accent text-white"
                    : "bg-white hover:bg-primary/50"
                }`}
                onClick={() => handleCategorySelect(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <ProductGrid category={category !== 'all' ? category : null} />
        </div>
      </section>
    </>
  );
};

export default Products;
