// ============================================================================
// TransitPulse — Dashboard View
// js/views/dashboard.js
// ============================================================================

/**
 * Format a number in Indian numbering style (e.g. 1,23,456)
 * @param {number} num
 * @returns {string}
 */
function formatIndian(num) {
    if (num == null || isNaN(num)) return '0';
    const str = Math.abs(Math.round(num)).toString();
    if (str.length <= 3) return (num < 0 ? '-' : '') + str;
    let last3 = str.slice(-3);
    let remaining = str.slice(0, -3);
    // Insert commas every 2 digits in the remaining part
    remaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return (num < 0 ? '-' : '') + remaining + ',' + last3;
}

/**
 * Get a CSS class for occupancy percentage
 * @param {number} pct 0-100
 * @returns {string}
 */
function occupancyColor(pct) {
    if (pct >= 80) return 'occupancy-red';
    if (pct >= 50) return 'occupancy-amber';
    return 'occupancy-green';
}

/**
 * Get badge markup for a bus status
 * @param {string} status
 * @returns {string}
 */
function statusBadge(status) {
    const s = (status || '').toLowerCase();
    let cls = 'badge-running';
    if (s === 'delayed') cls = 'badge-delayed';
    else if (s === 'maintenance') cls = 'badge-maintenance';
    return `<span class="status-badge ${cls}">${status}</span>`;
}

/**
 * Build the trend arrow markup
 * @param {number} current
 * @param {number} previous
 * @returns {string}
 */
function trendArrow(current, previous) {
    if (current === previous) {
        return '<span class="trend-neutral">—</span>';
    }
    const diff = current - previous;
    const pct = previous !== 0 ? Math.abs((diff / previous) * 100).toFixed(1) : '∞';
    if (diff > 0) {
        return `<span class="trend-up"><i class="fas fa-arrow-up"></i> ${pct}%</span>`;
    }
    return `<span class="trend-down"><i class="fas fa-arrow-down"></i> ${pct}%</span>`;
}

// ============================================================================
// Render
// ============================================================================

/**
 * Renders the full Dashboard HTML.
 * Expects window.TransitData to be populated.
 * @returns {string} HTML string
 */
