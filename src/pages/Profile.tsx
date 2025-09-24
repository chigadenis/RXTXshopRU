import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

interface User {
  id: number;
  username: string;
  created_at?: string;
  session_expires_at?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const sessionToken = localStorage.getItem("sessionToken");
    const storedUser = localStorage.getItem("user");

    if (!sessionToken || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://functions.poehali.dev/d57ad317-6bdc-446b-b539-362663e9303c", {
        method: "GET",
        headers: {
          "X-Session-Token": sessionToken,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
      } else {
        setError(data.error || "Ошибка загрузки профиля");
        if (response.status === 401) {
          localStorage.removeItem("sessionToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    navigate("/login");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Не указано";
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={32} />
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
          <Button onClick={handleLogout} variant="outline">
            <Icon name="LogOut" className="mr-2" size={16} />
            Выйти
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {user && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="User" className="mr-2" size={20} />
                  Информация о пользователе
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Логин</p>
                  <p className="text-lg">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">ID пользователя</p>
                  <p className="text-lg font-mono">#{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Дата регистрации</p>
                  <p className="text-lg">{formatDate(user.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Shield" className="mr-2" size={20} />
                  Безопасность
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Статус сессии</p>
                  <Badge variant="secondary" className="mt-1">
                    <Icon name="CheckCircle" className="mr-1" size={12} />
                    Активна
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Сессия истекает</p>
                  <p className="text-lg">{formatDate(user.session_expires_at)}</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Icon name="Key" className="mr-2" size={16} />
                  Сменить пароль
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Activity" className="mr-2" size={20} />
                  Активность
                </CardTitle>
                <CardDescription>
                  История действий в личном кабинете
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Icon name="LogIn" className="mr-2 text-green-500" size={16} />
                      <span>Вход в систему</span>
                    </div>
                    <span className="text-sm text-gray-500">Сегодня</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <Icon name="UserPlus" className="mr-2 text-blue-500" size={16} />
                      <span>Регистрация аккаунта</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(user.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;