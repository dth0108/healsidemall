import axios from 'axios';

async function testWordPressAPI() {
  try {
    console.log('Testing WordPress REST API...');
    const response = await axios.get('https://www.muravera19.com/wp-json/wp/v2/posts?per_page=3&_embed', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Healside-Blog-Integration/1.0'
      }
    });
    
    console.log(`Success! Fetched ${response.data.length} posts`);
    
    const post = response.data[0];
    console.log('Sample post data:');
    console.log('- ID:', post.id);
    console.log('- Title:', post.title?.rendered);
    console.log('- Date:', post.date);
    console.log('- Link:', post.link);
    console.log('- Has featured media:', !!post._embedded?.['wp:featuredmedia']);
    console.log('- Has author:', !!post._embedded?.author);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);
  }
}

testWordPressAPI();