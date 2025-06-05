import { useQuery } from "@tanstack/react-query";
import BlogCard, { BlogPostType } from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";

const BlogGrid = () => {
  const {
    data: blogPosts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
            <Skeleton className="w-full h-52" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading blog posts</div>;
  }

  if (!blogPosts || blogPosts.length === 0) {
    return <div className="text-center">No blog posts found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {blogPosts.map((post: BlogPostType, index: number) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};

export default BlogGrid;
