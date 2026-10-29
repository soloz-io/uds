"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { DataTable } from "@/components/composites/DataTable";
import { ConfirmDialog } from "@/components/composites/ConfirmDialog";
import { cn } from "@/lib/utils";

export interface BillingInvoice {
  id: string;
  date: string;
  totalUsdCents: number;
  status: string;
  pdfUrl?: string;
}

export interface PaymentMethodInfo {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface BillingPanelProps {
  plan?: { code: string; name: string } | null;
  interval?: string;
  statusText?: string;
  status?: "active" | "grace" | "cancelled" | "suspended";
  paymentMethod?: PaymentMethodInfo | null;
  invoices?: BillingInvoice[];
  cancelAt?: string;
  isCancelling?: boolean;
  onAdjustPlan?: () => void;
  onManagePaymentMethod?: () => void;
  onDownloadInvoice?: (id: string) => void;
  onCancelPlan?: () => void;
  className?: string;
}

export const BillingPanel = React.memo<BillingPanelProps>(
  ({
    plan,
    interval = "Monthly",
    statusText,
    status = "active",
    paymentMethod,
    invoices,
    cancelAt,
    isCancelling = false,
    onAdjustPlan,
    onManagePaymentMethod,
    onDownloadInvoice,
    onCancelPlan,
    className,
  }) => {
    const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);

    const invoiceColumns = React.useMemo<ColumnDef<BillingInvoice>[]>(
      () => [
        {
          accessorKey: "date",
          header: "Date",
          cell: ({ row }) => (
            <span className="text-sm font-medium text-foreground">
              {row.original.date}
            </span>
          ),
        },
        {
          accessorKey: "totalUsdCents",
          header: "Total",
          cell: ({ row }) => {
            const formatted = `$${(row.original.totalUsdCents / 100).toFixed(2)}`;
            return (
              <span className="text-sm font-medium text-foreground tabular-nums">
                {formatted}
              </span>
            );
          },
        },
        {
          accessorKey: "status",
          header: "Status",
          cell: ({ row }) => {
            const s = row.original.status.toLowerCase();
            const isPaid = s === "paid";
            const isPending = s === "pending";
            return (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs capitalize font-medium",
                  isPaid &&
                    "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                  isPending &&
                    "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
                  !isPaid &&
                    !isPending &&
                    "text-destructive border-destructive/30 bg-destructive/10"
                )}
              >
                {row.original.status}
              </Badge>
            );
          },
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownloadInvoice?.(row.original.id)}
              className="h-8 text-xs text-primary hover:underline hover:bg-transparent p-0 cursor-pointer font-medium"
            >
              Download PDF
            </Button>
          ),
        },
      ],
      [onDownloadInvoice]
    );

    const defaultStatusLine = React.useMemo(() => {
      if (statusText) return statusText;
      if (status === "grace") {
        return "Your payment failed. Subscription is in grace period.";
      }
      if (status === "suspended") {
        return "Subscription is suspended due to non-payment.";
      }
      if (status === "cancelled") {
        return cancelAt
          ? `Subscription cancelled. Access ends on ${cancelAt}.`
          : "Subscription has been cancelled.";
      }
      return cancelAt
        ? `Your subscription will auto renew on ${cancelAt}.`
        : "Active subscription.";
    }, [statusText, status, cancelAt]);

    return (
      <div className={cn("w-full space-y-8", className)}>
        {/* 1. Plan Block */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="sparkles" className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {plan?.name || "No plan"}
                  </h3>
                  {status === "grace" && (
                    <Badge
                      variant="outline"
                      className="text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                    >
                      Grace Period
                    </Badge>
                  )}
                  {status === "suspended" && (
                    <Badge
                      variant="destructive"
                      className="text-xs"
                    >
                      Suspended
                    </Badge>
                  )}
                </div>
                {plan && (
                  <>
                    <div className="text-xs text-muted-foreground font-medium">
                      {interval}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      {defaultStatusLine}
                    </p>
                  </>
                )}
              </div>
            </div>

            {onAdjustPlan && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdjustPlan}
                className="shrink-0 cursor-pointer font-medium"
              >
                {plan ? "Manage billing" : "Upgrade"}
              </Button>
            )}
          </div>
        </div>

        {/* 2. Payment Block: shown when the app manages payment methods itself */}
        {(paymentMethod !== undefined || onManagePaymentMethod) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Payment
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your default payment method is charged for subscription renewals,
                usage credits, and auto-reload.
              </p>
            </div>
            {!paymentMethod && onManagePaymentMethod && (
              <Button
                variant="outline"
                size="sm"
                onClick={onManagePaymentMethod}
                className="cursor-pointer"
              >
                Add payment method
              </Button>
            )}
          </div>

          {paymentMethod && (
            <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 rounded bg-muted/60 border border-border flex items-center justify-center shrink-0">
                  <Icon name="credit-card" className="w-4 h-4 text-foreground/80" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold capitalize text-foreground">
                      {paymentMethod.brand}
                    </span>
                    <span className="text-sm text-foreground">
                      •••• {paymentMethod.last4}
                    </span>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Default
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Expires{" "}
                    {paymentMethod.expMonth.toString().padStart(2, "0")}/
                    {paymentMethod.expYear}
                  </div>
                </div>
              </div>

              {onManagePaymentMethod && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onManagePaymentMethod}
                  className="cursor-pointer"
                >
                  Update
                </Button>
              )}
            </div>
          )}
        </div>
        )}

        {/* 3. Invoices Block: shown when the app lists invoices itself */}
        {invoices !== undefined && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground">
              Invoices
            </h3>

            <DataTable
              data={invoices}
              columns={invoiceColumns}
              enablePagination={false}
              enableFiltering={false}
            />
          </div>
        )}

        {/* 4. Cancellation Block */}
        {plan && status !== "cancelled" && onCancelPlan && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground">
                  Cancellation
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cancel plan
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelDialogOpen(true)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Cancellation confirmation modal */}
        <ConfirmDialog
          open={isCancelDialogOpen}
          onOpenChange={setIsCancelDialogOpen}
          title="Cancel plan"
          description={
            cancelAt
              ? `Your plan will remain active until ${cancelAt}. After this date, you will lose access to paid features.`
              : "Are you sure you want to cancel your plan? You will retain access until the end of your billing cycle."
          }
          confirmLabel="Cancel plan"
          cancelLabel="Keep plan"
          destructive
          busy={isCancelling}
          onConfirm={() => {
            onCancelPlan?.();
            setIsCancelDialogOpen(false);
          }}
        />
      </div>
    );
  }
);

BillingPanel.displayName = "BillingPanel";
