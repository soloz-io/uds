import type { AuthFeatureProps } from "./AuthFeature";

export const mockLoginProps: AuthFeatureProps = {
  mode: "login",
  appName: "Waypoint",
  email: "m@example.com",
  isLoading: false,
  allowSso: true,
  socialProviders: ["apple", "google"],
};

export const mockSignupProps: AuthFeatureProps = {
  mode: "signup",
  appName: "Waypoint",
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  confirmPassword: "password123",
  isLoading: false,
  allowSso: false,
  socialProviders: ["google"],
};

export const mockLoadingProps: AuthFeatureProps = {
  mode: "login",
  appName: "Waypoint",
  email: "m@example.com",
  isLoading: true,
  allowSso: true,
  socialProviders: ["apple", "google"],
};

export const mockErrorProps: AuthFeatureProps = {
  mode: "login",
  appName: "Waypoint",
  email: "m@example.com",
  error: "Invalid email or credentials. Please try again.",
  isLoading: false,
  allowSso: true,
  socialProviders: ["apple", "google"],
};
