import type * as React from "react";
import type { AuthMode, SocialProvider } from "@/components/composites/AuthCard";

export interface AuthCredentials {
  email: string;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface UseAuthFeatureOptions {
  initialMode?: AuthMode;
  initialEmail?: string;
  appName?: string;
  allowSso?: boolean;
  socialProviders?: SocialProvider[];
  onLogin?: (credentials: AuthCredentials) => void | Promise<void>;
  onSignup?: (data: SignupData) => void | Promise<void>;
  onSsoLogin?: () => void | Promise<void>;
  onSocialLogin?: (provider: SocialProvider) => void | Promise<void>;
}

export interface UseAuthFeatureReturn {
  mode: AuthMode;
  appName: string;
  appLogo?: React.ReactNode;
  title?: string;
  description?: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  error?: string | null;
  isLoading: boolean;
  allowSso: boolean;
  ssoButtonLabel?: string;
  socialProviders: SocialProvider[];
  termsUrl?: string;
  privacyUrl?: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setMode: (mode: AuthMode) => void;
  toggleMode: () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  handleSsoClick: () => Promise<void>;
  handleSocialClick: (provider: SocialProvider) => Promise<void>;
}

export function useAuthFeature(options?: UseAuthFeatureOptions): UseAuthFeatureReturn;
