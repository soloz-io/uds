import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "@storybook/test";
import { AuthFeature } from "./AuthFeature";
import { mockLoginProps, mockSignupProps } from "./AuthFeature.mocks";

const meta = {
  title: "Features/AuthFeature/Behaviors",
  component: AuthFeature,
  tags: ["test"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AuthFeature>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SubmitLoginForm: Story = {
  args: {
    ...mockLoginProps,
    onLogin: fn(),
    onEmailChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText("Email");
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "user@example.com");
    await expect(args.onEmailChange).toHaveBeenCalled();

    const loginButton = canvas.getByRole("button", { name: /Login with Email/i });
    await userEvent.click(loginButton);
    await expect(args.onLogin).toHaveBeenCalled();
  },
};

export const ClickSsoButton: Story = {
  args: {
    ...mockLoginProps,
    onSsoLogin: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const ssoButton = canvas.getByRole("button", { name: /Sign in with Single Sign-On/i });
    await userEvent.click(ssoButton);
    await expect(args.onSsoLogin).toHaveBeenCalled();
  },
};

export const ClickSocialButton: Story = {
  args: {
    ...mockLoginProps,
    onSocialLogin: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const googleButton = canvas.getByRole("button", { name: /Google/i });
    await userEvent.click(googleButton);
    await expect(args.onSocialLogin).toHaveBeenCalledWith("google");
  },
};

export const SubmitSignupForm: Story = {
  args: {
    ...mockSignupProps,
    onSignup: fn(),
    onNameChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText("Full Name");
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");
    await expect(args.onNameChange).toHaveBeenCalled();

    const createButton = canvas.getByRole("button", { name: /Create Account/i });
    await userEvent.click(createButton);
    await expect(args.onSignup).toHaveBeenCalled();
  },
};
