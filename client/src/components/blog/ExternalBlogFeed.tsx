import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fadeUpAnimation, staggerContainer } from "@/lib/motion";
import { formatDate } from "@/lib/utils";

interface ExternalBlogPost {
  id: number;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string | null;
  author?: string | null;
  categories?: string[];
  imageUrl?: string | null;
  source: string;
  cached: boolean;
  fetchedAt: string;
}

// Legacy response format from direct RSS feed
interface ExternalBlogResponse {
  source: string;
  items: {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    content?: string;
    author?: string;
    categories?: string[];
    imageUrl?: string;
  }[];
}

export default function ExternalBlogFeed() {
  // 사용할 리소스를 명시적으로 지정
  const source = "muravera19.com";
  
  // 데이터베이스에서 외부 블로그 포스트 가져오기
  const { data: dbPosts, isLoading: isDbLoading, error: dbError } = useQuery<ExternalBlogPost[]>({
    queryKey: ["/api/external-blog", source],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(`${queryKey[0]}?source=${source}`);
      if (!response.ok) {
        throw new Error("Failed to fetch external blog posts from database");
      }
      return await response.json();
    },
  });
  
  // 직접 RSS 피드에서 가져오는 기존 방식을 백업으로 유지 (데이터베이스에 데이터가 없는 경우)
  const { data: rssFeed, isLoading: isRssLoading, error: rssError } = useQuery<ExternalBlogResponse>({
    queryKey: ["/api/external-blog/direct"],
    queryFn: async () => {
      const response = await fetch("/api/external-blog");
      if (!response.ok) {
        throw new Error("Failed to fetch external blog posts from RSS");
      }
      return await response.json();
    },
    // 데이터베이스에서 가져오기가 성공하면 이 쿼리를 실행하지 않음
    enabled: !dbPosts || dbPosts.length === 0,
  });

  // Function to extract a short excerpt from HTML content
  const getExcerpt = (text: string, maxLength = 150): string => {
    // Remove HTML tags
    const strippedText = text.replace(/<[^>]*>/g, "");
    
    // Truncate to maxLength
    if (strippedText.length <= maxLength) return strippedText;
    
    // Find the last space before maxLength to avoid cutting words
    const lastSpace = strippedText.lastIndexOf(" ", maxLength);
    return lastSpace > 0 
      ? strippedText.substring(0, lastSpace) + "..." 
      : strippedText.substring(0, maxLength) + "...";
  };

  // 데이터베이스와 RSS 피드에서 모두 로딩 중인 경우
  const isLoading = isDbLoading && isRssLoading;
  
  // 사용할 데이터 결정 - 우선 데이터베이스에서 가져온 것 사용, 없으면 RSS 피드 사용
  const posts = dbPosts && dbPosts.length > 0 
    ? dbPosts 
    : rssFeed?.items || [];
    
  // 표시할 소스 이름 설정
  const sourceName = dbPosts && dbPosts.length > 0
    ? source
    : rssFeed?.source || source;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // 모든 데이터 소스에서 오류가 발생한 경우
  if ((dbError && rssError) || (!dbPosts && !rssFeed)) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load external blog posts.</p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="healside-container">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-poppins font-bold mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Latest from {sourceName}
          </motion.h2>
          <motion.p
            className="text-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Wellness insights from our partner blog
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {posts.map((post: any, index: number) => (
            <motion.div 
              key={post.link}
              variants={fadeUpAnimation}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {post.imageUrl && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-xs text-foreground/60">
                    {formatDate(post.pubDate)}
                  </span>
                  {post.categories && post.categories.length > 0 && (
                    <>
                      <span className="mx-2 text-foreground/30">•</span>
                      <span className="text-xs text-accent">
                        {Array.isArray(post.categories) 
                          ? post.categories[0] 
                          : typeof post.categories === 'string' 
                            ? post.categories.split(',')[0] 
                            : ''}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-poppins font-semibold text-lg mb-3">
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    {post.title}
                  </a>
                </h3>
                <p className="text-foreground/70 text-sm mb-4">
                  {post.description ? getExcerpt(post.description) : ''}
                </p>
                <a 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent font-medium text-sm hover:underline"
                >
                  Read More →
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}