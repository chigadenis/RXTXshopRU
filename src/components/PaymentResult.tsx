import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PaymentResultProps {
  success: boolean;
  onClose: () => void;
  orderNumber?: string;
}

const PaymentResult = ({ success, onClose, orderNumber }: PaymentResultProps) => {
  const generateOrderNumber = () => {
    return orderNumber || `RX${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
        {success ? (
          <>
            {/* Success */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Check" size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Оплата прошла успешно!
            </h2>
            <p className="text-gray-600 mb-6">
              Спасибо за покупку! Ваш заказ принят в обработку.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500 mb-1">Номер заказа</div>
              <div className="text-lg font-bold text-primary">{generateOrderNumber()}</div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 mb-6">
              <div className="flex items-center justify-center">
                <Icon name="Clock" size={16} className="mr-2" />
                Обработка: 1-2 рабочих дня
              </div>
              <div className="flex items-center justify-center">
                <Icon name="Truck" size={16} className="mr-2" />
                Доставка: 3-7 рабочих дней
              </div>
              <div className="flex items-center justify-center">
                <Icon name="Mail" size={16} className="mr-2" />
                Уведомления на email
              </div>
            </div>
            <Button onClick={onClose} className="w-full mb-3">
              <Icon name="Home" size={20} className="mr-2" />
              Вернуться в магазин
            </Button>
          </>
        ) : (
          <>
            {/* Failure */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="X" size={40} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ошибка оплаты
            </h2>
            <p className="text-gray-600 mb-6">
              К сожалению, не удалось обработать ваш платёж. Попробуйте ещё раз или выберите другой способ оплаты.
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
              <div className="text-sm font-medium text-red-800 mb-2">Возможные причины:</div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Недостаточно средств на карте</li>
                <li>• Неверные данные карты</li>
                <li>• Банк отклонил операцию</li>
                <li>• Проблемы с интернет-соединением</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Button onClick={onClose} className="w-full">
                <Icon name="RotateCcw" size={20} className="mr-2" />
                Попробовать ещё раз
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full"
              >
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Вернуться в корзину
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;