import type { EquipmentActivityLog, EquipmentPump } from '../../schema/equipment';
export interface PumpAnalytics {
    removalCount: number;
    runtimeStats: {
        average: number;
        longest: number;
        shortest: number;
        current: number | null;
        history: Array<{
            startDate: string;
            endDate: string;
            days: number;
            equipmentName?: string;
            location?: string;
        }>;
    };
    rebuildStats: {
        average: number;
        longest: number;
        shortest: number;
        current: number | null;
        history: Array<{
            startDate: string;
            endDate: string;
            days: number;
            technician?: string;
        }>;
    };
    timeInStatus: Array<{
        status: string;
        averageDays: number;
        totalOccurrences: number;
    }>;
    diagnosticFindings: Array<{
        finding: string;
        count: number;
    }>;
    correctiveActions: Array<{
        action: string;
        count: number;
        averageRuntimeAfter: number;
    }>;
    vibrationTrends: Array<{
        date: string;
        vibration: number;
        temperature: number;
    }>;
    mtbf: {
        current: number;
        history: number[];
    };
    riskIndex: {
        score: number;
        factors: {
            vibrationTrend: number;
            failureFrequency: number;
            currentRuntime: number;
            rebuildQuality: number;
        };
    };
    vibrationHealth: {
        status: "healthy" | "warning" | "critical";
        currentVibration: number | null;
        baselineVibration: number;
        trend: "improving" | "stable" | "degrading";
    };
    rebuildQuality: Array<{
        technician: string;
        rebuildCount: number;
        averageRuntimeAfter: number;
    }>;
    failurePrediction: {
        predictedDaysRemaining: number | null;
        confidence: "high" | "medium" | "low";
        recommendation: string;
    };
}
export interface PlantAnalytics {
    fleetHealth: {
        totalPumps: number;
        pumpsByStatus: Array<{
            status: string;
            count: number;
            percentage: number;
        }>;
        criticalAlerts: number;
        warningAlerts: number;
        highRiskPumps: number;
        fleetAvailability: number;
    };
    problemAreas: {
        problematicLocations: Array<{
            location: string;
            failureCount: number;
            averageRuntime: number;
            totalPumpsUsed: number;
        }>;
        problematicEquipment: Array<{
            equipmentName: string;
            equipmentId: string;
            location: string;
            failureCount: number;
            averageRuntime: number;
            lastFailure: string | null;
        }>;
        worstPerformingPumps: Array<{
            pumpId: string;
            model: string;
            failureCount: number;
            averageRuntime: number;
            currentStatus: string;
            mtbf: number;
        }>;
    };
    workforcePerformance: {
        technicianRankings: Array<{
            technician: string;
            rebuildCount: number;
            averageRuntimeAfter: number;
            averageRebuildTime: number;
            rank: number;
        }>;
    };
    maintenanceIntelligence: {
        commonFindings: Array<{
            finding: string;
            count: number;
            percentage: number;
        }>;
        effectiveActions: Array<{
            action: string;
            count: number;
            averageRuntimeAfter: number;
        }>;
        inventoryHealth: {
            totalInInventory: number;
            totalPumps: number;
            inventoryPercentage: number;
            avgDaysInInventory: number;
        };
    };
    predictive: {
        failuresNext30Days: Array<{
            pumpId: string;
            equipmentName: string;
            location: string;
            predictedDaysRemaining: number;
            currentRuntime: number;
            averageRuntime: number;
        }>;
        maintenanceSchedule: Array<{
            priority: "critical" | "high" | "medium";
            pumpId: string;
            equipmentName: string;
            location: string;
            recommendedAction: string;
            daysUntilAction: number;
        }>;
    };
}
interface PumpWithDetails extends EquipmentPump {
    equipmentName?: string;
    equipmentCustomId?: string;
    locationName?: string;
}
export declare function calculatePumpAnalytics(logs: EquipmentActivityLog[]): PumpAnalytics;
export declare function calculatePlantAnalytics(pumps: PumpWithDetails[], allLogs: EquipmentActivityLog[]): PlantAnalytics;
export {};
//# sourceMappingURL=analytics.d.ts.map