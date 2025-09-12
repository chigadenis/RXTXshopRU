import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { usePayment } from "@/hooks/usePayment";
import { PaymentRequest } from "@/services/paymentService";

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
  onPaymentResult: (success: boolean, paymentId?: string) => void;
}

const PaymentModalReal = ({ isOpen, onClose, cart, totalPrice, onPaymentResult }: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qr' | 'sbp'>('card');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: ''
  });
  const [availableMethods, setAvailableMethods] = useState<string[]>(['card']);

  const { 
    isLoading, 
    error, 
    paymentData, 
    createPayment, 
    checkPaymentStatus,
    clearError,
    reset 
  } = usePayment();

  // Загрузка доступных методов оплаты при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      loadPaymentMethods();
      clearError();
    }
  }, [isOpen, clearError]);

  // Мониторинг статуса платежа
  useEffect(() => {
    if (paymentData?.paymentId) {
      const interval = setInterval(async () => {
        const status = await checkPaymentStatus(paymentData.paymentId);
        if (status) {
          if (status.status === 'succeeded') {
            clearInterval(interval);
            onPaymentResult(true, paymentData.paymentId);
            handleClose();
          } else if (status.status === 'failed' || status.status === 'cancelled') {
            clearInterval(interval);
            onPaymentResult(false, paymentData.paymentId);
          }
        }
      }, 2000); // Проверка каждые 2 секунды

      // Таймаут через 10 минут
      const timeout = setTimeout(() => {
        clearInterval(interval);
        onPaymentResult(false, paymentData.paymentId);
      }, 600000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [paymentData, checkPaymentStatus, onPaymentResult]);

  const loadPaymentMethods = async () => {
    try {
      const { paymentService } = await import('@/services/paymentService');
      const methods = await paymentService.getPaymentMethods();
      setAvailableMethods(methods);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      setAvailableMethods(['card']); // Fallback
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    const paymentRequest: PaymentRequest = {
      items: cart,
      totalAmount: totalPrice,
      currency: 'RUB',
      customer: {
        email: formData.email,
        phone: formData.phone,
        name: formData.name || undefined,
      },
      paymentMethod,
      returnUrl: `${window.location.origin}/payment/result`,
      webhookUrl: `${window.location.origin}/api/webhooks/payment`,
    };

    const result = await createPayment(paymentRequest);
    
    if (result?.success) {
      // Если есть URL для перенаправления (для карт), открываем его
      if (result.paymentUrl && paymentMethod === 'card') {
        window.open(result.paymentUrl, '_blank');
      }
      // Для QR-кода данные уже будут в paymentData
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.phone) {
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }

    return true;
  };

  const handleClose = () => {
    reset();
    setFormData({ email: '', phone: '', name: '' });
    setPaymentMethod('card');
    onClose();
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return 'CreditCard';
      case 'qr': return 'QrCode';
      case 'sbp': return 'Smartphone';
      default: return 'CreditCard';
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'card': return 'Банковской картой';
      case 'qr': return 'QR-код';
      case 'sbp': return 'Система быстрых платежей';
      default: return 'Неизвестный метод';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Оплата заказа</h2>
            <Button variant="outline" size="sm" onClick={handleClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Icon name="AlertCircle" size={20} className="text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableMethods.map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod(method as 'card' | 'qr' | 'sbp')}
                  className="h-20 flex-col"
                  disabled={isLoading}
                >
                  <Icon name={getMethodIcon(method) as any} size={24} className="mb-2" />
                  {getMethodName(method)}
                </Button>
              ))}
            </div>
          </div>

          {/* QR Code Display */}
          {paymentData?.qrCode && paymentMethod === 'qr' && (
            <div className="text-center mb-6">
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-4">
                  <img src={paymentData.qrCode} alt="QR код для оплаты" className="max-w-full max-h-full" />
                </div>
                <p className="text-gray-600">Отсканируйте QR-код для оплаты</p>
                <p className="text-2xl font-bold text-primary mt-2">{totalPrice.toLocaleString()} ₽</p>
              </div>
              <p className="text-sm text-gray-500">
                Ожидаем подтверждение платежа...
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold">Контактная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Телефон *</label>
                <input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Имя (опционально)</label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Payment Button */}
          {!paymentData && (
            <Button
              onClick={handlePayment}
              disabled={isLoading || !validateForm()}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Создаём платёж...
                </>
              ) : (
                <>
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Оплатить {totalPrice.toLocaleString()} ₽
                </>
              )}
            </Button>
          )}

          {/* Payment Processing Info */}
          {paymentData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Icon name="Info" size={20} className="text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Платёж создан</span>
              </div>
              <p className="text-sm text-blue-700 mb-2">
                ID платежа: {paymentData.paymentId}
              </p>
              {paymentMethod === 'card' && paymentData.paymentUrl && (
                <p className="text-sm text-blue-700">
                  Перейдите по ссылке для завершения оплаты
                </p>
              )}
              {paymentMethod === 'qr' && (
                <p className="text-sm text-blue-700">
                  Ожидаем подтверждение оплаты через QR-код
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            Нажимая кнопку "Оплатить", вы соглашаетесь с условиями оферты
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModalReal;