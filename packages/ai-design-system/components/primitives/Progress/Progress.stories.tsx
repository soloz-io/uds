import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";
import { useState, useEffect } from "react";

/**
 * Progress component displays the completion progress of a task.
 *
 * ## Features
 * - Determinate progress (0-100%)
 * - Smooth animated transitions
 * - Customizable height and color
 * - ARIA attributes for accessibility
 * - WCAG 2.1 Level AA compliant
 *
 * ## Usage
 * ```tsx
 * <Progress value={50} />
 * ```
 *
 * ## Accessibility
 * - Uses role="progressbar"
 * - aria-valuenow for current value
 * - aria-valuemin and aria-valuemax for range
 * - Screen reader announcements
 */
const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays an indicator showing the completion progress of a task.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "The progress value (0-100)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

/**
 * Default progress at 50%
 */
export const Default: Story = {
  args: {
    value: 50,
    className: "w-[300px]",
  },
};

/**
 * Different progress values
 */
export const Values: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">0% Complete</div>
        <Progress value={0} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">25% Complete</div>
        <Progress value={25} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">50% Complete</div>
        <Progress value={50} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">75% Complete</div>
        <Progress value={75} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">100% Complete</div>
        <Progress value={100} />
      </div>
    </div>
  ),
};

/**
 * Animated progress (simulating upload/download)
 */
export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(timer);
    }, []);

    return (
      <div className="space-y-2 w-[300px]">
        <div className="text-sm text-muted-foreground">{progress}% Complete</div>
        <Progress value={progress} />
      </div>
    );
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Extra Small (h-1)</div>
        <Progress value={60} className="h-1" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Small (h-2, default)</div>
        <Progress value={60} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Medium (h-3)</div>
        <Progress value={60} className="h-3" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Large (h-4)</div>
        <Progress value={60} className="h-4" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Extra Large (h-6)</div>
        <Progress value={60} className="h-6" />
      </div>
    </div>
  ),
};

/**
 * Custom colors
 */
export const CustomColors: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Success (Green)</div>
        <Progress
          value={75}
          className="[&>div]:bg-green-500"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Warning (Yellow)</div>
        <Progress
          value={50}
          className="[&>div]:bg-yellow-500"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Error (Red)</div>
        <Progress
          value={25}
          className="[&>div]:bg-red-500"
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Info (Blue)</div>
        <Progress
          value={80}
          className="[&>div]:bg-blue-500"
        />
      </div>
    </div>
  ),
};

/**
 * Upload progress simulation
 */
export const UploadSimulation: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const startUpload = () => {
      setProgress(0);
      setIsUploading(true);

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsUploading(false);
            return 100;
          }
          // Simulate varying upload speeds
          const increment = Math.random() * 15 + 5;
          return Math.min(prev + increment, 100);
        });
      }, 300);
    };

    return (
      <div className="space-y-4 w-[400px]">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uploading file.pdf</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
          {progress === 100 && !isUploading && (
            <div className="text-sm text-green-600 dark:text-green-400">
              Upload complete!
            </div>
          )}
        </div>

        <button
          onClick={startUpload}
          disabled={isUploading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Start Upload"}
        </button>
      </div>
    );
  },
};

/**
 * Multi-step progress
 */
export const MultiStep: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    return (
      <div className="space-y-4 w-[400px]">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, totalSteps))}
            disabled={currentStep === totalSteps}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Indeterminate state (loading)
 */
export const IndeterminateLoading: Story = {
  render: () => (
    <div className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Loading...</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
          <div className="h-full w-1/3 animate-[shimmer_2s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  ),
};

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark space-y-4 w-[300px]">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Default</div>
        <Progress value={60} />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Success</div>
        <Progress value={80} className="[&>div]:bg-green-500" />
      </div>

      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Warning</div>
        <Progress value={50} className="[&>div]:bg-yellow-500" />
      </div>
    </div>
  ),
};
