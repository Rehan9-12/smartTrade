import { useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Header = () => {
  const { user, initializing, signOut } = useContext(AuthContext);
  const router = useRouter();

  const handleButtonClick = () => {
    if (user && (router.pathname === '/dashboard' || router.pathname === '/dashboard-indian')) {
      signOut();
      router.push('/');
    } else {
      router.push(user ? "/dashboard-indian" : "/login");
    }
  };

  const buttonText = () => {
    if (user && (router.pathname === '/dashboard' || router.pathname === '/dashboard-indian')) {
      return "Log out";
    }
    return user ? "Dashboard" : "Login";
  };

  return (
    <header className="w-full">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <Logo />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="/blog" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                router.push("/blog");
              }}
            >
              <BookOpen className="h-4 w-4" />
              Blog & Education
            </a>
          </nav>
        </div>
        {!initializing && (
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleButtonClick}
              variant="default"
              size="default"
            >
              {buttonText()}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;