import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Index = () => {
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: "99 990 ₽",
      image: "/img/4dca5d91-3fe4-4c59-8def-39e768cc9596.jpg",
      specs: ["6.1\" дисплей", "128 ГБ", "A17 Pro", "48 МП камера"]
    },
    {
      id: 2, 
      name: "Gaming Laptop ROG",
      price: "159 990 ₽",
      image: "/img/6e93eaf3-1cbd-4eaa-98d9-113884c4acce.jpg",
      specs: ["15.6\" 144Hz", "RTX 4070", "32 ГБ RAM", "1 ТБ SSD"]
    },
    {
      id: 3,
      name: "AirPods Pro 2",
      price: "24 990 ₽", 
      image: "/img/9782eaa2-b3b8-4c28-b77c-46ae73af56ab.jpg",
      specs: ["ANC", "6ч + 24ч", "USB-C", "MagSafe"]
    }
  ];

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
              <a href="#" className="text-primary font-medium border-b-2 border-primary pb-1">Главная</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Товары</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Контакты</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Icon name="Search" size={16} />
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="ShoppingCart" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl font-bold mb-6">Электроника и гаджеты</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">Лучшая радиоэлектроника прямыми поставками из Китая</p>
            <Button size="lg" variant="secondary" className="text-primary font-semibold">
              Посмотреть каталог
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Список товаров</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Тщательно отобранные устройства с лучшими характеристиками и отзывами
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card key={product.id} className="hover:shadow-xl transition-all duration-300 animate-scale-in hover:scale-105 bg-white border-0 shadow-md" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="text-2xl font-bold text-primary mb-4">{product.price}</div>
                  <div className="space-y-2 mb-6">
                    {product.specs.map((spec, specIndex) => (
                      <div key={specIndex} className="flex items-center text-gray-600 text-sm">
                        <Icon name="Check" size={16} className="text-primary mr-2 flex-shrink-0" />
                        {spec}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full">
                    В корзину
                    <Icon name="ShoppingCart" size={16} className="ml-2" />
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
              <p className="text-gray-600">Доставляем по Москве в день заказа, по России — за 1-3 дня</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Headphones" size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Поддержка 24/7</h3>
              <p className="text-gray-600">Консультации по выбору и техподдержка в любое время</p>
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
              <p className="text-gray-400 mb-4">Поставщик радиоэлектроники с 2012 года</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-center">
                  <Icon name="Phone" size={16} className="mr-2" />
                  <span>+7 (495) 123-45-67</span>
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
    </div>
  );
};

export default Index;