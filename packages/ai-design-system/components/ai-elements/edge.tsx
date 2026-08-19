import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getSimpleBezierPath,
  getSmoothStepPath,
} from "@xyflow/react";

const Temporary = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) => {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      className="stroke-1 stroke-ring"
      id={id}
      path={edgePath}
      style={{
        strokeDasharray: "5, 5",
      }}
    />
  );
};

const Strict = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={edgePath} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan rounded-md bg-secondary/90 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/80 shadow-xs backdrop-blur-xs"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const Animated = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  });

  return (
    <>
      <BaseEdge id={id} markerEnd={markerEnd} path={edgePath} style={style} />
      <circle fill="var(--primary)" r="4">
        <animateMotion dur="2s" path={edgePath} repeatCount="indefinite" />
      </circle>
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan rounded-md bg-secondary/90 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/80 shadow-xs backdrop-blur-xs"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const Edge = {
  Strict,
  Temporary,
  Animated,
};

