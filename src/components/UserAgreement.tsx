import { useState } from "react";
import Icon from "@/components/ui/icon";

const UserAgreement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agreementText = `ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ

1. ОБЩИЕ ПОЛОЖЕНИЯ
1.1. Настоящее Пользовательское соглашение (далее – Соглашение) регулирует отношения между администрацией интернет-магазина и пользователем.
1.2. Используя сайт, вы соглашаетесь с условиями настоящего Соглашения.

2. ПРАВА И ОБЯЗАННОСТИ СТОРОН
2.1. Администрация интернет-магазина обязуется:
- Предоставить пользователю информацию о товарах
- Обеспечить безопасность персональных данных
- Своевременно обрабатывать заказы

2.2. Пользователь обязуется:
- Предоставлять достоверную информацию при регистрации
- Не нарушать работу сайта
- Соблюдать условия настоящего Соглашения

3. ОТВЕТСТВЕННОСТЬ СТОРОН
3.1. Администрация не несет ответственности за временные технические сбои и перерывы в работе сайта.
3.2. Пользователь несет полную ответственность за достоверность предоставленной информации.

4. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ
4.1. Настоящее Соглашение вступает в силу с момента его акцепта пользователем.
4.2. Администрация оставляет за собой право изменять условия Соглашения без предварительного уведомления.`;

  return (
    <>
      <div className="text-center py-8 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
        >
          Пользовательское соглашение
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Пользовательское соглашение
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {agreementText}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserAgreement;