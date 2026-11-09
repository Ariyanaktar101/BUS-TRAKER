/**
 * TransitPulse — Routes Management & Explorer View
 * Tier-3 Urban Corridor Schedules & Stop Networks
 */

(function () {
    let selectedRouteId = 'R-101';
    let filterQuery = '';

    function renderRoutes() {
        const data = window.TransitData || { routes: [], buses: [] };
        const activeRoutes = data.routes.filter(r => {
            if (!filterQuery) return true;
            const q = filterQuery.toLowerCase();
            return r.name.toLowerCase().includes(q) || r.number.includes(q) || r.stops.some(s => s.toLowerCase().includes(q));
        });

        const currentRoute = data.routes.find(r => r.id === selectedRouteId) || data.routes[0];
        const assignedBuses = data.buses.filter(b => b.routeId === currentRoute.id);

        return `
        <div class="view-header">
            <div>
                <h2>City Transit Corridors & Routes</h2>
                <p class="text-secondary">Explore 15 Tier-3 arterial routes, scheduled frequencies, and live deployed fleet.</p>
            </div>
            <div class="view-actions">
                <div class="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="routeSearchInput" placeholder="Filter routes or stops..." value="${filterQuery}">
                </div>
                <button class="btn btn-primary" onclick="window.location.hash='#live-map'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>
                    View on Live Map
                </button>
            </div>
        </div>

        <div class="routes-layout-grid">
            <!-- Left: Routes List -->
            <div class="routes-master-column">
                <div class="card routes-card">
                    <div class="card-header">
                        <h3>Transit Corridors (${activeRoutes.length})</h3>
                        <span class="badge badge-primary">Active Loop</span>
                    </div>
                    <div class="routes-scroll-list" id="routesListContainer">
                        ${activeRoutes.map(r => `
                            <div class="route-item-card ${r.id === selectedRouteId ? 'active' : ''}" onclick="window.selectRoute('${r.id}')">
                                <div class="route-item-top">
                                    <div class="route-badge" style="background:${r.color || '#3B82F6'}">
                                        Route ${r.number}
                                    </div>
                                    <span class="badge ${r.status === 'Delayed' ? 'badge-delayed' : 'badge-running'}">${r.status}</span>
                                </div>
                                <h4 class="route-name">${r.name}</h4>
                                <div class="route-meta-row">
                                    <span>📍 ${r.stops.length} Stops</span>
                                    <span>⏱️ ${r.duration}</span>
                                    <span>🚌 ${r.activeBusesCount} Deployed</span>
                                    <span>💰 ${r.fare}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Right: Route Detail Inspection -->
            <div class="routes-detail-column">
                <div class="card route-detail-card">
                    <div class="route-detail-header" style="border-left: 6px solid ${currentRoute.color || '#3B82F6'}">
                        <div>
                            <span class="sub-label">Corridor Route ${currentRoute.number}</span>
                            <h3>${currentRoute.name}</h3>
                        </div>
                        <div class="detail-kpi-chips">
                            <div class="chip">Distance: <strong>${currentRoute.distance}</strong></div>
                            <div class="chip">Freq: <strong>${currentRoute.frequency}</strong></div>
                            <div class="chip">Est. Trip: <strong>${currentRoute.duration}</strong></div>
                        </div>
                    </div>

                    <!-- Stops Timeline -->
                    <div class="stops-section">
                        <h4>Sequential Stops & Interchanges</h4>
                        <div class="stops-timeline">
                            ${currentRoute.stops.map((stopName, idx) => {
                                const isStart = idx === 0;
                                const isEnd = idx === currentRoute.stops.length - 1;
                                return `
                                <div class="stop-node ${isStart ? 'start-node' : isEnd ? 'end-node' : ''}">
                                    <div class="stop-marker-dot"></div>
                                    <div class="stop-info">
                                        <div class="stop-name">${stopName}</div>
                                        <div class="stop-desc">${isStart ? 'Origin Terminal' : isEnd ? 'Destination Terminal' : 'Regular Shelter Stop'} • Avg dwell 45s</div>
                                    </div>
                                    <span class="stop-time">+${idx * 6}m</span>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Live Buses on this Route -->
                    <div class="route-buses-section">
                        <h4>Live Buses Deployed (${assignedBuses.length})</h4>
                        <div class="route-bus-pills">
                            ${assignedBuses.length === 0 ? `<p class="text-secondary">No buses actively mapped right now.</p>` : assignedBuses.map(b => {
                                const occPct = Math.round((b.passengersOnboard / b.capacity) * 100);
                                return `
                                <div class="route-bus-pill">
                                    <div class="rb-top">
                                        <strong>${b.number}</strong>
                                        <span class="badge ${b.status === 'Delayed' ? 'badge-delayed' : 'badge-running'}">${b.status}</span>
                                    </div>
                                    <div class="rb-meta">
                                        <span>Driver: ${b.driver}</span>
                                        <span>Next: <strong>${b.nextStop}</strong></span>
                                        <span>ETA: <strong class="text-green">${b.etaMins}m</strong></span>
                                    </div>
                                    <div class="progress-bar-bg mt-1">
                                        <div class="progress-bar-fill" style="width:${occPct}%; background:${occPct > 80 ? '#EF4444' : '#10B981'}"></div>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function initRoutes() {
        const searchInput = document.getElementById('routeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                filterQuery = e.target.value;
                const container = document.getElementById('content') || document.getElementById('viewContainer');
                if (container) {
                    container.innerHTML = renderRoutes();
                    initRoutes();
                }
            });
        }
    }

    function selectRoute(routeId) {
        selectedRouteId = routeId;
        const container = document.getElementById('content') || document.getElementById('viewContainer');
        if (container) {
            container.innerHTML = renderRoutes();
            initRoutes();
        }
    }

    window.renderRoutes = renderRoutes;
    window.initRoutes = initRoutes;
    window.selectRoute = selectRoute;
})();
