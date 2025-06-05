import { pgTable, text, serial, integer, numeric, timestamp, boolean, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  isAdmin: boolean("is_admin").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  googleId: text("google_id").unique(),
  appleId: text("apple_id").unique(),
  profileImageUrl: text("profile_image_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  address: true,
  city: true,
  state: true,
  country: true,
  zipCode: true,
  phone: true,
  isAdmin: true,
  googleId: true,
  appleId: true,
  profileImageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Product schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  supplier: text("supplier"),
  origin: text("origin"),
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  price: true,
  description: true,
  category: true,
  imageUrl: true,
  supplier: true,
  origin: true,
  inStock: true,
  stockQuantity: true,
  lowStockThreshold: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Review schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  productId: true,
  userId: true,
  rating: true,
  comment: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Wishlist schema
export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlists).pick({
  userId: true,
  productId: true,
});

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlists.$inferSelect;

// Newsletter subscription schema
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Order schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: text("shipping_city").notNull(),
  shippingState: text("shipping_state").notNull(),
  shippingCountry: text("shipping_country").notNull(),
  shippingZipCode: text("shipping_zip_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  total: true,
  status: true,
  shippingAddress: true,
  shippingCity: true,
  shippingState: true,
  shippingCountry: true,
  shippingZipCode: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Item schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Cart schema
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartSchema = createInsertSchema(carts).pick({
  userId: true,
  sessionId: true,
});

export type InsertCart = z.infer<typeof insertCartSchema>;
export type Cart = typeof carts.$inferSelect;

// Cart Item schema
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  cartId: true,
  productId: true,
  quantity: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Blog schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  published: boolean("published").default(true),
  publishDate: timestamp("publish_date").defaultNow(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  imageUrl: true,
  published: true,
  publishDate: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// External Blog Posts schema
export const externalBlogPosts = pgTable("external_blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  link: text("link").notNull().unique(),
  pubDate: timestamp("pub_date").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  author: text("author"),
  categories: text("categories").array(),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
  cached: boolean("cached").default(true),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const insertExternalBlogPostSchema = createInsertSchema(externalBlogPosts).pick({
  title: true,
  link: true,
  pubDate: true,
  description: true,
  content: true,
  author: true,
  categories: true,
  imageUrl: true,
  source: true,
  cached: true,
});

export type InsertExternalBlogPost = z.infer<typeof insertExternalBlogPostSchema>;
export type ExternalBlogPost = typeof externalBlogPosts.$inferSelect;
