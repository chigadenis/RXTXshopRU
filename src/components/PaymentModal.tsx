import { useState } from "react";
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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  onPaymentResult: (success: boolean) => void;
}

const PaymentModal = ({ isOpen, onClose, cart, totalPrice, onPaymentResult }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const simulatePayment = async () => {
    setIsProcessing(true);
    
    // Симуляция обработки платежа (3 секунды)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Случайный результат (80% успех, 20% неудача)
    const success = Math.random() > 0.2;
    
    setIsProcessing(false);
    onPaymentResult(success);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Оплата заказа</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ваш заказ</h3>
              <div className="space-y-2 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Способ оплаты</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-20 flex-col"
              >
                <Icon name="CreditCard" size={24} className="mb-2" />
                Банковской картой
              </Button>
              <Button
                variant={paymentMethod === 'qr' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('qr')}
                className="h-20 flex-col"
              >
                <Icon name="QrCode" size={24} className="mb-2" />
                QR-код
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Номер карты</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Срок действия</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    maxLength={3}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Имя держателя карты</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'qr' && (
            <div className="text-center mb-6">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <Icon name="QrCode" size={128} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Отсканируйте QR-код для оплаты</p>
                <p className="text-2xl font-bold text-primary mt-2">{totalPrice.toLocaleString()} ₽</p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold">Контактная информация</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={simulatePayment}
            disabled={isProcessing}
            size="lg"
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Обрабатываем платёж...
              </>
            ) : (
              <>
                <Icon name="CreditCard" size={20} className="mr-2" />
                Оплатить {totalPrice.toLocaleString()} ₽
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Нажимая кнопку "Оплатить", вы соглашаетесь с условиями оферты
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;