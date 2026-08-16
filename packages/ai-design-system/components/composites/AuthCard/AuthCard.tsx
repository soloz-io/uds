"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitives/Card";
import { Input } from "@/components/primitives/Input";
import { Label } from "@/components/primitives/Label";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export type AuthMode = "login" | "signup";
export type SocialProvider = "google" | "apple" | "github";

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mode: login (email/SSO per login-05) or signup (full form per signup-01) */
  mode?: AuthMode;
  /** Application name displayed in header */
  appName?: string;
  /** Custom logo or icon component */
  appLogo?: React.ReactNode;
  /** Card title override */
  title?: string;
  /** Card description override */
  description?: string;
  /** Name value (signup mode) */
  name?: string;
  /** Email input value */
  email?: string;
  /** Password value (signup mode) */
  password?: string;
  /** Confirm password value (signup mode) */
  confirmPassword?: string;
  /** Optional error message to display */
  error?: string | null;
  /** Loading state indicator */
  isLoading?: boolean;
  /** Enable SSO button */
  allowSso?: boolean;
  /** Custom label for SSO button */
  ssoButtonLabel?: string;
  /** Social auth providers to show */
  socialProviders?: SocialProvider[];
  /** Terms of service URL */
  termsUrl?: string;
  /** Privacy policy URL */
  privacyUrl?: string;
  /** Callback when name input changes */
  onNameChange?: (name: string) => void;
  /** Callback when email input changes */
  onEmailChange?: (email: string) => void;
  /** Callback when password input changes */
  onPasswordChange?: (password: string) => void;
  /** Callback when confirm password input changes */
  onConfirmPasswordChange?: (confirmPassword: string) => void;
  /** Callback when the form is submitted */
  onSubmit?: (e?: React.FormEvent) => void;
  /** Callback when SSO button is clicked */
  onSsoClick?: () => void;
  /** Callback when a social provider button is clicked */
  onSocialClick?: (provider: SocialProvider) => void;
  /** Callback when switching between login and signup */
  onToggleMode?: (nextMode: AuthMode) => void;
}

export const AuthCard = React.memo<AuthCardProps>(
  ({
    mode = "login",
    appName = "Waypoint",
    appLogo,
    title,
    description,
    name = "",
    email = "",
    password = "",
    confirmPassword = "",
    error,
    isLoading = false,
    allowSso = true,
    ssoButtonLabel = "Sign in with Single Sign-On",
    socialProviders = ["google", "apple"],
    termsUrl = "#",
    privacyUrl = "#",
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    onSsoClick,
    onSocialClick,
    onToggleMode,
    className,
    ...props
  }) => {
    const isSignup = mode === "signup";

    const defaultTitle = isSignup
      ? "Create an account"
      : `Welcome to ${appName}`;

    const defaultDescription = isSignup
      ? "Enter your information below to create your account"
      : undefined;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(e);
    };

    return (
      <div className={cn("w-full max-w-sm", className)} {...props}>
        <Card className="border shadow-sm">
          <CardHeader className="space-y-2 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {appLogo ?? <Icon name="gallery-vertical-end" size="lg" aria-label={appName} />}
              </div>
              <CardTitle className="text-xl font-bold tracking-tight">
                {title ?? defaultTitle}
              </CardTitle>
              {description ? (
                <CardDescription>{description}</CardDescription>
              ) : isSignup ? (
                <CardDescription>{defaultDescription}</CardDescription>
              ) : (
                <CardDescription>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onToggleMode?.("signup")}
                    className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                  >
                    Sign up
                  </button>
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
              >
                {error}
              </div>
            )}

            {/* SSO Action (per ADR-032 / platform auth) in login mode */}
            {!isSignup && allowSso && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="default"
                  className="w-full"
                  disabled={isLoading}
                  onClick={onSsoClick}
                >
                  {isLoading ? (
                    <>
                      <Icon name="loader-2" size="sm" className="mr-2 animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Icon name="lock" size="sm" className="mr-2" />
                      {ssoButtonLabel}
                    </>
                  )}
                </Button>
                <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground">
                  <div className="w-full border-t border-border" />
                  <span className="bg-card px-2">Or continue with email</span>
                  <div className="w-full border-t border-border" />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div className="space-y-1.5 text-left">
                  <Label htmlFor="auth-name">Full Name</Label>
                  <Input
                    id="auth-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => onNameChange?.(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5 text-left">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => onEmailChange?.(e.target.value)}
                  disabled={isLoading}
                  required
                />
                {isSignup && (
                  <p className="text-[11px] text-muted-foreground">
                    We will use this to contact you.
                  </p>
                )}
              </div>

              {isSignup && (
                <>
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="auth-password">Password</Label>
                    <Input
                      id="auth-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => onPasswordChange?.(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Must be at least 8 characters long.
                    </p>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="auth-confirm-password">Confirm Password</Label>
                    <Input
                      id="auth-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant={isSignup ? "default" : "secondary"}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="loader-2" size="sm" className="mr-2 animate-spin" />
                    Please wait…
                  </>
                ) : isSignup ? (
                  "Create Account"
                ) : (
                  "Login with Email"
                )}
              </Button>
            </form>

            {/* Social options */}
            {socialProviders.length > 0 && (
              <>
                <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground">
                  <div className="w-full border-t border-border" />
                  <span className="bg-card px-2">Or</span>
                  <div className="w-full border-t border-border" />
                </div>
                <div
                  className={cn(
                    "grid gap-2",
                    socialProviders.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  )}
                >
                  {socialProviders.includes("apple") && (
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      onClick={() => onSocialClick?.("apple")}
                      className="w-full text-xs"
                    >
                      <Icon name="apple" size="sm" className="mr-1.5" />
                      Apple
                    </Button>
                  )}
                  {socialProviders.includes("google") && (
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      onClick={() => onSocialClick?.("google")}
                      className="w-full text-xs"
                    >
                      <Icon name="google" size="sm" className="mr-1.5" />
                      Google
                    </Button>
                  )}
                  {socialProviders.includes("github") && (
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isLoading}
                      onClick={() => onSocialClick?.("github")}
                      className="w-full text-xs"
                    >
                      <Icon name="github" size="sm" className="mr-1.5" />
                      GitHub
                    </Button>
                  )}
                </div>
              </>
            )}

            {isSignup && (
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onToggleMode?.("login")}
                  className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                >
                  Sign in
                </button>
              </p>
            )}

            <p className="px-4 text-center text-[11px] text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <a
                href={termsUrl}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href={privacyUrl}
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
);

AuthCard.displayName = "AuthCard";
