import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

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

interface CartPageProps {
  cart: CartItem[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  setCurrentTab: (tab: 'home' | 'cart') => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  onCheckout: () => void;
}

const CartPage = ({ 
  cart, 
  updateQuantity, 
  removeFromCart, 
  setCurrentTab, 
  getTotalItems, 
  getTotalPrice,
  onCheckout
}: CartPageProps) => {
  return (
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
            
            {/* Delivery Information */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Icon name="Truck" size={20} className="text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Способ получения товара:</h3>
                    <p className="text-blue-800">
                      Отправляем по почте, <span className="font-medium">ОБЯЗАТЕЛЬНО указывайте ФИО и адрес при оплате.</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">
                    {getTotalPrice().toLocaleString()} ₽
                  </span>
                </div>
                <Button size="lg" className="w-full" onClick={onCheckout}>
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Оформить заказ
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Contact Information Footer */}
      <div className="mt-16 bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Контактная информация</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Icon name="Phone" size={16} className="mr-3" />
                  <span>+7 958 651 98 03</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Mail" size={16} className="mr-3" />
                  <span>rxtxshop@gmail.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Реквизиты</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm opacity-90">ИНН: 272100036607</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;