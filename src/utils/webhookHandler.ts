// Утилиты для обработки webhook-уведомлений от платежных систем

interface WebhookPayload {
  paymentId: string;
  status: 'succeeded' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  signature?: string;
  timestamp: string;
}

interface WebhookValidation {
  isValid: boolean;
  error?: string;
}

class WebhookHandler {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  // Проверка подписи webhook (для безопасности)
  validateSignature(payload: string, signature: string, timestamp: string): WebhookValidation {
    try {
      // Пример валидации для YooKassa
      // Для других провайдеров алгоритм может отличаться
      const expectedSignature = this.createSignature(payload, timestamp);
      
      if (signature !== expectedSignature) {
        return {
          isValid: false,
          error: 'Invalid signature'
        };
      }

      // Проверка времени (защита от replay-атак)
      const payloadTimestamp = parseInt(timestamp);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeDiff = Math.abs(currentTime - payloadTimestamp);

      if (timeDiff > 300) { // 5 минут
        return {
          isValid: false,
          error: 'Timestamp too old'
        };
      }

      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: 'Signature validation failed'
      };
    }
  }

  private createSignature(payload: string, timestamp: string): string {
    // Реализация зависит от конкретного провайдера
    // Пример для HMAC-SHA256
    const crypto = require('crypto');
    const message = timestamp + payload;
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(message)
      .digest('hex');
  }

  // Обработка разных типов webhook-событий
  processWebhook(payload: WebhookPayload): {
    action: 'update_order' | 'send_notification' | 'refund' | 'ignore';
    data: any;
  } {
    switch (payload.status) {
      case 'succeeded':
        return {
          action: 'update_order',
          data: {
            orderId: payload.metadata?.orderId,
            status: 'paid',
            paymentId: payload.paymentId,
            amount: payload.amount
          }
        };

      case 'failed':
        return {
          action: 'send_notification',
          data: {
            type: 'payment_failed',
            paymentId: payload.paymentId,
            reason: 'Payment processing failed'
          }
        };

      case 'cancelled':
        return {
          action: 'update_order',
          data: {
            orderId: payload.metadata?.orderId,
            status: 'cancelled',
            paymentId: payload.paymentId
          }
        };

      default:
        return {
          action: 'ignore',
          data: {}
        };
    }
  }
}

// Типы для интеграции с различными платежными системами
export interface PaymentProviderConfig {
  name: 'yookassa' | 'sberbank' | 'tinkoff' | 'cloudpayments';
  apiUrl: string;
  merchantId: string;
  secretKey: string;
  webhookEndpoint: string;
}

// Конфигурации для популярных российских платежных систем
export const paymentProviders: Record<string, Omit<PaymentProviderConfig, 'merchantId' | 'secretKey'>> = {
  yookassa: {
    name: 'yookassa',
    apiUrl: 'https://api.yookassa.ru/v3',
    webhookEndpoint: '/webhooks/yookassa'
  },
  sberbank: {
    name: 'sberbank',
    apiUrl: 'https://securepayments.sberbank.ru/payment/rest',
    webhookEndpoint: '/webhooks/sberbank'
  },
  tinkoff: {
    name: 'tinkoff',
    apiUrl: 'https://securepay.tinkoff.ru/v2',
    webhookEndpoint: '/webhooks/tinkoff'
  },
  cloudpayments: {
    name: 'cloudpayments',
    apiUrl: 'https://api.cloudpayments.ru',
    webhookEndpoint: '/webhooks/cloudpayments'
  }
};

export { WebhookHandler };
export type { WebhookPayload, WebhookValidation };