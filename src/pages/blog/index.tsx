import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  User, 
  Tag,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock blog posts data
const BLOG_POSTS = [
  {
    id: "1",
    title: "Understanding Market Volatility: A Beginner's Guide",
    excerpt: "Market volatility can be intimidating for new investors. Learn what causes market swings and how to navigate them effectively.",
    content: "",
    category: "Education",
    tags: ["Beginner", "Market Basics", "Risk Management"],
    imageUrl: "/images/rect.png",
    author: "Sarah Johnson",
    authorRole: "Financial Analyst",
    publishedAt: "2025-04-15",
    readTime: "8 min read"
  },
  {
    id: "2",
    title: "Technical Analysis vs. Fundamental Analysis: Which Should You Use?",
    excerpt: "Explore the differences between technical and fundamental analysis and discover which approach might work best for your investment strategy.",
    content: "",
    category: "Strategy",
    tags: ["Analysis", "Trading Strategies", "Intermediate"],
    imageUrl: "/images/rect.png",
    author: "Michael Chen",
    authorRole: "Trading Strategist",
    publishedAt: "2025-04-10",
    readTime: "12 min read"
  },
  {
    id: "3",
    title: "The Power of Compound Interest: Building Wealth Over Time",
    excerpt: "Discover how compound interest works and why it's considered the eighth wonder of the world for building long-term wealth.",
    content: "",
    category: "Wealth Building",
    tags: ["Investing Basics", "Long-term Strategy", "Beginner"],
    imageUrl: "/images/rect.png",
    author: "Emma Rodriguez",
    authorRole: "Wealth Advisor",
    publishedAt: "2025-04-05",
    readTime: "6 min read"
  },
  {
    id: "4",
    title: "Diversification: Why You Shouldn't Put All Your Eggs in One Basket",
    excerpt: "Learn the importance of diversification in reducing risk and creating a resilient investment portfolio that can weather market storms.",
    content: "",
    category: "Risk Management",
    tags: ["Portfolio Strategy", "Risk Reduction", "Intermediate"],
    imageUrl: "/images/rect.png",
    author: "David Wilson",
    authorRole: "Portfolio Manager",
    publishedAt: "2025-03-28",
    readTime: "9 min read"
  },
  {
    id: "5",
    title: "ESG Investing: Aligning Your Portfolio with Your Values",
    excerpt: "Explore how environmental, social, and governance (ESG) factors are reshaping investment strategies and how to incorporate them into your portfolio.",
    content: "",
    category: "Sustainable Investing",
    tags: ["ESG", "Sustainable Finance", "Modern Investing"],
    imageUrl: "/images/rect.png",
    author: "Olivia Park",
    authorRole: "ESG Specialist",
    publishedAt: "2025-03-20",
    readTime: "10 min read"
  },
  {
    id: "6",
    title: "Understanding Stock Market Indices: S&P 500, Dow Jones, and NASDAQ",
    excerpt: "Learn what major stock market indices represent, how they're calculated, and why they matter to investors.",
    content: "",
    category: "Market Basics",
    tags: ["Indices", "Market Indicators", "Beginner"],
    imageUrl: "/images/rect.png",
    author: "James Thompson",
    authorRole: "Market Analyst",
    publishedAt: "2025-03-15",
    readTime: "7 min read"
  },
];

// Featured courses
const FEATURED_COURSES = [
  {
    title: "Investing 101: Building Your First Portfolio",
    description: "Learn the fundamentals of investing and how to build a diversified portfolio from scratch.",
    level: "Beginner",
    lessons: 12,
    duration: "4 hours"
  },
  {
    title: "Technical Analysis Masterclass",
    description: "Master chart patterns, indicators, and technical analysis strategies to improve your trading decisions.",
    level: "Intermediate",
    lessons: 18,
    duration: "6 hours"
  },
  {
    title: "Advanced Options Trading Strategies",
    description: "Explore complex options strategies for generating income and managing risk in various market conditions.",
    level: "Advanced",
    lessons: 15,
    duration: "5 hours"
  }
];

export default function Blog() {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Blog & Education | SmartTrade</title>
        <meta name="description" content="Educational resources, market insights, and trading strategies to help you become a better investor." />
      </Head>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                SmartTrade Learning Center
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Educational resources, market insights, and trading strategies to help you become a better investor
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}>
                    Latest Articles
                  </Button>
                  <Button variant="outline" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                    Browse Courses
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Blog Posts Section */}
        <section id="blog" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
              <Button variant="ghost" className="flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image 
                        src={post.imageUrl} 
                        alt={post.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <Badge className="absolute top-3 left-3">{post.category}</Badge>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {post.publishedAt}
                        <span className="mx-1">•</span>
                        <BookOpen className="h-3 w-3" />
                        {post.readTime}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}, {post.authorRole}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <Separator />
        
        {/* Featured Courses Section */}
        <section id="courses" className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Featured Courses</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Structured learning paths to help you master trading and investing at your own pace
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_COURSES.map((course, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={
                          course.level === "Beginner" ? "secondary" : 
                          course.level === "Intermediate" ? "default" : 
                          "destructive"
                        }>
                          {course.level}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons} lessons
                        </div>
                      </div>
                      <CardTitle>{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">{course.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {course.duration}
                      </div>
                      <Button>Start Learning</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-500/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Ahead of the Market</h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to our newsletter for weekly market insights, trading tips, and educational resources delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                By subscribing, you agree to our Privacy Policy and Terms of Service.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-muted/30 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                    SmartTrade
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  © {new Date().getFullYear()} SmartTrade. All rights reserved.
                </p>
              </div>
              <div className="flex gap-8">
                <div>
                  <h3 className="text-sm font-semibold mb-3">Platform</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Features</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Pricing</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Security</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Resources</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Blog</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Education</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3">Company</h3>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">About</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Careers</a></li>
                    <li><a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}