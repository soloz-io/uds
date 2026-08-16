import * as React from "react";
import type {
  AuthMode,
  SocialProvider,
} from "@/components/composites/AuthCard";
import type {
  UseAuthFeatureOptions,
  UseAuthFeatureReturn,
} from "./useAuthFeature.d";

export function useAuthFeatureMock(
  options: UseAuthFeatureOptions = {}
): UseAuthFeatureReturn {
  const [mode, setMode] = React.useState<AuthMode>(options.initialMode ?? "login");
  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>(options.initialEmail ?? "alex@example.com");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const appName = options.appName ?? "Waypoint";
  const allowSso = options.allowSso ?? true;
  const socialProviders: SocialProvider[] = options.socialProviders ?? ["apple", "google"];

  const toggleMode = React.useCallback(() => {
    setError(null);
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  }, []);

  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        if (mode === "signup") {
          if (!name.trim()) {
            throw new Error("Full name is required");
          }
          if (password && confirmPassword && password !== confirmPassword) {
            throw new Error("Passwords do not match");
          }
          await Promise.resolve(
            options.onSignup?.({ name, email, password, confirmPassword })
          );
        } else {
          if (!email.trim()) {
            throw new Error("Email is required");
          }
          await Promise.resolve(options.onLogin?.({ email }));
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Authentication failed");
      } finally {
        setIsLoading(false);
      }
    },
    [mode, name, email, password, confirmPassword, options]
  );

  const handleSsoClick = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await Promise.resolve(options.onSsoLogin?.());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SSO connection failed");
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  const handleSocialClick = React.useCallback(
    async (provider: SocialProvider) => {
      setError(null);
      setIsLoading(true);
      try {
        await Promise.resolve(options.onSocialLogin?.(provider));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : `${provider} login failed`);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    mode,
    appName,
    name,
    email,
    password,
    confirmPassword,
    error,
    isLoading,
    allowSso,
    socialProviders,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setError,
    setIsLoading,
    setMode,
    toggleMode,
    handleSubmit,
    handleSsoClick,
    handleSocialClick,
  };
}
