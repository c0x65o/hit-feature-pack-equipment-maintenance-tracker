/**
 * @hit/feature-pack-equipment-maintenance-tracker
 *
 * Industrial equipment maintenance tracking feature pack with pump lifecycle management,
 * status transitions, field data collection, and analytics.
 *
 * Components are exported individually for optimal tree-shaking.
 * When used with the route loader system, only the requested component is bundled.
 */
// Pages - exported individually for tree-shaking
export { Dashboard, DashboardPage, PumpDetail, PumpDetailPage, PumpAnalytics, PumpAnalyticsPage, PlantAnalytics, PlantAnalyticsPage, Inventory, InventoryPage, Settings, SettingsPage, } from './pages/index';
// Components - exported individually for tree-shaking
export * from './components/index';
// Schema exports - for projects to import into their schema
export { equipmentPlants, equipmentLocations, equipmentEquipment, equipmentPumps, equipmentActivityLog, equipmentDiagnosticFindings, equipmentCorrectiveActions, equipmentMeasurementFields, equipmentRebuildMeasurements, pumpStatuses, assemblyStatuses, } from './schema/equipment';
