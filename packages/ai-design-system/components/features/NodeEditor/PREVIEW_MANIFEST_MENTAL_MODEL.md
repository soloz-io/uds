# Screen Preview Manifest (`.preview.mdx`): Specification & Mental Model

> **Target Audience:** Coding agents and developers authoring new UI screens who need to generate the co-located `.preview.mdx` navigation manifest.
> **Scope:** Generic specification applicable to any mobile/web application screen across any project.

---

## 1. Overview & Purpose

Every UI screen file (e.g. `MyScreen.tsx`) represents a visual state in the application. To allow visual workflow engines (like `NodeEditor`, Storybook, or builder canvasses) to render the screen inside a device bezel, accurately attach navigation arrows to interactive CTA buttons, and insert decision condition diamonds, each screen must have a co-located **`MyScreen.preview.mdx`** file.

The `.preview.mdx` file serves as the **declarative visual navigation contract** for that screen.

---

## 2. Manifest Schema Specification

Inside every `*.preview.md` file, include frontmatter and a YAML block conforming to this specification:

```markdown
---
id: <screen-id>
label: <Screen Title>
path: </route-path>
isInitial: <true | false>
---

# <Screen Title>

Brief description of the screen purpose and user interactions.

## Interactive Ports & Navigation

```yaml
id: screen-unique-id
label: Human Readable Label
path: /route-path
isInitial: false
ports:
  - id: test-id-of-button
    label: Button Label
    relativeTop: 0.450
transitions:
  - from: test-id-of-button
    to: destination-screen-id
    label: Edge Label
```
```

### Field Definitions

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique identifier matching the screen route (e.g. `"signin"`, `"checkout"`). |
| `label` | `string` | **Yes** | Display title rendered above the device frame on the canvas. |
| `path` | `string` | **Yes** | URL route path (e.g. `"/signin"`). Used for iframe routing. |
| `isInitial` | `boolean` | No | Set to `true` **only** for the entry-point screen of the app flow (default: `false`). |
| `ports` | `ScreenPort[]` | **Yes** | List of interactive action elements (buttons, links, avatars) that trigger navigation. |
| `transitions` | `Transition[]` | **Yes** | Outgoing navigation edges emanating from this screen. Empty `[]` for terminal screens. |

---

## 3. Mental Model for Calculating `relativeTop` (Button Anchors)

### Core Concept
`relativeTop` is a normalized decimal value ($0.0 \le \text{relativeTop} \le 1.0$) representing the **exact vertical center of the clickable element** relative to the total device viewport height ($H$).

$$\text{relativeTop} = \frac{Y_{\text{center}}}{H}$$

Using a normalized fraction makes the manifest **device-agnostic**: whether the canvas renders an iPhone 16 Pro ($H=852\text{px}$), Pixel 7 ($H=915\text{px}$), or iPhone SE ($H=667\text{px}$), the handle always snaps to the exact center of the button.

---

### Step-by-Step Calculation Rules

When inspecting a screen component's layout styles (`StyleSheet.create` or Tailwind), calculate $Y_{\text{center}}$ using one of three positioning archetypes:

```
┌─────────────────────────────────────────────────────────────┐  0.0
│ [Top Header / Avatar]  ◄── Archetype 1: Top-Anchored        │
│                                                             │
│                                                             │
│ ┌─────────────────────────┐                                 │
│ │ Input Form / Cards      │                                 │
│ └─────────────────────────┘                                 │
│ [Primary CTA Button]   ◄── Archetype 2: In-Flow (Form/Body) │
│                                                             │
│                                                             │
│                                                             │
│ [Bottom Action Button] ◄── Archetype 3: Bottom / Footer     │
└─────────────────────────────────────────────────────────────┘  1.0
```

#### Archetype 1: Top-Anchored Elements (Headers, Profile Avatars, Back Buttons)
For elements placed at the top with explicit padding:
$$Y_{\text{center}} = \text{paddingTop} + \text{topMargin} + \frac{\text{elementHeight}}{2}$$

*Example ($H = 852\text{px}$):*
- Screen has `paddingTop: 64`, Avatar height `40px`:
- $Y_{\text{center}} = 64 + 20 = 84\text{px}$
- $\text{relativeTop} = \frac{84}{852} = \mathbf{0.098}$

---

