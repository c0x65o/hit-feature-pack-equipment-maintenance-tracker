import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
export declare const pumpStatuses: readonly ["In Inventory", "Awaiting Install", "In Service", "Awaiting Wet End Removal", "Awaiting Rebuild", "Awaiting Wet End Install"];
export type PumpStatus = typeof pumpStatuses[number];
export declare const assemblyStatuses: readonly ["In Inventory", "Installed", "Awaiting Rebuild", "In Rebuild", "Decommissioned"];
export type AssemblyStatus = typeof assemblyStatuses[number];
export declare const equipmentPlants: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_plants";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        address: import("drizzle-orm/pg-core").PgColumn<{
            name: "address";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        city: import("drizzle-orm/pg-core").PgColumn<{
            name: "city";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        state: import("drizzle-orm/pg-core").PgColumn<{
            name: "state";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        zipCode: import("drizzle-orm/pg-core").PgColumn<{
            name: "zip_code";
            tableName: "equipment_plants";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        annualRevenue: import("drizzle-orm/pg-core").PgColumn<{
            name: "annual_revenue";
            tableName: "equipment_plants";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_plants";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentLocations: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_locations";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_locations";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        plantId: import("drizzle-orm/pg-core").PgColumn<{
            name: "plant_id";
            tableName: "equipment_locations";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "equipment_locations";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_locations";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentEquipment: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_equipment";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_equipment";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        locationId: import("drizzle-orm/pg-core").PgColumn<{
            name: "location_id";
            tableName: "equipment_equipment";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        equipmentId: import("drizzle-orm/pg-core").PgColumn<{
            name: "equipment_id";
            tableName: "equipment_equipment";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        name: import("drizzle-orm/pg-core").PgColumn<{
            name: "name";
            tableName: "equipment_equipment";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_equipment";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentPumps: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_pumps";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        pumpId: import("drizzle-orm/pg-core").PgColumn<{
            name: "pump_id";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        equipmentId: import("drizzle-orm/pg-core").PgColumn<{
            name: "equipment_id";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        model: import("drizzle-orm/pg-core").PgColumn<{
            name: "model";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        serialNumber: import("drizzle-orm/pg-core").PgColumn<{
            name: "serial_number";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "equipment_pumps";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        riskScore: import("drizzle-orm/pg-core").PgColumn<{
            name: "risk_score";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        currentRuntime: import("drizzle-orm/pg-core").PgColumn<{
            name: "current_runtime";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        runtime: import("drizzle-orm/pg-core").PgColumn<{
            name: "runtime";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        lastMaintenanceDate: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_maintenance_date";
            tableName: "equipment_pumps";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        totalRebuilds: import("drizzle-orm/pg-core").PgColumn<{
            name: "total_rebuilds";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        vibrationLevel: import("drizzle-orm/pg-core").PgColumn<{
            name: "vibration_level";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgReal";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        temperatureReading: import("drizzle-orm/pg-core").PgColumn<{
            name: "temperature_reading";
            tableName: "equipment_pumps";
            dataType: "number";
            columnType: "PgReal";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        schematicUrl: import("drizzle-orm/pg-core").PgColumn<{
            name: "schematic_url";
            tableName: "equipment_pumps";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_pumps";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "equipment_pumps";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentActivityLog: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_activity_log";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        pumpId: import("drizzle-orm/pg-core").PgColumn<{
            name: "pump_id";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userName: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_name";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        userRole: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_role";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        action: import("drizzle-orm/pg-core").PgColumn<{
            name: "action";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        oldStatus: import("drizzle-orm/pg-core").PgColumn<{
            name: "old_status";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        newStatus: import("drizzle-orm/pg-core").PgColumn<{
            name: "new_status";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        notes: import("drizzle-orm/pg-core").PgColumn<{
            name: "notes";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        details: import("drizzle-orm/pg-core").PgColumn<{
            name: "details";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        performedBy: import("drizzle-orm/pg-core").PgColumn<{
            name: "performed_by";
            tableName: "equipment_activity_log";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        timestamp: import("drizzle-orm/pg-core").PgColumn<{
            name: "timestamp";
            tableName: "equipment_activity_log";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentDiagnosticFindings: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_diagnostic_findings_options";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_diagnostic_findings_options";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        findingText: import("drizzle-orm/pg-core").PgColumn<{
            name: "finding_text";
            tableName: "equipment_diagnostic_findings_options";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "equipment_diagnostic_findings_options";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_diagnostic_findings_options";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentCorrectiveActions: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_corrective_actions_options";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_corrective_actions_options";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        actionText: import("drizzle-orm/pg-core").PgColumn<{
            name: "action_text";
            tableName: "equipment_corrective_actions_options";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "equipment_corrective_actions_options";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_corrective_actions_options";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentMeasurementFields: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_measurement_fields";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_measurement_fields";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        fieldName: import("drizzle-orm/pg-core").PgColumn<{
            name: "field_name";
            tableName: "equipment_measurement_fields";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        unit: import("drizzle-orm/pg-core").PgColumn<{
            name: "unit";
            tableName: "equipment_measurement_fields";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "equipment_measurement_fields";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_measurement_fields";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentRebuildMeasurements: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "equipment_rebuild_measurements";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "equipment_rebuild_measurements";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        measurementName: import("drizzle-orm/pg-core").PgColumn<{
            name: "measurement_name";
            tableName: "equipment_rebuild_measurements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        unit: import("drizzle-orm/pg-core").PgColumn<{
            name: "unit";
            tableName: "equipment_rebuild_measurements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        isActive: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_active";
            tableName: "equipment_rebuild_measurements";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "equipment_rebuild_measurements";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const equipmentPlantsRelations: import("drizzle-orm").Relations<"equipment_plants", {
    locations: import("drizzle-orm").Many<"equipment_locations">;
}>;
export declare const equipmentLocationsRelations: import("drizzle-orm").Relations<"equipment_locations", {
    plant: import("drizzle-orm").One<"equipment_plants", true>;
    equipment: import("drizzle-orm").Many<"equipment_equipment">;
}>;
export declare const equipmentEquipmentRelations: import("drizzle-orm").Relations<"equipment_equipment", {
    location: import("drizzle-orm").One<"equipment_locations", true>;
    pumps: import("drizzle-orm").Many<"equipment_pumps">;
}>;
export declare const equipmentPumpsRelations: import("drizzle-orm").Relations<"equipment_pumps", {
    equipment: import("drizzle-orm").One<"equipment_equipment", true>;
    activityLogs: import("drizzle-orm").Many<"equipment_activity_log">;
}>;
export declare const equipmentActivityLogRelations: import("drizzle-orm").Relations<"equipment_activity_log", {
    pump: import("drizzle-orm").One<"equipment_pumps", true>;
}>;
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
//# sourceMappingURL=equipment.d.ts.map