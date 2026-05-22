import { Background, ReactFlow, type ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";
import { Controls } from "./controls";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

export const Canvas = ({ children, ...props }: CanvasProps) => (
  <ReactFlow
    {...props}
    deleteKeyCode={["Backspace", "Delete"]}
    fitView
    panOnDrag={false}
    panOnScroll
    proOptions={{ hideAttribution: true }}
    selectionOnDrag={true}
    zoomOnDoubleClick={false}
  >
    <Background bgColor="var(--sidebar)" />
    <Controls />
    {children}
  </ReactFlow>
);
