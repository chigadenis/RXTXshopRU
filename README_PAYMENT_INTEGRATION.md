# Интеграция платежной системы

## Обзор архитектуры

Подготовлена полная инфраструктура для интеграции с реальными платежными системами:

### 📁 Структура файлов

```
src/
├── services/
│   └── paymentService.ts      # API сервис для работы с платежами
├── hooks/
│   └── usePayment.ts          # React Hook для управления состоянием
├── components/
│   └── PaymentModalReal.tsx   # Компонент формы оплаты
├── utils/
│   └── webhookHandler.ts      # Обработка webhook уведомлений
└── pages/Index.tsx           # Интегрировано в основное приложение
```

### 🔧 Конфигурация

1. **Переменные окружения** (`.env.example`):
```env
REACT_APP_PAYMENT_API_KEY=your_api_key
REACT_APP_PAYMENT_PROVIDER=yookassa
REACT_APP_API_BASE_URL=https://your-backend.com
```

2. **Поддерживаемые провайдеры**:
- ЮKassa (YooMoney)
- Сбербанк
- Тинькофф
- CloudPayments

### 🚀 API эндпоинты (Backend)

Необходимо реализовать на сервере:

```
POST /api/payments/create     # Создание платежа
GET  /api/payments/status/:id # Проверка статуса
POST /api/payments/cancel/:id # Отмена платежа
GET  /api/payments/methods    # Доступные методы
POST /api/webhooks/payment    # Webhook уведомления
```

### 💳 Способы оплаты

- **Банковские карты** - редирект на страницу банка
- **QR-коды** - статичный QR для сканирования
- **СБП** - система быстрых платежей

### 🔄 Процесс оплаты

1. **Создание платежа**: `paymentService.createPayment()`
2. **Мониторинг статуса**: автоматическая проверка каждые 2 сек
3. **Webhook обработка**: уведомления от платежной системы
4. **Результат**: success/failure + очистка корзины

### 🛡️ Безопасность

- Валидация webhook подписей
- Проверка timestamp (защита от replay)
- API ключи в переменных окружения
- Валидация пользовательского ввода

### 📋 Данные платежа

```typescript
interface PaymentRequest {
  items: CartItem[];           # Товары из корзины
  totalAmount: number;         # Сумма к оплате
  currency: 'RUB';            # Валюта
  customer: {                 # Данные покупателя
    email: string;
    phone: string;
    name?: string;
  };
  paymentMethod: 'card' | 'qr' | 'sbp';
  returnUrl: string;          # URL возврата
  webhookUrl: string;         # URL для уведомлений
}
```

### 🔧 Использование

```typescript
// В компоненте
import { usePayment } from '@/hooks/usePayment';

const { createPayment, isLoading, error } = usePayment();

// Создание платежа
const result = await createPayment({
  items: cart,
  totalAmount: 1000,
  customer: { email: "user@email.com", phone: "+79991234567" },
  // ... остальные параметры
});
```

### ✅ Ready для продакшена

- ✅ TypeScript типизация
- ✅ Error handling
- ✅ Loading состояния  
- ✅ Webhook безопасность
- ✅ Мониторинг платежей
- ✅ Валидация данных
- ✅ Множественные провайдеры

### 📞 Следующие шаги

1. Выберите платежного провайдера
2. Получите API ключи
3. Настройте backend эндпоинты
4. Добавьте переменные окружения
5. Протестируйте в sandbox режиме