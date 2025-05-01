import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "framer-motion";
import StockSearchAutocomplete from "@/components/StockSearchAutocomplete";
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Plus, 
  RefreshCw, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Briefcase, 
  Clock, 
  Eye, 
  Sparkles, 
  LogOut, 
  User, 
  Settings, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Check
} from "lucide-react";

// Custom Indian Rupee Icon
const RupeeIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 3h12M6 8h12M6 13h3M9 13c6.667 0 6.667 8 0 8M6 21h12" />
  </svg>
);

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell, Legend } from 'recharts';

// Mock data for development - Indian stocks
const MOCK_STOCKS = [
  { symbol: 'NIFTY', name: 'NIFTY 50 Index', currentPrice: 22450.25, previousClose: 22380.85, change: 69.40, changePercent: 0.31, volume: 58432100, marketCap: 0, sector: 'Index' },
  { symbol: 'SENSEX', name: 'S&P BSE SENSEX', currentPrice: 73850.50, previousClose: 73650.25, change: 200.25, changePercent: 0.27, volume: 25123400, marketCap: 0, sector: 'Index' },
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.', currentPrice: 2875.60, previousClose: 2850.25, change: 25.35, changePercent: 0.89, volume: 18234500, marketCap: 19500000000000, sector: 'Energy' },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.', currentPrice: 3560.75, previousClose: 3545.80, change: 14.95, changePercent: 0.42, volume: 32145600, marketCap: 13000000000000, sector: 'Technology' },
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd.', currentPrice: 1475.30, previousClose: 1490.45, change: -15.15, changePercent: -1.02, volume: 98765400, marketCap: 8250000000000, sector: 'Financial Services' },
  { symbol: 'INFY.BSE', name: 'Infosys Ltd.', currentPrice: 1425.80, previousClose: 1410.25, change: 15.55, changePercent: 1.10, volume: 15678900, marketCap: 5900000000000, sector: 'Technology' },
  { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel Ltd.', currentPrice: 1180.45, previousClose: 1165.30, change: 15.15, changePercent: 1.30, volume: 8765400, marketCap: 6600000000000, sector: 'Telecommunication' },
  { symbol: 'ICICIBANK.BSE', name: 'ICICI Bank Ltd.', currentPrice: 1025.75, previousClose: 1030.45, change: -4.70, changePercent: -0.46, volume: 12345600, marketCap: 7150000000000, sector: 'Financial Services' },
  { symbol: 'HINDUNILVR.BSE', name: 'Hindustan Unilever Ltd.', currentPrice: 2350.60, previousClose: 2330.25, change: 20.35, changePercent: 0.87, volume: 7654300, marketCap: 5500000000000, sector: 'Consumer Goods' },
  { symbol: 'TATAMOTORS.BSE', name: 'Tata Motors Ltd.', currentPrice: 875.40, previousClose: 865.85, change: 9.55, changePercent: 1.10, volume: 9876500, marketCap: 2900000000000, sector: 'Automotive' },
];

const MOCK_PORTFOLIO_DATA = [
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.', quantity: 10, avgBuyPrice: 2850.25, currentPrice: 2875.60, totalValue: 28756.00, profitLoss: 253.50, profitLossPercent: 0.89 },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.', quantity: 5, avgBuyPrice: 3545.80, currentPrice: 3560.75, totalValue: 17803.75, profitLoss: 74.75, profitLossPercent: 0.42 },
  { symbol: 'INFY.BSE', name: 'Infosys Ltd.', quantity: 8, avgBuyPrice: 1410.25, currentPrice: 1425.80, totalValue: 11406.40, profitLoss: 124.40, profitLossPercent: 1.10 },
];

const MOCK_WATCHLIST_DATA = [
  { symbol: 'HDFCBANK.BSE', name: 'HDFC Bank Ltd.', currentPrice: 1475.30, change: -15.15, changePercent: -1.02 },
  { symbol: 'TATAMOTORS.BSE', name: 'Tata Motors Ltd.', currentPrice: 875.40, change: 9.55, changePercent: 1.10 },
  { symbol: 'BHARTIARTL.BSE', name: 'Bharti Airtel Ltd.', currentPrice: 1180.45, change: 15.15, changePercent: 1.30 },
];

