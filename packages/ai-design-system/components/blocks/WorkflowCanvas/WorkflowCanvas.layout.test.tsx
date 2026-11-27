import { describe, expect, it } from "vitest"
import { getLayoutedElements } from "@/lib/workflow/layout-engine"
import type { WorkflowEdge, WorkflowNode } from "@/lib/workflow/interfaces"

const node = (id: string, type: string): WorkflowNode =>
  ({ id, type, position: { x: 0, y: 0 }, data: { label: id, type } }) as unknown as WorkflowNode

describe("getLayoutedElements", () => {
  it("draws a branch-outcome edge from a node position, labelled with its outcome", async () => {
    const nodes = [node("ask", "transition"), node("yes", "state"), node("no", "state")]
    const edges: WorkflowEdge[] = [
      { id: "e-yes", source: "ask", target: "yes", sourceHandle: "approve" },
      { id: "e-no", source: "ask", target: "no", sourceHandle: "reject" },
    ]
    const out = await getLayoutedElements(nodes, edges)
    const yes = out.edges.find((e) => e.id === "e-yes")!
    expect(yes.sourceHandle).toMatch(/^source-/)
    expect(yes.label).toBe("approve")
    expect(out.edges.find((e) => e.id === "e-no")!.label).toBe("reject")
  })

  it("keeps a positional handle as it is, with no label", async () => {
    const out = await getLayoutedElements([node("a", "state"), node("b", "state")], [
      { id: "e", source: "a", target: "b", sourceHandle: "source-right" },
    ])
    expect(out.edges[0].sourceHandle).toBe("source-right")
    expect(out.edges[0].label).toBeUndefined()
  })
})
