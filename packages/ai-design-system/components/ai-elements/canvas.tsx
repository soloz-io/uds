import { Background, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";
import { Controls } from "./controls";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

export const Canvas = ({
  children,
  panOnDrag = false,
  selectionOnDrag,
  ...props
}: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnScroll
    proOptions={{ hideAttribution: true }}
    zoomOnDoubleClick={false}
    panOnDrag={panOnDrag}
    selectionOnDrag={selectionOnDrag !== undefined ? selectionOnDrag : !panOnDrag}
    {...props}
  >
    <Background bgColor="var(--sidebar)" />
    <Controls />
    {children}
  </ReactFlow>
);
