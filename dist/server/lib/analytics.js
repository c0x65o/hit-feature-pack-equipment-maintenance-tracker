export function calculatePumpAnalytics(logs) {
    const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const removalCount = sortedLogs.filter(log => log.newStatus === "Awaiting Wet End Removal").length;
    const runtimeStats = calculateRuntimeStats(sortedLogs);
    const rebuildStats = calculateRebuildStats(sortedLogs);
    const timeInStatus = calculateTimeInStatus(sortedLogs);
    const diagnosticFindings = extractDiagnosticFindings(sortedLogs);
    const correctiveActions = calculateCorrectiveActionsEffectiveness(sortedLogs);
    const vibrationTrends = extractVibrationTrends(sortedLogs);
    const mtbf = calculateMTBF(sortedLogs);
    const riskIndex = calculateRiskIndex(sortedLogs, vibrationTrends, mtbf);
    const vibrationHealth = calculateVibrationHealth(vibrationTrends);
    const rebuildQuality = calculateRebuildQuality(sortedLogs);
    const failurePrediction = calculateFailurePrediction(sortedLogs, runtimeStats, mtbf);
    return {
        removalCount,
        runtimeStats,
        rebuildStats,
        timeInStatus,
        diagnosticFindings,
        correctiveActions,
        vibrationTrends,
        mtbf,
        riskIndex,
        vibrationHealth,
        rebuildQuality,
        failurePrediction,
    };
}
export function calculatePlantAnalytics(pumps, allLogs) {
    const fleetHealth = calculateFleetHealth(pumps, allLogs);
    const problemAreas = calculateProblemAreas(pumps, allLogs);
    const workforcePerformance = calculateWorkforcePerformance(allLogs);
    const maintenanceIntelligence = calculateMaintenanceIntelligence(pumps, allLogs);
    const predictive = calculatePredictive(pumps, allLogs);
    return {
        fleetHealth,
        problemAreas,
        workforcePerformance,
        maintenanceIntelligence,
        predictive,
    };
}
// Helper functions (same as original, adapted for EquipmentActivityLog type)
function calculateRuntimeStats(logs) {
    const runtimes = [];
    let currentRuntimeStart = null;
    let currentEquipment;
    let currentLocation;
    for (const log of logs) {
        if (log.newStatus === "Awaiting Install" && log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "dispatch") {
                    currentEquipment = parsed.data?.equipmentName;
                    currentLocation = parsed.data?.location;
                }
            }
            catch { }
        }
        if (log.newStatus === "In Service") {
            currentRuntimeStart = new Date(log.timestamp);
        }
        if (log.newStatus === "Awaiting Wet End Removal" && currentRuntimeStart) {
            const endDate = new Date(log.timestamp);
            const days = (endDate.getTime() - currentRuntimeStart.getTime()) / (1000 * 60 * 60 * 24);
            runtimes.push({
                startDate: currentRuntimeStart.toISOString(),
                endDate: endDate.toISOString(),
                days: Math.round(days * 10) / 10,
                equipmentName: currentEquipment,
                location: currentLocation,
            });
            currentRuntimeStart = null;
        }
    }
    let currentRuntime = null;
    if (currentRuntimeStart) {
        const now = new Date();
        currentRuntime = Math.round(((now.getTime() - currentRuntimeStart.getTime()) / (1000 * 60 * 60 * 24)) * 10) / 10;
    }
    const completedRuntimes = runtimes.map(r => r.days);
    const average = completedRuntimes.length > 0
        ? Math.round((completedRuntimes.reduce((sum, d) => sum + d, 0) / completedRuntimes.length) * 10) / 10
        : 0;
    const longest = completedRuntimes.length > 0 ? Math.max(...completedRuntimes) : 0;
    const shortest = completedRuntimes.length > 0 ? Math.min(...completedRuntimes) : 0;
    return {
        average,
        longest,
        shortest,
        current: currentRuntime,
        history: runtimes,
    };
}
function calculateRebuildStats(logs) {
    const rebuilds = [];
    let currentRebuildStart = null;
    let currentTechnician;
    for (const log of logs) {
        if (log.newStatus === "Awaiting Rebuild") {
            currentRebuildStart = new Date(log.timestamp);
        }
        if (log.newStatus === "Awaiting Wet End Install" && currentRebuildStart) {
            if (log.notes) {
                try {
                    const parsed = JSON.parse(log.notes);
                    if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                        currentTechnician = parsed.data?.technician?.name;
                    }
                }
                catch { }
            }
            const endDate = new Date(log.timestamp);
            const days = (endDate.getTime() - currentRebuildStart.getTime()) / (1000 * 60 * 60 * 24);
            rebuilds.push({
                startDate: currentRebuildStart.toISOString(),
                endDate: endDate.toISOString(),
                days: Math.round(days * 10) / 10,
                technician: currentTechnician,
            });
            currentRebuildStart = null;
            currentTechnician = undefined;
        }
    }
    let currentRebuild = null;
    if (currentRebuildStart) {
        const now = new Date();
        currentRebuild = Math.round(((now.getTime() - currentRebuildStart.getTime()) / (1000 * 60 * 60 * 24)) * 10) / 10;
    }
    const completedRebuilds = rebuilds.map(r => r.days);
    const average = completedRebuilds.length > 0
        ? Math.round((completedRebuilds.reduce((sum, d) => sum + d, 0) / completedRebuilds.length) * 10) / 10
        : 0;
    const longest = completedRebuilds.length > 0 ? Math.max(...completedRebuilds) : 0;
    const shortest = completedRebuilds.length > 0 ? Math.min(...completedRebuilds) : 0;
    return {
        average,
        longest,
        shortest,
        current: currentRebuild,
        history: rebuilds,
    };
}
function calculateTimeInStatus(logs) {
    const statusDurations = {};
    let currentStatus = null;
    let currentStatusStart = null;
    for (const log of logs) {
        if (log.newStatus) {
            if (currentStatus && currentStatusStart) {
                const duration = (new Date(log.timestamp).getTime() - currentStatusStart.getTime()) / (1000 * 60 * 60 * 24);
                if (!statusDurations[currentStatus]) {
                    statusDurations[currentStatus] = { total: 0, count: 0 };
                }
                statusDurations[currentStatus].total += duration;
                statusDurations[currentStatus].count += 1;
            }
            currentStatus = log.newStatus;
            currentStatusStart = new Date(log.timestamp);
        }
    }
    return Object.entries(statusDurations).map(([status, data]) => ({
        status,
        averageDays: Math.round((data.total / data.count) * 10) / 10,
        totalOccurrences: data.count,
    }));
}
function extractDiagnosticFindings(logs) {
    const findingCounts = {};
    for (const log of logs) {
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const findings = parsed.data?.diagnosticFindings || [];
                    for (const finding of findings) {
                        const text = finding.text || finding;
                        findingCounts[text] = (findingCounts[text] || 0) + 1;
                    }
                }
            }
            catch { }
        }
    }
    return Object.entries(findingCounts)
        .map(([finding, count]) => ({ finding, count }))
        .sort((a, b) => b.count - a.count);
}
function calculateCorrectiveActionsEffectiveness(logs) {
    const actionStats = {};
    const rebuildTimestamps = new Map();
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const actions = parsed.data?.correctiveActions || [];
                    for (const action of actions) {
                        const text = action.text || action;
                        if (!actionStats[text]) {
                            actionStats[text] = { count: 0, runtimes: [] };
                        }
                        actionStats[text].count += 1;
                    }
                    rebuildTimestamps.set(log.id, new Date(log.timestamp));
                }
            }
            catch { }
        }
    }
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (rebuildTimestamps.has(log.id)) {
            let serviceStart = null;
            for (let j = i + 1; j < logs.length; j++) {
                if (logs[j].newStatus === "In Service") {
                    serviceStart = new Date(logs[j].timestamp);
                    break;
                }
            }
            if (serviceStart) {
                for (let j = i + 1; j < logs.length; j++) {
                    if (logs[j].newStatus === "Awaiting Wet End Removal") {
                        const serviceEnd = new Date(logs[j].timestamp);
                        const runtime = (serviceEnd.getTime() - serviceStart.getTime()) / (1000 * 60 * 60 * 24);
                        if (log.notes) {
                            try {
                                const parsed = JSON.parse(log.notes);
                                const actions = parsed.data?.correctiveActions || [];
                                for (const action of actions) {
                                    const text = action.text || action;
                                    if (actionStats[text]) {
                                        actionStats[text].runtimes.push(runtime);
                                    }
                                }
                            }
                            catch { }
                        }
                        break;
                    }
                }
            }
        }
    }
    return Object.entries(actionStats)
        .map(([action, data]) => ({
        action,
        count: data.count,
        averageRuntimeAfter: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
    }))
        .sort((a, b) => b.count - a.count);
}
function extractVibrationTrends(logs) {
    const trends = [];
    for (const log of logs) {
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "field_data") {
                    const vibration = parseFloat(parsed.vibration);
                    const temperature = parseFloat(parsed.temperature);
                    if (!isNaN(vibration) && !isNaN(temperature)) {
                        trends.push({
                            date: new Date(log.timestamp).toISOString(),
                            vibration,
                            temperature,
                        });
                    }
                }
            }
            catch { }
        }
    }
    return trends;
}
function calculateMTBF(logs) {
    const failures = [];
    for (const log of logs) {
        if (log.newStatus === "Awaiting Wet End Removal") {
            failures.push(new Date(log.timestamp));
        }
    }
    const timeBetweenFailures = [];
    for (let i = 1; i < failures.length; i++) {
        const days = (failures[i].getTime() - failures[i - 1].getTime()) / (1000 * 60 * 60 * 24);
        timeBetweenFailures.push(days);
    }
    const current = timeBetweenFailures.length > 0
        ? Math.round((timeBetweenFailures.reduce((sum, d) => sum + d, 0) / timeBetweenFailures.length) * 10) / 10
        : 0;
    return {
        current,
        history: timeBetweenFailures.map(d => Math.round(d * 10) / 10),
    };
}
function calculateRiskIndex(logs, vibrationTrends, mtbf) {
    let vibrationTrend = 0;
    let failureFrequency = 0;
    let currentRuntime = 0;
    let rebuildQuality = 0;
    if (vibrationTrends.length >= 3) {
        const recent = vibrationTrends.slice(-3).map(t => t.vibration);
        const older = vibrationTrends.slice(-6, -3).map(t => t.vibration);
        if (older.length > 0) {
            const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
            const olderAvg = older.reduce((sum, v) => sum + v, 0) / older.length;
            const increase = ((recentAvg - olderAvg) / olderAvg) * 100;
            vibrationTrend = Math.min(100, Math.max(0, increase * 2));
        }
    }
    if (mtbf.current > 0) {
        const baselineMTBF = 120;
        failureFrequency = Math.min(100, Math.max(0, ((baselineMTBF - mtbf.current) / baselineMTBF) * 100));
    }
    const runtimeStats = calculateRuntimeStats(logs);
    if (runtimeStats.current && runtimeStats.average > 0) {
        const ratio = runtimeStats.current / runtimeStats.average;
        currentRuntime = Math.min(100, Math.max(0, (ratio - 0.5) * 100));
    }
    const rebuildStats = calculateRebuildStats(logs);
    if (rebuildStats.history.length > 0) {
        const lastRebuild = rebuildStats.history[rebuildStats.history.length - 1];
        const avgRebuild = rebuildStats.average;
        if (avgRebuild > 0) {
            rebuildQuality = Math.min(100, Math.max(0, ((avgRebuild - lastRebuild.days) / avgRebuild) * 50));
        }
    }
    const score = Math.round((vibrationTrend * 0.3) +
        (failureFrequency * 0.3) +
        (currentRuntime * 0.25) +
        (rebuildQuality * 0.15));
    return {
        score,
        factors: {
            vibrationTrend: Math.round(vibrationTrend),
            failureFrequency: Math.round(failureFrequency),
            currentRuntime: Math.round(currentRuntime),
            rebuildQuality: Math.round(rebuildQuality),
        },
    };
}
function calculateVibrationHealth(vibrationTrends) {
    if (vibrationTrends.length === 0) {
        return {
            status: "healthy",
            currentVibration: null,
            baselineVibration: 0,
            trend: "stable",
        };
    }
    const current = vibrationTrends[vibrationTrends.length - 1].vibration;
    const baseline = vibrationTrends.map(t => t.vibration).reduce((sum, v) => sum + v, 0) / vibrationTrends.length;
    let status = "healthy";
    if (current > baseline * 1.5) {
        status = "critical";
    }
    else if (current > baseline * 1.2) {
        status = "warning";
    }
    let trend = "stable";
    if (vibrationTrends.length >= 3) {
        const recent = vibrationTrends.slice(-3).map(t => t.vibration);
        const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
        if (recentAvg > baseline * 1.1) {
            trend = "degrading";
        }
        else if (recentAvg < baseline * 0.9) {
            trend = "improving";
        }
    }
    return {
        status,
        currentVibration: Math.round(current * 1000) / 1000,
        baselineVibration: Math.round(baseline * 1000) / 1000,
        trend,
    };
}
function calculateRebuildQuality(logs) {
    const technicianStats = {};
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const technician = parsed.data?.technician?.name;
                    if (technician) {
                        if (!technicianStats[technician]) {
                            technicianStats[technician] = { count: 0, runtimes: [] };
                        }
                        technicianStats[technician].count += 1;
                        for (let j = i + 1; j < logs.length; j++) {
                            if (logs[j].newStatus === "In Service") {
                                const serviceStart = new Date(logs[j].timestamp);
                                for (let k = j + 1; k < logs.length; k++) {
                                    if (logs[k].newStatus === "Awaiting Wet End Removal") {
                                        const serviceEnd = new Date(logs[k].timestamp);
                                        const runtime = (serviceEnd.getTime() - serviceStart.getTime()) / (1000 * 60 * 60 * 24);
                                        technicianStats[technician].runtimes.push(runtime);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
            catch { }
        }
    }
    return Object.entries(technicianStats)
        .map(([technician, data]) => ({
        technician,
        rebuildCount: data.count,
        averageRuntimeAfter: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
    }))
        .sort((a, b) => b.rebuildCount - a.rebuildCount);
}
function calculateFailurePrediction(logs, runtimeStats, mtbf) {
    if (!runtimeStats.current || runtimeStats.average === 0) {
        return {
            predictedDaysRemaining: null,
            confidence: "low",
            recommendation: "No active runtime to predict from.",
        };
    }
    const currentRuntime = runtimeStats.current;
    const averageRuntime = runtimeStats.average;
    const predicted = Math.max(0, averageRuntime - currentRuntime);
    let confidence = "low";
    if (runtimeStats.history.length >= 5) {
        confidence = "high";
    }
    else if (runtimeStats.history.length >= 3) {
        confidence = "medium";
    }
    else if (runtimeStats.history.length >= 1) {
        confidence = "low";
    }
    let recommendation = "";
    if (predicted < 7) {
        recommendation = "Critical: Consider preventative maintenance immediately.";
    }
    else if (predicted < 14) {
        recommendation = "Warning: Schedule preventative maintenance within next 2 weeks.";
    }
    else if (predicted < 30) {
        recommendation = "Monitor closely. Consider scheduling maintenance in next month.";
    }
    else {
        recommendation = "Healthy operating window. Continue normal monitoring.";
    }
    return {
        predictedDaysRemaining: Math.round(predicted * 10) / 10,
        confidence,
        recommendation,
    };
}
// Plant analytics helper functions
function calculateFleetHealth(pumps, allLogs) {
    const totalPumps = pumps.filter(p => p.isActive).length;
    const statusCounts = new Map();
    for (const pump of pumps.filter(p => p.isActive)) {
        statusCounts.set(pump.status, (statusCounts.get(pump.status) || 0) + 1);
    }
    const pumpsByStatus = Array.from(statusCounts.entries())
        .map(([status, count]) => ({
        status,
        count,
        percentage: Math.round((count / totalPumps) * 100),
    }))
        .sort((a, b) => b.count - a.count);
    let criticalAlerts = 0;
    let warningAlerts = 0;
    let highRiskPumps = 0;
    const logsByPump = new Map();
    for (const log of allLogs) {
        if (!logsByPump.has(log.pumpId)) {
            logsByPump.set(log.pumpId, []);
        }
        logsByPump.get(log.pumpId).push(log);
    }
    for (const pump of pumps.filter(p => p.isActive && p.status === "In Service")) {
        const logs = logsByPump.get(pump.id) || [];
        const prediction = calculateSimplePrediction(logs);
        if (prediction.daysRemaining !== null) {
            if (prediction.daysRemaining < 7)
                criticalAlerts++;
            else if (prediction.daysRemaining < 14)
                warningAlerts++;
        }
        if (pump.riskScore > 70)
            highRiskPumps++;
    }
    const availableCount = pumps.filter(p => p.isActive && (p.status === "In Inventory" || p.status === "In Service")).length;
    const fleetAvailability = totalPumps > 0
        ? Math.round((availableCount / totalPumps) * 100)
        : 0;
    return {
        totalPumps,
        pumpsByStatus,
        criticalAlerts,
        warningAlerts,
        highRiskPumps,
        fleetAvailability,
    };
}
function calculateProblemAreas(pumps, allLogs) {
    const locationStats = new Map();
    const equipmentStats = new Map();
    const logsByPump = new Map();
    for (const log of allLogs) {
        if (!logsByPump.has(log.pumpId)) {
            logsByPump.set(log.pumpId, []);
        }
        logsByPump.get(log.pumpId).push(log);
    }
    for (const [pumpId, logs] of Array.from(logsByPump.entries())) {
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const pump = pumps.find(p => p.id === pumpId);
        let currentLocation = pump?.locationName || "Unknown";
        let currentEquipment = pump?.equipmentName || "Unknown";
        let currentEquipmentId = pump?.equipmentCustomId || "Unknown";
        let runtimeStart = null;
        for (const log of sortedLogs) {
            if (log.notes) {
                try {
                    const parsed = JSON.parse(log.notes);
                    if (parsed.type === "dispatch") {
                        currentLocation = parsed.data?.location || currentLocation;
                        currentEquipment = parsed.data?.equipmentName || currentEquipment;
                        currentEquipmentId = parsed.data?.equipmentId || currentEquipmentId;
                    }
                }
                catch { }
            }
            if (log.newStatus === "In Service") {
                runtimeStart = new Date(log.timestamp);
            }
            if (log.newStatus === "Awaiting Wet End Removal" && runtimeStart) {
                const runtime = (new Date(log.timestamp).getTime() - runtimeStart.getTime()) / (1000 * 60 * 60 * 24);
                const locStat = locationStats.get(currentLocation) || {
                    failureCount: 0,
                    runtimes: [],
                    pumpIds: new Set(),
                };
                locStat.failureCount++;
                locStat.runtimes.push(runtime);
                locStat.pumpIds.add(pumpId);
                locationStats.set(currentLocation, locStat);
                const eqKey = `${currentEquipment}|${currentLocation}`;
                const eqStat = equipmentStats.get(eqKey);
                if (eqStat) {
                    eqStat.failureCount++;
                    eqStat.runtimes.push(runtime);
                    eqStat.lastFailure = new Date(log.timestamp);
                }
                else {
                    equipmentStats.set(eqKey, {
                        equipmentName: currentEquipment,
                        equipmentId: currentEquipmentId,
                        location: currentLocation,
                        failureCount: 1,
                        runtimes: [runtime],
                        lastFailure: new Date(log.timestamp),
                    });
                }
                runtimeStart = null;
            }
        }
    }
    const problematicLocations = Array.from(locationStats.entries())
        .map(([location, data]) => ({
        location,
        failureCount: data.failureCount,
        averageRuntime: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
        totalPumpsUsed: data.pumpIds.size,
    }))
        .sort((a, b) => b.failureCount - a.failureCount)
        .slice(0, 10);
    const problematicEquipment = Array.from(equipmentStats.values())
        .map(data => ({
        equipmentName: data.equipmentName,
        equipmentId: data.equipmentId,
        location: data.location,
        failureCount: data.failureCount,
        averageRuntime: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
        lastFailure: data.lastFailure?.toISOString() || null,
    }))
        .sort((a, b) => b.failureCount - a.failureCount)
        .slice(0, 10);
    const pumpFailureCounts = new Map();
    for (const [pumpId, logs] of Array.from(logsByPump.entries())) {
        const failures = logs.filter(l => l.newStatus === "Awaiting Wet End Removal");
        if (failures.length === 0)
            continue;
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const runtimes = [];
        let runtimeStart = null;
        for (const log of sortedLogs) {
            if (log.newStatus === "In Service") {
                runtimeStart = new Date(log.timestamp);
            }
            if (log.newStatus === "Awaiting Wet End Removal" && runtimeStart) {
                const runtime = (new Date(log.timestamp).getTime() - runtimeStart.getTime()) / (1000 * 60 * 60 * 24);
                runtimes.push(runtime);
                runtimeStart = null;
            }
        }
        const failureDates = failures.map(f => new Date(f.timestamp));
        const timeBetween = [];
        for (let i = 1; i < failureDates.length; i++) {
            timeBetween.push((failureDates[i].getTime() - failureDates[i - 1].getTime()) / (1000 * 60 * 60 * 24));
        }
        const mtbf = timeBetween.length > 0
            ? timeBetween.reduce((sum, t) => sum + t, 0) / timeBetween.length
            : 0;
        pumpFailureCounts.set(pumpId, {
            failureCount: failures.length,
            runtimes,
            mtbf,
        });
    }
    const worstPerformingPumps = Array.from(pumpFailureCounts.entries())
        .map(([pumpId, data]) => {
        const pump = pumps.find(p => p.id === pumpId);
        return {
            pumpId,
            model: pump?.model || "Unknown",
            failureCount: data.failureCount,
            averageRuntime: data.runtimes.length > 0
                ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
                : 0,
            currentStatus: pump?.status || "Unknown",
            mtbf: Math.round(data.mtbf * 10) / 10,
        };
    })
        .sort((a, b) => b.failureCount - a.failureCount)
        .slice(0, 10);
    return {
        problematicLocations,
        problematicEquipment,
        worstPerformingPumps,
    };
}
function calculateWorkforcePerformance(allLogs) {
    const technicianStats = new Map();
    for (let i = 0; i < allLogs.length; i++) {
        const log = allLogs[i];
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const technician = parsed.data?.technician?.name;
                    if (!technician)
                        continue;
                    const stat = technicianStats.get(technician) || {
                        rebuildCount: 0,
                        runtimes: [],
                        rebuildTimes: [],
                    };
                    stat.rebuildCount++;
                    for (let j = i - 1; j >= 0; j--) {
                        if (allLogs[j].pumpId === log.pumpId && allLogs[j].newStatus === "Awaiting Rebuild") {
                            const rebuildTime = (new Date(log.timestamp).getTime() - new Date(allLogs[j].timestamp).getTime()) / (1000 * 60 * 60 * 24);
                            stat.rebuildTimes.push(rebuildTime);
                            break;
                        }
                    }
                    for (let j = i + 1; j < allLogs.length; j++) {
                        if (allLogs[j].pumpId !== log.pumpId)
                            continue;
                        if (allLogs[j].newStatus === "In Service") {
                            const serviceStart = new Date(allLogs[j].timestamp);
                            for (let k = j + 1; k < allLogs.length; k++) {
                                if (allLogs[k].pumpId === log.pumpId && allLogs[k].newStatus === "Awaiting Wet End Removal") {
                                    const serviceEnd = new Date(allLogs[k].timestamp);
                                    const runtime = (serviceEnd.getTime() - serviceStart.getTime()) / (1000 * 60 * 60 * 24);
                                    stat.runtimes.push(runtime);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    technicianStats.set(technician, stat);
                }
            }
            catch { }
        }
    }
    const technicianRankings = Array.from(technicianStats.entries())
        .map(([technician, data]) => ({
        technician,
        rebuildCount: data.rebuildCount,
        averageRuntimeAfter: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
        averageRebuildTime: data.rebuildTimes.length > 0
            ? Math.round((data.rebuildTimes.reduce((sum, t) => sum + t, 0) / data.rebuildTimes.length) * 10) / 10
            : 0,
        rank: 0,
    }))
        .sort((a, b) => b.averageRuntimeAfter - a.averageRuntimeAfter)
        .map((tech, index) => ({ ...tech, rank: index + 1 }));
    return { technicianRankings };
}
function calculateMaintenanceIntelligence(pumps, allLogs) {
    const findingCounts = new Map();
    let totalFindings = 0;
    for (const log of allLogs) {
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const findings = parsed.data?.diagnosticFindings || [];
                    for (const finding of findings) {
                        const text = finding.text || finding;
                        findingCounts.set(text, (findingCounts.get(text) || 0) + 1);
                        totalFindings++;
                    }
                }
            }
            catch { }
        }
    }
    const commonFindings = Array.from(findingCounts.entries())
        .map(([finding, count]) => ({
        finding,
        count,
        percentage: totalFindings > 0 ? Math.round((count / totalFindings) * 100) : 0,
    }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    const actionStats = new Map();
    for (let i = 0; i < allLogs.length; i++) {
        const log = allLogs[i];
        if (log.notes) {
            try {
                const parsed = JSON.parse(log.notes);
                if (parsed.type === "rebuild_complete" || parsed.type === "rebuild_draft") {
                    const actions = parsed.data?.correctiveActions || [];
                    for (const action of actions) {
                        const text = action.text || action;
                        const stat = actionStats.get(text) || { count: 0, runtimes: [] };
                        stat.count++;
                        for (let j = i + 1; j < allLogs.length; j++) {
                            if (allLogs[j].pumpId !== log.pumpId)
                                continue;
                            if (allLogs[j].newStatus === "In Service") {
                                const serviceStart = new Date(allLogs[j].timestamp);
                                for (let k = j + 1; k < allLogs.length; k++) {
                                    if (allLogs[k].pumpId === log.pumpId && allLogs[k].newStatus === "Awaiting Wet End Removal") {
                                        const runtime = (new Date(allLogs[k].timestamp).getTime() - serviceStart.getTime()) / (1000 * 60 * 60 * 24);
                                        stat.runtimes.push(runtime);
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        actionStats.set(text, stat);
                    }
                }
            }
            catch { }
        }
    }
    const effectiveActions = Array.from(actionStats.entries())
        .map(([action, data]) => ({
        action,
        count: data.count,
        averageRuntimeAfter: data.runtimes.length > 0
            ? Math.round((data.runtimes.reduce((sum, r) => sum + r, 0) / data.runtimes.length) * 10) / 10
            : 0,
    }))
        .sort((a, b) => b.averageRuntimeAfter - a.averageRuntimeAfter)
        .slice(0, 10);
    const totalPumps = pumps.filter(p => p.isActive).length;
    const totalInInventory = pumps.filter(p => p.isActive && p.status === "In Inventory").length;
    const inventoryDurations = [];
    const logsByPump = new Map();
    for (const log of allLogs) {
        if (!logsByPump.has(log.pumpId)) {
            logsByPump.set(log.pumpId, []);
        }
        logsByPump.get(log.pumpId).push(log);
    }
    for (const [pumpId, logs] of Array.from(logsByPump.entries())) {
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        let inventoryStart = null;
        for (const log of sortedLogs) {
            if (log.newStatus === "In Inventory") {
                inventoryStart = new Date(log.timestamp);
            }
            if (log.newStatus === "Awaiting Install" && inventoryStart) {
                const duration = (new Date(log.timestamp).getTime() - inventoryStart.getTime()) / (1000 * 60 * 60 * 24);
                inventoryDurations.push(duration);
                inventoryStart = null;
            }
        }
    }
    const avgDaysInInventory = inventoryDurations.length > 0
        ? Math.round((inventoryDurations.reduce((sum, d) => sum + d, 0) / inventoryDurations.length) * 10) / 10
        : 0;
    return {
        commonFindings,
        effectiveActions,
        inventoryHealth: {
            totalInInventory,
            totalPumps,
            inventoryPercentage: totalPumps > 0 ? Math.round((totalInInventory / totalPumps) * 100) : 0,
            avgDaysInInventory,
        },
    };
}
function calculatePredictive(pumps, allLogs) {
    const logsByPump = new Map();
    for (const log of allLogs) {
        if (!logsByPump.has(log.pumpId)) {
            logsByPump.set(log.pumpId, []);
        }
        logsByPump.get(log.pumpId).push(log);
    }
    const failuresNext30Days = [];
    const maintenanceSchedule = [];
    for (const pump of pumps.filter(p => p.isActive && p.status === "In Service")) {
        const logs = logsByPump.get(pump.id) || [];
        const prediction = calculateSimplePrediction(logs);
        if (prediction.daysRemaining !== null && prediction.daysRemaining <= 30) {
            failuresNext30Days.push({
                pumpId: pump.id,
                equipmentName: pump.equipmentName || "Unknown",
                location: pump.locationName || "Unknown",
                predictedDaysRemaining: prediction.daysRemaining,
                currentRuntime: prediction.currentRuntime,
                averageRuntime: prediction.averageRuntime,
            });
            let priority = "medium";
            let recommendedAction = "";
            if (prediction.daysRemaining < 7) {
                priority = "critical";
                recommendedAction = "Schedule immediate preventative maintenance";
            }
            else if (prediction.daysRemaining < 14) {
                priority = "high";
                recommendedAction = "Schedule maintenance within next 2 weeks";
            }
            else {
                priority = "medium";
                recommendedAction = "Monitor and plan maintenance in next month";
            }
            maintenanceSchedule.push({
                priority,
                pumpId: pump.id,
                equipmentName: pump.equipmentName || "Unknown",
                location: pump.locationName || "Unknown",
                recommendedAction,
                daysUntilAction: prediction.daysRemaining,
            });
        }
    }
    failuresNext30Days.sort((a, b) => a.predictedDaysRemaining - b.predictedDaysRemaining);
    maintenanceSchedule.sort((a, b) => a.daysUntilAction - b.daysUntilAction);
    return {
        failuresNext30Days,
        maintenanceSchedule,
    };
}
function calculateSimplePrediction(logs) {
    const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const runtimes = [];
    let currentRuntimeStart = null;
    for (const log of sortedLogs) {
        if (log.newStatus === "In Service") {
            currentRuntimeStart = new Date(log.timestamp);
        }
        if (log.newStatus === "Awaiting Wet End Removal" && currentRuntimeStart) {
            const runtime = (new Date(log.timestamp).getTime() - currentRuntimeStart.getTime()) / (1000 * 60 * 60 * 24);
            runtimes.push(runtime);
            currentRuntimeStart = null;
        }
    }
    const averageRuntime = runtimes.length > 0
        ? runtimes.reduce((sum, r) => sum + r, 0) / runtimes.length
        : 0;
    let currentRuntime = 0;
    if (currentRuntimeStart) {
        currentRuntime = (new Date().getTime() - currentRuntimeStart.getTime()) / (1000 * 60 * 60 * 24);
    }
    const daysRemaining = averageRuntime > 0 && currentRuntime > 0
        ? Math.max(0, averageRuntime - currentRuntime)
        : null;
    return {
        daysRemaining: daysRemaining !== null ? Math.round(daysRemaining * 10) / 10 : null,
        currentRuntime: Math.round(currentRuntime * 10) / 10,
        averageRuntime: Math.round(averageRuntime * 10) / 10,
    };
}
