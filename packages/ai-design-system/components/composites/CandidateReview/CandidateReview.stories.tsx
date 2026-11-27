import type { Meta, StoryObj } from '@storybook/react'
import { CandidateReview } from './CandidateReview'

const meta = {
  title: 'Composites/CandidateReview',
  component: CandidateReview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof CandidateReview>

export default meta
type Story = StoryObj<typeof meta>

export const Draft: Story = {
  args: {
    pack: 'expense-approval',
    agent: 'classifier',
    status: 'draft',
    requirements: 'Classify incoming expense requests by category and urgency.',
    rationale: 'Initial candidate proposed by the improver based on baseline behaviour.',
  },
}

export const Evaluated: Story = {
  args: {
    pack: 'expense-approval',
    agent: 'classifier',
    status: 'evaluated',
    requirements: 'Classify incoming expense requests by category and urgency.',
    rationale: 'Improved prompt reduces hallucination rate by 12% on the eval set.',
    basePackVersion: '0.3.1',
    artifactDigest: 'sha256:4a3e21890cfb129038d818274a91cbf2109abc',
    decisionReason: 'Accuracy above threshold; approved for rollout.',
    onOpenDecision: () => console.log('open decision'),
  },
}

export const WithDiff: Story = {
  args: {
    pack: 'expense-approval',
    agent: 'classifier',
    status: 'accepted',
    requirements: 'Classify incoming expense requests by category and urgency.',
    rationale: 'Minor prompt tweak to handle edge cases.',
    diff: `- You are a classifier.
+ You are an expert expense classifier.
  Categorize the user's expense request.`,
    onOpenDecision: () => console.log('open decision'),
    openLabel: 'Open pull request',
  },
}

export const Error: Story = {
  args: {
    pack: 'expense-approval',
    agent: 'classifier',
    status: 'error',
    requirements: 'Classify incoming expense requests by category and urgency.',
    error: 'Evaluation run timed out after 60 seconds. Please retry.',
  },
}
