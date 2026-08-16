import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthFeature } from "./AuthFeature";
import { useAuthFeatureMock } from "./useAuthFeature.mock";
import {
  mockLoginProps,
  mockSignupProps,
  mockLoadingProps,
  mockErrorProps,
} from "./AuthFeature.mocks";

/**
 * AuthFeature Stories
 *
 * Full-page authentication feature supporting email-only/SSO login (per shadcn login-05)
 * and full account creation (per shadcn signup-01).
 *
 * ## Features
 * - Login mode with Email-only and Single Sign-On (SSO / OIDC)
 * - Signup mode with name, email, password, and confirmation
 * - Social login integration (Google, Apple, GitHub)
 * - Built-in loading and error feedback
 * - WCAG 2.1 Level AA compliant
 */
const meta = {
  title: "Features/AuthFeature",
  component: AuthFeature,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Complete authentication feature designed according to shadcn login-05 and signup-01 specifications.",
      },
    },
  },
} satisfies Meta<typeof AuthFeature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...mockLoginProps,
  },
};

export const SignupMode: Story = {
  args: {
    ...mockSignupProps,
  },
};

export const Loading: Story = {
  args: {
    ...mockLoadingProps,
  },
};

export const WithError: Story = {
  args: {
    ...mockErrorProps,
  },
};

export const WithStateManagement: Story = {
  render: () => {
    const hook = useAuthFeatureMock();
    return (
      <AuthFeature
        mode={hook.mode}
        appName={hook.appName}
        name={hook.name}
        email={hook.email}
        password={hook.password}
        confirmPassword={hook.confirmPassword}
        error={hook.error}
        isLoading={hook.isLoading}
        allowSso={hook.allowSso}
        socialProviders={hook.socialProviders}
        onNameChange={hook.setName}
        onEmailChange={hook.setEmail}
        onPasswordChange={hook.setPassword}
        onConfirmPasswordChange={hook.setConfirmPassword}
        onLogin={hook.handleSubmit}
        onSignup={hook.handleSubmit}
        onSsoLogin={hook.handleSsoClick}
        onSocialLogin={hook.handleSocialClick}
        onModeChange={hook.setMode}
      />
    );
  },
};

export const DarkMode: Story = {
  globals: {
    theme: "dark-neutral",
  },
  args: {
    ...mockLoginProps,
  },
};
