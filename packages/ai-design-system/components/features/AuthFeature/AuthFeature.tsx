"use client";

import * as React from "react";
import {
  AuthCard,
  type AuthMode,
  type SocialProvider,
} from "@/components/composites/AuthCard";
import { cn } from "@/lib/utils";

export interface AuthFeatureProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Mode: login (email/SSO per login-05) or signup (full form per signup-01) */
  mode?: AuthMode;
  /** Application name displayed in header */
  appName?: string;
  /** Custom logo or icon element */
  appLogo?: React.ReactNode;
  /** Heading title override */
  title?: string;
  /** Description override */
  description?: string;
  /** Full Name value in signup mode */
  name?: string;
  /** Email value */
  email?: string;
  /** Password value in signup mode */
  password?: string;
  /** Confirm password value in signup mode */
  confirmPassword?: string;
  /** Optional error message */
  error?: string | null;
  /** Loading state indicator */
  isLoading?: boolean;
  /** Enable SSO button */
  allowSso?: boolean;
  /** Custom label for SSO button */
  ssoButtonLabel?: string;
  /** Social auth providers list */
  socialProviders?: SocialProvider[];
  /** Terms of Service URL */
  termsUrl?: string;
  /** Privacy Policy URL */
  privacyUrl?: string;
  /** Callback on email input change */
  onEmailChange?: (email: string) => void;
  /** Callback on name input change */
  onNameChange?: (name: string) => void;
  /** Callback on password input change */
  onPasswordChange?: (password: string) => void;
  /** Callback on confirm password input change */
  onConfirmPasswordChange?: (confirmPassword: string) => void;
  /** Callback on login submission */
  onLogin?: (credentials: { email: string }) => void | Promise<void>;
  /** Callback on signup submission */
  onSignup?: (data: {
    name: string;
    email: string;
    password?: string;
    confirmPassword?: string;
  }) => void | Promise<void>;
  /** Callback on SSO button click */
  onSsoLogin?: () => void | Promise<void>;
  /** Callback on social button click */
  onSocialLogin?: (provider: SocialProvider) => void | Promise<void>;
  /** Callback on switching mode */
  onModeChange?: (mode: AuthMode) => void;
}

export const AuthFeature = React.memo<AuthFeatureProps>(
  ({
    mode = "login",
    appName = "Waypoint",
    appLogo,
    title,
    description,
    name: controlledName,
    email: controlledEmail,
    password: controlledPassword,
    confirmPassword: controlledConfirmPassword,
    error,
    isLoading = false,
    allowSso = true,
    ssoButtonLabel = "Sign in with Single Sign-On",
    socialProviders = ["apple", "google"],
    termsUrl = "#",
    privacyUrl = "#",
    onEmailChange,
    onNameChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onLogin,
    onSignup,
    onSsoLogin,
    onSocialLogin,
    onModeChange,
    className,
    ...props
  }) => {
    const [internalName, setInternalName] = React.useState(controlledName ?? "");
    const [internalEmail, setInternalEmail] = React.useState(controlledEmail ?? "");
    const [internalPassword, setInternalPassword] = React.useState(controlledPassword ?? "");
    const [internalConfirmPassword, setInternalConfirmPassword] = React.useState(
      controlledConfirmPassword ?? ""
    );

    const name = controlledName !== undefined ? controlledName : internalName;
    const email = controlledEmail !== undefined ? controlledEmail : internalEmail;
    const password = controlledPassword !== undefined ? controlledPassword : internalPassword;
    const confirmPassword =
      controlledConfirmPassword !== undefined
        ? controlledConfirmPassword
        : internalConfirmPassword;

    const handleNameChange = (val: string) => {
      setInternalName(val);
      onNameChange?.(val);
    };

    const handleEmailChange = (val: string) => {
      setInternalEmail(val);
      onEmailChange?.(val);
    };

    const handlePasswordChange = (val: string) => {
      setInternalPassword(val);
      onPasswordChange?.(val);
    };

    const handleConfirmPasswordChange = (val: string) => {
      setInternalConfirmPassword(val);
      onConfirmPasswordChange?.(val);
    };

    const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (mode === "signup") {
        onSignup?.({ name, email, password, confirmPassword });
      } else {
        onLogin?.({ email });
      }
    };

    const handleToggleMode = (nextMode: AuthMode) => {
      onModeChange?.(nextMode);
    };

    return (
      <div
        className={cn(
          "relative flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 bg-background text-foreground",
          className
        )}
        {...props}
      >
        <AuthCard
          mode={mode}
          appName={appName}
          appLogo={appLogo}
          title={title}
          description={description}
          name={name}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          error={error}
          isLoading={isLoading}
          allowSso={allowSso}
          ssoButtonLabel={ssoButtonLabel}
          socialProviders={socialProviders}
          termsUrl={termsUrl}
          privacyUrl={privacyUrl}
          onNameChange={handleNameChange}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          onSubmit={handleSubmit}
          onSsoClick={onSsoLogin}
          onSocialClick={onSocialLogin}
          onToggleMode={handleToggleMode}
        />
      </div>
    );
  }
);

AuthFeature.displayName = "AuthFeature";