function renderDashboard() {
    const data = window.TransitData || {};

    // ---------- Stat values ----------
    const fleet = data.fleet || [];
    const totalBuses = fleet.length || 40;
    const activeBuses = fleet.filter(b => (b.status || '').toLowerCase() === 'running').length;
    const activePct = totalBuses ? Math.round((activeBuses / totalBuses) * 100) : 0;

    const passengersToday = data.passengersToday ?? 14892;
    const passengersYesterday = data.passengersYesterday ?? 13245;

    const onTimeRate = data.onTimeRate ?? 87;

    const revenueToday = data.revenueToday ?? 285400;
    const revenueYesterday = data.revenueYesterday ?? 271800;

    // ---------- Fleet table rows ----------
    const fleetRows = (fleet.length ? fleet : defaultFleet()).map(bus => {
        const occ = bus.occupancy ?? 0;
        return `
        <tr>
            <td class="cell-bus-no">${bus.busNumber || bus.id}</td>
            <td>${bus.route || '—'}</td>
            <td>${bus.driver || '—'}</td>
            <td>
                <div class="occupancy-bar-wrap">
                    <div class="occupancy-bar ${occupancyColor(occ)}" style="width:${occ}%"></div>
                    <span class="occupancy-label">${occ}%</span>
                </div>
            </td>
            <td>${statusBadge(bus.status || 'Running')}</td>
            <td>${bus.eta || '—'}</td>
        </tr>`;
    }).join('');

    // ---------- Circular progress for on‑time rate ----------
    const circleRadius = 36;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const circleOffset = circleCircumference - (onTimeRate / 100) * circleCircumference;

    return `
<!-- ===== Dashboard ===== -->
<section class="dashboard-view fade-in">

    <!-- ---- Top Stats Row ---- -->
    <div class="stats-grid">

        <!-- Active Buses -->
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-label">Active Buses</span>
                <span class="pulse-dot"></span>
            </div>
            <div class="stat-value">${activeBuses}<span class="stat-secondary"> / ${totalBuses}</span></div>
            <div class="stat-footer">${activePct}% of fleet active</div>
        </div>

        <!-- Total Passengers Today -->
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-label">Passengers Today</span>
                <i class="fas fa-users stat-icon"></i>
            </div>
            <div class="stat-value">${formatIndian(passengersToday)}</div>
            <div class="stat-footer">${trendArrow(passengersToday, passengersYesterday)} vs yesterday</div>
        </div>

        <!-- On-Time Rate -->
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-label">On-Time Rate</span>
                <i class="fas fa-clock stat-icon"></i>
            </div>
            <div class="stat-value stat-value-circle">
                <svg class="progress-ring" width="90" height="90" viewBox="0 0 90 90">
                    <circle class="progress-ring-bg" cx="45" cy="45" r="${circleRadius}" />
                    <circle class="progress-ring-fg" cx="45" cy="45" r="${circleRadius}"
                        stroke-dasharray="${circleCircumference}"
                        stroke-dashoffset="${circleOffset}" />
                    <text x="45" y="50" class="progress-ring-text">${onTimeRate}%</text>
                </svg>
            </div>
        </div>

        <!-- Revenue Today -->
        <div class="stat-card">
            <div class="stat-header">
                <span class="stat-label">Revenue Today</span>
                <i class="fas fa-indian-rupee-sign stat-icon"></i>
            </div>
            <div class="stat-value">₹${formatIndian(revenueToday)}</div>
            <div class="stat-footer">${trendArrow(revenueToday, revenueYesterday)} vs yesterday</div>
        </div>

    </div>

    <!-- ---- Live Fleet Overview ---- -->
    <div class="fleet-overview">

        <!-- Mini Map -->
        <div class="card map-card">
            <div class="card-header">
                <h3><i class="fas fa-map-location-dot"></i> Live Fleet Map</h3>
                <span class="live-indicator"><span class="pulse-dot"></span> Live</span>
            </div>
            <div id="dashboard-map" class="mini-map"></div>
        </div>

        <!-- Bus Status Table -->
        <div class="card table-card">
            <div class="card-header">
                <h3><i class="fas fa-bus"></i> Bus Status</h3>
                <span class="table-count">${fleet.length || defaultFleet().length} vehicles</span>
            </div>
            <div class="table-scroll">
                <table class="fleet-table">
                    <thead>
                        <tr>
                            <th>Bus #</th>
                            <th>Route</th>
                            <th>Driver</th>
                            <th>Occupancy</th>
                            <th>Status</th>
                            <th>ETA</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fleetRows}
                    </tbody>
                </table>
            </div>
        </div>

    </div>

    <!-- ---- Bottom Charts ---- -->
    <div class="charts-row">

        <!-- Passenger Flow Chart -->
        <div class="card chart-card">
            <div class="card-header">
                <h3><i class="fas fa-chart-area"></i> Passenger Flow (24h)</h3>
            </div>
            <div class="chart-wrap">
                <canvas id="passengerFlowChart"></canvas>
            </div>
        </div>

        <!-- Route Performance Chart -->
        <div class="card chart-card">
            <div class="card-header">
                <h3><i class="fas fa-chart-bar"></i> Route Performance</h3>
            </div>
            <div class="chart-wrap">
                <canvas id="routePerformanceChart"></canvas>
            </div>
        </div>

    </div>

</section>`;
}

// ============================================================================
// Default / fallback fleet data
// ============================================================================

function defaultFleet() {
    return [
        { id: 'KA-01-F-1234', busNumber: 'KA-01-F-1234', route: 'Route 500D', driver: 'Ramesh K.', occupancy: 72, status: 'Running', eta: '12 min', lat: 12.9716, lng: 77.5946 },
        { id: 'KA-01-F-5678', busNumber: 'KA-01-F-5678', route: 'Route 401C', driver: 'Suresh M.', occupancy: 45, status: 'Running', eta: '8 min', lat: 12.9352, lng: 77.6245 },
        { id: 'KA-01-F-9012', busNumber: 'KA-01-F-9012', route: 'Route 335A', driver: 'Venkat P.', occupancy: 91, status: 'Delayed', eta: '25 min', lat: 12.9550, lng: 77.5510 },
        { id: 'KA-01-F-3456', busNumber: 'KA-01-F-3456', route: 'Route 201E', driver: 'Anil R.', occupancy: 33, status: 'Running', eta: '5 min', lat: 12.9850, lng: 77.6050 },
        { id: 'KA-01-F-7890', busNumber: 'KA-01-F-7890', route: 'Route 600B', driver: 'Prakash S.', occupancy: 58, status: 'Running', eta: '18 min', lat: 12.9280, lng: 77.5800 },
        { id: 'KA-01-F-2345', busNumber: 'KA-01-F-2345', route: 'Route 142F', driver: 'Mohan D.', occupancy: 12, status: 'Maintenance', eta: '—', lat: 12.9720, lng: 77.6400 },
        { id: 'KA-01-F-6789', busNumber: 'KA-01-F-6789', route: 'Route 500D', driver: 'Kiran T.', occupancy: 85, status: 'Delayed', eta: '32 min', lat: 12.9610, lng: 77.5730 },
        { id: 'KA-01-F-1357', busNumber: 'KA-01-F-1357', route: 'Route 335A', driver: 'Ravi N.', occupancy: 67, status: 'Running', eta: '14 min', lat: 12.9430, lng: 77.6100 },
    ];
}

