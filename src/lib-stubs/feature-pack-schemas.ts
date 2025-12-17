/**
 * Stub for @/lib/feature-pack-schemas
 * 
 * This is a type-only stub for feature pack compilation.
 * At runtime, the consuming application provides the actual implementation
 * via the generated lib/feature-pack-schemas.ts file.
 */

// Re-export the actual schema from this feature pack
// The consuming app's feature-pack-schemas.ts will aggregate all feature pack schemas
export {
  equipmentPlants,
  equipmentLocations,
  equipmentEquipment,
  equipmentPumps,
  equipmentActivityLog,
  equipmentDiagnosticFindings,
  equipmentCorrectiveActions,
  equipmentMeasurementFields,
  equipmentRebuildMeasurements,
} from '../schema/equipment';

