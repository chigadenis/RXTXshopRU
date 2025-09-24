import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem("sessionToken");
      
      if (!sessionToken) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://functions.poehali.dev/d57ad317-6bdc-446b-b539-362663e9303c", {
          method: "GET",
          headers: {
            "X-Session-Token": sessionToken,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("sessionToken");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem("sessionToken");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin mx-auto mb-4" size={32} />
          <p>Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;