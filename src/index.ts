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
export {
  Dashboard,
  DashboardPage,
  PumpDetail,
  PumpDetailPage,
  PumpAnalytics,
  PumpAnalyticsPage,
  PlantAnalytics,
  PlantAnalyticsPage,
  Inventory,
  InventoryPage,
  Settings,
  SettingsPage,
} from './pages/index';

// Components - exported individually for tree-shaking
export * from './components/index';

// Schema exports - MOVED to @hit/feature-pack-equipment-maintenance-tracker/schema to avoid bundling drizzle-orm in client
// Don't import from schema file at all - it pulls in drizzle-orm

// Status constants - defined inline to avoid pulling in schema file
export const pumpStatuses = ['in_service', 'standby', 'out_of_service', 'in_rebuild', 'scrapped'] as const;
export const assemblyStatuses = ['in_service', 'standby', 'out_of_service', 'in_rebuild', 'scrapped'] as const;
export type PumpStatus = typeof pumpStatuses[number];
export type AssemblyStatus = typeof assemblyStatuses[number];

