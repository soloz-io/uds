import { describe, expect, it } from "vitest";
import { GRAPH_COLUMN_WIDTH, GRAPH_ROW_HEIGHT, placeGraphNodes } from "./graph-placement";

const groups = [{ id: "a", label: "A" }, { id: "b", label: "B" }];

describe("placeGraphNodes", () => {
  it("places each group in its own column, in node order", () => {
    const placed = placeGraphNodes(
      [
        { id: "a1", label: "a1", groupId: "a" },
        { id: "b1", label: "b1", groupId: "b" },
        { id: "a2", label: "a2", groupId: "a" },
      ],
      groups,
      {}
    );
    expect(placed).toEqual({
      a1: { x: 0, y: 0 },
      a2: { x: 0, y: GRAPH_ROW_HEIGHT },
      b1: { x: GRAPH_COLUMN_WIDTH, y: 0 },
    });
  });

  it("keeps known positions and places new nodes below them", () => {
    const placed = placeGraphNodes(
      [
        { id: "a0", label: "a0", groupId: "a" },
        { id: "a1", label: "a1", groupId: "a" },
        { id: "a2", label: "a2", groupId: "a" },
      ],
      groups,
      { a1: { x: 40, y: 500 } }
    );
    expect(placed.a1).toEqual({ x: 40, y: 500 });
    expect(placed.a0).toEqual({ x: 0, y: 500 + GRAPH_ROW_HEIGHT });
    expect(placed.a2).toEqual({ x: 0, y: 500 + 2 * GRAPH_ROW_HEIGHT });
  });
});
