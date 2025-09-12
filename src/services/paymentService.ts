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

interface PaymentRequest {
  items: CartItem[];
  totalAmount: number;
  currency: 'RUB';
  customer: {
    email: string;
    phone: string;
    name?: string;
  };
  paymentMethod: 'card' | 'qr' | 'sbp';
  returnUrl: string;
  webhookUrl?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentId: string;
  paymentUrl?: string;
  qrCode?: string;
  error?: string;
  message?: string;
}

interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

class PaymentService {
  private baseUrl = '/api/payments'; // Базовый URL для API платежей
  
  // Создание платежа
  async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_PAYMENT_API_KEY || '',
        },
        body: JSON.stringify({
          ...request,
          metadata: {
            source: 'web',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error('Не удалось создать платеж. Попробуйте позже.');
    }
  }

  // Проверка статуса платежа
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_PAYMENT_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment status check failed:', error);
      throw new Error('Не удалось проверить статус платежа');
    }
  }

  // Отмена платежа
  async cancelPayment(paymentId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_PAYMENT_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment cancellation failed:', error);
      throw new Error('Не удалось отменить платеж');
    }
  }

  // Получение списка доступных методов оплаты
  async getPaymentMethods(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/methods`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_PAYMENT_API_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.methods || ['card', 'qr', 'sbp'];
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return ['card']; // Fallback к банковским картам
    }
  }

  // Валидация данных перед отправкой
  validatePaymentData(request: PaymentRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.items || request.items.length === 0) {
      errors.push('Корзина пуста');
    }

    if (!request.totalAmount || request.totalAmount <= 0) {
      errors.push('Некорректная сумма платежа');
    }

    if (!request.customer.email || !this.isValidEmail(request.customer.email)) {
      errors.push('Некорректный email');
    }

    if (!request.customer.phone || !this.isValidPhone(request.customer.phone)) {
      errors.push('Некорректный номер телефона');
    }

    if (!request.returnUrl) {
      errors.push('Не указан URL возврата');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ''));
  }
}

export const paymentService = new PaymentService();
export type { PaymentRequest, PaymentResponse, PaymentStatus, CartItem };