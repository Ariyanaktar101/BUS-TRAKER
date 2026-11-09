/**
 * TransitPulse — Passenger Analytics & City Transit Intelligence
 * Tier-3 City Route Utilization, Peak Demand & Emissions Analytics
 */

(function () {
    let trendChartInstance = null;
    let revenueChartInstance = null;
    let routeOccupancyChartInstance = null;
    let peakHoursChartInstance = null;

    function renderAnalytics() {
        const data = window.TransitData || { systemKPIs: {}, routes: [], hourlyPassengerFlow: [], last7DaysStats: [] };
        const kpi = data.systemKPIs || {};

        return `
        <div class="view-header">
            <div>
                <h2>Passenger Analytics & City Transit Intelligence</h2>
                <p class="text-secondary">Urban mobility trends, passenger load factor predictions, and municipal revenue metrics.</p>
            </div>
            <div class="view-actions">
                <button class="btn btn-outline" onclick="window.exportAnalyticsCSV()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Municipal Report (CSV)
                </button>
            </div>
        </div>

        <!-- 4 Key Analytics KPI Cards -->
        <div class="analytics-kpi-grid">
            <div class="card stat-card">
                <div class="stat-top">
                    <span class="stat-title">Daily Passenger Footfall</span>
                    <span class="badge badge-running">+4.2%</span>
                </div>
                <div class="stat-value">46,820</div>
                <div class="stat-desc">Tier-3 Commuters recorded today across 15 routes</div>
            </div>

            <div class="card stat-card">
                <div class="stat-top">
                    <span class="stat-title">Overall Fleet On-Time Rate</span>
                    <span class="badge badge-running">91.4%</span>
                </div>
                <div class="stat-value text-green">91.4%</div>
                <div class="stat-desc">Avg delay: 3.2 mins at key railway crossings</div>
            </div>

            <div class="card stat-card">
                <div class="stat-top">
                    <span class="stat-title">Municipal Revenue Today</span>
                    <span class="badge badge-primary">₹7,02,300</span>
                </div>
                <div class="stat-value text-blue">₹7,02,300</div>
                <div class="stat-desc">Digital UPI + Cash Smart Conductor Tap collections</div>
            </div>

            <div class="card stat-card">
                <div class="stat-top">
                    <span class="stat-title">EV Clean Mobility Share</span>
                    <span class="badge badge-running">43.3% EV</span>
                </div>
                <div class="stat-value text-amber">342.6 Tons</div>
                <div class="stat-desc">Estimated CO₂ emissions mitigated this month</div>
            </div>
        </div>

        <!-- 2x2 Analytics Charts Grid -->
        <div class="analytics-charts-grid">
            <!-- Chart 1: Passenger Volume by Hour -->
            <div class="card chart-card">
                <div class="chart-header">
                    <div>
                        <h3>Hourly Passenger Demand & Rush Hours</h3>
                        <p class="text-secondary">Comparing total passenger ridership vs bus seat capacity</p>
                    </div>
                    <span class="badge badge-delayed">Peak: 18:00 (3,410 pax)</span>
                </div>
                <div class="chart-wrapper">
                    <canvas id="analyticsHourlyChart"></canvas>
                </div>
            </div>

            <!-- Chart 2: Daily Revenue Trends (Last 7 Days) -->
            <div class="card chart-card">
                <div class="chart-header">
                    <div>
                        <h3>Daily Fare Revenue (₹)</h3>
                        <p class="text-secondary">Weekly revenue trajectory and passenger ticket volumes</p>
                    </div>
                    <span class="badge badge-running">Weekly: ₹47.6L</span>
                </div>
                <div class="chart-wrapper">
                    <canvas id="analyticsRevenueChart"></canvas>
                </div>
            </div>

            <!-- Chart 3: Route Average Occupancy % -->
            <div class="card chart-card">
                <div class="chart-header">
                    <div>
                        <h3>Route Capacity & Load Factors (%)</h3>
                        <p class="text-secondary">Occupancy comparison to identify routes needing additional buses</p>
                    </div>
                </div>
                <div class="chart-wrapper">
                    <canvas id="analyticsOccupancyChart"></canvas>
                </div>
            </div>

            <!-- Chart 4: On-Time Performance Trend -->
            <div class="card chart-card">
                <div class="chart-header">
                    <div>
                        <h3>On-Time Punctuality Index</h3>
                        <p class="text-secondary">Daily reliability percentage across urban arterial corridors</p>
                    </div>
                </div>
                <div class="chart-wrapper">
                    <canvas id="analyticsPunctualityChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Bottleneck & Congestion Insights -->
        <div class="card mt-3">
            <div class="card-header">
                <h3>Tier-3 Congestion Bottlenecks & Smart Solutions</h3>
                <span class="badge badge-delayed">Live AI Prediction</span>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Bottleneck Location</th>
                            <th>Corridor Routes Impacted</th>
                            <th>Peak Delay Window</th>
                            <th>Current Severity</th>
                            <th>Recommended Fleet Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Golghar Clock Tower Intersection</strong></td>
                            <td>Routes 101, 103, 105, 112</td>
                            <td>08:30 - 10:15 & 17:30 - 19:45</td>
                            <td><span class="badge badge-delayed">High Congestion</span></td>
                            <td>Deploy 2 feeder shuttles via Town Hall Bypass</td>
                        </tr>
                        <tr>
                            <td><strong>Railway Station Level Crossing</strong></td>
                            <td>Routes 101, 102, 111, 115</td>
                            <td>Train arrival waves (12:00, 16:30)</td>
                            <td><span class="badge badge-maintenance">Medium Delay</span></td>
                            <td>Sync bus schedules with IRCTC express train arrivals</td>
                        </tr>
                        <tr>
                            <td><strong>Mohaddipur Four-Way Crossing</strong></td>
                            <td>Routes 101, 104, 107, 114</td>
                            <td>09:00 - 11:00</td>
                            <td><span class="badge badge-delayed">High Overcrowding</span></td>
                            <td>Increase Route 101 bus frequency from 8m to 5m</td>
                        </tr>
                        <tr>
                            <td><strong>GIDA Industrial Gate 2</strong></td>
                            <td>Routes 102, 107, 114</td>
                            <td>Shift change (07:30, 19:30)</td>
                            <td><span class="badge badge-delayed">Peak Standing Load</span></td>
                            <td>Add 56-seat JanBus high-capacity service</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }

    function initAnalyticsCharts() {
        const data = window.TransitData || { hourlyPassengerFlow: [], last7DaysStats: [], routes: [] };

        // 1. Hourly Chart
        const hourlyCtx = document.getElementById('analyticsHourlyChart');
        if (hourlyCtx) {
            if (trendChartInstance) trendChartInstance.destroy();
            const labels = data.hourlyPassengerFlow.map(h => h.hour);
            const paxData = data.hourlyPassengerFlow.map(h => h.passengers);
            const capData = data.hourlyPassengerFlow.map(h => h.capacity);

            trendChartInstance = new Chart(hourlyCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Passengers Onboard',
                            data: paxData,
                            borderColor: '#295CE8',
                            backgroundColor: 'rgba(41, 92, 232, 0.12)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 3
                        },
                        {
                            label: 'Standard Seating Capacity',
                            data: capData,
                            borderColor: '#EF4444',
                            borderDash: [6, 6],
                            pointRadius: 0,
                            fill: false,
                            borderWidth: 2
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#0E1B30', font: { weight: '600' } } }
                    },
                    scales: {
                        x: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } },
                        y: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } }
                    }
                }
            });
        }

        // 2. Revenue Chart
        const revCtx = document.getElementById('analyticsRevenueChart');
        if (revCtx) {
            if (revenueChartInstance) revenueChartInstance.destroy();
            const labels = data.last7DaysStats.map(d => `${d.day} (${d.date})`);
            const revData = data.last7DaysStats.map(d => d.revenue);

            revenueChartInstance = new Chart(revCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Revenue (₹)',
                        data: revData,
                        backgroundColor: '#1A9E66',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#0E1B30', font: { weight: '600' } } }
                    },
                    scales: {
                        x: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } },
                        y: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } }
                    }
                }
            });
        }

        // 3. Occupancy by Route Chart
        const occCtx = document.getElementById('analyticsOccupancyChart');
        if (occCtx) {
            if (routeOccupancyChartInstance) routeOccupancyChartInstance.destroy();
            const topRoutes = data.routes.slice(0, 8);
            const labels = topRoutes.map(r => `Route ${r.number}`);
            const values = [94, 88, 76, 82, 68, 74, 85, 62];

            routeOccupancyChartInstance = new Chart(occCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Avg Load Factor (%)',
                        data: values,
                        backgroundColor: values.map(v => v >= 85 ? '#E53E3E' : v >= 75 ? '#E38C1F' : '#295CE8'),
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#0E1B30', font: { weight: '600' } } }
                    },
                    scales: {
                        x: { max: 100, grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } },
                        y: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } }
                    }
                }
            });
        }

        // 4. On-Time Trend Chart
        const punctCtx = document.getElementById('analyticsPunctualityChart');
        if (punctCtx) {
            if (peakHoursChartInstance) peakHoursChartInstance.destroy();
            const labels = data.last7DaysStats.map(d => d.day);
            const onTime = data.last7DaysStats.map(d => d.onTimePct);

            peakHoursChartInstance = new Chart(punctCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Punctuality (%)',
                        data: onTime,
                        borderColor: '#295CE8',
                        backgroundColor: 'rgba(41, 92, 232, 0.12)',
                        fill: true,
                        tension: 0.3,
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#0E1B30', font: { weight: '600' } } }
                    },
                    scales: {
                        x: { grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } },
                        y: { min: 80, max: 100, grid: { color: '#E2E8F0' }, ticks: { color: '#6B7A8F' } }
                    }
                }
            });
        }
    }

    function exportAnalyticsCSV() {
        const data = window.TransitData;
        if (!data) return;

        let csv = 'Hour,Passengers,SeatingCapacity,CrowdRate\n';
        data.hourlyPassengerFlow.forEach(row => {
            csv += `${row.hour},${row.passengers},${row.capacity},${row.crowdRate}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `TransitPulse_Municipal_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    window.renderAnalytics = renderAnalytics;
    window.initAnalyticsCharts = initAnalyticsCharts;
    window.exportAnalyticsCSV = exportAnalyticsCSV;
})();
