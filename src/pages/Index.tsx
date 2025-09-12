import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Notification from "@/components/Notification";
import HomePage from "@/components/HomePage";
import CartPage from "@/components/CartPage";
import { Product, CartItem } from "@/types";

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
      <Header 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        totalItems={getTotalItems()}
      />
      
      <Notification message={notification} />

      {currentTab === 'home' && (
        <HomePage products={products} addToCart={addToCart} />
      )}

      {currentTab === 'cart' && (
        <CartPage
          cart={cart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          setCurrentTab={setCurrentTab}
          getTotalItems={getTotalItems}
          getTotalPrice={getTotalPrice}
        />
      )}
    </div>
  );
};

export default Index;