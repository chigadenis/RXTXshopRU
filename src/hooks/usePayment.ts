import { useState, useCallback } from 'react';
import { paymentService, PaymentRequest, PaymentResponse, PaymentStatus } from '../services/paymentService';

interface UsePaymentReturn {
  isLoading: boolean;
  error: string | null;
  paymentData: PaymentResponse | null;
  paymentStatus: PaymentStatus | null;
  createPayment: (request: PaymentRequest) => Promise<PaymentResponse | null>;
  checkPaymentStatus: (paymentId: string) => Promise<PaymentStatus | null>;
  cancelPayment: (paymentId: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

export const usePayment = (): UsePaymentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const createPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Валидация данных
      const validation = paymentService.validatePaymentData(request);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const response = await paymentService.createPayment(request);
      setPaymentData(response);
      
      if (!response.success) {
        throw new Error(response.error || 'Ошибка создания платежа');
      }

      // Отправляем email уведомление о заказе
      try {
        await fetch("https://functions.poehali.dev/8cf4ae1d-a65c-4ac4-a729-fe81eb9cd885", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_email: request.customerInfo.email,
            customer_phone: request.customerInfo.phone,
            customer_name: request.customerInfo.name || "",
            order_amount: request.amount,
            order_id: response.paymentId || `ORDER-${Date.now()}`,
            items: request.items || [],
            payment_method: request.paymentMethod || ""
          }),
        });
      } catch (emailError) {
        console.warn('Email notification failed:', emailError);
        // Не прерываем процесс платежа если email не отправился
      }

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Payment creation error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkPaymentStatus = useCallback(async (paymentId: string): Promise<PaymentStatus | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await paymentService.getPaymentStatus(paymentId);
      setPaymentStatus(status);
      return status;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка проверки статуса';
      setError(errorMessage);
      console.error('Payment status check error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelPayment = useCallback(async (paymentId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await paymentService.cancelPayment(paymentId);
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка отмены платежа';
      setError(errorMessage);
      console.error('Payment cancellation error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setPaymentData(null);
    setPaymentStatus(null);
  }, []);

  return {
    isLoading,
    error,
    paymentData,
    paymentStatus,
    createPayment,
    checkPaymentStatus,
    cancelPayment,
    clearError,
    reset,
  };
};