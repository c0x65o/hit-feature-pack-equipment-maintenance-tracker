import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, serial, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

// Pump status enum
export const pumpStatuses = [
  "In Inventory",
  "Awaiting Install",
  "In Service",
  "Awaiting Wet End Removal",
  "Awaiting Rebuild",
  "Awaiting Wet End Install"
] as const;
export type PumpStatus = typeof pumpStatuses[number];

// Assembly status enum (for rotating assemblies admin system)
export const assemblyStatuses = [
  "In Inventory",
  "Installed",
  "Awaiting Rebuild",
  "In Rebuild",
  "Decommissioned"
] as const;
export type AssemblyStatus = typeof assemblyStatuses[number];

// ─────────────────────────────────────────────────────────────────────────────
// TABLES
// ─────────────────────────────────────────────────────────────────────────────

export const equipmentPlants = pgTable("equipment_plants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  annualRevenue: integer("annual_revenue").notNull().default(10000000),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("equipment_plants_name_idx").on(table.name),
}));

export const equipmentLocations = pgTable("equipment_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plantId: varchar("plant_id").notNull().references(() => equipmentPlants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  plantIdIdx: index("equipment_locations_plant_id_idx").on(table.plantId),
  nameIdx: index("equipment_locations_name_idx").on(table.name),
}));

export const equipmentEquipment = pgTable("equipment_equipment", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationId: varchar("location_id").notNull().references(() => equipmentLocations.id, { onDelete: "cascade" }),
  equipmentId: text("equipment_id").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  locationIdIdx: index("equipment_equipment_location_id_idx").on(table.locationId),
  equipmentIdIdx: index("equipment_equipment_equipment_id_idx").on(table.equipmentId),
}));

export const equipmentPumps = pgTable("equipment_pumps", {
  id: text("id").primaryKey(), // RA-001 format
  pumpId: text("pump_id"),
  equipmentId: varchar("equipment_id").notNull().references(() => equipmentEquipment.id, { onDelete: "cascade" }),
  model: text("model").notNull(),
  serialNumber: text("serial_number"),
  status: text("status").notNull().default("In Inventory"),
  isActive: boolean("is_active").notNull().default(true),
  riskScore: integer("risk_score").notNull().default(0),
  currentRuntime: integer("current_runtime").notNull().default(0),
  runtime: integer("runtime").notNull().default(0), // hours - kept for backward compatibility
  lastMaintenanceDate: timestamp("last_maintenance_date"),
  totalRebuilds: integer("total_rebuilds").notNull().default(0),
  vibrationLevel: real("vibration_level"), // in/s
  temperatureReading: real("temperature_reading"), // °F
  schematicUrl: text("schematic_url"), // Path to pump schematic diagram
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  equipmentIdIdx: index("equipment_pumps_equipment_id_idx").on(table.equipmentId),
  statusIdx: index("equipment_pumps_status_idx").on(table.status),
  isActiveIdx: index("equipment_pumps_is_active_idx").on(table.isActive),
  createdAtIdx: index("equipment_pumps_created_at_idx").on(table.createdAt),
}));

export const equipmentActivityLog = pgTable("equipment_activity_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pumpId: text("pump_id").notNull().references(() => equipmentPumps.id, { onDelete: "cascade" }),
  userId: varchar("user_id"), // References auth module user, not local users table
  userName: text("user_name").notNull(),
  userRole: text("user_role").notNull(),
  action: text("action").notNull(),
  oldStatus: text("old_status"),
  newStatus: text("new_status"),
  notes: text("notes"),
  details: text("details"),
  performedBy: text("performed_by"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
}, (table) => ({
  pumpIdIdx: index("equipment_activity_log_pump_id_idx").on(table.pumpId),
  userIdIdx: index("equipment_activity_log_user_id_idx").on(table.userId),
  timestampIdx: index("equipment_activity_log_timestamp_idx").on(table.timestamp),
}));

// Settings tables
export const equipmentDiagnosticFindings = pgTable("equipment_diagnostic_findings_options", {
  id: serial("id").primaryKey(),
  findingText: text("finding_text").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  findingTextIdx: index("equipment_diagnostic_findings_finding_text_idx").on(table.findingText),
}));

