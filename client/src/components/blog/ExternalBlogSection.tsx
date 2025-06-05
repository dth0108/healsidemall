import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Calendar, User } from "lucide-react";

interface ExternalBlogPost {
  id: number;
  title: string;
  link: string;
  description: string;
  content?: string;
  imageUrl?: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  source: string;
}

export function ExternalBlogSection() {
  const { data: posts, isLoading, error } = useQuery<ExternalBlogPost[]>({
    queryKey: ["/api/external-blog"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Debug logging
  console.log('External blog data:', posts);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary/20">
        <div className="healside-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">
              Latest from Our Travel & Wellness Blog
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Discover wellness insights and travel experiences from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !posts || !Array.isArray(posts) || posts.length === 0) {
    return (
      <section className="py-16 bg-secondary/20">
        <div className="healside-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-poppins font-bold mb-4">
              Latest from Our Travel & Wellness Blog
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Discover wellness insights and travel experiences from around the world
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-foreground/60 mb-4">
              Unable to load blog posts at the moment.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-secondary/20">
      <div className="healside-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-poppins font-bold mb-4">
            Latest from Our Travel & Wellness Blog
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Discover wellness insights and travel experiences from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 6).map((post: ExternalBlogPost) => (
            <Card key={post.id} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              {post.imageUrl && (
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <CardHeader className="flex-1">
                <CardTitle className="line-clamp-2 text-lg">
                  {post.title}
                </CardTitle>
                
                <div className="flex items-center gap-4 text-sm text-foreground/60">
                  {post.author && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.pubDate)}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-foreground/70 line-clamp-3 mb-4">
                  {stripHtml(post.description)}
                </p>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(post.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline"
            onClick={() => window.open('https://muravera19.com', '_blank')}
            className="px-8"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Our Blog
          </Button>
        </div>
      </div>
    </section>
  );
}