/**
 * TransitPulse — Driver & Conductor Mobile/Web Application
 * Real-Time Bus Passenger Counting, Seating Capacity & Stop Navigation
 */

(function () {
    let currentBusId = 'BUS-01';
    let shiftActive = true;
    let shiftMinutes = 184;

    function renderDriver() {
        const data = window.TransitData || { buses: [] };
        const bus = data.buses.find(b => b.id === currentBusId) || data.buses[0];
        const occPct = Math.round((bus.passengersOnboard / bus.capacity) * 100);
        const seatMap = window.TransitData ? window.TransitData.generateSeatMap(bus.capacity, bus.passengersOnboard) : [];

        let statusColor = '#10B981';
        if (occPct > 85) statusColor = '#EF4444';
        else if (occPct >= 50) statusColor = '#F59E0B';

        return `
        <div class="driver-portal-wrapper">
            <!-- Mobile App Frame Header -->
            <div class="driver-top-banner">
                <div class="driver-profile-header">
                    <div class="driver-avatar-circle">👨🏽‍✈️</div>
                    <div>
                        <h3>${bus.driver}</h3>
                        <span class="sub-text">Conductor: <strong>${bus.conductor}</strong> | Badge #DL-4819</span>
                    </div>
                </div>
                <div class="driver-status-actions">
                    <div class="bus-selector-dropdown">
                        <label>Vehicle Console:</label>
                        <select id="driverBusSelect" class="form-select" onchange="window.switchDriverBus(this.value)">
                            ${data.buses.map(b => `<option value="${b.id}" ${b.id === currentBusId ? 'selected' : ''}>${b.number} — ${b.routeName.slice(0, 24)}...</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn ${shiftActive ? 'btn-outline text-red' : 'btn-primary'}" onclick="window.toggleDriverShift()">
                        ${shiftActive ? '🔴 End Duty Shift' : '🟢 Start Duty Shift'}
                    </button>
                </div>
            </div>

            <!-- Active Shift Stats Bar -->
            <div class="driver-shift-bar">
                <div class="d-metric">
                    <span class="d-label">Assigned Vehicle</span>
                    <span class="d-val text-blue">${bus.number}</span>
                </div>
                <div class="d-metric">
                    <span class="d-label">Active Route</span>
                    <span class="d-val">${bus.routeName}</span>
                </div>
                <div class="d-metric">
                    <span class="d-label">Shift Duration</span>
                    <span class="d-val text-green">${Math.floor(shiftMinutes / 60)}h ${shiftMinutes % 60}m</span>
                </div>
                <div class="d-metric">
                    <span class="d-label">Fare Cash/UPI Today</span>
                    <span class="d-val text-amber">₹${bus.fareCollectionToday}</span>
                </div>
            </div>

            <!-- Two-Column Responsive Layout -->
            <div class="driver-grid-layout">
                <!-- Left Column: Conductor Passenger Counter & Actions -->
                <div class="driver-counter-card card">
                    <div class="card-header">
                        <div>
                            <h3>Passenger Counter & Crowd Controller</h3>
                            <p class="text-secondary">Overhead optical IR sensors + Manual conductor tap overrides</p>
                        </div>
                        <span class="badge ${bus.status === 'Overcrowded' ? 'badge-delayed' : 'badge-running'}">${bus.status}</span>
                    </div>

                    <div class="counter-display-block">
                        <div class="pax-big-number" style="color:${statusColor}">
                            ${bus.passengersOnboard}
                        </div>
                        <div class="pax-capacity-sub">
                            Total Onboard / <strong>${bus.capacity} Seated Capacity</strong>
                        </div>
                        <div class="progress-bar-bg pax-progress-lg mt-2">
                            <div class="progress-bar-fill" style="width:${Math.min(occPct, 100)}%; background:${statusColor}"></div>
                        </div>
                        <div class="capacity-alert-row mt-1">
                            <span>Occupancy: <strong>${occPct}%</strong></span>
                            <span>${bus.standingCount > 0 ? `<strong class="text-red">⚠️ ${bus.standingCount} Standing Passengers</strong>` : `${bus.capacity - bus.passengersOnboard} seats available`}</span>
                        </div>
                    </div>

                    <!-- Rapid Tap Counting Buttons -->
                    <div class="conductor-tap-pad">
                        <div class="tap-col boarding-col">
                            <span class="tap-col-title text-green">➕ PASSENGER BOARDING</span>
                            <div class="tap-btn-group">
                                <button class="btn btn-tap btn-board" onclick="window.driverRecordBoard(1)">+1 Adult</button>
                                <button class="btn btn-tap btn-board" onclick="window.driverRecordBoard(5)">+5 Group</button>
                                <button class="btn btn-tap btn-board-lg" onclick="window.driverRecordBoard(10)">+10 Stop Rush</button>
                            </div>
                        </div>

                        <div class="tap-col alighting-col">
                            <span class="tap-col-title text-red">➖ PASSENGER ALIGHTING</span>
                            <div class="tap-btn-group">
                                <button class="btn btn-tap btn-alight" onclick="window.driverRecordAlight(1)">-1 Exit</button>
                                <button class="btn btn-tap btn-alight" onclick="window.driverRecordAlight(5)">-5 Exit</button>
                                <button class="btn btn-tap btn-alight-lg" onclick="window.driverRecordAlight(10)">-10 Depot Clear</button>
                            </div>
                        </div>
                    </div>

                    <!-- Next Stop Navigation & Arrival Button -->
                    <div class="next-stop-banner mt-3">
                        <div class="stop-nav-info">
                            <span class="nav-sub">Approaching Next Bus Stop</span>
                            <h4 class="nav-stop-title">🚏 ${bus.nextStop}</h4>
                            <span class="nav-eta">Dynamic Prediction: <strong>${bus.etaMins} mins</strong> (${bus.speed} km/h)</span>
                        </div>
                        <button class="btn btn-primary btn-lg" onclick="window.driverArrivedAtStop('${bus.id}')">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            Confirm Arrival at Stop
                        </button>
                    </div>

                    <!-- Driver Distress / Delay Broadcast -->
                    <div class="driver-alerts-row mt-3">
                        <button class="btn btn-outline text-amber" onclick="window.driverReportDelay('Traffic Congestion')">
                            ⚠️ Report Traffic Jam (+10m)
                        </button>
                        <button class="btn btn-outline text-amber" onclick="window.driverReportDelay('Level Crossing Closed')">
                            🚂 Railway Gate Closed (+15m)
                        </button>
                        <button class="btn btn-danger" onclick="window.driverTriggerSOS()">
                            🚨 Emergency SOS to Depot
                        </button>
                    </div>
                </div>

                <!-- Right Column: Interactive Seat Occupancy Diagram -->
                <div class="driver-seatmap-card card">
                    <div class="card-header">
                        <div>
                            <h3>Vehicle Interior Seating Map</h3>
                            <p class="text-secondary">Tap any seat to toggle reservation / occupancy state</p>
                        </div>
                        <span class="badge badge-primary">2×2 Urban Chassis</span>
                    </div>

                    <div class="seatmap-scroll-area">
                        <div class="bus-interior-chassis driver-chassis-view">
                            <div class="bus-front-cabin">
                                <div class="driver-seat-box">👨🏽‍✈️ Driver Cockpit</div>
                                <div class="door-entry-label">Front Entrance (Boarding)</div>
                            </div>

                            <div class="bus-seat-grid-2x2">
                                ${seatMap.map(s => `
                                    <div class="bus-seat-unit ${s.occupied ? 'occupied' : 'vacant'} ${s.type}" onclick="window.toggleSingleSeat('${bus.id}')" title="Seat ${s.seatNumber}: ${s.occupied ? 'Occupied' : 'Available'}">
                                        <span class="seat-code">${s.seatNumber}</span>
                                        <span class="seat-icon">${s.occupied ? '👤' : '💺'}</span>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="bus-rear-chassis">
                                <div class="door-entry-label">Rear Exit Door</div>
                                <div class="standing-pax-box">
                                    <span>Aisle Standing Passengers: <strong class="text-amber">${bus.standingCount || 0}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="seat-legend mt-3">
                        <span class="legend-chip"><span class="box vacant"></span> Vacant (${bus.capacity - bus.passengersOnboard > 0 ? bus.capacity - bus.passengersOnboard : 0})</span>
                        <span class="legend-chip"><span class="box occupied"></span> Occupied (${Math.min(bus.passengersOnboard, bus.capacity)})</span>
                        <span class="legend-chip"><span class="box women-reserved"></span> Women Reserved (Rows 1-3)</span>
                        <span class="legend-chip"><span class="box senior-citizen"></span> Senior Citizen</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function switchDriverBus(busId) {
        currentBusId = busId;
        refreshDriverView();
    }

    function toggleDriverShift() {
        shiftActive = !shiftActive;
        if (window.showToast) {
            window.showToast(shiftActive ? 'Duty Shift Started. GPS broadcasting live.' : 'Duty Shift Ended. Logged in depot.');
        }
        refreshDriverView();
    }

    function driverRecordBoard(count) {
        if (window.TransitData && window.TransitData.recordPassengerBoard) {
            window.TransitData.recordPassengerBoard(currentBusId, count);
            if (window.showToast) window.showToast(`+${count} Passengers Boarded`);
            refreshDriverView();
        }
    }

    function driverRecordAlight(count) {
        if (window.TransitData && window.TransitData.recordPassengerAlight) {
            window.TransitData.recordPassengerAlight(currentBusId, count);
            if (window.showToast) window.showToast(`-${count} Passengers Alighted`);
            refreshDriverView();
        }
    }

    function toggleSingleSeat(busId) {
        if (window.TransitData) {
            const bus = window.TransitData.buses.find(b => b.id === busId);
            if (bus) {
                if (bus.passengersOnboard < bus.capacity) {
                    bus.passengersOnboard += 1;
                } else {
                    bus.passengersOnboard -= 1;
                }
                refreshDriverView();
            }
        }
    }

    function driverArrivedAtStop(busId) {
        if (window.TransitData) {
            const bus = window.TransitData.buses.find(b => b.id === busId);
            if (bus) {
                const route = window.TransitData.routes.find(r => r.id === bus.routeId);
                if (route && route.stops) {
                    const currentIdx = route.stops.indexOf(bus.nextStop);
                    const nextIdx = (currentIdx + 1) % route.stops.length;
                    bus.nextStop = route.stops[nextIdx];
                    bus.etaMins = Math.floor(Math.random() * 5) + 3;
                    if (window.showToast) window.showToast(`Arrived at stop! Next destination updated to: ${bus.nextStop}`);
                    refreshDriverView();
                }
            }
        }
    }

    function driverReportDelay(reason) {
        if (window.TransitData) {
            const bus = window.TransitData.buses.find(b => b.id === currentBusId);
            if (bus) {
                bus.status = 'Delayed';
                bus.etaMins += 10;
                if (window.showToast) window.showToast(`Broadcasted delay alert: "${reason}" (+10 mins ETA).`);
                refreshDriverView();
            }
        }
    }

    function driverTriggerSOS() {
        if (confirm('🚨 Are you sure you want to broadcast an EMERGENCY SOS to Municipal Transit Depot?')) {
            if (window.showToast) window.showToast('🚨 SOS Emergency Signal Sent! Depot dispatch & PCR notified.');
        }
    }

    function refreshDriverView() {
        const container = document.getElementById('content') || document.getElementById('viewContainer');
        if (container && window.location.hash.includes('driver')) {
            container.innerHTML = renderDriver();
        }
    }

    window.renderDriver = renderDriver;
    window.switchDriverBus = switchDriverBus;
    window.toggleDriverShift = toggleDriverShift;
    window.driverRecordBoard = driverRecordBoard;
    window.driverRecordAlight = driverRecordAlight;
    window.toggleSingleSeat = toggleSingleSeat;
    window.driverArrivedAtStop = driverArrivedAtStop;
    window.driverReportDelay = driverReportDelay;
    window.driverTriggerSOS = driverTriggerSOS;
})();
