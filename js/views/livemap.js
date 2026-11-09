/**
 * TransitPulse — Live Map View
 * Real-Time Bus Tracking on Leaflet Map
 */

(function () {
    let map = null;
    let busMarkers = {};
    let routePolylines = {};
    let stopMarkers = [];
    let selectedRouteFilter = 'all';
    let searchQuery = '';
    let liveUpdateInterval = null;

    const STATUS_COLORS = {
        'Running': '#10B981',
        'On-Time': '#10B981',
        'Near Capacity': '#F59E0B',
        'Overcrowded': '#EF4444',
        'Delayed': '#EF4444',
        'Maintenance': '#64748B'
    };

    function renderLiveMap() {
        const data = window.TransitData || { buses: [], routes: [], stops: [] };
        const activeCount = data.buses.filter(b => b.status !== 'Maintenance').length;
        const avgSpeed = Math.round(data.buses.reduce((acc, b) => acc + (b.speed || 0), 0) / (data.buses.length || 1));

        return `
        <div class="livemap-container">
            <!-- Leaflet Map Canvas -->
            <div id="livemapCanvas" class="livemap-canvas"></div>

            <!-- Floating Top Toolbar -->
            <div class="livemap-toolbar">
                <div class="livemap-search-group">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="liveMapSearch" placeholder="Search by bus number (e.g. UP-53) or stop..." value="${searchQuery}">
                </div>
                <div class="livemap-filter-group">
                    <select id="liveMapRouteFilter" class="form-select">
                        <option value="all" ${selectedRouteFilter === 'all' ? 'selected' : ''}>All Routes (15)</option>
                        ${data.routes.map(r => `<option value="${r.id}" ${selectedRouteFilter === r.id ? 'selected' : ''}>Route ${r.number}: ${r.name}</option>`).join('')}
                    </select>
                </div>
                <button class="btn btn-primary btn-sm" id="liveMapCenterBtn" title="Reset Map View">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                    Center City
                </button>
            </div>

            <!-- Collapsible Side Fleet Drawer -->
            <aside class="livemap-side-panel" id="liveMapPanel">
                <div class="livemap-panel-header">
                    <div class="panel-title">
                        <span class="live-pulse-dot"></span>
                        <h3>Fleet Tracker</h3>
                    </div>
                    <span class="badge badge-primary" id="fleetLiveCount">${activeCount} Active</span>
                </div>
                <div class="livemap-bus-list" id="liveMapBusList">
                    ${renderBusListItems(data.buses)}
                </div>
            </aside>

            <!-- Bottom Floating KPI Bar -->
            <div class="livemap-bottom-bar">
                <div class="kpi-mini">
                    <span class="kpi-label">Active Fleet</span>
                    <span class="kpi-val text-green">${activeCount} Buses</span>
                </div>
                <div class="kpi-mini">
                    <span class="kpi-label">Avg Speed</span>
                    <span class="kpi-val text-blue">${avgSpeed} km/h</span>
                </div>
                <div class="kpi-mini">
                    <span class="kpi-label">Peak Congestion</span>
                    <span class="kpi-val text-amber">Golghar & Mohaddipur</span>
                </div>
                <div class="kpi-mini live-sync-indicator">
                    <span class="pulse-ring"></span>
                    <span class="kpi-label">GPS Stream: <strong class="text-green">ONLINE (3s)</strong></span>
                </div>
            </div>
        </div>
        `;
    }

    function renderBusListItems(buses) {
        let filtered = buses.filter(b => b.status !== 'Maintenance');
        if (selectedRouteFilter !== 'all') {
            filtered = filtered.filter(b => b.routeId === selectedRouteFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(b => 
                b.number.toLowerCase().includes(q) || 
                b.routeName.toLowerCase().includes(q) ||
                (b.nextStop && b.nextStop.toLowerCase().includes(q))
            );
        }

        if (filtered.length === 0) {
            return `<div class="empty-state-p">No buses matching criteria</div>`;
        }

        return filtered.map(b => {
            const occPct = Math.round((b.passengersOnboard / b.capacity) * 100);
            let occColor = '#10B981';
            if (occPct > 85) occColor = '#EF4444';
            else if (occPct >= 50) occColor = '#F59E0B';

            return `
            <div class="bus-card-compact" data-bus-id="${b.id}" onclick="window.focusBusOnMap('${b.id}')">
                <div class="bus-compact-top">
                    <div class="bus-reg">
                        <span class="bus-badge-dot" style="background:${occColor}"></span>
                        <strong>${b.number}</strong>
                    </div>
                    <span class="badge ${b.status === 'Delayed' ? 'badge-delayed' : b.status === 'Overcrowded' ? 'badge-delayed' : 'badge-running'}">${b.status}</span>
                </div>
                <div class="bus-compact-route">${b.routeName}</div>
                <div class="bus-compact-meta">
                    <span>Next: <strong>${b.nextStop}</strong></span>
                    <span class="bus-eta">ETA: <strong>${b.etaMins}m</strong></span>
                </div>
                <div class="bus-compact-occ">
                    <div class="occ-text">
                        <span>Occupancy: <strong>${b.passengersOnboard}/${b.capacity}</strong></span>
                        <span>${occPct}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width:${Math.min(occPct, 100)}%; background:${occColor}"></div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    function initLiveMap() {
        const mapEl = document.getElementById('livemapCanvas');
        if (!mapEl) return;

        const data = window.TransitData || { cityCenter: { lat: 26.7606, lng: 83.3732 }, routes: [], buses: [], stops: [] };
        const center = [data.cityCenter.lat, data.cityCenter.lng];

        // Clean existing map instance if any
        if (map) {
            try { map.remove(); } catch (e) {}
            map = null;
        }

        busMarkers = {};
        routePolylines = {};
        stopMarkers = [];

        // Initialize Leaflet
        map = L.map('livemapCanvas', {
            zoomControl: false,
            attributionControl: false
        }).setView(center, 13);

        L.control.zoom({ position: 'topright' }).addTo(map);

        // Clean light tile layer matching Figma
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(map);

        // Draw Route Polylines
        data.routes.forEach(route => {
            if (route.coordinates && route.coordinates.length > 1) {
                const polyline = L.polyline(route.coordinates, {
                    color: route.color || '#3B82F6',
                    weight: 4,
                    opacity: 0.65,
                    dashArray: '8, 8'
                }).addTo(map);

                polyline.bindTooltip(`Route ${route.number}: ${route.name}`, { sticky: true });
                routePolylines[route.id] = polyline;
            }
        });

        // Draw Bus Stops
        data.stops.forEach(st => {
            const stopMarker = L.circleMarker([st.lat, st.lng], {
                radius: 4,
                color: '#94A3B8',
                fillColor: '#1E293B',
                fillOpacity: 0.9,
                weight: 2
            }).addTo(map);

            stopMarker.bindPopup(`
                <div class="map-popup-card">
                    <h4>🚏 ${st.name}</h4>
                    <p>Routes: <strong>${st.connectingRoutes ? st.connectingRoutes.join(', ') : 'All'}</strong></p>
                    <p>Avg Dwell: ${st.avgDwellSec}s | Shelter: ${st.shelter ? 'Yes' : 'No'}</p>
                </div>
            `);
            stopMarkers.push(stopMarker);
        });

        // Add Bus Markers
        updateBusMarkers();

        // Attach DOM listeners
        const searchInput = document.getElementById('liveMapSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                updateBusMarkers();
                refreshSideList();
            });
        }

        const routeFilter = document.getElementById('liveMapRouteFilter');
        if (routeFilter) {
            routeFilter.addEventListener('change', (e) => {
                selectedRouteFilter = e.target.value;
                highlightSelectedRoute(selectedRouteFilter);
                updateBusMarkers();
                refreshSideList();
            });
        }

        const centerBtn = document.getElementById('liveMapCenterBtn');
        if (centerBtn) {
            centerBtn.addEventListener('click', () => {
                if (map) map.setView(center, 13);
            });
        }

        // Start live sync interval
        if (liveUpdateInterval) clearInterval(liveUpdateInterval);
        liveUpdateInterval = setInterval(() => {
            updateBusMarkers();
            refreshSideList();
        }, 3000);

        setTimeout(() => { if (map) map.invalidateSize(); }, 300);
    }

    function highlightSelectedRoute(routeId) {
        Object.keys(routePolylines).forEach(id => {
            const pl = routePolylines[id];
            if (routeId === 'all' || id === routeId) {
                pl.setStyle({ opacity: 0.8, weight: id === routeId ? 6 : 4, dashArray: id === routeId ? null : '8, 8' });
                if (id === routeId && map) {
                    map.fitBounds(pl.getBounds(), { padding: [40, 40] });
                }
            } else {
                pl.setStyle({ opacity: 0.15, weight: 2 });
            }
        });
    }

    function updateBusMarkers() {
        if (!map) return;
        const data = window.TransitData || { buses: [] };

        data.buses.forEach(bus => {
            if (bus.status === 'Maintenance') {
                if (busMarkers[bus.id]) {
                    map.removeLayer(busMarkers[bus.id]);
                    delete busMarkers[bus.id];
                }
                return;
            }

            // Route filter check
            if (selectedRouteFilter !== 'all' && bus.routeId !== selectedRouteFilter) {
                if (busMarkers[bus.id]) {
                    map.removeLayer(busMarkers[bus.id]);
                    delete busMarkers[bus.id];
                }
                return;
            }

            const occPct = Math.round((bus.passengersOnboard / bus.capacity) * 100);
            let color = '#10B981';
            if (occPct > 85) color = '#EF4444';
            else if (occPct >= 50) color = '#F59E0B';

            const iconHtml = `
                <div class="custom-bus-pin" style="border-color:${color}">
                    <span class="bus-pin-label">${bus.number.replace('UP-53 BT ', '')}</span>
                    <span class="bus-pin-pulse" style="background:${color}"></span>
                </div>
            `;

            const customIcon = L.divIcon({
                className: 'custom-bus-icon-wrap',
                html: iconHtml,
                iconSize: [42, 42],
                iconAnchor: [21, 21]
            });

            const popupContent = `
                <div class="map-bus-popup">
                    <div class="popup-header">
                        <span class="badge" style="background:${color}; color:#fff">${bus.number}</span>
                        <span class="popup-speed">${bus.speed} km/h</span>
                    </div>
                    <div class="popup-route">${bus.routeName}</div>
                    <div class="popup-divider"></div>
                    <div class="popup-details">
                        <div class="p-row"><span>Driver:</span> <strong>${bus.driver}</strong></div>
                        <div class="p-row"><span>Conductor:</span> <strong>${bus.conductor}</strong></div>
                        <div class="p-row"><span>Next Stop:</span> <strong class="text-blue">${bus.nextStop}</strong></div>
                        <div class="p-row"><span>Est. Arrival:</span> <strong class="text-green">${bus.etaMins} mins</strong></div>
                        <div class="p-row"><span>Passengers:</span> <strong>${bus.passengersOnboard}/${bus.capacity} (${occPct}%)</strong></div>
                        ${bus.standingCount > 0 ? `<div class="p-row text-red"><span>Standing Pax:</span> <strong>${bus.standingCount}</strong></div>` : ''}
                        <div class="p-row"><span>Powertrain:</span> <strong>${bus.batteryOrFuel}</strong></div>
                    </div>
                    <button class="btn btn-outline btn-sm full-w mt-2" onclick="window.location.hash='#buses'">Inspect Fleet Telemetry</button>
                </div>
            `;

            if (busMarkers[bus.id]) {
                busMarkers[bus.id].setLatLng([bus.lat, bus.lng]);
                busMarkers[bus.id].setIcon(customIcon);
                busMarkers[bus.id].setPopupContent(popupContent);
            } else {
                const marker = L.marker([bus.lat, bus.lng], { icon: customIcon }).addTo(map);
                marker.bindPopup(popupContent, { maxWidth: 280, className: 'dark-popup' });
                busMarkers[bus.id] = marker;
            }
        });
    }

    function refreshSideList() {
        const listEl = document.getElementById('liveMapBusList');
        if (listEl && window.TransitData) {
            listEl.innerHTML = renderBusListItems(window.TransitData.buses);
        }
    }

    function focusBusOnMap(busId) {
        if (!map || !window.TransitData) return;
        const bus = window.TransitData.buses.find(b => b.id === busId);
        if (bus) {
            map.flyTo([bus.lat, bus.lng], 16, { animate: true, duration: 1 });
            if (busMarkers[busId]) {
                setTimeout(() => { busMarkers[busId].openPopup(); }, 800);
            }
        }
    }

    function destroyLiveMap() {
        if (liveUpdateInterval) {
            clearInterval(liveUpdateInterval);
            liveUpdateInterval = null;
        }
        if (map) {
            try { map.remove(); } catch (e) {}
            map = null;
        }
    }

    // Attach to window
    window.renderLiveMap = renderLiveMap;
    window.initLiveMap = initLiveMap;
    window.destroyLiveMap = destroyLiveMap;
    window.focusBusOnMap = focusBusOnMap;

})();
