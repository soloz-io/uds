"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, Pencil, X, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/primitives/Input";
import { Textarea } from "@/components/primitives/Textarea";
import { Label } from "@/components/primitives/Label";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/utils";
import {
  Confirmation as AIConfirmation,
  ConfirmationTitle,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";

export interface ActionRequest {
  name: string;
  args: Record<string, unknown>;
  description?: string;
}

export interface ReviewConfig {
  allowedDecisions?: string[];
}

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

export interface ApprovalCardProps {
  actionRequest: ActionRequest;
  reviewConfig?: ReviewConfig;
  onApprove: () => void | Promise<void>;
  onReject: (reason: string) => void | Promise<void>;
  onEdit: (editedArgs: Record<string, unknown>) => void | Promise<void>;
  isProcessing?: boolean;
  state?: ToolUIState;
  approval?: ToolApproval;
  className?: string;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

// Custom Speech Bubble with Question Mark SVG Icon
function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

interface Question {
  question: string;
  options?: string[];
  is_multi_select?: boolean;
}

export const ApprovalCard = React.memo<ApprovalCardProps>(
  ({
    actionRequest,
    reviewConfig,
    onApprove,
    onReject,
    onEdit,
    isProcessing = false,
    state = "approval-requested",
    approval = {},
    className,
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [prevArgs, setPrevArgs] = useState(actionRequest.args);
    const [editedArgs, setEditedArgs] = useState<Record<string, unknown>>(() => actionRequest.args);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    // Question states
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
    const [otherTexts, setOtherTexts] = useState<Record<number, string>>({});
    const [selectedOptionIndices, setSelectedOptionIndices] = useState<Record<number, number | null>>({});

    if (actionRequest.args !== prevArgs) {
      setPrevArgs(actionRequest.args);
      setEditedArgs(actionRequest.args);
    }

    const allowed = reviewConfig?.allowedDecisions ?? ["approve", "reject"];
    const canEdit = allowed.includes("edit");
    const canReject = allowed.includes("reject");

    // Detect if this is an interactive question/poll action
    const isQuestionAction =
      actionRequest.name === "ask_question" ||
      (actionRequest.args &&
        (typeof actionRequest.args.question === "string" ||
          Array.isArray(actionRequest.args.questions)));

    // Parse questions
    let questions: Question[] = [];
    if (actionRequest.args && Array.isArray(actionRequest.args.questions)) {
      questions = actionRequest.args.questions as Question[];
    } else if (actionRequest.args && typeof actionRequest.args.question === "string") {
      questions = [
        {
          question: actionRequest.args.question,
          options: Array.isArray(actionRequest.args.options)
            ? (actionRequest.args.options as string[])
            : [],
          is_multi_select: !!actionRequest.args.is_multi_select,
        },
      ];
    }

    const currentQuestion = questions[currentQuestionIndex];
    const options = currentQuestion?.options || [];
    const isMultiSelect = currentQuestion?.is_multi_select || false;
    const allOptions = [...options, "Other (write your answer)"];

    // Render interactive question view
    if (isQuestionAction && currentQuestion) {
      const handleContinue = () => {
        if (currentQuestionIndex === questions.length - 1) {
          const finalAnswers = questions.map((q, idx) => {
            if (selectedOptionIndices[idx] === q.options?.length) {
              return otherTexts[idx] || "";
            }
            return selectedAnswers[idx] || "";
          });

          if (onEdit) {
            onEdit({ ...actionRequest.args, answers: finalAnswers });
          }
          onApprove();
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      };

      const handleOptionSelect = (option: string, index: number, isOther: boolean) => {
        if (isOther) {
          setSelectedOptionIndices((prev) => ({ ...prev, [currentQuestionIndex]: index }));
        } else {
          if (isMultiSelect) {
            const current = (selectedAnswers[currentQuestionIndex] as string[]) || [];
            const updated = current.includes(option)
              ? current.filter((o) => o !== option)
              : [...current, option];
            setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: updated }));
          } else {
            setSelectedOptionIndices((prev) => ({ ...prev, [currentQuestionIndex]: index }));
            setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
          }
        }
      };

      return (
        <AIConfirmation
          state={state}
          approval={approval}
          className={cn(
            "flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm p-5 gap-0 max-w-lg w-full",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4 select-none">
            <div className="flex items-start gap-3">
              <QuestionIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <ConfirmationTitle className="text-base font-semibold tracking-tight text-foreground leading-snug">
                {currentQuestion.question}
              </ConfirmationTitle>
            </div>
            {questions.length > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="hover:text-foreground disabled:opacity-30 p-0.5 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-medium">{currentQuestionIndex + 1} of {questions.length}</span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))
                  }
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="hover:text-foreground disabled:opacity-30 p-0.5 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {allOptions.map((option, index) => {
              const isOther = index === allOptions.length - 1;
              const isSelected = isMultiSelect
                ? (selectedAnswers[currentQuestionIndex] as string[])?.includes(
                    isOther ? otherTexts[currentQuestionIndex] || "" : option
                  )
                : selectedOptionIndices[currentQuestionIndex] === index;

              return (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(option, index, isOther)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-muted/20 hover:bg-muted/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>

                  {isOther ? (
                    <div className="flex-grow min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Other (write your answer)"
                        value={otherTexts[currentQuestionIndex] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOtherTexts((prev) => ({ ...prev, [currentQuestionIndex]: val }));
                          setSelectedOptionIndices((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: index,
                          }));
                          if (isMultiSelect) {
                            // support update in array
                            const current = (selectedAnswers[currentQuestionIndex] as string[]) || [];
                            // replace any empty/other values or append
                            const updated = current.filter((o) => !options.includes(o));
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [currentQuestionIndex]: [...updated, val],
                            }));
                          } else {
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [currentQuestionIndex]: val,
                            }));
                          }
                        }}
                        onFocus={() => {
                          setSelectedOptionIndices((prev) => ({
                            ...prev,
                            [currentQuestionIndex]: index,
                          }));
                        }}
                        className="w-full bg-transparent border-none p-0 text-sm focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-foreground leading-relaxed break-words pt-0.5">
                      {option}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <ConfirmationActions className="flex items-center justify-between w-full mt-6 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                if (onReject) {
                  onReject("Skipped question");
                }
              }}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors py-2 px-1"
            >
              Skip
            </button>

            <ConfirmationAction
              type="button"
              onClick={handleContinue}
              disabled={isProcessing}
              variant="default"
              className="flex items-center gap-1.5 h-9"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                <>
                  Continue
                  <span className="text-xs font-semibold opacity-75">↵</span>
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </ConfirmationAction>
          </ConfirmationActions>
        </AIConfirmation>
      );
    }

    // Default regular approval card rendering
    return (
      <AIConfirmation
        state={state}
        approval={approval}
        className={cn(
          "flex flex-col rounded-xl border border-border bg-card text-card-foreground overflow-hidden shadow-sm p-0 gap-0",
          className
        )}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/40">
          <Shield className="h-4 w-4 text-primary" />
          <ConfirmationTitle className="text-sm font-medium">Review Required</ConfirmationTitle>
          <Badge
            variant="secondary"
            className="ml-auto text-[11px] font-semibold px-2 py-0.5"
          >
            Awaiting Approval
          </Badge>
        </div>

        <div className="p-4 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Pencil className="h-4 w-4" />
                <span>
                  Edit —{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                    {actionRequest.name}
                  </code>
                </span>
              </div>
              <div className="space-y-4">
                {Object.entries(editedArgs).map(([key, value]) => {
                  const strValue = formatValue(value);
                  const isLong = strValue.length > 80 || strValue.includes("\n");
                  return (
                    <div key={key} className="space-y-1.5">
                      <Label
                        htmlFor={`edit-${key}`}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        {key}
                      </Label>
                      {isLong ? (
                        <Textarea
                          id={`edit-${key}`}
                          value={strValue}
                          onChange={(e) =>
                            setEditedArgs((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          rows={4}
                          className="w-full font-mono text-sm resize-y"
                        />
                      ) : (
                        <Input
                          id={`edit-${key}`}
                          type="text"
                          value={strValue}
                          onChange={(e) =>
                            setEditedArgs((prev) => ({ ...prev, [key]: e.target.value }))
                          }
                          className="w-full text-sm"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <ConfirmationActions className="flex items-center gap-2 self-start mt-0">
                <ConfirmationAction
                  type="button"
                  onClick={() => {
                    onEdit(editedArgs);
                    setIsEditing(false);
                  }}
                  disabled={isProcessing}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save & Approve
                </ConfirmationAction>
                <ConfirmationAction
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditedArgs(actionRequest.args);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </ConfirmationAction>
              </ConfirmationActions>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 border border-border p-3">
                <code className="text-sm font-mono font-semibold">{actionRequest.name}</code>
                {actionRequest.description && (
                  <p className="text-xs text-muted-foreground mt-1">{actionRequest.description}</p>
                )}

                <div className="mt-3 space-y-3">
                  {Object.entries(actionRequest.args).map(([key, value]) => {
                    const strValue = formatValue(value);
                    const isMultiline = strValue.includes("\n");
                    return (
                      <div key={key} className="space-y-1">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                          {key}
                        </div>
                        {isMultiline ? (
                          <pre className="text-xs text-card-foreground whitespace-pre-wrap break-all font-mono bg-muted/50 rounded-md px-2.5 py-1.5 border border-border">
                            {strValue}
                          </pre>
                        ) : (
                          <div className="text-sm text-card-foreground break-all">{strValue}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {showRejectInput && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="reject-reason"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Reason for rejection{" "}
                    <span className="text-muted-foreground/70 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="reject-reason"
                    type="text"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason..."
                    className="w-full text-sm"
                  />
                </div>
              )}

              <ConfirmationActions className="flex flex-wrap items-center gap-2 self-start mt-0">
                {showRejectInput ? (
                  <>
                    <ConfirmationAction
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        onReject(rejectReason || "User rejected");
                        setShowRejectInput(false);
                      }}
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Confirm Rejection
                    </ConfirmationAction>
                    <ConfirmationAction
                      type="button"
                      variant="outline"
                      onClick={() => setShowRejectInput(false)}
                    >
                      Cancel
                    </ConfirmationAction>
                  </>
                ) : (
                  <>
                    <ConfirmationAction
                      type="button"
                      variant="default"
                      onClick={onApprove}
                      disabled={isProcessing}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </ConfirmationAction>
                    {canEdit && (
                      <ConfirmationAction
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        disabled={isProcessing}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </ConfirmationAction>
                    )}
                    {canReject && (
                      <ConfirmationAction
                        type="button"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/15"
                        onClick={() => setShowRejectInput(true)}
                        disabled={isProcessing}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </ConfirmationAction>
                    )}
                  </>
                )}
              </ConfirmationActions>
            </div>
          )}
        </div>
      </AIConfirmation>
    );
  }
);

ApprovalCard.displayName = "ApprovalCard";
