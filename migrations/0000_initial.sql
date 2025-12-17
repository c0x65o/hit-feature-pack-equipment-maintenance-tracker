-- Initial schema for equipment-maintenance-tracker feature pack
-- Creates all tables for tracking industrial equipment (pumps) through their lifecycle

-- Plants (manufacturing facilities)
CREATE TABLE IF NOT EXISTS equipment_plants (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  annual_revenue INTEGER NOT NULL DEFAULT 10000000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_plants_name_idx ON equipment_plants(name);

-- Locations (areas within plants)
CREATE TABLE IF NOT EXISTS equipment_locations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id VARCHAR NOT NULL REFERENCES equipment_plants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_locations_plant_id_idx ON equipment_locations(plant_id);
CREATE INDEX IF NOT EXISTS equipment_locations_name_idx ON equipment_locations(name);

-- Equipment (physical equipment at locations)
CREATE TABLE IF NOT EXISTS equipment_equipment (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id VARCHAR NOT NULL REFERENCES equipment_locations(id) ON DELETE CASCADE,
  equipment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_equipment_location_id_idx ON equipment_equipment(location_id);
CREATE INDEX IF NOT EXISTS equipment_equipment_equipment_id_idx ON equipment_equipment(equipment_id);

-- Pumps (rotating assemblies tracked through lifecycle)
CREATE TABLE IF NOT EXISTS equipment_pumps (
  id TEXT PRIMARY KEY, -- RA-001 format
  pump_id TEXT,
  equipment_id VARCHAR NOT NULL REFERENCES equipment_equipment(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  serial_number TEXT,
  status TEXT NOT NULL DEFAULT 'In Inventory',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  risk_score INTEGER NOT NULL DEFAULT 0,
  current_runtime INTEGER NOT NULL DEFAULT 0,
  runtime INTEGER NOT NULL DEFAULT 0, -- hours - kept for backward compatibility
  last_maintenance_date TIMESTAMP WITH TIME ZONE,
  total_rebuilds INTEGER NOT NULL DEFAULT 0,
  vibration_level REAL, -- in/s
  temperature_reading REAL, -- °F
  schematic_url TEXT, -- Path to pump schematic diagram
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_pumps_equipment_id_idx ON equipment_pumps(equipment_id);
CREATE INDEX IF NOT EXISTS equipment_pumps_status_idx ON equipment_pumps(status);
CREATE INDEX IF NOT EXISTS equipment_pumps_is_active_idx ON equipment_pumps(is_active);
CREATE INDEX IF NOT EXISTS equipment_pumps_created_at_idx ON equipment_pumps(created_at);

-- Activity Log (audit trail of all pump actions)
CREATE TABLE IF NOT EXISTS equipment_activity_log (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  pump_id TEXT NOT NULL REFERENCES equipment_pumps(id) ON DELETE CASCADE,
  user_id VARCHAR, -- References auth module user, not local users table
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  details TEXT,
  performed_by TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_activity_log_pump_id_idx ON equipment_activity_log(pump_id);
CREATE INDEX IF NOT EXISTS equipment_activity_log_user_id_idx ON equipment_activity_log(user_id);
CREATE INDEX IF NOT EXISTS equipment_activity_log_timestamp_idx ON equipment_activity_log(timestamp);

-- Settings: Diagnostic Findings Options
CREATE TABLE IF NOT EXISTS equipment_diagnostic_findings_options (
  id SERIAL PRIMARY KEY,
  finding_text TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_diagnostic_findings_finding_text_idx ON equipment_diagnostic_findings_options(finding_text);

-- Settings: Corrective Actions Options
CREATE TABLE IF NOT EXISTS equipment_corrective_actions_options (
  id SERIAL PRIMARY KEY,
  action_text TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_corrective_actions_action_text_idx ON equipment_corrective_actions_options(action_text);

-- Settings: Measurement Fields
CREATE TABLE IF NOT EXISTS equipment_measurement_fields (
  id SERIAL PRIMARY KEY,
  field_name TEXT NOT NULL UNIQUE,
  unit TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_measurement_fields_field_name_idx ON equipment_measurement_fields(field_name);

-- Settings: Rebuild Measurements
CREATE TABLE IF NOT EXISTS equipment_rebuild_measurements (
  id SERIAL PRIMARY KEY,
  measurement_name TEXT NOT NULL UNIQUE,
  unit TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS equipment_rebuild_measurements_measurement_name_idx ON equipment_rebuild_measurements(measurement_name);

