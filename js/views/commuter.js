/**
 * TransitPulse — Commuter Web & Mobile Application
 * Live Bus Seating Availability, Real-Time ETA Predictions & Route Navigation
 */

(function () {
    let selectedStop = 'Gorakhpur Junction Rly Station';
    let destinationQuery = '';
    let favoriteRoutes = ['101', '103'];

    function renderCommuter() {
        const data = window.TransitData || { stops: [], routes: [], buses: [] };
        
        // Find buses passing or approaching the selected stop
        const upcomingBuses = data.buses.filter(b => b.status !== 'Maintenance').slice(0, 6);

        return `
        <div class="commuter-wrapper">
            <!-- Commuter Hero Search Header -->
            <div class="commuter-hero-card card">
                <div class="commuter-hero-text">
                    <h2>Live Commuter Bus Finder</h2>
                    <p class="text-secondary">Instant seat availability & live GPS arrival predictions for Tier-3 passengers.</p>
                </div>

                <div class="commuter-search-bar-row">
                    <div class="commuter-input-box">
                        <label>📍 Your Current Bus Stop:</label>
                        <select id="commuterStopSelect" class="form-select" onchange="window.selectCommuterStop(this.value)">
                            ${data.stops.map(s => `<option value="${s.name}" ${s.name === selectedStop ? 'selected' : ''}>${s.name}</option>`).join('')}
                        </select>
                    </div>

                    <div class="commuter-input-box">
                        <label>🎯 Where are you going?</label>
                        <input type="text" id="commuterDestInput" placeholder="Enter destination (e.g. AIIMS, MMMUT, GIDA)..." value="${destinationQuery}" oninput="window.updateCommuterDest(this.value)">
                    </div>

                    <button class="btn btn-primary" onclick="window.location.hash='#live-map'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
                        Find on Map
                    </button>
                </div>
            </div>

            <!-- Service Notice Alert -->
            <div class="commuter-notice-banner">
                <span class="notice-icon">📢</span>
                <div class="notice-text">
                    <strong>Service Advisory:</strong> High passenger traffic on Golghar & Mohaddipur corridor. Extra EV feeder buses deployed every 6 minutes.
                </div>
            </div>

            <!-- Upcoming Buses at this Stop -->
            <div class="upcoming-buses-section">
                <div class="section-title-row">
                    <div>
                        <h3>Upcoming Buses at "${selectedStop}"</h3>
                        <p class="text-secondary">Real-time GPS countdown & seat occupancy prediction</p>
                    </div>
                    <span class="badge badge-running">LIVE SATELLITE SYNC</span>
                </div>

                <div class="commuter-buses-grid">
                    ${upcomingBuses.map((bus, idx) => {
                        const occPct = Math.round((bus.passengersOnboard / bus.capacity) * 100);
                        const freeSeats = Math.max(0, bus.capacity - bus.passengersOnboard);
                        
                        let seatStatusText = `${freeSeats} Seats Available`;
                        let seatBadgeClass = 'badge-running';
                        let seatBadgeColor = '#10B981';

                        if (bus.passengersOnboard > bus.capacity) {
                            seatStatusText = `Standing Room Only (+${bus.standingCount})`;
                            seatBadgeClass = 'badge-delayed';
                            seatBadgeColor = '#EF4444';
                        } else if (freeSeats <= 8) {
                            seatStatusText = `Only ${freeSeats} Seats Left!`;
                            seatBadgeClass = 'badge-maintenance';
                            seatBadgeColor = '#F59E0B';
                        }

                        const routeObj = data.routes.find(r => r.id === bus.routeId) || {};

                        return `
                        <div class="card commuter-bus-card">
                            <div class="cbc-top">
                                <div class="cbc-route-pill" style="background:${routeObj.color || '#3B82F6'}">
                                    Route ${routeObj.number || '101'}
                                </div>
                                <div class="cbc-eta-box">
                                    <span class="eta-label">Arrives in</span>
                                    <span class="eta-time">${bus.etaMins + (idx * 3)} mins</span>
                                </div>
                            </div>

                            <h4 class="cbc-route-title">${bus.routeName}</h4>
                            <div class="cbc-bus-num">Vehicle: <strong>${bus.number}</strong> (${bus.model.slice(0, 18)})</div>

                            <div class="cbc-seat-status" style="border-left: 4px solid ${seatBadgeColor}">
                                <div class="seat-status-header">
                                    <span class="seat-badge-text" style="color:${seatBadgeColor}">
                                        ${freeSeats > 15 ? '🟢 ' : freeSeats > 5 ? '🟡 ' : '🔴 '}
                                        ${seatStatusText}
                                    </span>
                                    <span class="text-secondary">${occPct}% full</span>
                                </div>
                                <div class="progress-bar-bg mt-1">
                                    <div class="progress-bar-fill" style="width:${Math.min(occPct, 100)}%; background:${seatBadgeColor}"></div>
                                </div>
                            </div>

                            <div class="cbc-fare-strip">
                                <span>Ticket: <strong>${routeObj.fare || '₹15'}</strong></span>
                                <span>Speed: <strong>${bus.speed} km/h</strong></span>
                                <span>AC/EV: <strong>${bus.batteryOrFuel.includes('Electric') ? '⚡ 100% Zero Emission' : '🌿 Clean CNG'}</strong></span>
                            </div>

                            <div class="cbc-actions">
                                <button class="btn btn-primary btn-sm full-w" onclick="window.trackBusOnMap('${bus.id}')">
                                    Track Live Location
                                </button>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Favorite Commute Routes & Quick Access -->
            <div class="commuter-bottom-grid mt-3">
                <div class="card fav-routes-card">
                    <div class="card-header">
                        <h3>Your Saved Corridors</h3>
                        <span class="badge badge-primary">Favorites</span>
                    </div>
                    <div class="fav-routes-list">
                        <div class="fav-route-item">
                            <div class="fri-left">
                                <span class="route-badge" style="background:#3B82F6">Route 101</span>
                                <div>
                                    <strong>Gorakhpur Junction ⇄ AIIMS Hospital</strong>
                                    <small>Frequent service: Every 8 mins</small>
                                </div>
                            </div>
                            <span class="text-green">Next: 4 mins</span>
                        </div>
                        <div class="fav-route-item">
                            <div class="fri-left">
                                <span class="route-badge" style="background:#F59E0B">Route 103</span>
                                <div>
                                    <strong>BRD Medical College ⇄ Ramgarh Tal</strong>
                                    <small>Lake Promenade express: Every 10 mins</small>
                                </div>
                            </div>
                            <span class="text-green">Next: 7 mins</span>
                        </div>
                    </div>
                </div>

                <div class="card accessibility-card">
                    <div class="card-header">
                        <h3>Tier-3 Inclusivity & Women Safety</h3>
                        <span class="badge badge-running">Active</span>
                    </div>
                    <div class="inclusivity-content">
                        <p class="text-secondary">TransitPulse buses feature dedicated women reservation rows (Rows 1-3), wheelchair accessibility ramps, and panic alarm buttons wired to the city control room.</p>
                        <div class="helpline-chips mt-2">
                            <div class="chip">Transit Helpline: <strong>1800-180-5300</strong></div>
                            <div class="chip">Women Emergency: <strong>1090</strong></div>
                            <div class="chip">Police Control: <strong>112</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function selectCommuterStop(stopName) {
        selectedStop = stopName;
        const container = document.getElementById('content') || document.getElementById('viewContainer');
        if (container) {
            container.innerHTML = renderCommuter();
        }
    }

    function updateCommuterDest(val) {
        destinationQuery = val;
    }

    function trackBusOnMap(busId) {
        window.location.hash = '#live-map';
        if (window.focusBusOnMap) {
            setTimeout(() => { window.focusBusOnMap(busId); }, 400);
        }
    }

    window.renderCommuter = renderCommuter;
    window.selectCommuterStop = selectCommuterStop;
    window.updateCommuterDest = updateCommuterDest;
    window.trackBusOnMap = trackBusOnMap;
})();
