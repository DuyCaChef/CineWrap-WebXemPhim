import { useState, useEffect, type ReactNode, useCallback } from "react";
import { api } from "@/services/api";
import { AuthContext, type User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Khi tải lại trang (F5), khôi phục trạng thái đăng nhập từ localStorage
  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem("accessToken");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        try {
          setAccessToken(savedToken);
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Hàm gọi khi đăng nhập thành công
  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm gọi khi đăng xuất
  const logout = useCallback(async () => {
    try {
      // 1. Gọi API /auth/logout lên NestJS Back-end
      await api.post("/auth/logout");
    } catch (error) {
      // Dù API có lỗi (ví dụ token hết hạn) thì vẫn tiếp tục xóa state ở client
      console.warn("Lỗi khi gọi API logout từ Server:", error);
    } finally {
      // 2. Xóa Token và User thông tin ở Client State & LocalStorage
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
