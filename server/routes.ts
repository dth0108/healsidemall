import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Stripe from "stripe";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { createPaymentIntent, checkPaymentStatus, handleWebhook } from "./stripe";
import { fetchWordPressPosts, type WordPressBlogPost } from "./rss-service";
import { insertProductSchema, insertReviewSchema, insertUserSchema, insertCartItemSchema, insertNewsletterSchema } from "@shared/schema";
import { adminRouter } from "./routes/admin";
import { authRouter } from "./routes/auth";
import passport from "passport";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(passport.initialize());
  
  // Configure Auth router
  app.use('/auth', authRouter);
  // Auth middleware
  const authenticateJWT = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      
      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
        
        req.user = user;
        next();
      });
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // Admin login route
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check if user is admin
      if (!user.isAdmin) {
        return res.status(403).json({ message: "Access denied: Admin privileges required" });
      }
      
      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        token, 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({ 
        message: "User registered successfully",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate JWT
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      console.log("API received category query:", category);
      const products = await storage.getProducts(category);
      console.log("Sending back products filtered by category:", category);
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Review routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const reviews = await storage.getReviews(productId);
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/reviews", authenticateJWT, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      let cart;
      
      if (req.user?.id) {
        // Logged in user
        cart = await storage.getCart(req.user.id);
      } else if (req.query.sessionId) {
        // Guest user with session ID
        cart = await storage.getCart(undefined, req.query.sessionId as string);
      } else {
        return res.status(400).json({ message: "Session ID required for guest checkout" });
      }
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      // Get cart items
      const cartItems = await storage.getCartItems(cart.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(200).json({
        cart,
        items: itemsWithDetails
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/cart", async (req, res) => {
    try {
      let cart;
      
      if (req.user?.id) {
        // Logged in user
        cart = await storage.getCart(req.user.id);
        
        if (!cart) {
          cart = await storage.createCart({ userId: req.user.id });
        }
      } else if (req.body.sessionId) {
        // Guest user with session ID
        cart = await storage.getCart(undefined, req.body.sessionId);
        
        if (!cart) {
          cart = await storage.createCart({ sessionId: req.body.sessionId });
        }
      } else {
        return res.status(400).json({ message: "Session ID required for guest checkout" });
      }
      
      const cartItemData = insertCartItemSchema.parse({
        cartId: cart.id,
        productId: req.body.productId,
        quantity: req.body.quantity || 1
      });
      
      // Check if product exists
      const product = await storage.getProduct(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if item already in cart
      const existingItem = await storage.getCartItem(cart.id, cartItemData.productId);
      
      let cartItem;
      
      if (existingItem) {
        // Update quantity
        cartItem = await storage.updateCartItemQuantity(
          existingItem.id, 
          existingItem.quantity + cartItemData.quantity
        );
      } else {
        // Add new item
        cartItem = await storage.createCartItem(cartItemData);
      }
      
      res.status(201).json({
        message: "Item added to cart",
        cartItem: {
          ...cartItem,
          product
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });
  
  app.put("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      if (!req.body.quantity || req.body.quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
      
      const cartItem = await storage.updateCartItemQuantity(itemId, req.body.quantity);
      
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      const product = await storage.getProduct(cartItem.productId);
      
      res.status(200).json({
        message: "Cart item updated",
        cartItem: {
          ...cartItem,
          product
        }
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid item ID" });
      }
      
      const deleted = await storage.deleteCartItem(itemId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(200).json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const blogPosts = await storage.getBlogPosts();
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const blogPost = await storage.getBlogPostBySlug(slug);
      
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.status(200).json(blogPost);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Stripe payment route
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      
      if (!amount || isNaN(amount)) {
        return res.status(400).json({ message: "Valid amount is required" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        // Add additional metadata if needed
        metadata: {
          integration_check: "healside_payment"
        }
      });
      
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });
  
  // PayPal payment routes
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });
  
  // External WordPress blog integration - Direct RSS feed
  app.get("/api/external-blog/direct", async (req, res) => {
    try {
      const feedUrl = "https://www.muravera19.com/feed/";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      
      const feedItems = await fetchWordPressRSSFeed(feedUrl);
      
      // Return limited number of items
      const limitedItems = feedItems.slice(0, limit);
      
      res.status(200).json({
        source: "muravera19.com",
        items: limitedItems
      });
    } catch (error) {
      console.error("Error fetching external blog:", error);
      res.status(500).json({ message: "Failed to fetch external blog posts" });
    }
  });
  
  // New database-backed external blog routes
  app.get("/api/external-blog", async (req, res) => {
    try {
      const source = req.query.source as string | undefined;
      const posts = await storage.getExternalBlogPosts(source);
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching external blog posts:", error);
      return res.status(500).json({ error: "Failed to fetch external blog posts" });
    }
  });
  
  app.post("/api/external-blog/sync", async (req, res) => {
    try {
      const { url, source } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "RSS feed URL is required" });
      }
      
      if (!source) {
        return res.status(400).json({ error: "Source identifier is required" });
      }
      
      // RSS 피드에서 포스트를 가져옵니다
      const rssItems = await fetchWordPressRSSFeed(url);
      
      // RSS 항목을 외부 블로그 포스트 형식으로 변환합니다
      const externalBlogPosts = rssItems.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: new Date(item.pubDate),
        description: item.description,
        content: item.content || null,
        author: item.author || null,
        categories: item.categories || [],
        imageUrl: item.imageUrl || null,
        source: source,
        cached: true
      }));
      
      // 데이터베이스에 저장합니다
      const savedPosts = await storage.saveExternalBlogPosts(externalBlogPosts);
      
      return res.json({
        message: `Successfully synced ${savedPosts.length} posts from ${source}`,
        posts: savedPosts
      });
    } catch (error) {
      console.error("Error syncing external blog posts:", error);
      return res.status(500).json({ error: "Failed to sync external blog posts" });
    }
  });
  
  // Checkout route
  app.post("/api/checkout", authenticateJWT, async (req, res) => {
    try {
      const { shippingDetails, paymentIntentId } = req.body;
      
      if (!shippingDetails || !paymentIntentId) {
        return res.status(400).json({ message: "Shipping details and payment intent ID are required" });
      }
      
      // Verify payment intent (optional, as Stripe webhooks would normally handle this)
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      // Get user's cart
      const cart = await storage.getCart(req.user.id);
      
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      
      const cartItems = await storage.getCartItems(cart.id);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Check stock availability and calculate total
      let total = 0;
      const orderItems = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }
          
          // Check if enough stock is available
          const hasStock = await storage.checkStock(item.productId, item.quantity);
          if (!hasStock) {
            throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQuantity || 0}, Requested: ${item.quantity}`);
          }
          
          const itemTotal = Number(product.price) * item.quantity;
          total += itemTotal;
          
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
          };
        })
      );
      
      // Create order
      const order = await storage.createOrder({
        userId: req.user.id,
        total,
        status: "paid",
        shippingAddress: shippingDetails.address,
        shippingCity: shippingDetails.city,
        shippingState: shippingDetails.state,
        shippingCountry: shippingDetails.country,
        shippingZipCode: shippingDetails.zipCode
      });
      
      // Create order items and update stock
      for (const item of orderItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        
        // Reduce stock quantity
        await storage.updateStock(item.productId, -item.quantity);
      }
      
      // Check for low stock and send alerts
      const lowStockProducts = await storage.getLowStockProducts();
      if (lowStockProducts.length > 0) {
        // Import email service dynamically to avoid errors if not configured
        try {
          const { sendLowStockAlert } = await import('./email-service');
          const adminEmail = process.env.ADMIN_EMAIL || 'admin@healside.com';
          await sendLowStockAlert(lowStockProducts, adminEmail);
          console.log(`Low stock alert sent for ${lowStockProducts.length} products`);
        } catch (emailError) {
          console.warn('Could not send low stock alert:', emailError);
        }
      }
      
      // Clear cart
      await storage.clearCart(cart.id);
      
      res.status(201).json({
        message: "Order placed successfully",
        order
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Orders route (for user's order history)
  app.get("/api/orders", authenticateJWT, async (req, res) => {
    try {
      const orders = await storage.getOrders(req.user.id);
      
      // Get items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          
          // Get product details for each item
          const itemsWithDetails = await Promise.all(
            items.map(async (item) => {
              const product = await storage.getProduct(item.productId);
              return {
                ...item,
                product
              };
            })
          );
          
          return {
            ...order,
            items: itemsWithDetails
          };
        })
      );
      
      res.status(200).json(ordersWithItems);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.get("/api/orders/:id", authenticateJWT, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      
      if (isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Ensure user can only access their own orders
      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const items = await storage.getOrderItems(order.id);
      
      // Get product details for each item
      const itemsWithDetails = await Promise.all(
        items.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.status(200).json({
        ...order,
        items: itemsWithDetails
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reviews API routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/products/:id/reviews", authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = req.user?.id;
      const { rating, comment } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const review = await storage.createReview({
        productId,
        userId,
        rating,
        comment,
        createdAt: new Date()
      });

      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Wishlist API routes
  app.get("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const wishlist = await storage.getWishlist(userId);
      res.json(wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user?.id;
      const { productId } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      // Check if already in wishlist
      const isInWishlist = await storage.isInWishlist(userId, productId);
      if (isInWishlist) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }

      const wishlistItem = await storage.addToWishlist({
        userId,
        productId,
        createdAt: new Date()
      });

      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user?.id;
      const productId = parseInt(req.params.productId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const success = await storage.removeFromWishlist(userId, productId);
      if (success) {
        res.json({ message: "Removed from wishlist" });
      } else {
        res.status(404).json({ message: "Item not found in wishlist" });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/check/:productId", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user?.id;
      const productId = parseInt(req.params.productId);

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const isInWishlist = await storage.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      res.status(500).json({ message: "Failed to check wishlist" });
    }
  });

  // Newsletter API routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const subscription = await storage.subscribeNewsletter({
        email,
        createdAt: new Date(),
        isActive: true
      });

      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const success = await storage.unsubscribeNewsletter(email);
      if (success) {
        res.json({ message: "Successfully unsubscribed" });
      } else {
        res.status(404).json({ message: "Email not found in subscription list" });
      }
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  // External Blog API routes - muravera19.com integration
  app.get("/api/external-blog", async (req, res) => {
    console.log('External blog API endpoint hit');
    
    try {
      console.log('Fetching WordPress posts from muravera19.com');
      
      // Direct axios call to WordPress REST API
      const axios = (await import('axios')).default;
      const response = await axios.get('https://www.muravera19.com/wp-json/wp/v2/posts?per_page=10&_embed', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Healside-Blog-Integration/1.0'
        }
      });
      
      console.log(`Received ${response.data?.length || 0} posts from WordPress API`);
      
      const posts = response.data.map((post: any) => {
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
      
      console.log(`Returning ${posts.length} transformed WordPress posts`);
      res.json(posts);
      
    } catch (error: any) {
      console.error("Error fetching WordPress posts:", error.message);
      res.status(500).json({ 
        message: "Failed to fetch blog posts", 
        error: error.message 
      });
    }
  });

  app.get("/api/external-blog/:id", async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getExternalBlogPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching external blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Refresh external blog posts manually
  app.post("/api/external-blog/refresh", async (req, res) => {
    try {
      const feedUrl = 'https://muravera19.com/feed/';
      console.log(`Manually refreshing posts from: ${feedUrl}`);
      
      const posts = await fetchWordPressRSSFeed(feedUrl);
      
      if (posts && posts.length > 0) {
        const postsToSave = posts.map(post => ({
          title: post.title,
          link: post.link,
          description: post.description,
          content: post.content || null,
          imageUrl: post.imageUrl || null,
          pubDate: new Date(post.pubDate),
          author: post.author || null,
          categories: post.categories || null,
          source: 'muravera19.com',
          cached: true,
          fetchedAt: new Date()
        }));

        await storage.saveExternalBlogPosts(postsToSave);
        res.json({ message: `Successfully refreshed ${posts.length} posts`, posts: posts.length });
      } else {
        res.status(404).json({ message: "No posts found at the feed URL" });
      }
    } catch (error) {
      console.error("Error refreshing external blog posts:", error);
      res.status(500).json({ 
        message: "Failed to refresh blog posts", 
        error: error.message 
      });
    }
  });

  // Admin API 라우트 등록
  app.use('/api/admin', adminRouter);

  // PayPal API 라우트
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });
  
  // Stripe API 라우트
  app.post("/api/stripe/create-payment-intent", async (req, res) => {
    await createPaymentIntent(req, res);
  });
  
  app.get("/api/stripe/payment-status/:paymentIntentId", async (req, res) => {
    await checkPaymentStatus(req, res);
  });
  
  app.post("/api/stripe/webhook", express.raw({type: 'application/json'}), async (req, res) => {
    await handleWebhook(req, res);
  });

  // Review routes
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", authenticateJWT, async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview({
        ...reviewData,
        userId: (req as any).user.id
      });
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const wishlist = await storage.getWishlist(userId);
      
      // Get product details for wishlist items
      const wishlistWithProducts = await Promise.all(
        wishlist.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(wishlistWithProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist", authenticateJWT, async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = (req as any).user.id;
      
      // Check if already in wishlist
      const exists = await storage.isInWishlist(userId, productId);
      if (exists) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }
      
      const wishlistItem = await storage.addToWishlist({
        userId,
        productId
      });
      
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:productId", authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const userId = (req as any).user.id;
      
      const removed = await storage.removeFromWishlist(userId, productId);
      if (!removed) {
        return res.status(404).json({ message: "Item not found in wishlist" });
      }
      
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/check/:productId", authenticateJWT, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const userId = (req as any).user.id;
      
      const isInWishlist = await storage.isInWishlist(userId, productId);
      res.json({ isInWishlist });
    } catch (error) {
      console.error("Error checking wishlist:", error);
      res.status(500).json({ message: "Failed to check wishlist" });
    }
  });

  // Newsletter routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter({ email });
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  app.post("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { email } = req.body;
      const unsubscribed = await storage.unsubscribeNewsletter(email);
      if (!unsubscribed) {
        return res.status(404).json({ message: "Email not found" });
      }
      res.json({ message: "Successfully unsubscribed from newsletter" });
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
