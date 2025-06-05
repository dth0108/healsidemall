import { 
  User, InsertUser, users,
  Product, InsertProduct, products,
  Review, InsertReview, reviews,
  Wishlist, InsertWishlist, wishlists,
  NewsletterSubscription, InsertNewsletter, newsletterSubscriptions,
  Order, InsertOrder, orders,
  OrderItem, InsertOrderItem, orderItems,
  Cart, InsertCart, carts,
  CartItem, InsertCartItem, cartItems,
  BlogPost, InsertBlogPost, blogPosts,
  ExternalBlogPost, InsertExternalBlogPost, externalBlogPosts
} from "@shared/schema";

// modify the interface with any CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined>;

  // Product methods
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Stock management methods
  updateStock(productId: number, quantity: number): Promise<Product | undefined>;
  checkStock(productId: number, requestedQuantity: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Review methods
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Wishlist methods
  getWishlist(userId: number): Promise<Wishlist[]>;
  addToWishlist(wishlist: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  isInWishlist(userId: number, productId: number): Promise<boolean>;
  
  // Newsletter methods
  subscribeNewsletter(subscription: InsertNewsletter): Promise<NewsletterSubscription>;
  unsubscribeNewsletter(email: string): Promise<boolean>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
  
  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Order Item methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart methods
  getCart(userId?: number, sessionId?: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  clearCart(cartId: number): Promise<boolean>;
  
  // Cart Item methods
  getCartItems(cartId: number): Promise<CartItem[]>;
  getCartItem(cartId: number, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  
  // External Blog methods
  getExternalBlogPosts(source?: string): Promise<ExternalBlogPost[]>;
  getExternalBlogPost(id: number): Promise<ExternalBlogPost | undefined>;
  getExternalBlogPostByLink(link: string): Promise<ExternalBlogPost | undefined>;
  createExternalBlogPost(blogPost: InsertExternalBlogPost): Promise<ExternalBlogPost>;
  saveExternalBlogPosts(blogPosts: InsertExternalBlogPost[]): Promise<ExternalBlogPost[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private reviews: Map<number, Review>;
  private wishlists: Map<number, Wishlist>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private blogPosts: Map<number, BlogPost>;
  private externalBlogPosts: Map<number, ExternalBlogPost>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentReviewId: number;
  private currentWishlistId: number;
  private currentNewsletterSubscriptionId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentCartId: number;
  private currentCartItemId: number;
  private currentBlogPostId: number;
  private currentExternalBlogPostId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.reviews = new Map();
    this.wishlists = new Map();
    this.newsletterSubscriptions = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.blogPosts = new Map();
    this.externalBlogPosts = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentReviewId = 1;
    this.currentWishlistId = 1;
    this.currentNewsletterSubscriptionId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentCartId = 1;
    this.currentCartItemId = 1;
    this.currentBlogPostId = 1;
    this.currentExternalBlogPostId = 1;
    
    // Seed with sample data
    this.seedUsers();
    this.seedProducts();
    this.seedBlogPosts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId
    );
  }
  
  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.appleId === appleId
    );
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    // 기본값으로 관리자 아님, stripeCustomerId, stripeSubscriptionId를 null로 설정
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: insertUser.isAdmin || false,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      googleId: insertUser.googleId || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      password: insertUser.password || null
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(id: number, stripeCustomerId: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, stripeCustomerId };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserStripeInfo(id: number, info: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: info.stripeCustomerId, 
      stripeSubscriptionId: info.stripeSubscriptionId 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product methods
  async getProducts(category?: string): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    console.log("Server: getProducts called with category:", category);
    console.log("Server: Available products:", products.map(p => `${p.name} (${p.category})`));
    
    if (category && category !== 'all') {
      console.log("Server: Filtering by category:", category);
      products = products.filter(product => product.category === category);
      console.log("Server: Filtered products:", products.map(p => p.name));
    }
    
    return products;
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      stockQuantity: insertProduct.stockQuantity || 0,
      lowStockThreshold: insertProduct.lowStockThreshold || 5
    };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Stock management methods
  async updateStock(productId: number, quantity: number): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    const updatedProduct = { 
      ...product, 
      stockQuantity: (product.stockQuantity || 0) + quantity,
      inStock: (product.stockQuantity || 0) + quantity > 0
    };
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }

  async checkStock(productId: number, requestedQuantity: number): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product) return false;
    return (product.stockQuantity || 0) >= requestedQuantity;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => 
      (product.stockQuantity || 0) <= (product.lowStockThreshold || 5)
    );
  }
  
  // Review methods
  async getReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.productId === productId
    );
  }
  
  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentReviewId++;
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date(),
      comment: insertReview.comment || null
    };
    this.reviews.set(id, review);
    return review;
  }

  // Wishlist methods
  async getWishlist(userId: number): Promise<Wishlist[]> {
    return Array.from(this.wishlists.values()).filter(w => w.userId === userId);
  }

  async addToWishlist(insertWishlist: InsertWishlist): Promise<Wishlist> {
    const id = this.currentWishlistId++;
    const wishlist: Wishlist = { 
      ...insertWishlist, 
      id, 
      createdAt: new Date()
    };
    this.wishlists.set(id, wishlist);
    return wishlist;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    for (const [id, wishlist] of this.wishlists.entries()) {
      if (wishlist.userId === userId && wishlist.productId === productId) {
        this.wishlists.delete(id);
        return true;
      }
    }
    return false;
  }

  async isInWishlist(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.wishlists.values()).some(
      w => w.userId === userId && w.productId === productId
    );
  }

  // Newsletter methods
  async subscribeNewsletter(insertNewsletter: InsertNewsletter): Promise<NewsletterSubscription> {
    // Check if email already exists
    const existing = Array.from(this.newsletterSubscriptions.values()).find(
      sub => sub.email === insertNewsletter.email
    );
    
    if (existing) {
      // Reactivate if inactive
      if (!existing.isActive) {
        existing.isActive = true;
      }
      return existing;
    }

    const id = this.currentNewsletterSubscriptionId++;
    const subscription: NewsletterSubscription = { 
      ...insertNewsletter, 
      id, 
      isActive: true,
      createdAt: new Date()
    };
    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async unsubscribeNewsletter(email: string): Promise<boolean> {
    for (const subscription of this.newsletterSubscriptions.values()) {
      if (subscription.email === email) {
        subscription.isActive = false;
        return true;
      }
    }
    return false;
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).filter(sub => sub.isActive);
  }
  
  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, order);
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }
  
  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }
  
  // Cart methods
  async getCart(userId?: number, sessionId?: string): Promise<Cart | undefined> {
    if (userId) {
      return Array.from(this.carts.values()).find(
        cart => cart.userId === userId
      );
    }
    
    if (sessionId) {
      return Array.from(this.carts.values()).find(
        cart => cart.sessionId === sessionId
      );
    }
    
    return undefined;
  }
  
  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.currentCartId++;
    const cart: Cart = { 
      ...insertCart, 
      id, 
      createdAt: new Date() 
    };
    this.carts.set(id, cart);
    return cart;
  }
  
  async clearCart(cartId: number): Promise<boolean> {
    const cartItemsToDelete = Array.from(this.cartItems.values())
      .filter(item => item.cartId === cartId);
      
    cartItemsToDelete.forEach(item => {
      this.cartItems.delete(item.id);
    });
    
    return true;
  }
  
  // Cart Item methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.cartId === cartId
    );
  }
  
  async getCartItem(cartId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.cartId === cartId && item.productId === productId
    );
  }
  
  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).filter(post => post.published);
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      post => post.slug === slug
    );
  }
  
  async createBlogPost(insertBlogPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const blogPost: BlogPost = { 
      ...insertBlogPost, 
      id, 
      publishDate: new Date() 
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  // External Blog methods
  async getExternalBlogPosts(source?: string): Promise<ExternalBlogPost[]> {
    const posts = Array.from(this.externalBlogPosts.values());
    if (source) {
      return posts.filter(post => post.source === source);
    }
    return posts;
  }

  async getExternalBlogPost(id: number): Promise<ExternalBlogPost | undefined> {
    return this.externalBlogPosts.get(id);
  }

  async getExternalBlogPostByLink(link: string): Promise<ExternalBlogPost | undefined> {
    for (const post of this.externalBlogPosts.values()) {
      if (post.link === link) {
        return post;
      }
    }
    return undefined;
  }

  async createExternalBlogPost(insertPost: InsertExternalBlogPost): Promise<ExternalBlogPost> {
    const id = this.currentExternalBlogPostId++;
    const post: ExternalBlogPost = {
      ...insertPost,
      id,
      fetchedAt: new Date(),
      cached: true,
    };
    this.externalBlogPosts.set(id, post);
    return post;
  }

  async saveExternalBlogPosts(blogPosts: InsertExternalBlogPost[]): Promise<ExternalBlogPost[]> {
    const savedPosts: ExternalBlogPost[] = [];
    
    for (const post of blogPosts) {
      // 중복 방지를 위해 링크로 확인
      const existingPost = await this.getExternalBlogPostByLink(post.link);
      if (existingPost) {
        savedPosts.push(existingPost);
      } else {
        const newPost = await this.createExternalBlogPost(post);
        savedPosts.push(newPost);
      }
    }
    
    return savedPosts;
  }
  
  // Seed methods
  private seedUsers() {
    // 관리자 계정 생성
    const adminUser = {
      username: 'admin',
      email: 'admin@healside.com',
      role: 'admin',
      // Password will be set through environment variable
      password: process.env.ADMIN_PASSWORD || undefined
    };
    this.users.set(this.currentUserId++, adminUser);
  }

  private seedProducts() {
    const productsSeed: InsertProduct[] = [
      // Relaxation 카테고리 제품
      {
        name: 'Aromatherapy Oil',
        price: 25.00,
        description: 'Pure essential oil blend to promote relaxation and stress relief.',
        category: 'Relaxation',
        imageUrl: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        supplier: 'Aromatherapy Co.',
        origin: 'Provence, France',
        inStock: true
      },
      {
        name: 'Herbal Tea Blend',
        price: 15.00,
        description: 'Organic blend of calming herbs to promote relaxation and better sleep.',
        category: 'Relaxation',
        imageUrl: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        supplier: 'Organic Herbals',
        origin: 'Sourced from Kerala, India',
        inStock: true
      },
      {
        name: 'Bamboo Diffuser',
        price: 50.00,
        description: 'Sustainable bamboo essential oil diffuser with LED color therapy lights.',
        category: 'Relaxation',
        imageUrl: 'https://images.pexels.com/photos/4046769/pexels-photo-4046769.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        supplier: 'Eco Home',
        origin: 'Crafted in Bali, Indonesia',
        inStock: true
      },
      {
        name: 'Sleep Sound Machine',
        price: 40.00,
        description: 'Sound machine with 10 soothing nature sounds to promote deep, restful sleep.',
        category: 'Relaxation',
        imageUrl: '/images/products/sleep sound machine.jpg',
        supplier: 'SleepWell',
        origin: 'Designed in Sweden',
        inStock: true
      },
      
      // Meditation 카테고리 제품
      {
        name: 'Meditation Cushion',
        price: 45.00,
        description: 'Ergonomic cushion filled with natural buckwheat hulls for comfortable meditation.',
        category: 'Meditation',
        imageUrl: '/images/products/meditation_cushion.jpg',
        supplier: 'Zen Living',
        origin: 'Crafted in Japan',
        inStock: true
      },
      {
        name: 'Tibetan Singing Bowl',
        price: 65.00,
        description: 'Hand-hammered singing bowl for sound meditation and deep relaxation.',
        category: 'Meditation',
        imageUrl: '/images/products/tibetan singing bowl.jpg',
        supplier: 'Himalayan Crafts',
        origin: 'Nepal',
        inStock: true
      },
      {
        name: 'Mindfulness Journal',
        price: 18.00,
        description: 'Guided journal with prompts to cultivate mindfulness and present-moment awareness.',
        category: 'Meditation',
        imageUrl: 'https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
        supplier: 'Mindful Living',
        origin: 'Printed in USA with recycled materials',
        inStock: true
      },
      {
        name: 'Meditation Timer',
        price: 29.00,
        description: 'Simple wooden timer with gentle chime sounds for meditation timing.',
        category: 'Meditation',
        imageUrl: '/images/products/meditation_timer.jpg',
        supplier: 'Peaceful Presence',
        origin: 'Handcrafted in Thailand',
        inStock: true
      },
      
      // Spirituality 카테고리 제품
      {
        name: 'Crystal Healing Set',
        price: 35.00,
        description: 'Set of 5 healing crystals with guide for chakra balancing and energy work.',
        category: 'Spirituality',
        imageUrl: '/images/products/crystal_healing_set.jpg',
        supplier: 'Crystal Earth',
        origin: 'Sourced from Brazil',
        inStock: true
      },
      {
        name: 'Sage Smudge Stick',
        price: 12.00,
        description: 'Ethically harvested white sage bundle for energy clearing and purification.',
        category: 'Spirituality',
        imageUrl: '/images/products/sage_smudge_stick.jpg',
        supplier: 'Sacred Elements',
        origin: 'Sustainably harvested in California',
        inStock: true
      },
      {
        name: 'Chakra Bracelet',
        price: 22.00,
        description: 'Seven gemstone bracelet representing each chakra for balance and alignment.',
        category: 'Spirituality',
        imageUrl: '/images/products/chakra_bracelet.jpg',
        supplier: 'Aligned Energy',
        origin: 'Handmade in Bali',
        inStock: true
      },
      {
        name: 'Tarot Card Deck',
        price: 32.00,
        description: 'Beautifully illustrated 78-card tarot deck with guidebook for intuitive readings.',
        category: 'Spirituality',
        imageUrl: 'https://images.pexels.com/photos/6476776/pexels-photo-6476776.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        supplier: 'Mystic Oracle',
        origin: 'Designed in Australia',
        inStock: true
      },
      
      // Skincare 카테고리 제품
      {
        name: 'Organic Bath Salts',
        price: 20.00,
        description: 'Mineral-rich bath salts with lavender and chamomile for deep relaxation.',
        category: 'Skincare',
        imageUrl: 'https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        supplier: 'Natural Elements',
        origin: 'Sourced from the Dead Sea',
        inStock: true
      },
      {
        name: 'Vitamin C Serum',
        price: 38.00,
        description: 'Brightening serum with stabilized vitamin C and hyaluronic acid for glowing skin.',
        category: 'Skincare',
        imageUrl: 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        supplier: 'Glow Natural',
        origin: 'Made in South Korea',
        inStock: true
      },
      {
        name: 'Aloe Vera Gel',
        price: 16.50,
        description: 'Pure organic aloe vera gel for soothing and moisturizing sensitive skin.',
        category: 'Skincare',
        imageUrl: 'https://images.pexels.com/photos/6690924/pexels-photo-6690924.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        supplier: 'Healing Plant',
        origin: 'Organically grown in Mexico',
        inStock: true
      },
      {
        name: 'Clay Face Mask',
        price: 22.00,
        description: 'Detoxifying bentonite and kaolin clay mask with added green tea extract.',
        category: 'Skincare',
        imageUrl: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1',
        supplier: 'Earth Beauty',
        origin: 'Formulated in France',
        inStock: true
      }
    ];
    
    productsSeed.forEach(product => {
      this.createProduct(product);
    });
  }
  
  private seedBlogPosts() {
    const blogPostsSeed: InsertBlogPost[] = [
      {
        title: 'The Art of Aromatherapy',
        slug: 'the-art-of-aromatherapy',
        excerpt: 'Discover how essential oils can transform your wellbeing and the ancient traditions behind modern aromatherapy practices.',
        content: `
          <h2>The Ancient Origins of Aromatherapy</h2>
          <p>Aromatherapy has been used for thousands of years across different cultures to promote wellbeing and treat various ailments. The ancient Egyptians were among the first to incorporate aromatic plants into their rituals, medicines, and cosmetics. They created perfumes and essential oils through methods of distillation and infusion.</p>
          
          <h2>How Aromatherapy Works</h2>
          <p>Essential oils interact with our bodies in two primary ways: through inhalation and topical application. When we inhale essential oils, the aromatic molecules travel through our nose to the limbic system in our brain, which controls emotions and memories. This explains why certain scents can instantly trigger feelings or recollections.</p>
          
          <h2>Benefits of Common Essential Oils</h2>
          <ul>
            <li><strong>Lavender</strong>: Promotes relaxation and supports restful sleep</li>
            <li><strong>Peppermint</strong>: Enhances mental clarity and alleviates tension</li>
            <li><strong>Eucalyptus</strong>: Supports respiratory health and clears congestion</li>
            <li><strong>Tea Tree</strong>: Offers natural antimicrobial properties</li>
            <li><strong>Lemon</strong>: Uplifts mood and energizes</li>
          </ul>
          
          <h2>Incorporating Aromatherapy Into Your Daily Routine</h2>
          <p>Begin your aromatherapy journey with a simple diffuser in your home. Start with just one or two oils that address your specific needs. For relaxation, try diffusing lavender in the evening. For an energizing morning, citrus oils can set a positive tone for the day.</p>
          
          <p>Remember, quality matters with essential oils. Look for pure, therapeutic-grade oils sourced sustainably. The potency and benefits of essential oils depend greatly on their quality and purity.</p>
        `,
        imageUrl: 'https://pixabay.com/get/g08f1f5a33ee2ca63d3bbc4b84b642dae079aca64b1812f6acd192dff150a688837b7b07cc8e846633dbc2ddfe470d54ff176f2b93d1bf3eb31e33f8a021d5fc8_1280.jpg',
        published: true,
        publishDate: new Date('2023-06-12')
      },
      {
        title: 'Mindful Meditation Tips',
        slug: 'mindful-meditation-tips',
        excerpt: 'Learn practical mindfulness techniques from Eastern traditions that can be easily incorporated into your busy Western lifestyle.',
        content: `
          <h2>The Essence of Mindfulness</h2>
          <p>Mindfulness meditation is the practice of bringing full awareness to the present moment without judgment. This ancient practice, originating from Buddhist traditions, has been scientifically validated to reduce stress, improve focus, and enhance overall wellbeing.</p>
          
          <h2>Starting Your Meditation Practice</h2>
          <p>Begin with just 5 minutes daily. Find a comfortable seated position, either on a chair or cushion. Maintain good posture with your spine straight but not rigid. Close your eyes or maintain a soft gaze a few feet in front of you.</p>
          
          <h2>Simple Techniques for Beginners</h2>
          <ol>
            <li><strong>Breath Awareness</strong>: Simply notice your natural breathing pattern without trying to change it. When your mind wanders, gently bring attention back to the sensation of breathing.</li>
            <li><strong>Body Scan</strong>: Systematically bring awareness to each part of your body, from your toes to the top of your head, noticing sensations without judgment.</li>
            <li><strong>Loving-kindness Meditation</strong>: Cultivate feelings of compassion toward yourself and others by silently repeating phrases like "May I be happy, may I be healthy, may I be at peace."</li>
          </ol>
          
          <h2>Integrating Mindfulness Into Daily Life</h2>
          <p>Formal sitting practice is just one aspect of mindfulness. The true goal is to bring mindful awareness to everyday activities. Try practicing mindful eating by savoring each bite, mindful walking by noticing each step, or mindful listening by giving your full attention to conversations.</p>
          
          <p>Remember that consistency matters more than duration. A daily 5-minute practice will yield more benefits than an occasional hour-long session. Be patient with yourself—mindfulness is a skill that develops with practice.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80',
        published: true,
        publishDate: new Date('2023-05-28')
      },
      {
        title: 'Global Healing Rituals',
        slug: 'global-healing-rituals',
        excerpt: 'Explore traditional healing practices from cultures around the world and how they can enhance your modern wellness routine.',
        content: `
          <h2>Ancient Wisdom for Modern Wellness</h2>
          <p>Throughout human history, diverse cultures have developed unique healing practices based on their understanding of the body, mind, and spirit. These time-tested traditions offer valuable insights that complement our modern approach to wellness.</p>
          
          <h2>Traditional Chinese Medicine</h2>
          <p>Dating back over 2,500 years, Traditional Chinese Medicine (TCM) views health as a harmonious balance of yin and yang within the body. Key practices include acupuncture, herbal medicine, and qigong. Central to TCM is the concept of qi (vital energy) flowing through meridians in the body. Simple practices like acupressure on specific points can help maintain energy flow and address minor imbalances.</p>
          
          <h2>Ayurveda from India</h2>
          <p>Ayurveda, originating in India over 5,000 years ago, is based on the concept that health exists when there is a balance between three fundamental bodily bio-elements or doshas: Vata, Pitta, and Kapha. Ayurvedic practices include personalized nutrition, herbal remedies, yoga, and daily routines aligned with natural cycles. A simple Ayurvedic practice to try is tongue scraping in the morning to remove toxins that accumulated overnight.</p>
          
          <h2>Nordic Sauna Therapy</h2>
          <p>In Scandinavian countries, sauna bathing has been a cultural and wellness practice for thousands of years. The contrast between intense heat and cold is believed to improve circulation, reduce stress, and strengthen the immune system. Many people now incorporate contrast therapy (alternating between hot and cold) into their wellness routines.</p>
          
          <h2>Indigenous Smudging Rituals</h2>
          <p>Many Native American and indigenous cultures practice smudging—burning sacred herbs like sage, cedar, or sweetgrass to purify spaces and people of negative energies. Modern research suggests that burning certain herbs may actually help clear airborne bacteria. A respectful adaptation might include mindfully burning herbs to cleanse your space while setting positive intentions.</p>
          
          <p>When exploring global healing traditions, approach them with cultural respect and understanding. These practices often carry deep cultural and spiritual significance for their communities of origin.</p>
        `,
        imageUrl: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=350&q=80',
        published: true,
        publishDate: new Date('2023-04-15')
      }
    ];
    
    blogPostsSeed.forEach(blogPost => {
      this.createBlogPost(blogPost);
    });

    // Add external blog posts from muravera19.com
    const externalPosts: ExternalBlogPost[] = [
      {
        id: 1,
        title: "영국 해안 걷기: 자연과 역사 속으로 떠난 특별한 여정",
        link: "https://www.muravera19.com/영국-해안-걷기-자연과-역사-속으로-떠난-특별한-여정/",
        description: "영국의 아름다운 해안선을 따라 걷는 특별한 여행 경험을 소개합니다. 자연의 아름다움과 역사적 의미가 어우러진 코스들을 탐험해보세요.",
        content: "영국의 해안 길은 세계에서 가장 아름다운 트레킹 코스 중 하나입니다. 드라마틱한 절벽, 한적한 해변, 그리고 역사적인 유적지들이 어우러져 잊을 수 없는 경험을 선사합니다.",
        imageUrl: "https://images.pexels.com/photos/2901134/pexels-photo-2901134.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
        pubDate: new Date('2025-05-29'),
        author: "muravera19",
        categories: ["여행", "걷기", "영국"],
        source: "muravera19.com",
        cached: true,
        fetchedAt: new Date()
      },
      {
        id: 2,
        title: "마음챙김과 여행: 일상에서 벗어나 진정한 휴식 찾기",
        link: "https://www.muravera19.com/mindful-travel-finding-peace/",
        description: "여행을 통해 마음의 평화를 찾고 일상의 스트레스에서 벗어나는 방법을 알아보세요. 마음챙김 여행의 진정한 의미를 발견하십시오.",
        content: "진정한 여행은 단순히 새로운 장소를 방문하는 것이 아닙니다. 그것은 내면의 평화를 찾고 자신과 다시 연결되는 기회입니다.",
        imageUrl: "https://images.pexels.com/photos/1051449/pexels-photo-1051449.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
        pubDate: new Date('2025-05-25'),
        author: "muravera19",
        categories: ["여행", "마음챙김", "웰니스"],
        source: "muravera19.com",
        cached: true,
        fetchedAt: new Date()
      },
      {
        id: 3,
        title: "자연 속에서 찾는 힐링: 숲과 바다가 주는 치유의 힘",
        link: "https://www.muravera19.com/nature-healing-forest-ocean/",
        description: "자연이 우리에게 주는 치유의 힘을 탐구해보세요. 숲 목욕과 바다 명상을 통해 몸과 마음의 균형을 되찾는 방법을 소개합니다.",
        content: "현대 생활의 스트레스에서 벗어나 자연 속에서 진정한 평화를 찾아보세요. 과학적으로 입증된 자연 치유의 효과를 경험해보십시오.",
        imageUrl: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
        pubDate: new Date('2025-05-20'),
        author: "muravera19",
        categories: ["자연", "힐링", "명상"],
        source: "muravera19.com",
        cached: true,
        fetchedAt: new Date()
      },
      {
        id: 4,
        title: "지중해식 라이프스타일: 건강하고 균형잡힌 삶의 비결",
        link: "https://www.muravera19.com/mediterranean-lifestyle-wellness/",
        description: "지중해 지역의 건강한 라이프스타일을 탐구하고, 일상에 적용할 수 있는 실용적인 팁들을 알아보세요.",
        content: "지중해식 생활 방식은 단순한 식단을 넘어서 전체적인 웰빙 철학입니다. 느린 삶의 리듬과 자연과의 조화로운 생활을 경험해보세요.",
        imageUrl: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
        pubDate: new Date('2025-05-15'),
        author: "muravera19",
        categories: ["라이프스타일", "건강", "지중해"],
        source: "muravera19.com",
        cached: true,
        fetchedAt: new Date()
      }
    ];

    externalPosts.forEach(post => {
      this.externalBlogPosts.set(post.id, post);
    });
  }
}

export const storage = new MemStorage();
