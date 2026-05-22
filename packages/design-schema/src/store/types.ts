/**
 * Store types for persisting AI-generated UI specs.
 *
 * Consumers implement SchemaStore against their own DB (Drizzle, Prisma, etc).
 * This package only provides the interface and record shape.
 */

export interface SchemaRecord {
  /** Unique identifier (e.g., UUID or DB auto-id) */
  id: string;
  /** Human-readable name for this saved spec */
  name: string;
  /** Optional longer description */
  description?: string;
  /** The AI-generated UI spec — pass directly to <Renderer spec={...} /> */
  spec: unknown;
  /** Which preset was used to generate this spec — needed to pick the right registry on load */
  catalogPreset: string;
  /** design-schema package version at generation time — detect stale specs on upgrades */
  version: string;
  /** ISO-8601 timestamp */
  createdAt: string;
  /** ISO-8601 timestamp */
  updatedAt: string;
}

/**
 * Minimal store interface for consumers to implement.
 * Adapters (Jotai, Drizzle) build on top of this.
 */
export interface SchemaStore {
  load(id: string): Promise<SchemaRecord | null>;
  save(record: Omit<SchemaRecord, "id" | "createdAt" | "updatedAt">): Promise<SchemaRecord>;
  list(): Promise<SchemaRecord[]>;
  delete(id: string): Promise<void>;
}
