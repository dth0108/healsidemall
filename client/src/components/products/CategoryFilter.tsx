import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface CategoryFilterProps {
  activeCategory?: string;
}

// 데이터베이스에 저장된 정확한 카테고리 이름과 일치시킴
const categories = [
  { id: "all", name: "All" },
  { id: "Relaxation", name: "Relaxation" },
  { id: "Meditation", name: "Meditation" },
  { id: "Skincare", name: "Skincare" },
  { id: "Spirituality", name: "Spirituality" }
];

const CategoryFilter = ({ activeCategory = "all" }: CategoryFilterProps) => {
  const [_, setLocation] = useLocation();
  console.log("Current active category:", activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    if (categoryId === "all") {
      setLocation("/products");
    } else {
      setLocation(`/products?category=${categoryId}`);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => (
        <motion.button
          key={category.id}
          className={`px-6 py-2 rounded-full font-poppins text-sm font-medium transition-all ${
            category.id === activeCategory
              ? "bg-accent text-white"
              : "bg-white hover:bg-primary/50"
          }`}
          onClick={() => handleCategoryChange(category.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
