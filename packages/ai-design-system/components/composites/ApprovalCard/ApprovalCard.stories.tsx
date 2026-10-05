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

// Sample media for the carousel stories.
const CLIP_BASE =
  "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes";
const TRACK = (n: number) => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${n}.mp3`;

export const CarouselCharacterSelection: Story = {
  args: {
    actionRequest: {
      name: "ask_user",
      args: {
        questions: [
          {
            question: "Which presenter should front your channel?",
            layout: "carousel",
            options: [
              { label: "Ava", badge: "Recommended", media: { kind: "image", url: "https://picsum.photos/seed/ava/480/640", aspect: "portrait" } },
              { label: "Noah", media: { kind: "image", url: "https://picsum.photos/seed/noah/480/640", aspect: "portrait" } },
              { label: "Mia", media: { kind: "image", url: "https://picsum.photos/seed/mia/480/640", aspect: "portrait" } },
              { label: "Leo", badge: "Beta", media: { kind: "image", url: "https://picsum.photos/seed/leo/480/640", aspect: "portrait" } },
            ],
          },
        ],
      },
    },
  },
};

export const CarouselVideoSelection: Story = {
  args: {
    actionRequest: {
      name: "ask_user",
      args: {
        questions: [
          {
            question: "Pick the opening shot.",
            layout: "carousel",
            options: [1, 2, 3].map((n) => ({
              label: `Take ${n}`,
              description: n === 1 ? "Close-up, slow push-in" : undefined,
              media: {
                kind: "video",
                url: `${CLIP_BASE}/scene00${n}/clip.mp4`,
                aspect: "vertical",
                poster: n === 3 ? undefined : `https://picsum.photos/seed/take${n}/360/640`,
              },
            })),
          },
        ],
      },
    },
  },
};

export const CarouselAudioVariants: Story = {
  args: {
    actionRequest: {
      name: "ask_user",
      args: {
        questions: [
          {
            question: "Which version of your voice should the channel use?",
            layout: "carousel",
            options: [
              { label: "Original", media: { kind: "audio", url: TRACK(1) } },
              { label: "Denoised", badge: "Recommended", media: { kind: "audio", url: TRACK(2) } },
              { label: "Wind removed", media: { kind: "audio", url: TRACK(3) } },
              { label: "Vocal isolated", media: { kind: "audio", url: TRACK(4) } },
            ],
          },
        ],
      },
    },
  },
};

export const CarouselMixedWithList: Story = {
  args: {
    actionRequest: {
      name: "ask_user",
      args: {
        questions: [
          {
            question: "Choose preferred publication channel:",
            options: ["YouTube", "TikTok", "Instagram Reels"],
          },
          {
            question: "Pick a thumbnail style.",
            layout: "carousel",
            options: [
              { label: "Document", badge: "Beta", media: { kind: "image", url: "https://picsum.photos/seed/doc/640/360", aspect: "landscape" } },
              { label: "Presentation", badge: "Beta", media: { kind: "image", url: "https://picsum.photos/seed/deck/640/360", aspect: "landscape" } },
              { label: "Design", badge: "Beta", media: { kind: "image", url: "https://picsum.photos/seed/design/640/360", aspect: "landscape" } },
            ],
          },
        ],
      },
    },
  },
};

export const CarouselMissingMedia: Story = {
  args: {
    actionRequest: {
      name: "ask_user",
      args: {
        questions: [
          {
            question: "A carousel whose options have no previews is refused, not guessed.",
            layout: "carousel",
            options: ["Yes", "No"],
          },
        ],
      },
    },
  },
};