const MOCK_TRANSACTIONS = [
  { id: '1', symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.', type: 'BUY', quantity: 5, price: 2845.50, total: 14227.50, timestamp: '2025-04-25T10:30:00Z' },
  { id: '2', symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.', type: 'BUY', quantity: 3, price: 3540.75, total: 10622.25, timestamp: '2025-04-26T14:15:00Z' },
  { id: '3', symbol: 'RELIANCE.BSE', name: 'Reliance Industries Ltd.', type: 'BUY', quantity: 5, price: 2855.00, total: 14275.00, timestamp: '2025-04-28T09:45:00Z' },
  { id: '4', symbol: 'INFY.BSE', name: 'Infosys Ltd.', type: 'BUY', quantity: 8, price: 1410.25, total: 11282.00, timestamp: '2025-04-29T11:20:00Z' },
  { id: '5', symbol: 'TCS.BSE', name: 'Tata Consultancy Services Ltd.', type: 'BUY', quantity: 2, price: 3550.25, total: 7100.50, timestamp: '2025-04-30T13:10:00Z' },
];

const MOCK_PORTFOLIO_HISTORY = [
  { date: '2025-04-01', value: 500000 },
  { date: '2025-04-02', value: 502500 },
  { date: '2025-04-03', value: 506000 },
  { date: '2025-04-04', value: 504000 },
  { date: '2025-04-05', value: 507500 },
  { date: '2025-04-06', value: 511000 },
  { date: '2025-04-07', value: 515500 },
  { date: '2025-04-08', value: 514000 },
  { date: '2025-04-09', value: 517500 },
  { date: '2025-04-10', value: 521000 },
  { date: '2025-04-11', value: 519000 },
  { date: '2025-04-12', value: 522500 },
  { date: '2025-04-13', value: 526000 },
  { date: '2025-04-14', value: 530500 },
  { date: '2025-04-15', value: 529000 },
  { date: '2025-04-16', value: 532500 },
  { date: '2025-04-17', value: 536000 },
  { date: '2025-04-18', value: 534000 },
  { date: '2025-04-19', value: 537500 },
  { date: '2025-04-20', value: 541000 },
  { date: '2025-04-21', value: 545500 },
  { date: '2025-04-22', value: 544000 },
  { date: '2025-04-23', value: 547500 },
  { date: '2025-04-24', value: 551000 },
  { date: '2025-04-25', value: 549000 },
  { date: '2025-04-26', value: 552500 },
  { date: '2025-04-27', value: 556000 },
  { date: '2025-04-28', value: 560500 },
  { date: '2025-04-29', value: 564000 },
  { date: '2025-04-30', value: 567500 },
];

const MOCK_ALLOCATION_DATA = [
  { name: 'Technology', value: 29210.15, color: '#3b82f6' },
  { name: 'Energy', value: 28756.00, color: '#10b981' },
  { name: 'Financial Services', value: 0, color: '#f59e0b' },
  { name: 'Telecommunication', value: 0, color: '#8b5cf6' },
  { name: 'Cash', value: 509533.85, color: '#6b7280' },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6b7280'];

const MOCK_AI_RECOMMENDATIONS = [
  { symbol: 'ADANIENT.BSE', name: 'Adani Enterprises Ltd.', reason: 'Strong infrastructure development portfolio with significant government project pipeline and renewable energy initiatives.', riskLevel: 'MODERATE', confidence: 85 },
  { symbol: 'HDFCLIFE.BSE', name: 'HDFC Life Insurance Co. Ltd.', reason: 'Consistent premium growth, strong distribution network, and increasing market penetration in the underpenetrated Indian insurance sector.', riskLevel: 'LOW', confidence: 92 },
  { symbol: 'BAJFINANCE.BSE', name: 'Bajaj Finance Ltd.', reason: 'Leading consumer finance company with robust digital infrastructure and strong growth in new customer acquisition.', riskLevel: 'MODERATE', confidence: 78 },
];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [userBalance, setUserBalance] = useState(509533.85); // Updated to match allocation data
  const [portfolioValue, setPortfolioValue] = useState(57966.15); // Updated to match allocation data
  const [totalValue, setTotalValue] = useState(567500.00); // Updated to match portfolio history
  const [portfolioData, setPortfolioData] = useState(MOCK_PORTFOLIO_DATA);
  const [watchlistData, setWatchlistData] = useState(MOCK_WATCHLIST_DATA);
  const [transactionHistory, setTransactionHistory] = useState(MOCK_TRANSACTIONS);
  const [portfolioHistory, setPortfolioHistory] = useState(MOCK_PORTFOLIO_HISTORY);
  const [allocationData, setAllocationData] = useState(MOCK_ALLOCATION_DATA);
  const [aiRecommendations, setAiRecommendations] = useState(MOCK_AI_RECOMMENDATIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const results = MOCK_STOCKS.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  // Handle stock selection
  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Handle buy stock
  const handleBuyStock = () => {
    if (!selectedStock || quantity <= 0) return;
    
    const totalCost = selectedStock.currentPrice * quantity;
    
    if (totalCost > userBalance) {
      toast({
        variant: "destructive",
        title: "Insufficient funds",
        description: `You need ₹${totalCost.toFixed(2)} to complete this purchase.`,
      });
      return;
    }
    
    // Update portfolio
    const existingStock = portfolioData.find(item => item.symbol === selectedStock.symbol);
    
    if (existingStock) {
      // Update existing position
      const updatedPortfolio = portfolioData.map(item => {
        if (item.symbol === selectedStock.symbol) {
          const newQuantity = item.quantity + quantity;
          const newAvgBuyPrice = ((item.avgBuyPrice * item.quantity) + (selectedStock.currentPrice * quantity)) / newQuantity;
          const newTotalValue = newQuantity * selectedStock.currentPrice;
          const newProfitLoss = newTotalValue - (newAvgBuyPrice * newQuantity);
          const newProfitLossPercent = (newProfitLoss / (newAvgBuyPrice * newQuantity)) * 100;
          
          return {
            ...item,
            quantity: newQuantity,
            avgBuyPrice: newAvgBuyPrice,
            totalValue: newTotalValue,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent
          };
        }
        return item;
      });
      
      setPortfolioData(updatedPortfolio);
    } else {
      // Add new position
      const newPosition = {
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        quantity: quantity,
        avgBuyPrice: selectedStock.currentPrice,
        currentPrice: selectedStock.currentPrice,
        totalValue: selectedStock.currentPrice * quantity,
        profitLoss: 0,
        profitLossPercent: 0
      };
      
      setPortfolioData([...portfolioData, newPosition]);
    }
    
    // Add transaction
    const newTransaction = {
      id: (transactionHistory.length + 1).toString(),
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      type: 'BUY',
      quantity: quantity,
      price: selectedStock.currentPrice,
      total: selectedStock.currentPrice * quantity,
      timestamp: new Date().toISOString()
    };
    
    setTransactionHistory([newTransaction, ...transactionHistory]);
    
    // Update balance and portfolio value
    const newBalance = userBalance - totalCost;
    const newPortfolioValue = portfolioValue + totalCost;
    
    setUserBalance(newBalance);
    setPortfolioValue(newPortfolioValue);
    
    // Update allocation data
    const updatedAllocationData = [...allocationData];
    const sectorIndex = updatedAllocationData.findIndex(item => item.name === selectedStock.sector);
    
    if (sectorIndex !== -1) {
      updatedAllocationData[sectorIndex].value += totalCost;
    } else {
      // If sector doesn't exist in allocation data, add it
      updatedAllocationData.push({
        name: selectedStock.sector || 'Other',
        value: totalCost,
        color: COLORS[updatedAllocationData.length % COLORS.length]
      });
    }
    
    // Update cash allocation
    const cashIndex = updatedAllocationData.findIndex(item => item.name === 'Cash');
    if (cashIndex !== -1) {
      updatedAllocationData[cashIndex].value = newBalance;
    }
    
    setAllocationData(updatedAllocationData);
    
    // Close dialog and show success message
    setBuyDialogOpen(false);
    setQuantity(1);
    
    toast({
      title: "Purchase successful",
      description: `You bought ${quantity} shares of ${selectedStock.symbol} for ₹${totalCost.toFixed(2)}.`,
    });
  };

  // Handle sell stock
  const handleSellStock = () => {
    if (!selectedStock || quantity <= 0) return;
    
    const existingStock = portfolioData.find(item => item.symbol === selectedStock.symbol);
    
    if (!existingStock) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `You don't own any shares of ${selectedStock.symbol}.`,
      });
      return;
    }
    
    if (quantity > existingStock.quantity) {
      toast({
        variant: "destructive",
        title: "Insufficient shares",
        description: `You only have ${existingStock.quantity} shares of ${selectedStock.symbol}.`,
      });
      return;
    }
    
    const totalValue = selectedStock.currentPrice * quantity;
    
    // Update portfolio
    let updatedPortfolio;
    
    if (quantity === existingStock.quantity) {
      // Remove stock from portfolio if selling all shares
      updatedPortfolio = portfolioData.filter(item => item.symbol !== selectedStock.symbol);
    } else {
      // Update quantity if selling some shares
      updatedPortfolio = portfolioData.map(item => {
        if (item.symbol === selectedStock.symbol) {
          const newQuantity = item.quantity - quantity;
          const newTotalValue = newQuantity * selectedStock.currentPrice;
          const newProfitLoss = newTotalValue - (item.avgBuyPrice * newQuantity);
          const newProfitLossPercent = (newProfitLoss / (item.avgBuyPrice * newQuantity)) * 100;
          
          return {
            ...item,
            quantity: newQuantity,
            totalValue: newTotalValue,
            profitLoss: newProfitLoss,
            profitLossPercent: newProfitLossPercent
          };
        }
        return item;
      });
    }
    
    setPortfolioData(updatedPortfolio);
    
    // Add transaction
    const newTransaction = {
      id: (transactionHistory.length + 1).toString(),
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      type: 'SELL',
      quantity: quantity,
      price: selectedStock.currentPrice,
      total: totalValue,
      timestamp: new Date().toISOString()
    };
    
    setTransactionHistory([newTransaction, ...transactionHistory]);
    
    // Update balance and portfolio value
    const newBalance = userBalance + totalValue;
    const newPortfolioValue = portfolioValue - totalValue;
    
    setUserBalance(newBalance);
    setPortfolioValue(newPortfolioValue);
    
    // Update allocation data
    const updatedAllocationData = [...allocationData];
    const sectorIndex = updatedAllocationData.findIndex(item => item.name === selectedStock.sector);
    
    if (sectorIndex !== -1) {
      updatedAllocationData[sectorIndex].value -= totalValue;
      
      // Remove sector if value is 0
      if (updatedAllocationData[sectorIndex].value <= 0) {
        updatedAllocationData.splice(sectorIndex, 1);
      }
    }
    
    // Update cash allocation
    const cashIndex = updatedAllocationData.findIndex(item => item.name === 'Cash');
    if (cashIndex !== -1) {
      updatedAllocationData[cashIndex].value = newBalance;
    }
    
    setAllocationData(updatedAllocationData);
    
    // Close dialog and show success message
    setSellDialogOpen(false);
    setQuantity(1);
    
    toast({
      title: "Sale successful",
      description: `You sold ${quantity} shares of ${selectedStock.symbol} for ₹${totalValue.toFixed(2)}.`,
    });
  };

  // Handle add to watchlist
  const handleAddToWatchlist = (stock: any) => {
    const exists = watchlistData.some(item => item.symbol === stock.symbol);
    
    if (exists) {
      toast({
        title: "Already in watchlist",
        description: `${stock.symbol} is already in your watchlist.`,
      });
      return;
    }
    
    const newWatchlistItem = {
      symbol: stock.symbol,
      name: stock.name,
      currentPrice: stock.currentPrice,
      change: stock.change,
      changePercent: stock.changePercent
    };
    
    setWatchlistData([...watchlistData, newWatchlistItem]);
    
    toast({
      title: "Added to watchlist",
      description: `${stock.symbol} has been added to your watchlist.`,
    });
  };

  // Handle remove from watchlist
  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlistData(watchlistData.filter(item => item.symbol !== symbol));
    
    toast({
      title: "Removed from watchlist",
      description: `${symbol} has been removed from your watchlist.`,
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Head>
        <title>Dashboard | SmartTrade</title>
        <meta name="description" content="SmartTrade dashboard - Manage your portfolio, track stocks, and get AI-powered insights" />
      </Head>
      
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => router.push("/")}
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                SmartTrade
              </span>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <Button 
              variant={activeTab === "overview" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === "portfolio" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("portfolio")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Portfolio
            </Button>
            <Button 
              variant={activeTab === "watchlist" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("watchlist")}
            >
              <Eye className="mr-2 h-4 w-4" />
              Watchlist
            </Button>
            <Button 
              variant={activeTab === "transactions" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("transactions")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            <Button 
              variant={activeTab === "advisor" ? "default" : "ghost"} 
              className="w-full justify-start" 
              onClick={() => setActiveTab("advisor")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Advisor
            </Button>
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Free Account</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile header */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                SmartTrade
              </span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("overview")}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("portfolio")}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Portfolio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("watchlist")}>
                  <Eye className="mr-2 h-4 w-4" />
                  Watchlist
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("transactions")}>
                  <Clock className="mr-2 h-4 w-4" />
                  Transactions
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab("advisor")}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Advisor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          
          {/* Search and balance bar */}
          <div className="p-4 border-b border-border flex flex-col md:flex-row justify-between gap-4">
            <StockSearchAutocomplete 
              className="w-full md:w-96"
              onSelectStock={(stock) => {
                // Find the stock in our mock data or fetch it from API
                const foundStock = MOCK_STOCKS.find(s => 
                  s.symbol === stock.symbol || 
                  s.symbol === `${stock.symbol}.BSE` || 
                  s.symbol === `${stock.symbol}.NSE`
                );
                
                if (foundStock) {
                  handleSelectStock(foundStock);
                } else {
                  // If not found in mock data, create a placeholder and fetch real data
                  const newStock = {
                    symbol: stock.symbol,
                    name: stock.name,
                    currentPrice: 0,
                    previousClose: 0,
                    change: 0,
                    changePercent: 0,
                    volume: 0,
                    marketCap: 0,
                    sector: stock.type,
                    updatedAt: new Date()
                  };
                  
                  // In a real app, you would fetch the actual stock data here
                  // For now, we'll just use the placeholder
                  handleSelectStock(newStock);
                  
                  toast({
                    title: "Stock selected",
                    description: `${stock.symbol} - ${stock.name}`,
                  });
                }
              }}
            />
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="font-medium">₹{userBalance.toFixed(2)}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="font-medium">₹{portfolioValue.toFixed(2)}</p>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="font-medium">₹{totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Selected stock details */}
          {selectedStock && (
            <div className="p-4 border-b border-border">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{selectedStock.symbol}</h2>
                        <Badge variant="outline">{selectedStock.sector || 'N/A'}</Badge>
                      </div>
                      <p className="text-muted-foreground">{selectedStock.name}</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <p className="text-2xl font-bold">₹{selectedStock.currentPrice.toFixed(2)}</p>
                      <div className="flex items-center">
                        {selectedStock.change >= 0 ? (
                          <Badge className="bg-green-500">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            ₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Previous Close</p>
                      <p className="font-medium">₹{selectedStock.previousClose.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-medium">{selectedStock.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Cap</p>
                      <p className="font-medium">₹{(selectedStock.marketCap / 1000000000).toFixed(2)}B</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sector</p>
                      <p className="font-medium">{selectedStock.sector || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button onClick={() => setBuyDialogOpen(true)}>
                      Buy
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSellDialogOpen(true)}
                      disabled={!portfolioData.some(item => item.symbol === selectedStock.symbol)}
                    >
                      Sell
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleAddToWatchlist(selectedStock)}
                      disabled={watchlistData.some(item => item.symbol === selectedStock.symbol)}
                    >
                      Add to Watchlist
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setSelectedStock(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Content based on active tab */}
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-[300px]" />
                  <Skeleton className="h-[300px]" />
                </div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>30-day history of your portfolio value</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={portfolioHistory}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                tickFormatter={(value) => `₹${value}`}
                                tick={{ fontSize: 12 }}
                              />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip 
                                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Value']}
                                labelFormatter={(label) => {
                                  const date = new Date(label);
                                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3b82f6" 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Portfolio Allocation</CardTitle>
                          <CardDescription>Breakdown of your investments by sector</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartPieChart>
                                <Pie
                                  data={allocationData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={true}
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                  {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Value']}
                                />
                                <Legend />
                              </RechartPieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle>Recent Transactions</CardTitle>
                          <CardDescription>Your latest stock trades</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[300px]">
                            {transactionHistory.slice(0, 5).map((transaction) => (
                              <div 
                                key={transaction.id} 
                                className="flex justify-between items-center py-3 border-b border-border last:border-0"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={transaction.type === 'BUY' ? 'default' : 'destructive'}>
                                      {transaction.type}
                                    </Badge>
                                    <p className="font-medium">{transaction.symbol}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(transaction.timestamp)} at {formatTime(transaction.timestamp)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{transaction.total.toFixed(2)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {transaction.quantity} shares @ ₹{transaction.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </ScrollArea>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="ghost" 
                            className="w-full" 
                            onClick={() => setActiveTab("transactions")}
                          >
                            View All Transactions
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                )}
                
                {/* Portfolio Tab */}
                {activeTab === "portfolio" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Your Portfolio</CardTitle>
                        <CardDescription>Current holdings and performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {portfolioData.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You don't have any stocks in your portfolio yet.</p>
                            <Button onClick={() => setActiveTab("overview")}>Start Trading</Button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-3 px-4">Symbol</th>
                                  <th className="text-left py-3 px-4">Name</th>
                                  <th className="text-right py-3 px-4">Quantity</th>
                                  <th className="text-right py-3 px-4">Avg. Price</th>
                                  <th className="text-right py-3 px-4">Current Price</th>
                                  <th className="text-right py-3 px-4">Total Value</th>
                                  <th className="text-right py-3 px-4">Profit/Loss</th>
                                  <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {portfolioData.map((item) => (
                                  <tr key={item.symbol} className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">{item.symbol}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{item.name}</td>
                                    <td className="py-3 px-4 text-right">{item.quantity}</td>
                                    <td className="py-3 px-4 text-right">₹{item.avgBuyPrice.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">₹{item.currentPrice.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">₹{item.totalValue.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className={item.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        ₹{item.profitLoss.toFixed(2)} ({item.profitLossPercent.toFixed(2)}%)
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => {
                                          const stock = MOCK_STOCKS.find(s => s.symbol === item.symbol);
                                          if (stock) {
                                            setSelectedStock(stock);
                                            setSellDialogOpen(true);
                                          }
                                        }}
                                      >
                                        Sell
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Portfolio Performance</CardTitle>
                        <CardDescription>30-day history of your portfolio value</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={portfolioHistory}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(value) => {
                                  const date = new Date(value);
                                  return `${date.getMonth() + 1}/${date.getDate()}`;
                                }}
                                tick={{ fontSize: 12 }}
                              />
                              <YAxis 
                                tickFormatter={(value) => `₹${value}`}
                                tick={{ fontSize: 12 }}
                              />
                              <CartesianGrid strokeDasharray="3 3" />
                              <Tooltip 
                                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Value']}
                                labelFormatter={(label) => {
                                  const date = new Date(label);
                                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#3b82f6" 
                                fillOpacity={1} 
                                fill="url(#colorValue2)" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Watchlist Tab */}
                {activeTab === "watchlist" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Your Watchlist</CardTitle>
                        <CardDescription>Stocks you're monitoring</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {watchlistData.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">Your watchlist is empty. Add stocks to track them.</p>
                            <Button onClick={() => setActiveTab("overview")}>Search Stocks</Button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-3 px-4">Symbol</th>
                                  <th className="text-left py-3 px-4">Name</th>
                                  <th className="text-right py-3 px-4">Price</th>
                                  <th className="text-right py-3 px-4">Change</th>
                                  <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {watchlistData.map((item) => (
                                  <tr key={item.symbol} className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">{item.symbol}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{item.name}</td>
                                    <td className="py-3 px-4 text-right">₹{item.currentPrice.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className={item.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {item.change >= 0 ? '+' : ''}₹{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => {
                                            const stock = MOCK_STOCKS.find(s => s.symbol === item.symbol);
                                            if (stock) {
                                              setSelectedStock(stock);
                                              setBuyDialogOpen(true);
                                            }
                                          }}
                                        >
                                          Buy
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleRemoveFromWatchlist(item.symbol)}
                                        >
                                          Remove
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Top Performing Stocks Section */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Top Performing Stocks</CardTitle>
                        <CardDescription>Best performing stocks in the Indian market</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4">Symbol</th>
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-right py-3 px-4">Price</th>
                                <th className="text-right py-3 px-4">Change</th>
                                <th className="text-right py-3 px-4">Sector</th>
                                <th className="text-right py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {MOCK_STOCKS
                                .filter(stock => stock.changePercent > 0)
                                .sort((a, b) => b.changePercent - a.changePercent)
                                .slice(0, 5)
                                .map((stock) => (
                                  <tr key={stock.symbol} className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{stock.name}</td>
                                    <td className="py-3 px-4 text-right">₹{stock.currentPrice.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className="text-green-500">
                                        +₹{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">{stock.sector}</td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => {
                                            setSelectedStock(stock);
                                            setBuyDialogOpen(true);
                                          }}
                                        >
                                          Buy
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleAddToWatchlist(stock)}
                                          disabled={watchlistData.some(item => item.symbol === stock.symbol)}
                                        >
                                          {watchlistData.some(item => item.symbol === stock.symbol) ? 'In Watchlist' : 'Add to Watchlist'}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* All Stocks List Section */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle>Indian Stocks</CardTitle>
                        <CardDescription>Complete list of available Indian stocks</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4">Symbol</th>
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-right py-3 px-4">Price</th>
                                <th className="text-right py-3 px-4">Change</th>
                                <th className="text-right py-3 px-4">Sector</th>
                                <th className="text-right py-3 px-4">Volume</th>
                                <th className="text-right py-3 px-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {MOCK_STOCKS
                                .filter(stock => stock.symbol !== 'NIFTY' && stock.symbol !== 'SENSEX')
                                .map((stock) => (
                                  <tr key={stock.symbol} className="border-b border-border">
                                    <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                                    <td className="py-3 px-4 text-muted-foreground">{stock.name}</td>
                                    <td className="py-3 px-4 text-right">₹{stock.currentPrice.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right">
                                      <span className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                        {stock.change >= 0 ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">{stock.sector}</td>
                                    <td className="py-3 px-4 text-right">{stock.volume.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-right">
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => {
                                            setSelectedStock(stock);
                                            setBuyDialogOpen(true);
                                          }}
                                        >
                                          Buy
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm"
                                          onClick={() => handleAddToWatchlist(stock)}
                                          disabled={watchlistData.some(item => item.symbol === stock.symbol)}
                                        >
                                          {watchlistData.some(item => item.symbol === stock.symbol) ? 'In Watchlist' : 'Add to Watchlist'}
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                
                {/* Transactions Tab */}
                {activeTab === "transactions" && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Transaction History</CardTitle>
                      <CardDescription>Record of all your trades</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactionHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">You haven't made any transactions yet.</p>
                          <Button onClick={() => setActiveTab("overview")}>Start Trading</Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-3 px-4">Date & Time</th>
                                <th className="text-left py-3 px-4">Type</th>
                                <th className="text-left py-3 px-4">Symbol</th>
                                <th className="text-left py-3 px-4">Name</th>
                                <th className="text-right py-3 px-4">Quantity</th>
                                <th className="text-right py-3 px-4">Price</th>
                                <th className="text-right py-3 px-4">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactionHistory.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-border">
                                  <td className="py-3 px-4">
                                    <div>
                                      <p className="font-medium">{formatDate(transaction.timestamp)}</p>
                                      <p className="text-sm text-muted-foreground">{formatTime(transaction.timestamp)}</p>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge variant={transaction.type === 'BUY' ? 'default' : 'destructive'}>
                                      {transaction.type}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4 font-medium">{transaction.symbol}</td>
                                  <td className="py-3 px-4 text-muted-foreground">{transaction.name}</td>
                                  <td className="py-3 px-4 text-right">{transaction.quantity}</td>
                                  <td className="py-3 px-4 text-right">₹{transaction.price.toFixed(2)}</td>
                                  <td className="py-3 px-4 text-right">₹{transaction.total.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* AI Advisor Tab */}
                {activeTab === "advisor" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          AI Stock Advisor
                        </CardTitle>
                        <CardDescription>
                          Personalized stock recommendations based on your risk profile and market trends
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2">Your Risk Profile</h3>
                          <Select defaultValue="MODERATE">
                            <SelectTrigger>
                              <SelectValue placeholder="Select your risk tolerance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LOW">Low Risk</SelectItem>
                              <SelectItem value="MODERATE">Moderate Risk</SelectItem>
                              <SelectItem value="HIGH">High Risk</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground mt-2">
                            Your risk profile helps our AI generate recommendations that match your investment style.
                          </p>
                        </div>
                        
                        <h3 className="text-lg font-medium mb-4">Recommended Stocks</h3>
                        <div className="space-y-4">
                          {aiRecommendations.map((recommendation) => (
                            <Card key={recommendation.symbol}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold">{recommendation.symbol}</h4>
                                      <Badge variant="outline">{recommendation.name}</Badge>
                                      <Badge 
                                        variant={
                                          recommendation.riskLevel === 'LOW' ? 'secondary' : 
                                          recommendation.riskLevel === 'MODERATE' ? 'default' : 
                                          'destructive'
                                        }
                                      >
                                        {recommendation.riskLevel} RISK
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">{recommendation.reason}</p>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm">AI Confidence:</p>
                                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary"
                                          style={{ width: `${recommendation.confidence}%` }}
                                        ></div>
                                      </div>
                                      <p className="text-sm font-medium">{recommendation.confidence}%</p>
                                    </div>
                                  </div>
                                  <Button 
                                    onClick={() => {
                                      const stock = MOCK_STOCKS.find(s => s.symbol === recommendation.symbol);
                                      if (stock) {
                                        setSelectedStock(stock);
                                        setBuyDialogOpen(true);
                                      } else {
                                        toast({
                                          title: "Stock data not available",
                                          description: "Please search for this stock to view details.",
                                        });
                                      }
                                    }}
                                  >
                                    View & Buy
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <p className="text-sm text-muted-foreground">
                          Last updated: April 30, 2025 at 3:15 PM
                        </p>
                        <Button variant="outline" onClick={() => {
                          toast({
                            title: "Recommendations refreshed",
                            description: "AI advisor has updated your stock recommendations.",
                          });
                        }}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Recommendations
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Insights</CardTitle>
                        <CardDescription>AI-generated analysis of current market conditions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p>
                            The Indian market is currently showing <strong>moderate bullish trends</strong> with technology and healthcare sectors outperforming. 
                            Recent economic data suggests continued growth, though inflation concerns remain.
                          </p>
                          <p>
                            Based on your moderate risk profile, we recommend a balanced approach with 60% allocation to growth stocks 
                            and 40% to value stocks. Consider increasing exposure to IT, renewable energy, and financial sectors.
                          </p>
                          <div className="bg-muted/50 p-4 rounded-lg border border-border">
                            <h4 className="font-medium mb-2">Key Market Indicators</h4>
                            <ul className="space-y-2">
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>NIFTY 50 showing positive momentum with 2.3% gain over past month</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>IT sector leading with 4.1% growth, driven by AI and cloud services</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <X className="h-4 w-4 text-red-500" />
                                <span>Energy sector underperforming with 1.2% decline amid policy uncertainties</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>RBI signaling stable interest rates for next quarter</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      
      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy {selectedStock?.symbol}</DialogTitle>
            <DialogDescription>
              Current price: ₹{selectedStock?.currentPrice.toFixed(2)} per share
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between">
              <p>Total Cost:</p>
              <p className="font-medium">₹{selectedStock ? (selectedStock.currentPrice * quantity).toFixed(2) : '0.00'}</p>
            </div>
            <div className="flex justify-between">
              <p>Available Balance:</p>
              <p className="font-medium">₹{userBalance.toFixed(2)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleBuyStock}
              disabled={!selectedStock || quantity <= 0 || selectedStock.currentPrice * quantity > userBalance}
            >
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell {selectedStock?.symbol}</DialogTitle>
            <DialogDescription>
              Current price: ₹{selectedStock?.currentPrice.toFixed(2)} per share
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sell-quantity">Quantity</Label>
              <Input
                id="sell-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              {selectedStock && (
                <p className="text-sm text-muted-foreground">
                  You own {portfolioData.find(item => item.symbol === selectedStock.symbol)?.quantity || 0} shares
                </p>
              )}
            </div>
            <div className="flex justify-between">
              <p>Total Value:</p>
              <p className="font-medium">₹{selectedStock ? (selectedStock.currentPrice * quantity).toFixed(2) : '0.00'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSellStock}
              disabled={
                !selectedStock || 
                quantity <= 0 || 
                !portfolioData.some(item => item.symbol === selectedStock.symbol) ||
                quantity > (portfolioData.find(item => item.symbol === selectedStock.symbol)?.quantity || 0)
              }
            >
              Confirm Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}