import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

/**
 * Prompt helpers for building LLM system and user prompts.
 *
 * The package never makes AI calls — it only provides helpers to build
 * the prompts that consumers pass to their LLM of choice.
 */

export interface SystemPromptOptions {
  /** Extra instructions appended to the system prompt */
  extraInstructions?: string;
  /** Theme hint passed to the AI (e.g. "dark", "light") */
  theme?: "light" | "dark";
  /** If true, the AI is told to use $bindState and $state binding syntax */
  enableDataBinding?: boolean;
  /** Additional design rules injected into the system prompt */
  designRules?: string[];
}

/**
 * Builds a system prompt from a component schemas object.
 * Internally creates a temporary catalog and calls .prompt() to describe
 * all available components, then adds design-schema–specific guidelines.
 *
 * @example
 * ```ts
 * import { dataSchemas } from 'design-schema/schemas/data';
 * import { buildSystemPrompt } from 'design-schema/prompts';
 *
 * const systemPrompt = buildSystemPrompt(dataSchemas, {
 *   theme: 'dark',
 *   designRules: ['always include sample data in state', 'use StatsCard for numeric KPIs'],
 * });
 * ```
 */
export function buildSystemPrompt(
  schemas: Record<string, unknown>,
  options: SystemPromptOptions = {}
): string {
  const { extraInstructions, theme = "light", enableDataBinding = true, designRules = [] } = options;

  const catalog = defineCatalog(schema, {
    components: schemas as Parameters<typeof defineCatalog>[1]["components"],
    actions: {},
  });
  const catalogPrompt = catalog.prompt();

  const bindingSection = enableDataBinding
    ? `
## Data Binding
- Use \`{ "$state": "/path" }\` to read a value from the app state tree (read-only)
- Use \`{ "$bindState": "/path" }\` on form inputs for two-way binding
- Data paths are slash-separated, e.g. \`/customers/data\`, \`/form/email\`
`
    : "";

  const themeSection = `
## Theme
The UI uses the **${theme}** color theme. Use semantic color tokens (e.g. \`text-muted-foreground\`,
\`bg-card\`) via className props rather than hard-coded hex values.
`;

  const rulesSection = `
## Output Rules
- Respond with a single valid JSON object that is a complete UI spec
- Do NOT include markdown fences, explanations, or any text outside the JSON
- All component \`type\` values must exactly match the component names in the catalog
- Use Grid with 4 columns for stat cards, 2 columns for side-by-side panels
- Prefer StatsCard over plain Card for numeric KPIs
- Nest components via the \`children\` array — no flat lists at root level
${designRules.map((r) => `- ${r}`).join("\n")}
`;

  return [catalogPrompt, bindingSection, themeSection, rulesSection, extraInstructions ?? ""]
    .filter(Boolean)
    .join("\n");
}

/**
 * Builds a user prompt for UI generation or refinement.
 *
 * @example
 * ```ts
 * // Fresh generation
 * buildUserPrompt({ prompt: "Create a sales dashboard" })
 *
 * // Refinement of an existing spec
 * buildUserPrompt({ prompt: "Add a chart showing revenue by region", currentSpec: existingSpec })
 * ```
 */
export function buildUserPrompt(params: {
  prompt: string;
  currentSpec?: unknown;
  availableData?: string[];
  availableActions?: string[];
}): string {
  const { prompt, currentSpec, availableData, availableActions } = params;
  const lines: string[] = [prompt];

  if (availableData?.length) {
    lines.push(
      "\nAvailable data paths:\n" + availableData.map((d) => `  - ${d}`).join("\n")
    );
  }

  if (availableActions?.length) {
    lines.push(
      "\nAvailable actions:\n" + availableActions.map((a) => `  - ${a}`).join("\n")
    );
  }

  if (currentSpec) {
    lines.push(
      "\nExisting spec to refine:\n```json\n" +
        JSON.stringify(currentSpec, null, 2) +
        "\n```"
    );
  }

  return lines.join("\n");
}
