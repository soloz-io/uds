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

/** A relationship end's multiplicity, as the view states it; unknown draws no symbol. */
export type EndMultiplicity = { min: number; max: number | "*" } | "unknown";

/**
 * Crow's Foot (Information Engineering) symbols for one end: the inner mark is
 * the maximum (a bar for one, a crow's foot for many), the outer mark the
 * minimum (a circle for zero, a bar for one). Drawn pointing at the entity.
 */
function CrowsFoot({ id, end }: { id: string; end: EndMultiplicity }) {
  if (end === "unknown") return null;
  const many = end.max === "*" || end.max > 1;
  return (
    <marker id={id} viewBox="0 0 20 12" refX="20" refY="6" markerWidth="20" markerHeight="12" orient="auto-start-reverse" markerUnits="userSpaceOnUse">
      <g className="stroke-foreground" fill="none" strokeWidth="1.25">
        {many ? <path d="M 12 6 L 20 0 M 12 6 L 20 12 M 12 6 L 20 6" /> : <path d="M 16 1 L 16 11" />}
        {end.min === 0 ? <circle cx="7" cy="6" r="3" className="fill-background" /> : <path d="M 8 1 L 8 11" />}
      </g>
    </marker>
  );
}

const text = (end: EndMultiplicity) => (end === "unknown" ? "?" : `${end.min}..${end.max}`);

/**
 * An ERD relationship: a line with Crow's Foot symbols at each end where the
 * multiplicity is known, and the relationship's name. An end of unknown
 * multiplicity is marked "?", never drawn as if it were known.
 */
const Relationship = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}: EdgeProps) => {
  const ends = (data ?? {}) as { fromMultiplicity?: EndMultiplicity; toMultiplicity?: EndMultiplicity };
  const from = ends.fromMultiplicity ?? "unknown";
  const to = ends.toMultiplicity ?? "unknown";
  const [edgePath, labelX, labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 8 });
  const startId = `${id}-from`;
  const endId = `${id}-to`;
  return (
    <>
      <defs>
        <CrowsFoot id={startId} end={from} />
        <CrowsFoot id={endId} end={to} />
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={from === "unknown" ? undefined : `url(#${startId})`}
        markerEnd={to === "unknown" ? undefined : `url(#${endId})`}
      />
      <EdgeLabelRenderer>
        <div
          style={{ position: "absolute", transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, pointerEvents: "all" }}
          className="nodrag nopan rounded-md bg-secondary/90 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground border border-border/80 shadow-xs"
          title={`${text(from)} — ${text(to)}`}
        >
          {label}
          {from === "unknown" || to === "unknown" ? <span className="ml-1 text-muted-foreground">(multiplicity {text(from)} — {text(to)})</span> : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const Edge = {
  Strict,
  Temporary,
  Animated,
  Relationship,
};

