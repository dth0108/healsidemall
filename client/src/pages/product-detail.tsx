import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState, useContext, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Rating from "@/components/ui/Rating";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AuthContext } from "@/App";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CartRecommendModal from "@/components/cart/CartRecommendModal";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";

interface ReviewFormState {
  rating: number;
  comment: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>({
    rating: 5,
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const floatingBarRef = useRef<HTMLDivElement>(null);
  const productInfoRef = useRef<HTMLDivElement>(null);

  const { 
    data: product, 
    isLoading: productLoading, 
    error: productError 
  } = useQuery({
    queryKey: [`/api/products/${id}`],
  });

  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: [`/api/products/${id}/reviews`],
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // 스크롤 이벤트를 감지하여 플로팅 바 표시 여부를 결정합니다
  useEffect(() => {
    const handleScroll = () => {
      if (productInfoRef.current) {
        const rect = productInfoRef.current.getBoundingClientRect();
        // 제품 정보 섹션이 뷰포트의 상단을 벗어나면 플로팅 바를 표시합니다
        setShowFloatingBar(rect.top < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    try {
      // For guest users we'd use a session ID stored in localStorage
      const sessionId = !isAuthenticated 
        ? localStorage.getItem('cartSessionId') || `guest-${Date.now()}`
        : undefined;
      
      if (!isAuthenticated && sessionId && !localStorage.getItem('cartSessionId')) {
        localStorage.setItem('cartSessionId', sessionId);
      }
      
      const response = await apiRequest("POST", "/api/cart", {
        productId: parseInt(id as string),
        quantity,
        sessionId: !isAuthenticated ? sessionId : undefined
      });
      
      const data = await response.json();
      
      // 장바구니에 추가 성공 시, 추천 제품 모달 띄우기
      setShowRecommendModal(true);
      
      // Invalidate cart cache
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }
    
    if (!reviewForm.comment) {
      toast({
        title: "Comment required",
        description: "Please enter a comment for your review",
        variant: "destructive",
      });
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      await apiRequest("POST", "/api/reviews", {
        productId: parseInt(id as string),
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      // Reset form
      setReviewForm({
        rating: 5,
        comment: "",
      });
      
      // Refetch reviews
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}/reviews`] });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Could not submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (productLoading) {
    return (
      <div className="healside-container py-16">
        <div className="flex flex-col md:flex-row gap-12">
          <Skeleton className="md:w-1/2 h-96 rounded-2xl" />
          <div className="md:w-1/2 space-y-6">
            <Skeleton className="h-10 w-4/5" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="healside-container py-16 text-center">
        <h2 className="text-2xl font-poppins font-semibold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you're looking for could not be found or has been removed.</p>
        <Link href="/products">
          <Button className="btn-primary">Return to Products</Button>
        </Link>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <>
      <Helmet>
        <title>{product?.name} | Healside</title>
        <meta name="description" content={`${product?.description?.substring(0, 150)}...`} />
      </Helmet>
      
      {/* 추천 제품 모달 - Casper.com 스타일 */}
      <CartRecommendModal 
        isOpen={showRecommendModal} 
        onClose={() => setShowRecommendModal(false)} 
        addedProduct={product as any}
      />
      
      {/* 플로팅 바 - Casper.com 스타일 */}
      <AnimatePresence>
        {showFloatingBar && product && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={floatingBarRef}
          >
            <div className="healside-container py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-poppins font-medium">{product.name}</h3>
                    <p className="text-lg font-semibold">${product.price?.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-2 py-1 border-r border-border hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium">{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-2 py-1 border-l border-border hover:bg-secondary transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-poppins text-sm font-medium transition-all shadow-md hover:shadow-lg"
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="healside-container py-16">
        {/* Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm">
            <Link href="/">
              <a className="text-foreground/60 hover:text-accent transition-colors">Home</a>
            </Link>
            {" / "}
            <Link href="/products">
              <a className="text-foreground/60 hover:text-accent transition-colors">Products</a>
            </Link>
            {" / "}
            <span className="text-foreground">{product.name}</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Product Image */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-auto rounded-2xl shadow-md object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            ref={productInfoRef}
          >
            <h1 className="text-3xl font-poppins font-bold mb-2">{product?.name}</h1>
            
            {/* Origin */}
            {product?.origin && (
              <p className="text-foreground/70 mb-4">{product.origin}</p>
            )}
            
            {/* Price */}
            <p className="text-2xl font-poppins font-medium mb-6">${product?.price?.toFixed(2)}</p>
            
            {/* Rating */}
            <div className="mb-6">
              <Rating value={avgRating} count={reviews?.length || 0} size="lg" />
            </div>
            
            {/* Description */}
            <p className="mb-8 text-foreground/80">{product?.description}</p>
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-md">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 text-lg border-r border-border hover:bg-secondary transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 text-lg border-l border-border hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-poppins text-sm font-medium transition-all"
                disabled={!product?.inStock}
              >
                {product?.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              {isAuthenticated && (
                <WishlistButton productId={product.id} />
              )}
            </div>
            
            {/* Extra Info */}
            <div className="border-t border-border pt-6 space-y-4">
              {product.supplier && (
                <p className="flex items-center gap-2">
                  <i className="ri-store-line text-accent"></i>
                  <span><strong>Supplier:</strong> {product.supplier}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <i className="ri-truck-line text-accent"></i>
                <span><strong>Shipping:</strong> Worldwide delivery</span>
              </p>
              <p className="flex items-center gap-2">
                <i className="ri-recycle-line text-accent"></i>
                <span><strong>Packaging:</strong> Eco-friendly materials</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tabs: Details and Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            {/* Product Details Tab */}
            <TabsContent value="details" className="mt-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-poppins font-semibold mb-6">About This Product</h2>
                <div className="space-y-6">
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-secondary p-6 rounded-lg">
                      <h3 className="font-poppins font-medium text-lg mb-3">Benefits</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <i className="ri-check-line text-accent mr-2 mt-1"></i>
                          <span>Promotes relaxation and wellbeing</span>
                        </li>
                        <li className="flex items-start">
                          <i className="ri-check-line text-accent mr-2 mt-1"></i>
                          <span>Ethically sourced materials</span>
                        </li>
                        <li className="flex items-start">
                          <i className="ri-check-line text-accent mr-2 mt-1"></i>
                          <span>Supports traditional artisans</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-secondary p-6 rounded-lg">
                      <h3 className="font-poppins font-medium text-lg mb-3">How to Use</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <i className="ri-arrow-right-s-line text-accent mr-2 mt-1"></i>
                          <span>Follow included instructions for best results</span>
                        </li>
                        <li className="flex items-start">
                          <i className="ri-arrow-right-s-line text-accent mr-2 mt-1"></i>
                          <span>Use consistently for optimal benefits</span>
                        </li>
                        <li className="flex items-start">
                          <i className="ri-arrow-right-s-line text-accent mr-2 mt-1"></i>
                          <span>Store in a cool, dry place</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-poppins font-semibold mb-6">Customer Reviews</h2>
                
                {/* Reviews summary */}
                <div className="flex items-center mb-8">
                  <div className="mr-4">
                    <p className="text-3xl font-poppins font-bold">{avgRating.toFixed(1)}</p>
                    <Rating value={avgRating} showCount={false} />
                    <p className="text-sm text-foreground/60 mt-1">{reviews?.length || 0} reviews</p>
                  </div>
                </div>
                
                {/* Review form */}
                <div className="mb-12">
                  <h3 className="font-poppins font-medium text-lg mb-4">Write a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block mb-2">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(rating => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                            className="text-xl"
                          >
                            <i className={`${reviewForm.rating >= rating ? 'ri-star-fill' : 'ri-star-line'} text-accent`}></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="comment" className="block mb-2">Your Review</label>
                      <textarea
                        id="comment"
                        rows={4}
                        className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        required
                      />
                    </div>
                    <Button 
                      type="submit"
                      className="btn-primary"
                      disabled={submittingReview || !isAuthenticated}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    {!isAuthenticated && (
                      <p className="text-sm text-foreground/60 mt-2">You must be logged in to submit a review.</p>
                    )}
                  </form>
                </div>
                
                {/* Reviews list */}
                <div>
                  {reviewsLoading ? (
                    <div className="space-y-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="border-b border-border pb-6 mb-6">
                          <Skeleton className="h-6 w-1/3 mb-2" />
                          <Skeleton className="h-4 w-1/5 mb-4" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-4/5" />
                        </div>
                      ))}
                    </div>
                  ) : reviewsError ? (
                    <p className="text-center text-red-500">Error loading reviews</p>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="border-b border-border pb-6 mb-6 last:border-0">
                          <Rating value={review.rating} showCount={false} />
                          <p className="text-sm text-foreground/60 mb-3">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center italic text-foreground/60">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-16">
          <NewsletterSignup 
            title="Stay Updated on Wellness"
            description="Get exclusive wellness tips, product updates, and special offers delivered to your inbox."
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
