import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface WishlistButtonProps {
  productId: number;
  size?: "sm" | "default" | "lg";
}

export function WishlistButton({ productId, size = "default" }: WishlistButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if product is in wishlist
  const { data: wishlistData } = useQuery({
    queryKey: ["/api/wishlist/check", productId],
    retry: false,
  });

  const isInWishlist = wishlistData?.isInWishlist || false;

  const addToWishlist = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/wishlist", { productId });
    },
    onSuccess: () => {
      toast({
        title: "Added to wishlist",
        description: "Product has been added to your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist/check", productId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/wishlist/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Removed from wishlist",
        description: "Product has been removed from your wishlist.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist/check", productId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClick = () => {
    if (isInWishlist) {
      removeFromWishlist.mutate();
    } else {
      addToWishlist.mutate();
    }
  };

  const isLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 ${
        isInWishlist ? "bg-red-600 hover:bg-red-700" : ""
      }`}
    >
      <Heart
        className={`h-4 w-4 ${
          isInWishlist ? "fill-white text-white" : "text-gray-600"
        }`}
      />
      {isLoading ? "..." : isInWishlist ? "In Wishlist" : "Add to Wishlist"}
    </Button>
  );
}