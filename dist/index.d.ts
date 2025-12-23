/**
 * @hit/feature-pack-equipment-maintenance-tracker
 *
 * Industrial equipment maintenance tracking feature pack with pump lifecycle management,
 * status transitions, field data collection, and analytics.
 *
 * Components are exported individually for optimal tree-shaking.
 * When used with the route loader system, only the requested component is bundled.
 */
export { Dashboard, DashboardPage, PumpDetail, PumpDetailPage, PumpAnalytics, PumpAnalyticsPage, PlantAnalytics, PlantAnalyticsPage, Inventory, InventoryPage, Settings, SettingsPage, } from './pages/index';
export * from './components/index';
export declare const pumpStatuses: readonly ["in_service", "standby", "out_of_service", "in_rebuild", "scrapped"];
export declare const assemblyStatuses: readonly ["in_service", "standby", "out_of_service", "in_rebuild", "scrapped"];
export type PumpStatus = typeof pumpStatuses[number];
export type AssemblyStatus = typeof assemblyStatuses[number];
//# sourceMappingURL=index.d.ts.map