import type { Meta, StoryObj } from '@storybook/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from './Card'
import { Button } from '../Button/Button'

/**
 * Card Primitive Stories
 *
 * The Card component is a foundational primitive for grouping related content and actions.
 * It provides a flexible container with consistent styling, spacing, and visual hierarchy.
 * Cards are essential building blocks for creating organized, scannable interfaces.
 *
 * ## Features
 * - Flexible composition with Header, Title, Description, Content, Footer, and Action sub-components
 * - Consistent spacing and padding throughout
 * - Semantic HTML structure for accessibility
 * - Dark mode support with automatic theming
 * - Responsive design that adapts to container width
 * - Shadow and border styling for visual depth
 *
 * ## Component Structure
 * Cards are composed of several sub-components that work together:
 * - **Card**: Main container with rounded corners, border, and shadow
 * - **CardHeader**: Container for title, description, and optional actions
 * - **CardTitle**: Main heading with semibold typography
 * - **CardDescription**: Supporting text with muted styling
 * - **CardContent**: Main body content area with consistent padding
 * - **CardFooter**: Footer area typically containing actions or supplementary info
 * - **CardAction**: Positioned action buttons or icons in the header
 *
 * ## Accessibility
 * - Semantic HTML structure with proper heading hierarchy
 * - Keyboard navigation support for interactive elements
 * - ARIA attributes for screen readers when needed
 * - Sufficient color contrast in both light and dark modes
 * - Focus management for interactive cards
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use cards to group related content and actions
 * - Maintain consistent card styling across the application
 * - Keep card content focused and concise
 * - Use CardTitle for clear, descriptive headings
 * - Place primary actions in CardFooter
 * - Use CardDescription to provide context
 *
 * ### Don'ts
 * - Don't nest cards too deeply (avoid card-in-card patterns)
 * - Don't overcrowd cards with too much content
 * - Don't use cards for every piece of content (consider alternatives)
 * - Don't forget to provide adequate spacing between cards
 * - Don't use overly long titles or descriptions
 */
const meta = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile card component for grouping related content and actions, built on shadcn/ui foundation.',
      },
    },
  },
  argTypes: {
    elevation: {
      control: 'select',
      options: ['flat', 'elevated', 'outlined'],
      description: 'Elevation variant of the card',
      table: {
        defaultValue: { summary: 'flat' },
      },
    },
    padding: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Padding variant of the card',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default card
 *
 * A simple card with just content. This is the most basic form of a card,
 * useful for displaying standalone content without additional context.
 */
export const Default: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardContent>
        <p>This is a simple card with just content. It provides a clean container for your information.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The simplest card structure with only content, useful for basic content containers.',
      },
    },
  },
}

/**
 * Card with header
 *
 * A card with a header section containing a title.
 * This is the most common card pattern, providing clear context for the content.
 */
export const WithHeader: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          This card includes a header with a title, providing clear context for the content below. Headers help
          establish visual hierarchy and improve scanability.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with a header section containing a title, the most common card pattern.',
      },
    },
  },
}

/**
 * Card with header and description
 *
 * A card with both title and description in the header.
 * The description provides additional context in a muted style.
 */
export const WithHeaderAndDescription: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Feature Overview</CardTitle>
        <CardDescription>Comprehensive details about this feature and its capabilities.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          The card description appears in a muted color below the title, providing supplementary information without
          competing for attention. This creates a clear visual hierarchy.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with both title and supporting description text in the header for additional context.',
      },
    },
  },
}

/**
 * Card with footer
 *
 * A card with a footer section containing actions.
 * Footers are ideal for call-to-action buttons or supplementary information.
 */
export const WithFooter: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Action Required</CardTitle>
        <CardDescription>Please review and confirm the information below.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. The footer below provides actions related to this content.</p>
      </CardContent>
      <CardFooter>
        <Button variant="default">Confirm</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with a footer section containing action buttons, perfect for forms or confirmations.',
      },
    },
  },
}

/**
 * Complete card structure
 *
 * A fully featured card with all available sub-components:
 * header, title, description, content, and footer.
 */
