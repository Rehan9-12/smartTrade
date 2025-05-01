import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDebounce } from '@/hooks/useDebounce';

export interface StockSearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timezone: string;
  currency: string;
  matchScore: string;
}

interface StockSearchAutocompleteProps {
  onSelectStock: (stock: StockSearchResult) => void;
  placeholder?: string;
  className?: string;
}

export const StockSearchAutocomplete: React.FC<StockSearchAutocompleteProps> = ({
  onSelectStock,
  placeholder = "Search for stocks...",
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for stocks when query changes
  useEffect(() => {
    const searchStocks = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/stocks/search?query=${encodeURIComponent(debouncedSearchQuery)}`);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        const data = await response.json();
        setResults(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error('Error searching stocks:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchStocks();
  }, [debouncedSearchQuery]);

  const handleSelectResult = (stock: StockSearchResult) => {
    onSelectStock(stock);
    setSearchQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="pr-10"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-80 overflow-auto">
          <ScrollArea className="h-full max-h-80">
            {results.map((stock) => (
              <div
                key={stock.symbol}
                className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                onClick={() => handleSelectResult(stock)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{stock.region}</p>
                    <p className="text-xs text-muted-foreground">{stock.currency}</p>
                  </div>
                </div>
              </div>
            ))}
            {results.length === 0 && !isLoading && (
              <div className="p-3 text-center text-muted-foreground">
                No results found
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};

export default StockSearchAutocomplete;