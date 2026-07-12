// Mirrors com.tiffin.common.response.ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Mirrors com.tiffin.common.enums.UserRole
export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

// Mirrors com.tiffin.dto.AuthResponse
export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

// What the frontend sends to /api/users/login
export interface LoginRequest {
  email: string;
  password: string;
}

// What we expose to client components after login —
// deliberately excludes the token, which stays server-side only
export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}