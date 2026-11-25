# GraphView

A live, read-only view of a graph of grouped nodes and edges.

- **Generic.** Nodes, edges and groups carry no domain meaning. The application maps its own data to them and decides the status banner and the selected node's details.
- **Stable under incremental updates.** A node that has a position keeps it; a new node goes below the others of its group (one column per group). The viewport is fitted once, when the first nodes appear, and later updates never move it. Selection is kept by node id.
- **Controlled state.** `positions` / `onPositionsChange`, `hiddenGroupIds` / `onHiddenGroupIdsChange` and `selectedNodeId` / `onNodeSelect` let the application persist and restore what the viewer did.

Hook contract: `useGraphView.d.ts`. Stories: `Features/GraphView`.
