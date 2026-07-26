import { createContext } from "react";

// Kiểu dữ liệu thông tin User nhận từ BE
export interface User {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);