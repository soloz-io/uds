/**
 * Jotai state adapter for design-schema.
 *
 * Provides createSchemaAtoms() factory that wires a SchemaStore to Jotai atoms.
 *
 * Usage:
 * ```ts
 * import { createSchemaAtoms } from "design-schema/adapters/jotai";
 * import { WaypointSchemaStore } from "./schema-store";
 *
 * // Provides: specAtom, loadSpecAtom, saveSpecAtom, hasUnsavedChangesAtom
 * // with built-in 1s debounce autosave  same pattern as the archived workflow-builder-template
 * export const schemaAtoms = createSchemaAtoms(new WaypointSchemaStore());
 * ```
 *
 * Peer dependency: jotai >=2.0
 */

import { atom } from "jotai";
import type { SchemaRecord, SchemaStore } from "../../store/types.js";

export interface SchemaAtoms {
  /** The current spec (null = not loaded) */
  specAtom: ReturnType<typeof atom<unknown | null>>;
  /** The full SchemaRecord (null = not loaded) */
  recordAtom: ReturnType<typeof atom<SchemaRecord | null>>;
  /** Whether there are unsaved local changes */
  hasUnsavedChangesAtom: ReturnType<typeof atom<boolean>>;
  /** Trigger a load by record id  write atom: useSetAtom(loadSpecAtom)(id) */
  loadSpecAtom: ReturnType<typeof atom<null, [string], Promise<void>>>;
  /** Trigger a save of the current specAtom value  write atom: useSetAtom(saveSpecAtom)() */
  saveSpecAtom: ReturnType<typeof atom<null, [], Promise<void>>>;
}

/**
 * Creates Jotai atoms wired to a SchemaStore.
 *
 * Autosave debounce is intentionally left to the consumer  compose with
 * your own debounced write atom (see waypoint/archived/workflow-builder-template
 * for the 1-second debounce + immediate-save-on-structural-change pattern).
 */
export function createSchemaAtoms(store: SchemaStore): SchemaAtoms {
  const recordAtom = atom<SchemaRecord | null>(null);
  const specAtom = atom<unknown | null>(null);
  const hasUnsavedChangesAtom = atom<boolean>(false);

  const loadSpecAtom = atom(null, async (_get, set, id: string) => {
    const record = await store.load(id);
    set(recordAtom, record);
    set(specAtom, record?.spec ?? null);
    set(hasUnsavedChangesAtom, false);
  });

  const saveSpecAtom = atom(null, async (get, set) => {
    const spec = get(specAtom);
    const record = get(recordAtom);
    if (!spec || !record) return;

    const updated = await store.save({
      ...record,
      spec,
      updatedAt: undefined as unknown as string, // DB sets this
    } as Omit<SchemaRecord, "id" | "createdAt" | "updatedAt">);

    set(recordAtom, updated);
    set(hasUnsavedChangesAtom, false);
  });

  return { specAtom, recordAtom, hasUnsavedChangesAtom, loadSpecAtom, saveSpecAtom };
}
