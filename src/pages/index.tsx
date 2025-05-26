import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TrendingUp, BarChart3, LineChart, PieChart, Briefcase, Shield, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Head>
        <title>SmartTrade | Intelligent Trading Platform</title>
        <meta name="description" content="SmartTrade - AI-powered trading platform for smart investors. Real-time stock data, portfolio management, and AI-driven insights." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div 
              className="text-center md:text-left md:max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                <span className="block">Trade Smarter with</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  AI-Powered Insights
                </span>
              </h1>
              <motion.p 
                className="mt-6 text-xl text-muted-foreground max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                SmartTrade combines real-time market data with advanced AI to help you make informed investment decisions. Start with ₹10,000 in virtual funds and build your portfolio risk-free.
              </motion.p>
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => router.push(user ? "/dashboard-indian" : "/signup")}
                >
                  {user ? "Go to Dashboard" : "Start Trading Now"}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Background graphic */}
          <motion.div 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.8, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="relative w-[600px] h-[600px]">
              <motion.div 
                className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Powerful Features for Smart Investors
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to make informed trading decisions in one platform
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Market Data</h3>
                <p className="text-muted-foreground">
                  Access live stock prices, trends, and market movements to stay ahead of the curve.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Portfolio Management</h3>
                <p className="text-muted-foreground">
                  Track your investments, analyze performance, and optimize your portfolio with ease.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Get personalized stock recommendations based on your risk profile and market trends.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">
                  Visualize performance with interactive charts and comprehensive analytics tools.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Virtual Trading</h3>
                <p className="text-muted-foreground">
                  Practice with ₹10,000 in virtual funds. Test strategies without risking real money.
                </p>
              </motion.div>
              
              <motion.div variants={item} className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Resources</h3>
                <p className="text-muted-foreground">
                  Learn trading strategies and financial concepts through our comprehensive guides.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                How SmartTrade Works
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Start your investment journey in three simple steps
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">
                  Sign up in seconds and get instant access to your virtual trading account with ₹10,000.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Build Your Portfolio</h3>
                <p className="text-muted-foreground">
                  Search for stocks, get AI recommendations, and build a diversified investment portfolio.
                </p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Track & Optimize</h3>
                <p className="text-muted-foreground">
                  Monitor performance, analyze trends, and optimize your strategy based on AI insights.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-blue-500/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Start Your Trading Journey?
              </h2>
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Join thousands of smart investors who are already using SmartTrade to build their wealth
              </p>
              <motion.div 
                className="mt-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8"
                  onClick={() => router.push(user ? "/dashboard-indian" : "/signup")}
                >
                  {user ? "Go to Dashboard" : "Create Free Account"}
                </Button>
              </motion.div>
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