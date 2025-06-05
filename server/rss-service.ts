import axios from 'axios';

export interface WordPressBlogPost {
  id: number;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

export async function fetchWordPressPosts(siteUrl: string): Promise<WordPressBlogPost[]> {
  try {
    console.log(`🌐 Fetching WordPress posts from: ${siteUrl}`);
    
    // WordPress REST API endpoint for posts
    const apiUrl = `${siteUrl}/wp-json/wp/v2/posts?per_page=10&_embed`;
    
    console.log(`📡 Making request to: ${apiUrl}`);
    const response = await axios.get(apiUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Healside-Blog-Integration/1.0'
      }
    });
    
    console.log(`✅ Received ${response.data?.length || 0} posts from WordPress API`);
    
    const posts: WordPressBlogPost[] = response.data.map((post: any) => {
      // Extract featured image
      let imageUrl = '';
      if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
      }
      
      // Extract categories
      let categories: string[] = [];
      if (post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]) {
        categories = post._embedded['wp:term'][0].map((term: any) => term.name);
      }
      
      // Extract author
      let author = '';
      if (post._embedded && post._embedded['author'] && post._embedded['author'][0]) {
        author = post._embedded['author'][0].name;
      }
      
      return {
        id: post.id,
        title: post.title?.rendered || '',
        link: post.link || '',
        pubDate: post.date || '',
        description: post.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || '',
        content: post.content?.rendered || null,
        author: author || null,
        categories: categories || [],
        imageUrl: imageUrl || null
      };
    });
    
    console.log(`📝 Transformed ${posts.length} WordPress posts`);
    return posts;
  } catch (error: any) {
    console.error('💥 Error fetching WordPress posts:', error.message);
    throw new Error(`Failed to fetch WordPress posts: ${error.message}`);
  }
}

// Helper function to format date
export function formatWordPressDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return dateString;
  }
}