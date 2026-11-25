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

type Point = { x: number; y: number };

/**
 * A path through the bend points the layout computed, joined to the handles by
 * a vertical then horizontal segment so it stays orthogonal. Undefined when the
 * route does not run from below the source to above the target, the way the
 * handles face: the edge then falls back to a smooth step.
 */
export function routedPath(source: Point, target: Point, route: Point[] | undefined): [string, number, number] | undefined {
  if (!route || route.length === 0) return undefined;
  const first = route[0]!;
  const last = route[route.length - 1]!;
  if (first.y < source.y || last.y > target.y) return undefined;
  const points = [source, { x: source.x, y: first.y }, ...route, { x: target.x, y: last.y }, target];
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const mid = points[Math.floor(points.length / 2)]!;
  return [path, mid.x, mid.y];
}

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
  data,
}: EdgeProps) => {
  const route = (data as { route?: Point[] } | undefined)?.route;
  const [edgePath, labelX, labelY] =
    routedPath({ x: sourceX, y: sourceY }, { x: targetX, y: targetY }, route) ??
    getSmoothStepPath({
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

