import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface HeaderProps {
  currentTab: "home" | "cart";
  setCurrentTab: (tab: "home" | "cart") => void;
  totalItems: number;
}

const Header = ({ currentTab, setCurrentTab, totalItems }: HeaderProps) => {
  const [user, setUser] = useState<{username: string} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn.poehali.dev/files/5e4ca52d-3576-405f-a172-29a864b635b1.png"
              alt="RXTX Logo"
              className="h-8 w-auto"
            />
          </div>
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setCurrentTab("home")}
              className={`font-medium pb-1 transition-colors ${
                currentTab === "home"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentTab("cart")}
              className={`font-medium pb-1 transition-colors ${
                currentTab === "cart"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              Корзина
            </button>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Icon name="Search" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentTab("cart")}
              className="relative"
            >
              <Icon name="ShoppingCart" size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            {user ? (
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Icon name="User" size={16} />
                  <span className="ml-1 hidden sm:inline">{user.username}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <Icon name="LogIn" size={16} />
                  <span className="ml-1 hidden sm:inline">Войти</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;