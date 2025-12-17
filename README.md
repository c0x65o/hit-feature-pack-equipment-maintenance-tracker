# @hit/feature-pack-equipment-maintenance-tracker

Industrial equipment maintenance tracking feature pack with pump lifecycle management, status transitions, field data collection, and analytics.

## Features

- **Equipment Tracking**: Track pumps and rotating assemblies through their complete lifecycle
- **Status Workflow**: Linear status transitions with role-based permissions
- **Field Data Collection**: Record vibration, temperature, and other measurements
- **Activity Logging**: Comprehensive audit trail for all equipment actions
- **Analytics**: Pump-specific and plant-wide analytics dashboards
- **Inventory Management**: Track equipment in inventory and dispatch workflows
- **Role-Based Access**: Support for basic (admin/user) or extended roles (Supervisor, Mechanic, Vibration Technician, etc.)

## Installation

```bash
npm install @hit/feature-pack-equipment-maintenance-tracker
```

## Usage

Add to your `hit.yaml`:

```yaml
feature_packs:
  - name: equipment-maintenance-tracker
    version: "1.0.0"
    options:
      support_additional_roles: false  # Set to true for extended role support
```

### Configuration

- `support_additional_roles` (boolean, default: false)
  - **false**: Only `admin` and `user` roles supported
  - **true**: Extended roles: `Admin`, `Supervisor`, `Mechanic`, `Vibration Technician`, `Inventory Manager`, `Pump Technician`

### Status Workflow

Equipment follows a linear workflow:
- `In Inventory` → `Awaiting Install` → `In Service` → `Awaiting Wet End Removal` → `Awaiting Rebuild` → `Awaiting Wet End Install` → `In Inventory`

### Role Permissions (when `support_additional_roles: true`)

- **Admin**: Full access to all features
- **Supervisor**: View analytics, manage inventory dispatch, change status, enter field data
- **Mechanic**: Change status, enter field data
- **Vibration Technician**: Enter field data (can enter without status change when pump is "In Service")
- **Inventory Manager**: Dispatch from inventory, view inventory
- **Pump Technician**: Complete rebuilds

### Role Permissions (when `support_additional_roles: false`)

- **admin**: Full access
- **user**: View pumps, enter field data, change status (simplified workflow)

## API Routes

- `/api/equipment-maintenance-tracker/pumps` - List/create pumps
- `/api/equipment-maintenance-tracker/pumps/[id]` - Get/update/delete pump
- `/api/equipment-maintenance-tracker/pumps/[id]/status` - Update pump status
- `/api/equipment-maintenance-tracker/pumps/[id]/field-data` - Enter field data
- `/api/equipment-maintenance-tracker/pumps/[id]/analytics` - Get pump analytics
- `/api/equipment-maintenance-tracker/plants` - Manage plants
- `/api/equipment-maintenance-tracker/locations` - Manage locations
- `/api/equipment-maintenance-tracker/equipment` - Manage equipment
- `/api/equipment-maintenance-tracker/activity-logs` - View activity logs
- `/api/equipment-maintenance-tracker/analytics/plant` - Plant-wide analytics

## Development

```bash
npm install
npm run dev  # Watch mode
npm run build  # Build for production
```

## License

MIT