export const Complete: Story = {
  render: () => (
    <Card style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Complete Card Example</CardTitle>
        <CardDescription>This card demonstrates all available sub-components working together.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '12px' }}>
            This is a fully featured card showcasing the complete structure available in the design system.
          </p>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '12px' }}>
            <li>CardHeader for grouping title and description</li>
            <li>CardTitle for the main heading</li>
            <li>CardDescription for supporting text</li>
            <li>CardContent for the main body</li>
            <li>CardFooter for actions</li>
          </ul>
          <p>Use this structure when you need to present comprehensive information with clear hierarchy.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm">
          Primary Action
        </Button>
        <Button variant="outline" size="sm">
          Secondary
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete card structure demonstrating all available sub-components and their composition.',
      },
    },
  },
}

/**
 * Card with header action
 *
 * A card with an action button in the header using CardAction.
 * Useful for cards that need quick access to actions like edit, delete, or more options.
 */
export const WithHeaderAction: Story = {
  render: () => (
    <Card style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Settings Panel</CardTitle>
        <CardDescription>Configure your preferences below.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            •••
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The CardAction component positions action buttons in the header, typically for edit or menu actions.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with an action button positioned in the header using CardAction component.',
      },
    },
  },
}

/**
 * Multiple cards in a grid
 *
 * Demonstrates how cards work together in a grid layout.
 * Shows consistent spacing and alignment when using multiple cards.
 */
export const MultipleCards: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        maxWidth: '900px',
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>View your performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>2,847</div>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>Total views this month</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly earnings overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>$12,459</div>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>+18% from last month</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            View Report
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Recent activity updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>12</div>
          <p style={{ fontSize: '14px', color: 'hsl(var(--muted-foreground))' }}>Unread notifications</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple cards arranged in a responsive grid layout, demonstrating consistent spacing and alignment.',
      },
    },
    layout: 'padded',
  },
}

/**
 * Card with complex content
 *
 * Demonstrates a card with more complex content structure,
 * including multiple paragraphs, lists, and rich formatting.
 */
export const WithComplexContent: Story = {
  render: () => (
    <Card style={{ width: '500px' }}>
      <CardHeader>
        <CardTitle>Getting Started Guide</CardTitle>
        <CardDescription>Everything you need to know to begin using the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <section>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Step 1: Setup</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Begin by configuring your account settings and preferences. This ensures a personalized experience
              tailored to your needs.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Step 2: Integration</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              Connect your existing tools and services for seamless workflow integration. We support all major
              platforms.
            </p>
          </section>

          <section>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Step 3: Launch</h4>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              You're ready to go! Start exploring features and building your first project.
            </p>
          </section>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="default">Start Tutorial</Button>
        <Button variant="ghost">Skip for Now</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card containing complex structured content with multiple sections and rich formatting.',
      },
    },
  },
}

/**
 * Compact cards
 *
 * Smaller cards suitable for dashboards or dense layouts.
 * Demonstrates minimal structure with concise content.
 */
export const CompactCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Card style={{ width: '200px' }}>
        <CardContent>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>156</div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Active Users</div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ width: '200px' }}>
        <CardContent>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>89%</div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Completion Rate</div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ width: '200px' }}>
        <CardContent>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>24/7</div>
            <div style={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}>Support Available</div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact cards with minimal content, ideal for dashboards and metric displays.',
      },
    },
  },
}

/**
 * Dark mode preview
 *
 * All card variants in dark mode to verify theming compatibility.
 * Cards automatically adapt to dark mode with appropriate contrast and styling.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '32px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
        <Card>
          <CardHeader>
            <CardTitle>Dark Mode Card</CardTitle>
            <CardDescription>Cards automatically adapt to dark mode with proper contrast.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The card component seamlessly transitions between light and dark themes, maintaining readability and visual hierarchy.</p>
          </CardContent>
          <CardFooter>
            <Button variant="default" size="sm">
              Action
            </Button>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Card</CardTitle>
            <CardDescription>All elements maintain appropriate contrast ratios.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Text, borders, and shadows are optimized for dark mode viewing, ensuring comfortable reading in low-light environments.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Cards in dark mode demonstrating automatic theming with proper contrast and styling.',
      },
    },
    backgrounds: { disable: true },
  },
}

/**
 * Interactive cards
 *
 * Cards with interactive elements and hover states.
 * Demonstrates how cards can be used for clickable content areas.
 */
