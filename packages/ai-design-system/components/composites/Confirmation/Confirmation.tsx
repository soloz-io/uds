import * as React from "react";
import {
  Confirmation as AIConfirmation,
  ConfirmationTitle,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

/**
 * Confirmation Block
 *
 * Approval workflow component that internally manages action buttons.
 * Wraps content with Confirmation AI element and provides approve/reject actions.
 */

// Define our own types since ToolUIPart doesn't exist in current AI SDK
type ToolUIState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-denied"
  | "output-available"
  | "output-error";

type ToolApproval = {
  approved?: boolean;
};

export interface ConfirmationProps {
  /**
   * Title text displayed at the top of the confirmation
   */
  title?: string;
  /**
   * Callback when user approves
   */
  onApprove?: () => void;
  /**
   * Callback when user rejects
   */
  onReject?: () => void;
  /**
   * Confirmation state
   */
  state: ToolUIState;
  /**
   * Approval data
   */
  approval?: ToolApproval;
  /**
   * Content to display (e.g., FileQueue)
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Confirmation component - manages approval workflow with internal action buttons
 */
export const Confirmation = React.memo<ConfirmationProps>(
  ({ title, onApprove, onReject, state, approval, children, className }) => {
    return (
      <AIConfirmation state={state} approval={approval} className={cn(className)}>
        {title && <ConfirmationTitle>{title}</ConfirmationTitle>}

        {children}

        <ConfirmationActions>
          {onReject && (
            <ConfirmationAction variant="outline" onClick={onReject}>
              <Icon name="x" size="sm" className="mr-2" />
              Reject All
            </ConfirmationAction>
          )}
          {onApprove && (
            <ConfirmationAction variant="default" onClick={onApprove}>
              <Icon name="check" size="sm" className="mr-2" />
              Approve All
            </ConfirmationAction>
          )}
        </ConfirmationActions>
      </AIConfirmation>
    );
  }
);

Confirmation.displayName = "Confirmation";