// ============================================================================
// Chart.js initialization
// ============================================================================

let passengerFlowChartInstance = null;
let routePerformanceChartInstance = null;

/**
 * Initialize (or re-initialize) the two dashboard Chart.js charts.
 * Call AFTER the dashboard HTML has been injected into the DOM.
 */
function initDashboardCharts() {
    const data = window.TransitData || {};

    // ---------- Color tokens (Figma Light Theme) ----------
    const BG       = '#FFFFFF';
    const TEXT     = '#0E1B30';
    const SUBTEXT  = '#6B7A8F';
    const GRID     = '#E2E8F0';
    const BLUE     = '#295CE8';
    const GREEN    = '#1A9E66';
    const AMBER    = '#E38C1F';

    // ---------- Shared scale options ----------
    const scaleDefaults = {
        ticks: { color: SUBTEXT, font: { size: 11, family: 'Inter' } },
        grid:  { color: GRID, drawBorder: false },
    };

    // ===== Passenger Flow (Area / Line) =====
    const flowCtx = document.getElementById('passengerFlowChart');
    if (flowCtx) {
        if (passengerFlowChartInstance) passengerFlowChartInstance.destroy();

        const hours = data.passengerFlowHours || [
            '12 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM','7 AM',
            '8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM','3 PM',
            '4 PM','5 PM','6 PM','7 PM','8 PM','9 PM','10 PM','11 PM'
        ];
        const counts = data.passengerFlowCounts || [
            120, 85, 42, 28, 35, 210, 780, 1420,
            1680, 1350, 980, 870, 920, 1050, 1180, 1290,
            1550, 1720, 1480, 1100, 760, 480, 310, 180
        ];

        passengerFlowChartInstance = new Chart(flowCtx, {
            type: 'line',
            data: {
                labels: hours,
                datasets: [{
                    label: 'Passengers',
                    data: counts,
                    borderColor: BLUE,
                    backgroundColor: hexToRgba(BLUE, 0.15),
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    pointBackgroundColor: BLUE,
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: TEXT,
                        bodyColor: TEXT,
                        borderColor: GRID,
                        borderWidth: 1,
                        callbacks: {
                            label: ctx => `${formatIndian(ctx.parsed.y)} passengers`
                        }
                    }
                },
                scales: {
                    x: { ...scaleDefaults },
                    y: {
                        ...scaleDefaults,
                        beginAtZero: true,
                        ticks: {
                            ...scaleDefaults.ticks,
                            callback: v => formatIndian(v)
                        }
                    }
                }
            }
        });
    }

    // ===== Route Performance (Bar) =====
    const perfCtx = document.getElementById('routePerformanceChart');
    if (perfCtx) {
        if (routePerformanceChartInstance) routePerformanceChartInstance.destroy();

        const routes = data.routePerformanceLabels || [
            'Route 500D', 'Route 401C', 'Route 335A',
            'Route 201E', 'Route 600B', 'Route 142F'
        ];
        const onTimePcts = data.routePerformanceData || [92, 88, 74, 95, 81, 68];

        // Color each bar: green ≥85, amber 70-84, red <70
        const barColors = onTimePcts.map(v => v >= 85 ? GREEN : v >= 70 ? AMBER : '#EF4444');

        routePerformanceChartInstance = new Chart(perfCtx, {
            type: 'bar',
            data: {
                labels: routes,
                datasets: [{
                    label: 'On-Time %',
                    data: onTimePcts,
                    backgroundColor: barColors,
                    borderRadius: 4,
                    maxBarThickness: 40,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: TEXT,
                        bodyColor: TEXT,
                        borderColor: GRID,
                        borderWidth: 1,
                        callbacks: {
                            label: ctx => `${ctx.parsed.x}% on-time`
                        }
                    }
                },
                scales: {
                    x: {
                        ...scaleDefaults,
                        min: 0,
                        max: 100,
                        ticks: { ...scaleDefaults.ticks, callback: v => v + '%' }
                    },
                    y: { ...scaleDefaults }
                }
            }
        });
    }
}