#### Archetype 2: In-Flow Elements (Form Buttons, List Items, Body CTAs)
For elements positioned sequentially down the page:
$$Y_{\text{center}} = \text{paddingTop} + \sum(\text{preceding element heights}) + \sum(\text{gaps/margins}) + \frac{\text{elementHeight}}{2}$$

*Example ($H = 852\text{px}$):*
- `paddingTop: 80`
- Title: Height 36px + Margin 32px ($= 68\text{px}$)
- Form Inputs: 2 inputs (50px each) + Gap (12px) + Form Margin (24px) ($= 136\text{px}$)
- CTA Button: Height 50px
- $Y_{\text{center}} = 80 + 68 + 136 + \frac{50}{2} = 309\text{px}$
- $\text{relativeTop} = \frac{309}{852} = \mathbf{0.362}$

---

#### Archetype 3: Bottom / Footer-Anchored Elements (Sticky Next/Done Buttons, Tab Bars)
For elements pinned to the bottom of the screen:
$$Y_{\text{center}} = H - \text{paddingBottom} - \text{bottomMargin} - \frac{\text{elementHeight}}{2}$$

*Example ($H = 852\text{px}$):*
- Screen has `paddingBottom: 36`, Button height `50px`:
- $Y_{\text{center}} = 852 - 36 - \frac{50}{2} = 852 - 36 - 25 = 791\text{px}$
- $\text{relativeTop} = \frac{791}{852} = \mathbf{0.928}$

---

## 4. Mental Model for Edge Placement & Graph Topology

### Principle 1: Model the Primary Forward Flow (DAG), Not Intra-Step Toggles
- **Include**: Navigation transitions that advance the user to the next state, step, or onboarding milestone.
- **Exclude**: Micro-interactions within the same screen (e.g. *"Show/Hide Password"*, *"Switch Tabs"*, or circular *"Have an account? Sign In"* links between sibling auth cards).
- **Rationale**: The workflow canvas is a **Directed Acyclic Graph (DAG)**. Introducing mutual circular edges between screens destroys hierarchical column layering in layout engines (ELK/Sugiyama), causing nodes to jump across columns.

---

### Principle 2: Direct Transitions (1 Source $\rightarrow$ 1 Destination)
Use when clicking a button unconditionally navigates to a specific screen:

```json
{
  "from": "btn-submit-order",
  "to": "order-confirmation",
  "label": "Place order"
}
```

- `from`: The `id` of the port in the current screen's `ports` array.
- `to`: The `id` of the target screen manifest.
- `label`: Optional action text displayed on the edge badge.

---

### Principle 3: Conditional Branching (1 Source $\rightarrow$ Condition $\rightarrow$ $N$ Destinations)
Use when an action evaluates runtime business logic (e.g. auth check, payment status, A/B variant, validation) that splits into multiple possible screens:

```json
{
  "from": "btn-continue",
  "condition": {
    "id": "cond-auth-status",
    "label": "Is Authenticated?",
    "transitionType": "conditional",
    "description": "Evaluate user login session"
  },
  "branches": [
    { "to": "checkout-screen", "label": "Yes" },
    { "to": "login-screen", "label": "No" }
  ]
}
```

- Automatically inserts a decision diamond node (`type: "transition"`) on the canvas.
- Creates 1 incoming edge from the button port to the condition node.
- Creates $N$ outgoing labeled edges from the condition node to each branch target screen.

---

### Principle 4: Terminal / Sink Screens
Destination hubs, dashboards, or terminal success screens that do not have mandatory forward onboarding steps should specify an empty transitions array:
```json
"transitions": []
```

---

## 5. Authoring Agent Verification Checklist

Before saving any `.preview.mdx` file, verify the following 5 criteria:

1. **TestID Parity**: Does every port `id` in `ports: [...]` match an actual `testID` prop on a `Pressable`/`Button` in the `.tsx` file?
2. **Normalized Fraction**: Are all `relativeTop` values strictly between `0.0` and `1.0` (with 3 decimal precision)?
3. **Valid Targets**: Do all `to` targets in `transitions` correspond to a valid `id` of another screen manifest?
4. **Single Initial**: Is `isInitial: true` set on **only one** entry screen in the entire app flow?
5. **No Graph Cycles**: Are all edges directed forward along the user journey without bidirectional loops?
