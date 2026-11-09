/**
 * TransitPulse — Buses & Fleet Management View
 * Real-Time Telemetry, Capacity Monitors, and Vehicle Inspection
 */

(function () {
    let currentFilter = 'All';
    let searchQuery = '';
    let selectedBusModal = null;

    function renderBuses() {
        const data = window.TransitData || { buses: [] };
        let list = data.buses;

        if (currentFilter !== 'All') {
            if (currentFilter === 'Running') list = list.filter(b => b.status === 'Running');
            else if (currentFilter === 'Crowded') list = list.filter(b => b.status === 'Near Capacity' || b.status === 'Overcrowded');
            else if (currentFilter === 'Delayed') list = list.filter(b => b.status === 'Delayed');
            else if (currentFilter === 'Maintenance') list = list.filter(b => b.status === 'Maintenance');
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(b => 
                b.number.toLowerCase().includes(q) || 
                b.driver.toLowerCase().includes(q) || 
                b.routeName.toLowerCase().includes(q) ||
                b.model.toLowerCase().includes(q)
            );
        }

        const totalActive = data.buses.filter(b => b.status !== 'Maintenance').length;
        const totalEV = data.buses.filter(b => b.batteryOrFuel.includes('Electric')).length;
        const totalCrowded = data.buses.filter(b => b.status === 'Near Capacity' || b.status === 'Overcrowded').length;

        return `
        <div class="view-header">
            <div>
                <h2>Fleet Operations & Passenger Load</h2>
                <p class="text-secondary">Real-time telemetry, IoT seat sensors, and vehicle status across 30 municipal buses.</p>
            </div>
            <div class="view-actions">
                <div class="search-box">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="busSearchInput" placeholder="Search bus, driver, model..." value="${searchQuery}">
                </div>
            </div>
        </div>

        <!-- Fleet Overview Stat Row -->
        <div class="buses-stat-strip">
            <div class="stat-mini-pill">
                <span class="label">Total Fleet</span>
                <span class="val">${data.buses.length} Vehicles</span>
            </div>
            <div class="stat-mini-pill">
                <span class="label">Active on Road</span>
                <span class="val text-green">${totalActive} Active</span>
            </div>
            <div class="stat-mini-pill">
                <span class="label">Electric Buses (EV)</span>
                <span class="val text-blue">${totalEV} Units</span>
            </div>
            <div class="stat-mini-pill">
                <span class="label">High Crowd Alert</span>
                <span class="val text-amber">${totalCrowded} Buses</span>
            </div>
        </div>

        <!-- Filter Chips Bar -->
        <div class="filter-tab-bar">
            ${['All', 'Running', 'Crowded', 'Delayed', 'Maintenance'].map(f => `
                <button class="filter-tab ${currentFilter === f ? 'active' : ''}" onclick="window.filterBusesByStatus('${f}')">
                    ${f} ${f === 'All' ? `(${data.buses.length})` : ''}
                </button>
            `).join('')}
        </div>

        <!-- Buses Grid -->
        <div class="buses-grid">
            ${list.map(bus => {
                const occPct = Math.round((bus.passengersOnboard / bus.capacity) * 100);
                let occColor = '#1A9E66';
                let occBadgeClass = 'badge-running';
                if (occPct > 85) {
                    occColor = '#E53E3E';
                    occBadgeClass = 'badge-delayed';
                } else if (occPct >= 50) {
                    occColor = '#E38C1F';
                    occBadgeClass = 'badge-maintenance';
                }

                return `
                <div class="card bus-grid-card">
                    <div class="bgc-header">
                        <div class="bgc-reg">
                            <span class="bus-icon-circle">🚌</span>
                            <div>
                                <h4 class="bus-plate">${bus.number}</h4>
                                <span class="bus-model-sub">${bus.model}</span>
                            </div>
                        </div>
                        <span class="badge ${occBadgeClass}">${bus.status}</span>
                    </div>

                    <div class="bgc-route">
                        <span class="route-tag">Route ${bus.routeId ? bus.routeId.replace('R-', '') : '101'}</span>
                        <span class="route-name-title">${bus.routeName}</span>
                    </div>

                    <div class="bgc-occ-box">
                        <div class="occ-flex-title">
                            <span>Passenger Count</span>
                            <strong style="color:${occColor}">${bus.passengersOnboard} / ${bus.capacity} seats</strong>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width:${Math.min(occPct, 100)}%; background:${occColor}"></div>
                        </div>
                        <div class="occ-sub-text">
                            <span>${occPct}% Occupied</span>
                            <span>${bus.standingCount > 0 ? `<strong class="text-red">+${bus.standingCount} Standing</strong>` : `${bus.capacity - bus.passengersOnboard} seats free`}</span>
                        </div>
                    </div>

                    <div class="bgc-telemetry-grid">
                        <div class="telem-item">
                            <span class="t-label">Speed</span>
                            <span class="t-val">${bus.speed} km/h</span>
                        </div>
                        <div class="telem-item">
                            <span class="t-label">Powertrain</span>
                            <span class="t-val">${bus.batteryOrFuel}</span>
                        </div>
                        <div class="telem-item">
                            <span class="t-label">Next Stop</span>
                            <span class="t-val text-blue">${bus.nextStop}</span>
                        </div>
                        <div class="telem-item">
                            <span class="t-label">Arrival ETA</span>
                            <span class="t-val text-green">${bus.etaMins} mins</span>
                        </div>
                    </div>

                    <div class="bgc-footer">
                        <div class="driver-inline">
                            <span class="driver-avatar-mini">👨🏽‍✈️</span>
                            <div class="driver-names">
                                <span>${bus.driver}</span>
                                <small>${bus.driverPhone}</small>
                            </div>
                        </div>
                        <button class="btn btn-outline btn-sm" onclick="window.openBusModal('${bus.id}')">Telemetry</button>
                    </div>
                </div>
                `;
            }).join('')}
        </div>

        <!-- Telemetry Inspection Modal -->
        <div id="busTelemetryModal" class="modal-backdrop ${selectedBusModal ? 'active' : ''}">
            ${selectedBusModal ? renderModalContent(selectedBusModal) : ''}
        </div>
        `;
    }

    function renderModalContent(bus) {
        const occPct = Math.round((bus.passengersOnboard / bus.capacity) * 100);
        const seatMap = window.TransitData ? window.TransitData.generateSeatMap(bus.capacity, bus.passengersOnboard) : [];

        return `
        <div class="modal-card">
            <div class="modal-header">
                <div>
                    <h3>Vehicle Telemetry — ${bus.number}</h3>
                    <p class="text-secondary">${bus.model} • ${bus.routeName}</p>
                </div>
                <button class="modal-close-btn" onclick="window.closeBusModal()">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Seating Grid Visual (2x2 Indian Tier-3 Layout) -->
                <div class="seat-layout-container">
                    <h4>Live Seating Capacity Map (${bus.passengersOnboard}/${bus.capacity})</h4>
                    <p class="text-secondary mb-2">Color-coded occupancy from optical overhead sensors</p>
                    <div class="bus-interior-chassis">
                        <div class="bus-front-cabin">
                            <div class="driver-seat-box">👨🏽‍✈️ Driver: ${bus.driver}</div>
                            <div class="door-entry-label">Front Entry Door (IR Sensor)</div>
                        </div>
                        <div class="bus-seat-grid-2x2">
                            ${seatMap.map(s => `
                                <div class="bus-seat-unit ${s.occupied ? 'occupied' : 'vacant'} ${s.type}">
                                    <span class="seat-code">${s.seatNumber}</span>
                                    <span class="seat-icon">💺</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="bus-rear-chassis">
                            <div class="door-entry-label">Rear Exit Door (IR Sensor)</div>
                            <div class="standing-pax-box">
                                <span>Standing Aisle Passengers: <strong>${bus.standingCount || 0}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="seat-legend mt-2">
                        <span class="legend-chip"><span class="box vacant"></span> Vacant</span>
                        <span class="legend-chip"><span class="box occupied"></span> Occupied</span>
                        <span class="legend-chip"><span class="box women-reserved"></span> Women Reserved</span>
                        <span class="legend-chip"><span class="box senior-citizen"></span> Senior Citizen</span>
                    </div>
                </div>

                <!-- Stats & Actions -->
                <div class="modal-stats-panel">
                    <h4>Trip & Sensor Telemetry</h4>
                    <div class="telemetry-table">
                        <div class="t-row"><span>Status</span> <strong class="text-green">${bus.status}</strong></div>
                        <div class="t-row"><span>Current Speed</span> <strong>${bus.speed} km/h</strong></div>
                        <div class="t-row"><span>Energy / Tank</span> <strong>${bus.batteryOrFuel}</strong></div>
                        <div class="t-row"><span>Today's Odometer</span> <strong>${bus.odoKm} km</strong></div>
                        <div class="t-row"><span>Tickets Collected</span> <strong class="text-green">₹${bus.fareCollectionToday}</strong></div>
                        <div class="t-row"><span>Next Stop</span> <strong class="text-blue">${bus.nextStop}</strong></div>
                        <div class="t-row"><span>ETA to Next</span> <strong class="text-amber">${bus.etaMins} mins</strong></div>
                    </div>

                    <div class="quick-sim-buttons mt-3">
                        <h5>Manual Conductor Overrides</h5>
                        <div class="btn-group-row">
                            <button class="btn btn-outline btn-sm" onclick="window.boardPassenger('${bus.id}', 1)">+1 Board</button>
                            <button class="btn btn-outline btn-sm" onclick="window.boardPassenger('${bus.id}', 5)">+5 Board</button>
                            <button class="btn btn-outline btn-sm" onclick="window.alightPassenger('${bus.id}', 1)">-1 Alight</button>
                            <button class="btn btn-outline btn-sm" onclick="window.alightPassenger('${bus.id}', 5)">-5 Alight</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="window.closeBusModal()">Close Window</button>
                <button class="btn btn-primary" onclick="window.location.hash='#live-map'; window.focusBusOnMap('${bus.id}')">Track on Live Map</button>
            </div>
        </div>
        `;
    }

    function initBuses() {
        const searchInput = document.getElementById('busSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                const container = document.getElementById('content') || document.getElementById('viewContainer');
                if (container) {
                    container.innerHTML = renderBuses();
                    initBuses();
                }
            });
        }
    }

    function filterBusesByStatus(status) {
        currentFilter = status;
        const container = document.getElementById('content') || document.getElementById('viewContainer');
        if (container) {
            container.innerHTML = renderBuses();
            initBuses();
        }
    }

    function openBusModal(busId) {
        if (!window.TransitData) return;
        selectedBusModal = window.TransitData.buses.find(b => b.id === busId);
        const modal = document.getElementById('busTelemetryModal');
        if (modal) {
            modal.innerHTML = renderModalContent(selectedBusModal);
            modal.classList.add('active');
        }
    }

    function closeBusModal() {
        selectedBusModal = null;
        const modal = document.getElementById('busTelemetryModal');
        if (modal) {
            modal.classList.remove('active');
            modal.innerHTML = '';
        }
    }

    function boardPassenger(busId, count) {
        if (window.TransitData && window.TransitData.recordPassengerBoard) {
            window.TransitData.recordPassengerBoard(busId, count);
            openBusModal(busId);
        }
    }

    function alightPassenger(busId, count) {
        if (window.TransitData && window.TransitData.recordPassengerAlight) {
            window.TransitData.recordPassengerAlight(busId, count);
            openBusModal(busId);
        }
    }

    window.renderBuses = renderBuses;
    window.initBuses = initBuses;
    window.filterBusesByStatus = filterBusesByStatus;
    window.openBusModal = openBusModal;
    window.closeBusModal = closeBusModal;
    window.boardPassenger = boardPassenger;
    window.alightPassenger = alightPassenger;
})();