// ============================================================================
// Leaflet mini-map initialization
// ============================================================================

let dashboardMap = null;
let busMarkers = [];

/**
 * Initialize the Leaflet mini-map on the dashboard.
 * Call AFTER the dashboard HTML is in the DOM.
 */
function initDashboardMap() {
    const container = document.getElementById('dashboard-map');
    if (!container) return;

    const data = window.TransitData || {};
    const fleet = (data.buses && data.buses.length) ? data.buses : defaultFleet();

    // Center on Tier-3 Gorakhpur transit hub by default
    const centerLat = data.cityCenter ? data.cityCenter.lat : 26.7606;
    const centerLng = data.cityCenter ? data.cityCenter.lng : 83.3732;

    // Remove old map instance if re-rendering
    if (dashboardMap) {
        dashboardMap.remove();
        dashboardMap = null;
    }

    dashboardMap = L.map('dashboard-map', {
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: false,
    }).setView([centerLat, centerLng], 13);

    // CartoDB Voyager clean light tile layer matching Figma
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
    }).addTo(dashboardMap);

    // Zoom control bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(dashboardMap);

    // Bus icon
    const busIcon = L.divIcon({
        className: 'bus-map-icon',
        html: '<i class="fas fa-bus"></i>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    const delayedIcon = L.divIcon({
        className: 'bus-map-icon bus-map-icon-delayed',
        html: '<i class="fas fa-bus"></i>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    const maintenanceIcon = L.divIcon({
        className: 'bus-map-icon bus-map-icon-maintenance',
        html: '<i class="fas fa-bus"></i>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

    // Clear old markers
    busMarkers.forEach(m => m.remove());
    busMarkers = [];

    fleet.forEach(bus => {
        if (bus.lat == null || bus.lng == null) return;
        let icon = busIcon;
        const st = (bus.status || '').toLowerCase();
        if (st === 'delayed') icon = delayedIcon;
        else if (st === 'maintenance') icon = maintenanceIcon;

        const marker = L.marker([bus.lat, bus.lng], { icon })
            .addTo(dashboardMap)
            .bindPopup(`
                <div class="map-popup">
                    <strong>${bus.busNumber || bus.id}</strong><br>
                    ${bus.route || ''}<br>
                    Driver: ${bus.driver || '—'}<br>
                    Occupancy: ${bus.occupancy ?? 0}%<br>
                    Status: ${bus.status || '—'}
                </div>
            `);
        busMarkers.push(marker);
    });

    // Fit bounds if markers exist
    if (busMarkers.length) {
        const group = L.featureGroup(busMarkers);
        dashboardMap.fitBounds(group.getBounds().pad(0.15));
    }

    // Force re-render (Leaflet in hidden containers quirk)
    setTimeout(() => dashboardMap && dashboardMap.invalidateSize(), 250);
}

// ============================================================================
// Real-time data update
// ============================================================================

/**
 * Refresh the dashboard with latest data from window.TransitData.
 * Re-renders the HTML and reinitializes charts & map.
 */
function updateDashboardData() {
    const content = document.getElementById('content') || document.getElementById('viewContainer');
    if (!content) return;

    // Check if dashboard is currently active
    const dashSection = content.querySelector('.dashboard-view');
    if (!dashSection) return;

    // Re-render
    content.innerHTML = renderDashboard();
    initDashboardCharts();
    initDashboardMap();
}

// Attach to window
if (typeof window !== 'undefined') {
    window.renderDashboard = renderDashboard;
    window.initDashboardCharts = initDashboardCharts;
    window.initDashboardMap = initDashboardMap;
    window.updateDashboardData = updateDashboardData;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert hex color to rgba string
 * @param {string} hex
 * @param {number} alpha
 * @returns {string}
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
