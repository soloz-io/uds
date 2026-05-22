/**
 * Drizzle ORM adapter for design-schema.
 *
 * Provides helper types and column definitions for storing SchemaRecord
 * in a PostgreSQL database via Drizzle ORM.
 *
 * Pattern from waypoint/archived/workflow-builder-template/lib/db/schema.ts
 *
 * Usage:
 * ```ts
 * import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
 * import { schemaSpecColumn } from 'design-schema/adapters/drizzle';
 *
 * export const uiSpecs = pgTable('ui_specs', {
 *   id: text('id').primaryKey(),
 *   ownerId: text('owner_id').notNull(),
 *   label: text('label'),
 *   preset: text('preset'),
 *   schemaVersion: text('schema_version').notNull(),
 *   spec: schemaSpecColumn('spec').notNull(),
 *   createdAt: timestamp('created_at').defaultNow().notNull(),
 *   updatedAt: timestamp('updated_at').defaultNow().notNull(),
 * });
 * ```
 *
 * Peer dependency: drizzle-orm >=0.30
 */

import { customType } from "drizzle-orm/pg-core";
import type { SchemaRecord } from "../../store/types.js";

/**
 * Typed JSONB column for storing design-schema specs.
 * The column stores the raw spec object (the value of SchemaRecord.spec).
 */
export const schemaSpecColumn = customType<{ data: SchemaRecord["spec"]; driverData: string }>({
  dataType() {
    return "jsonb";
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value;
  },
});

/**
 * Full SchemaRecord JSONB column — stores the entire record as a single jsonb blob.
 * Simpler alternative if you don't need individual columns for filtering.
 */
export const schemaRecordColumn = customType<{ data: SchemaRecord; driverData: string }>({
  dataType() {
    return "jsonb";
  },
  toDriver(value) {
    return JSON.stringify(value);
  },
  fromDriver(value) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value as SchemaRecord;
  },
});
