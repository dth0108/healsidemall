import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams();
  
  const { 
    data: post, 
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/blog/${slug}`],
  });

  if (isLoading) {
    return (
      <div className="healside-container py-16">
        <Skeleton className="h-8 w-2/3 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
        <Skeleton className="w-full h-96 mb-10 rounded-xl" />
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="healside-container py-16 text-center">
        <h2 className="text-2xl font-poppins font-semibold mb-4">Article Not Found</h2>
        <p className="mb-8">The article you're looking for could not be found or has been removed.</p>
        <Link href="/blog">
          <Button className="btn-primary">Return to Blog</Button>
        </Link>
      </div>
    );
  }

  // Format date
  const date = new Date(post.publishDate);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <>
      <Helmet>
        <title>{post.title} | Healside</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <article className="pb-16">
        {/* Featured Image */}
        <div className="w-full h-[40vh] bg-primary relative overflow-hidden">
          <img 
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
            <div className="healside-container pb-12">
              <motion.div 
                className="max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-poppins font-bold text-3xl md:text-5xl text-white mb-4">{post.title}</h1>
                <p className="text-white/80">{formattedDate}</p>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Breadcrumb */}
        <div className="healside-container pt-8">
          <p className="text-sm mb-10">
            <Link href="/">
              <a className="text-foreground/60 hover:text-accent transition-colors">Home</a>
            </Link>
            {" / "}
            <Link href="/blog">
              <a className="text-foreground/60 hover:text-accent transition-colors">Blog</a>
            </Link>
            {" / "}
            <span className="text-foreground">{post.title}</span>
          </p>
        </div>
        
        {/* Article Content */}
        <div className="healside-container">
          <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm max-w-3xl mx-auto">
            <p className="text-xl text-foreground/80 font-medium mb-8">{post.excerpt}</p>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Share and Tags */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-between items-center">
                <div>
                  <h3 className="font-poppins font-medium mb-2">Share this article</h3>
                  <div className="flex gap-3">
                    <a href="#" className="text-xl hover:text-accent transition-colors">
                      <i className="ri-facebook-fill"></i>
                    </a>
                    <a href="#" className="text-xl hover:text-accent transition-colors">
                      <i className="ri-twitter-fill"></i>
                    </a>
                    <a href="#" className="text-xl hover:text-accent transition-colors">
                      <i className="ri-pinterest-fill"></i>
                    </a>
                    <a href="#" className="text-xl hover:text-accent transition-colors">
                      <i className="ri-mail-line"></i>
                    </a>
                  </div>
                </div>
                <div>
                  <Link href="/blog">
                    <Button variant="outline" className="mt-4 sm:mt-0">
                      <i className="ri-arrow-left-line mr-2"></i> Back to Articles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPost;
