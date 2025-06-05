import { Link } from "wouter";
import { motion } from "framer-motion";

export interface BlogPostType {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  published: boolean;
  publishDate: string;
}

interface BlogCardProps {
  post: BlogPostType;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  // Format date
  const date = new Date(post.publishDate);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);

  return (
    <motion.article 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <a className="block">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-52 object-cover"
          />
          <div className="p-6">
            <span className="text-xs text-foreground/60">{formattedDate}</span>
            <h3 className="font-poppins font-semibold text-lg mt-2 mb-3">{post.title}</h3>
            <p className="text-foreground/80 mb-4 text-sm">{post.excerpt}</p>
            <span className="font-poppins font-medium text-accent hover:text-accent/80 transition-all inline-flex items-center">
              Read More <i className="ri-arrow-right-line ml-1"></i>
            </span>
          </div>
        </a>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
