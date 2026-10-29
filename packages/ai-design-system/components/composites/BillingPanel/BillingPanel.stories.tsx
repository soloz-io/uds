import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { BillingPanel } from "./BillingPanel";

const sampleInvoices = [
  {
    id: "inv-1",
    date: "Oct 8, 2026",
    totalUsdCents: 2000,
    status: "Paid",
  },
  {
    id: "inv-2",
    date: "Sep 8, 2026",
    totalUsdCents: 2000,
    status: "Paid",
  },
  {
    id: "inv-3",
    date: "Aug 8, 2026",
    totalUsdCents: 2000,
    status: "Paid",
  },
];

const samplePaymentMethod = {
  brand: "Visa",
  last4: "5895",
  expMonth: 8,
  expYear: 2030,
};

/**
 * BillingPanel Composite Stories
 *
 * Comprehensive billing management screen with subscription details, payment method,
 * invoice history table, and subscription cancellation confirmation.
 *
 * ## Features
 * - Subscription status card (active, grace period, suspended, cancelled)
 * - Payment method summary with Add/Update action
 * - Invoices data table with currency formatting and PDF download
 * - End-of-term cancellation protection with ConfirmDialog
 */
const meta = {
  title: "Composites/BillingPanel",
  component: BillingPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    onAdjustPlan: fn(),
    onManagePaymentMethod: fn(),
    onDownloadInvoice: fn(),
    onCancelPlan: fn(),
  },
} satisfies Meta<typeof BillingPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Active monthly subscription with valid payment method and paid invoices.
 */
export const Default: Story = {
  args: {
    plan: { code: "pro", name: "Pro plan" },
    interval: "Monthly",
    statusText: "Your subscription will auto renew on Nov 8, 2026.",
    status: "active",
    cancelAt: "Nov 8, 2026",
    paymentMethod: samplePaymentMethod,
    invoices: sampleInvoices,
  },
};

/**
 * Subscription in grace period after a failed invoice renewal.
 */
export const GracePeriod: Story = {
  args: {
    plan: { code: "pro", name: "Pro plan" },
    interval: "Monthly",
    statusText: "Your latest invoice failed. In grace period until Nov 12, 2026.",
    status: "grace",
    paymentMethod: samplePaymentMethod,
    invoices: [
      {
        id: "inv-failed",
        date: "Oct 28, 2026",
        totalUsdCents: 2000,
        status: "Failed",
      },
      ...sampleInvoices,
    ],
  },
};

/**
 * Suspended subscription state due to prolonged unpaid invoices.
 */
export const Suspended: Story = {
  args: {
    plan: { code: "team", name: "Pro+ Team" },
    interval: "Monthly",
    statusText: "Subscription suspended due to unpaid invoice.",
    status: "suspended",
    paymentMethod: samplePaymentMethod,
    invoices: sampleInvoices,
  },
};

/**
 * Pending cancellation at the end of the current billing cycle.
 */
export const Cancelled: Story = {
  args: {
    plan: { code: "pro", name: "Pro plan" },
    interval: "Monthly",
    statusText: "Subscription ends on Nov 8, 2026.",
    status: "cancelled",
    cancelAt: "Nov 8, 2026",
    paymentMethod: samplePaymentMethod,
    invoices: sampleInvoices,
  },
};

/**
 * Free plan or accounts without an active payment method on file.
 */
export const WithoutPaymentMethod: Story = {
  args: {
    plan: { code: "free", name: "Free plan" },
    interval: "Monthly",
    status: "active",
    paymentMethod: null,
    invoices: [],
  },
};