export const InteractiveCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '600px' }}>
      <Card
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Browse guides and API references</CardDescription>
        </CardHeader>
      </Card>

      <Card
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <CardHeader>
          <CardTitle>Tutorials</CardTitle>
          <CardDescription>Step-by-step learning paths</CardDescription>
        </CardHeader>
      </Card>

      <Card
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>Connect with other users</CardDescription>
        </CardHeader>
      </Card>

      <Card
        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Get help when you need it</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive cards with hover effects, useful for navigation or selection interfaces.',
      },
    },
  },
}

/**
 * Flat card (default elevation)
 *
 * Card with no shadow and subtle border
 */
export const FlatCard: Story = {
  render: () => (
    <Card elevation="flat" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Flat Card</CardTitle>
        <CardDescription>No shadow, subtle border for minimal visual weight</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has a flat elevation with a subtle border, perfect for minimal designs.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Elevated card
 *
 * Card with drop shadow for depth
 */
export const ElevatedCard: Story = {
  render: () => (
    <Card elevation="elevated" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Drop shadow creates depth and emphasis</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has an elevated shadow, making it appear to float above the surface.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Outlined card
 *
 * Card with prominent border and no shadow
 */
export const OutlinedCard: Story = {
  render: () => (
    <Card elevation="outlined" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
        <CardDescription>Prominent border without shadow</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has a prominent border with no shadow for clear definition.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Small padding card
 *
 * Card with compact padding
 */
export const SmallPaddingCard: Story = {
  render: () => (
    <Card padding="sm" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Small padding for dense layouts</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has compact padding, suitable for dense layouts or small spaces.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Large padding card
 *
 * Card with spacious padding
 */
export const LargePaddingCard: Story = {
  render: () => (
    <Card padding="lg" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Spacious Card</CardTitle>
        <CardDescription>Large padding for breathing room</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has generous padding, providing plenty of breathing room for the content.</p>
      </CardContent>
    </Card>
  ),
}

/**
 * Elevation variants showcase
 */
export const ElevationVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <Card elevation="flat">
        <CardHeader>
          <CardTitle>Flat</CardTitle>
          <CardDescription>Subtle border, no shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Minimal visual weight</p>
        </CardContent>
      </Card>

      <Card elevation="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Drop shadow for depth</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Appears to float above surface</p>
        </CardContent>
      </Card>

      <Card elevation="outlined">
        <CardHeader>
          <CardTitle>Outlined</CardTitle>
          <CardDescription>Prominent border, no shadow</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Clear definition and separation</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All elevation variants side by side for comparison',
      },
    },
  },
}

/**
 * Padding variants showcase
 */
export const PaddingVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <Card padding="sm">
        <CardHeader>
          <CardTitle>Small Padding</CardTitle>
          <CardDescription>Compact spacing for dense layouts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Less space, more content density</p>
        </CardContent>
      </Card>

      <Card padding="default">
        <CardHeader>
          <CardTitle>Default Padding</CardTitle>
          <CardDescription>Standard spacing for most use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Balanced spacing and content</p>
        </CardContent>
      </Card>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Large Padding</CardTitle>
          <CardDescription>Spacious layout with breathing room</CardDescription>
        </CardHeader>
        <CardContent>
          <p>More space, improved readability</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All padding variants side by side for comparison',
      },
    },
  },
}

/**
 * Combined variants showcase
 */
export const CombinedVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '800px' }}>
      <Card elevation="flat" padding="sm">
        <CardHeader>
          <CardTitle>Flat + Small</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Minimal and compact</p>
        </CardContent>
      </Card>

      <Card elevation="elevated" padding="default">
        <CardHeader>
          <CardTitle>Elevated + Default</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Balanced emphasis</p>
        </CardContent>
      </Card>

      <Card elevation="outlined" padding="lg">
        <CardHeader>
          <CardTitle>Outlined + Large</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Clear and spacious</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different combinations of elevation and padding variants',
      },
    },
    layout: 'padded',
  },
}
