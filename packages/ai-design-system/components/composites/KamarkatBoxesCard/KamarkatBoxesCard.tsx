import * as React from "react";
import { Card, CardContent } from "@/components/primitives/Card";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export interface KamarkatBoxItem {
  id: string;
  boxId: string;
  hubDomain: string;
  managementCluster: string;
  connection?: "connected" | "expired" | "none";
}

export interface KamarkatBoxesCardProps {
  boxes?: KamarkatBoxItem[];
  busy?: string | null;
  onDetectBoxes?: () => void;
  onConnectBox?: (boxId: string) => void;
  className?: string;
}

/**
 * KamarkatBoxesCard Composite
 *
 * Displays connected box repositories and controls to connect to platform clusters.
 */
export function KamarkatBoxesCard({
  boxes = [],
  busy,
  onDetectBoxes,
  onConnectBox,
  className,
}: KamarkatBoxesCardProps) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Kamarkat boxes
          </h2>
          <p className="text-sm text-muted-foreground">
            Found in your connected box repositories (<code className="font-mono text-xs">registry/box.yaml</code>).
            Agents read its platform and Grafana with your access.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onDetectBoxes}
          disabled={busy === "detect"}
          className="text-xs"
        >
          {busy === "detect" ? "Looking…" : "Look again"}
        </Button>
      </div>

      <Card className="border-border">
        <CardContent className="p-5">
          {boxes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No box yet. Allow this app to use your box&apos;s gitops repository (e.g.{" "}
              <span className="font-mono text-xs text-foreground">acme-gitops</span>).
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {boxes.map((box) => (
                <div
                  key={box.id}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-sm font-medium text-foreground">
                      {box.boxId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {box.hubDomain} · {box.managementCluster}
                    </span>
                  </div>
                  <Button
                    variant={box.connection === "connected" ? "outline" : "default"}
                    size="sm"
                    onClick={() => onConnectBox?.(box.id)}
                  >
                    {box.connection === "connected" ? "Connected" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
