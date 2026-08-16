# AuthFeature

A full-page authentication feature implementing shadcn `login-05` and `signup-01` design patterns.

## Features
- **Login Mode**: Email-only login with Single Sign-On (OIDC / Hydra / AgentGateway) and social login providers (Google, Apple, GitHub).
- **Signup Mode**: Full registration form with Name, Email, Password, and Confirmation.
- **Accessible & Token-First**: Built with WCAG 2.1 AA compliance and theme token support (light, dark modes).

## Consumption

```tsx
import { AuthFeature } from 'ai-design-system';

export function LoginPage() {
  const handleLogin = async ({ email }) => {
    // login logic
  };

  const handleSso = async () => {
    // redirect to OIDC gateway
  };

  return (
    <AuthFeature
      mode="login"
      appName="Waypoint"
      onLogin={handleLogin}
      onSsoLogin={handleSso}
    />
  );
}
```
