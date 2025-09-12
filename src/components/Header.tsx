import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface HeaderProps {
  currentTab: "home" | "cart";
  setCurrentTab: (tab: "home" | "cart") => void;
  totalItems: number;
}

const Header = ({ currentTab, setCurrentTab, totalItems }: HeaderProps) => {
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
            <h1 className="text-2xl font-bold text-gray-900"> shop </h1>
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
            <a
              href="#"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Контакты
            </a>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
