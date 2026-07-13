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

//what the frontend sends to /api/users/resgister
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  role: "CUSTOMER" | "PROVIDER";
}

//note:- role is deliberately typed as "CUSTOMER" | "PRIVIDER" here, not the full userRole (which also includes "ADMIN") - nobody should be able to self-register as an admin from this form. Restricting it as the type level means TypeScript itself would flag it if the register page ever accidentally tried to send "ADMIN".

