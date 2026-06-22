import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalCard } from "./ApprovalCard";
import { fn } from "@storybook/test";

const meta: Meta<typeof ApprovalCard> = {
  title: "Composites/ApprovalCard",
  component: ApprovalCard,
  parameters: {
    layout: "centered",
  },
  args: {
    onApprove: fn(),
    onReject: fn(),
    onEdit: fn(),
    isProcessing: false,
  },
} satisfies Meta<typeof ApprovalCard>;

export default meta;
type Story = StoryObj<typeof ApprovalCard>;

export const Default: Story = {
  args: {
    actionRequest: {
      name: "send_email",
      description: "Review email before sending to team",
      args: {
        to: "team@acme.com",
        subject: "Q4 Results",
        body: "Revenue grew 15% this quarter.",
      },
    },
    reviewConfig: {
      allowedDecisions: ["approve", "edit", "reject"],
    },
  },
};

export const SimpleApprovalOnly: Story = {
  args: {
    actionRequest: {
      name: "publish_content",
      description: "Publish video narration to production database",
      args: {
        document_id: "doc_123",
        environment: "production",
      },
    },
    reviewConfig: {
      allowedDecisions: ["approve", "reject"],
    },
  },
};

export const MultilineArguments: Story = {
  args: {
    actionRequest: {
      name: "apply_patch",
      description: "Approve and apply code patch to target repository",
      args: {
        patch: `diff --git a/src/index.ts b/src/index.ts
index 83a2d78..d3345f1 100644
--- a/src/index.ts
+++ b/src/index.ts
@@ -10,3 +10,4 @@
 export function hello() {
-  console.log("hello");
+  console.log("hello world!");
 }`,
        author: "AI Developer Agent",
      },
    },
    reviewConfig: {
      allowedDecisions: ["approve", "edit", "reject"],
    },
  },
};

export const InteractiveQuestion: Story = {
  args: {
    actionRequest: {
      name: "ask_question",
      args: {
        question: "Where in the workflow timeline should the SEO review step run?",
        options: [
          "(Recommended) Before the main human content approval, so the editor can see the SEO recommendations and scores when reviewing the script.",
          "After the main human content approval, so that the general content is finalized first before being tuned for SEO."
        ],
        is_multi_select: false
      }
    }
  }
};

export const MultiQuestionPoll: Story = {
  args: {
    actionRequest: {
      name: "ask_question",
      args: {
        questions: [
          {
            question: "Choose preferred publication channel:",
            options: ["YouTube", "Vimeo", "TikTok", "Instagram Reels"],
            is_multi_select: false
          },
          {
            question: "Which departments need to sign off on budget?",
            options: ["Marketing", "Finance", "Legal", "Operations"],
            is_multi_select: true
          }
        ]
      }
    }
  }
};
