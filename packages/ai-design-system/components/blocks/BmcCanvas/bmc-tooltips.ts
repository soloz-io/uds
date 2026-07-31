export interface BmcTooltipContent {
  title: string;
  description: string;
  question: string;
  examples: string[];
}

export const BMC_TOOLTIPS: Record<string, BmcTooltipContent> = {
  key_partnerships: {
    title: "Key Partnerships",
    description: "The external companies, suppliers, or vendors that help your business operate and grow.",
    question: "Who do we rely on outside our company to make this business work?",
    examples: ["Cloud hosting providers", "Payment gateways", "Material suppliers", "Strategic alliances"]
  },
  key_activities: {
    title: "Key Activities",
    description: "The most critical daily tasks and operations your team must execute to deliver your offer.",
    question: "What core things must we do every day to operate and succeed?",
    examples: ["Software development", "AI model training", "Content creation", "Customer support"]
  },
  key_resources: {
    title: "Key Resources",
    description: "The most vital assets—physical, intellectual, human, or financial—needed to run your business.",
    question: "What essential assets do we need to own or access to deliver our value?",
    examples: ["Skilled engineers", "Proprietary algorithms", "Brand identity", "Capital"]
  },
  value_propositions: {
    title: "Value Propositions",
    description: "The collection of products, services, and benefits that solve customer problems or satisfy their needs.",
    question: "Why do customers choose us over competitors? What problem are we solving?",
    examples: ["Time savings", "Cost reduction", "Ease of use", "Premium quality"]
  },
  customer_relationships: {
    title: "Customer Relationships",
    description: "The type of interaction and ongoing relationship you establish with each customer group.",
    question: "How do we interact with our customers across their lifecycle?",
    examples: ["Self-service onboarding", "Dedicated account management", "Automated support"]
  },
  channels: {
    title: "Channels",
    description: "The touchpoints and pathways you use to communicate with, sell to, and deliver value to customers.",
    question: "How do customers find, evaluate, buy, and receive our product or service?",
    examples: ["Direct web platform", "Sales team", "Mobile app", "Partner marketplaces"]
  },
  customer_segments: {
    title: "Customer Segments",
    description: "The specific groups of people or organizations your business aims to reach and serve.",
    question: "Who are we creating value for? Who is our ideal buyer?",
    examples: ["Enterprise B2B teams", "Thought leaders", "Small business owners"]
  },
  cost_structure: {
    title: "Cost Structure",
    description: "All major fixed and variable expenses required to operate your business model.",
    question: "What are the biggest costs inherent in running our business?",
    examples: ["Server/compute costs", "Team salaries", "R&D licensing", "Marketing"]
  },
  revenue_streams: {
    title: "Revenue Streams",
    description: "The different ways your business earns cash and captures value from each customer segment.",
    question: "How does money flow into the business? What are customers paying for?",
    examples: ["Monthly SaaS subscriptions", "Usage-based fees", "One-time setup charges"]
  }
};
