import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  specs: string[];
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [currentTab, setCurrentTab] = useState<'home' | 'cart'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "Шифратор сигнала аналоговый",
      price: "19.990 ₽",
      image:
        "https://cdn.poehali.dev/files/906784c9-3f67-46a2-bfab-14cf7c7c8c4d.jpg",
      specs: [
        "Маскирование видео",
        "Отсутствие задержки",
        "Удаленное включение/отключение кодирования",
        "Адаптивная коррекция качества видеосигнала",
      ],
    },
    {
      id: 2,
      name: "Усилитель 25 Ватт 130-170 МГц",
      price: "12 990 ₽",
      image:
        "https://cdn.poehali.dev/files/aea531a6-8d8a-4a24-b0ca-73e161c2e71c.png",
      specs: [
        "25W мощность",
        "130-170 МГц",
        "Активное охлаждение",
        "SMA разъёмы",
      ],
    },
    {
      id: 3,
      name: "Дешифратор сигнала аналоговый",
      price: "24.990 ₽",
      image:
        "https://cdn.poehali.dev/files/7077915b-b895-4c4a-9fdd-470f169e6a88.jpg",
      specs: ["100.000 вариантов кода", "Стандарт видео PAL", "TTL, CVBS"],
    },
  ];

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // Show notification
    setNotification(`${product.name} добавлен в корзину`);
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Icon name="Smartphone" className="text-primary" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">RXTXshop</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentTab('home')}
                className={`font-medium pb-1 transition-colors ${
                  currentTab === 'home'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Главная
              </button>
              <button
                onClick={() => setCurrentTab('cart')}
                className={`font-medium pb-1 transition-colors ${
                  currentTab === 'cart'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary'
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
                onClick={() => setCurrentTab('cart')}
                className="relative"
              >
                <Icon name="ShoppingCart" size={16} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={16} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {currentTab === 'home' && (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-primary via-secondary to-primary/80 text-white py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center animate-fade-in">
                <h1 className="text-5xl font-bold mb-6">Радиоэлектроника </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                  Тщательно отобранные товары, прямыми поставками из Китая
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-primary font-semibold"
                >
                  Посмотреть каталог
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </div>

            {/* Radio Towers Background Graphics */}
            <div className="absolute inset-0 opacity-10">
              {/* Left Tower */}
              <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
                <svg
                  width="60"
                  height="120"
                  viewBox="0 0 60 120"
                  fill="currentColor"
                  className="text-white"
                >
                  {/* Tower Base */}
                  <rect x="25" y="80" width="10" height="40" />
                  {/* Tower Body */}
                  <rect x="27" y="20" width="6" height="60" />
                  {/* Antenna Elements */}
                  <rect x="20" y="25" width="20" height="2" />
                  <rect x="22" y="35" width="16" height="2" />
                  <rect x="24" y="45" width="12" height="2" />
                  {/* Tower Top */}
                  <rect x="28" y="10" width="4" height="15" />
                  <circle cx="30" cy="8" r="3" />
                </svg>
              </div>

              {/* Right Tower */}
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <svg
                  width="60"
                  height="120"
                  viewBox="0 0 60 120"
                  fill="currentColor"
                  className="text-white"
                >
                  {/* Tower Base */}
                  <rect x="25" y="80" width="10" height="40" />
                  {/* Tower Body */}
                  <rect x="27" y="20" width="6" height="60" />
                  {/* Antenna Elements */}
                  <rect x="20" y="25" width="20" height="2" />
                  <rect x="22" y="35" width="16" height="2" />
                  <rect x="24" y="45" width="12" height="2" />
                  {/* Tower Top */}
                  <rect x="28" y="10" width="4" height="15" />
                  <circle cx="30" cy="8" r="3" />
                </svg>
              </div>

              {/* Signal Waves */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  width="200"
                  height="80"
                  viewBox="0 0 200 80"
                  fill="none"
                  className="text-white animate-pulse"
                >
                  {/* Signal waves from left */}
                  <path
                    d="M20 40 Q60 20, 100 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <path
                    d="M30 40 Q65 25, 100 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  <path
                    d="M40 40 Q70 30, 100 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                  />

                  {/* Signal waves to right */}
                  <path
                    d="M100 40 Q140 20, 180 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  <path
                    d="M100 40 Q135 25, 170 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.4"
                  />
                  <path
                    d="M100 40 Q130 30, 160 40"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                  />

                  {/* Central connection point */}
                  <circle
                    cx="100"
                    cy="40"
                    r="4"
                    fill="currentColor"
                    opacity="0.8"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Список товаров
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Тщательно отобранные устройства с лучшими характеристиками и
                  отзывами
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-xl transition-all duration-300 animate-scale-in hover:scale-105 bg-white border-0 shadow-md"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="text-2xl font-bold text-primary mb-4">
                        {product.price}
                      </div>
                      <div className="space-y-2 mb-6">
                        {product.specs.map((spec, specIndex) => (
                          <div
                            key={specIndex}
                            className="flex items-center text-gray-600 text-sm"
                          >
                            <Icon
                              name="Check"
                              size={16}
                              className="text-primary mr-2 flex-shrink-0"
                            />
                            {spec}
                          </div>
                        ))}
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full"
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Добавить в корзину
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Truck" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Быстрая доставка</h3>
                  <p className="text-gray-600">
                    Доставляем по Москве в 1-3 дня, по России — 1-2 недели
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Headphones" size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
                  <p className="text-gray-600">
                    Консультации по выбору и техподдержка в любое время
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Icon name="Smartphone" size={28} className="text-primary" />
                    <h3 className="text-xl font-bold px-0">RXTXshop</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Поставщик радиоэлектроники с 2012 года
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Контакты</h4>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center">
                      <Icon name="Phone" size={16} className="mr-2" />
                      <span>+7 (960) 491-24-37</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="Mail" size={16} className="mr-2" />
                      <span>RXTXshop@gmail.com</span>
                    </div>
                    <div className="flex items-center">
                      <Icon name="MapPin" size={16} className="mr-2" />
                      <span>Москва, ул. Тверская, 1</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Часы работы</h4>
                  <div className="space-y-2 text-gray-300">
                    <div>Пн-Пт: 9:00 - 21:00</div>
                    <div>Сб-Вс: 10:00 - 20:00</div>
                    <div className="flex items-center space-x-4 mt-4">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <span className="text-primary">Работаем сейчас</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>© 2024 RXTXshop. Все права защищены.</p>
              </div>
            </div>
          </footer>
        </>
      )}

      {currentTab === 'cart' && (
        <div className="min-h-screen bg-gray-50 pt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Корзина</h1>
              <p className="text-gray-600">
                {getTotalItems() > 0 
                  ? `${getTotalItems()} товар(ов) на сумму ${getTotalPrice().toLocaleString()} ₽`
                  : 'Корзина пуста'
                }
              </p>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="ShoppingCart" size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Корзина пуста</h2>
                <p className="text-gray-500 mb-8">Добавьте товары из каталога</p>
                <Button onClick={() => setCurrentTab('home')}>
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Вернуться к покупкам
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.specs.join(' • ')}</p>
                          <div className="text-lg font-bold text-primary">{item.price}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-red-600 hover:text-red-700"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="bg-white border-primary">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-semibold">Итого:</span>
                      <span className="text-2xl font-bold text-primary">
                        {getTotalPrice().toLocaleString()} ₽
                      </span>
                    </div>
                    <Button size="lg" className="w-full">
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      Оформить заказ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;