export const equipmentCorrectiveActions = pgTable("equipment_corrective_actions_options", {
  id: serial("id").primaryKey(),
  actionText: text("action_text").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  actionTextIdx: index("equipment_corrective_actions_action_text_idx").on(table.actionText),
}));

export const equipmentMeasurementFields = pgTable("equipment_measurement_fields", {
  id: serial("id").primaryKey(),
  fieldName: text("field_name").notNull().unique(),
  unit: text("unit"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  fieldNameIdx: index("equipment_measurement_fields_field_name_idx").on(table.fieldName),
}));

export const equipmentRebuildMeasurements = pgTable("equipment_rebuild_measurements", {
  id: serial("id").primaryKey(),
  measurementName: text("measurement_name").notNull().unique(),
  unit: text("unit"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  measurementNameIdx: index("equipment_rebuild_measurements_measurement_name_idx").on(table.measurementName),
}));

// ─────────────────────────────────────────────────────────────────────────────
// RELATIONS (optional)
// ─────────────────────────────────────────────────────────────────────────────

export const equipmentPlantsRelations = relations(equipmentPlants, ({ many }) => ({
  locations: many(equipmentLocations),
}));

export const equipmentLocationsRelations = relations(equipmentLocations, ({ one, many }) => ({
  plant: one(equipmentPlants, {
    fields: [equipmentLocations.plantId],
    references: [equipmentPlants.id],
  }),
  equipment: many(equipmentEquipment),
}));

export const equipmentEquipmentRelations = relations(equipmentEquipment, ({ one, many }) => ({
  location: one(equipmentLocations, {
    fields: [equipmentEquipment.locationId],
    references: [equipmentLocations.id],
  }),
  pumps: many(equipmentPumps),
}));

export const equipmentPumpsRelations = relations(equipmentPumps, ({ one, many }) => ({
  equipment: one(equipmentEquipment, {
    fields: [equipmentPumps.equipmentId],
    references: [equipmentEquipment.id],
  }),
  activityLogs: many(equipmentActivityLog),
}));

export const equipmentActivityLogRelations = relations(equipmentActivityLog, ({ one }) => ({
  pump: one(equipmentPumps, {
    fields: [equipmentActivityLog.pumpId],
    references: [equipmentPumps.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// TYPES - Export for use in handlers and components
// ─────────────────────────────────────────────────────────────────────────────

export type EquipmentPlant = InferSelectModel<typeof equipmentPlants>;
export type EquipmentLocation = InferSelectModel<typeof equipmentLocations>;
export type EquipmentEquipment = InferSelectModel<typeof equipmentEquipment>;
export type EquipmentPump = InferSelectModel<typeof equipmentPumps>;
export type EquipmentActivityLog = InferSelectModel<typeof equipmentActivityLog>;
export type EquipmentDiagnosticFinding = InferSelectModel<typeof equipmentDiagnosticFindings>;
export type EquipmentCorrectiveAction = InferSelectModel<typeof equipmentCorrectiveActions>;
export type EquipmentMeasurementField = InferSelectModel<typeof equipmentMeasurementFields>;
export type EquipmentRebuildMeasurement = InferSelectModel<typeof equipmentRebuildMeasurements>;

export type InsertEquipmentPlant = InferInsertModel<typeof equipmentPlants>;
export type InsertEquipmentLocation = InferInsertModel<typeof equipmentLocations>;
export type InsertEquipmentEquipment = InferInsertModel<typeof equipmentEquipment>;
export type InsertEquipmentPump = InferInsertModel<typeof equipmentPumps>;
export type InsertEquipmentActivityLog = InferInsertModel<typeof equipmentActivityLog>;
export type InsertEquipmentDiagnosticFinding = InferInsertModel<typeof equipmentDiagnosticFindings>;
export type InsertEquipmentCorrectiveAction = InferInsertModel<typeof equipmentCorrectiveActions>;
export type InsertEquipmentMeasurementField = InferInsertModel<typeof equipmentMeasurementFields>;
export type InsertEquipmentRebuildMeasurement = InferInsertModel<typeof equipmentRebuildMeasurements>;

