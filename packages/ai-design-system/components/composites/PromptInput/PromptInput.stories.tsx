import type { Meta, StoryObj } from "@storybook/react";
import { PromptInput } from "./PromptInput";
import { useState } from "react";

const meta: Meta<typeof PromptInput> = {
  title: "Blocks/PromptInput",
  component: PromptInput,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Blocks form submission when true. Textarea remains editable.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the textarea input",
    },
  },
} satisfies Meta<typeof PromptInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default uncontrolled PromptInput
 * The AI element manages its own internal state
 */
export const Default: Story = {
  args: {
    placeholder: "What would you like to know?",
    onSubmit: (message) => {
      console.log("Submitted:", message);
      alert(`Submitted: ${message.text}`);
    },
  },
};

/**
 * Controlled state example
 * Parent component manages the input value
 */
export const ControlledState: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [submittedMessages, setSubmittedMessages] = useState<string[]>([]);

    return (
      <div className="space-y-4">
        <div className="rounded-md border border-border bg-muted p-4">
          <h3 className="mb-2 font-semibold text-sm">Parent State:</h3>
          <p className="font-mono text-xs">
            Current value: "{value}" ({value.length} chars)
          </p>
        </div>

        <PromptInput
          value={value}
          onChange={setValue}
          placeholder="Type something (controlled mode)"
          onSubmit={(message) => {
            setSubmittedMessages((prev) => [...prev, message.text || ""]);
            setValue(""); // Clear after submit
          }}
        />

        {submittedMessages.length > 0 && (
          <div className="rounded-md border border-border bg-muted p-4">
            <h3 className="mb-2 font-semibold text-sm">Submitted Messages:</h3>
            <ul className="space-y-1">
              {submittedMessages.map((msg, i) => (
                <li key={i} className="font-mono text-xs">
                  {i + 1}. {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Disabled state
 * Form submission is blocked, but textarea remains editable for drafts
 */
export const DisabledState: Story = {
  render: () => {
    const [isDisabled, setIsDisabled] = useState(true);

    return (
      <div className="space-y-4">
        <div className="rounded-md border border-border bg-muted p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
            />
            <span className="text-sm">Disable submission (textarea stays editable)</span>
          </label>
        </div>

        <PromptInput
          disabled={isDisabled}
          placeholder="Try typing and submitting (disabled mode)"
          onSubmit={(message) => {
            alert(`This should not appear when disabled! Message: ${message.text}`);
          }}
        />

        <div className="rounded-md border border-border bg-muted p-4">
          <p className="text-muted-foreground text-xs">
            When disabled, the submit button is blocked but you can still type in the textarea.
            This is useful for review workflows where users can draft responses but cannot submit until approval.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Custom placeholder
 * Different placeholder text for various contexts
 */
export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Ask a question or describe a task...",
    onSubmit: (message) => {
      console.log("Submitted:", message);
    },
  },
};

/**
 * Custom submit handler
 * Demonstrates async submit handling with loading state
 */
export const CustomSubmitHandler: Story = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmitted, setLastSubmitted] = useState<string>("");

    return (
      <div className="space-y-4">
        {isSubmitting && (
          <div className="rounded-md border border-border bg-muted p-4">
            <p className="text-sm">Processing your message...</p>
          </div>
        )}

        {lastSubmitted && (
          <div className="rounded-md border border-border bg-muted p-4">
            <h3 className="mb-2 font-semibold text-sm">Last Submitted:</h3>
            <p className="font-mono text-xs">{lastSubmitted}</p>
          </div>
        )}

        <PromptInput
          placeholder="Type something and submit (simulates 2s async processing)"
          disabled={isSubmitting}
          onSubmit={async (message) => {
            setIsSubmitting(true);
            // Simulate async processing
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setLastSubmitted(message.text || "");
            setIsSubmitting(false);
          }}
        />
      </div>
    );
  },
};

/**
 * No attachment UI
 * Verifies compositional hiding - no attachment components visible
 */
export const NoAttachmentUI: Story = {
  args: {
    placeholder: "Text-only input - no attachment options available",
    onSubmit: (message) => {
      console.log("Message with files array:", message);
      alert(
        `Text: ${message.text}\nFiles: ${message.files?.length || 0} (should always be 0)`
      );
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "The PromptInput block hides all attachment-related UI through compositional hiding. No attachment buttons, dropdowns, or drag-drop functionality is exposed.",
      },
    },
  },
};
