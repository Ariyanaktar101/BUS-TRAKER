/**
 * TransitPulse — Exact Figma UI Implementation (12 Screens)
 * Matches Figma file DRhkpfA4SNlVEAR22jNA4G ("TransitPulse — Bus Tracking & Analytics UI")
 */

(function () {
    // Current interactive state
    const state = {
        activeScreen: '01', // '01' through '12'
        paxCount: 32,
        busCapacity: 50,
        route12AEta: 4,
        selectedRoute: '12A',
        conductorShiftActive: true,
        conductorBoardedThisStop: 4,
        conductorAlightedThisStop: 2,
        searchQuery: '',
        userProfile: {
            name: 'Aryan Kalra',
            email: 'aryan.kalra@transitpulse.in',
            initials: 'AK',
            role: 'Senior Conductor / Tier-3 Lead'
        }
    };

    // Shared SVG Icons from Figma Design
    const SVG = {
        statusBar: `
            <div class="fig-status-bar">
                <span class="fig-status-time">9:41</span>
                <div class="fig-status-icons">
                    <span>● ● ●</span>
                    <span style="font-size:11px; margin-left:6px;">100%</span>
                    <svg width="18" height="10" viewBox="0 0 24 12" fill="none" style="vertical-align:middle; margin-left:4px;">
                        <rect x="1" y="1" width="18" height="10" rx="3" stroke="#172438" stroke-width="1.5"/>
                        <rect x="3" y="3" width="14" height="6" rx="1.5" fill="#172438"/>
                        <path d="M21 4v4" stroke="#172438" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        `,
        bottomNav: (activeTab = 'home') => `
            <div class="fig-bottom-nav">
                <button class="fig-nav-item ${activeTab === 'home' ? 'active' : ''}" onclick="window.setFigmaScreen('01')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    <span>Home</span>
                </button>
                <button class="fig-nav-item ${activeTab === 'explore' ? 'active' : ''}" onclick="window.setFigmaScreen('05')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                    </svg>
                    <span>Explore</span>
                </button>
                <button class="fig-nav-item ${activeTab === 'saved' ? 'active' : ''}" onclick="window.setFigmaScreen('09')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Saved</span>
                </button>
                <button class="fig-nav-item ${activeTab === 'profile' ? 'active' : ''}" onclick="window.setFigmaScreen('08')">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Profile</span>
                </button>
            </div>
        `,
        bus3D: `
            <svg width="104" height="58" viewBox="0 0 104 58" fill="none" class="floating-bus-svg">
                <rect x="6" y="8" width="88" height="40" rx="12" fill="#295CE8"/>
                <rect x="12" y="14" width="22" height="16" rx="4" fill="#93C5FD"/>
                <rect x="38" y="14" width="24" height="16" rx="4" fill="#93C5FD"/>
                <rect x="66" y="14" width="22" height="16" rx="4" fill="#93C5FD"/>
                <circle cx="26" cy="48" r="8" fill="#0E1B30"/>
                <circle cx="26" cy="48" r="3" fill="#E2E8F0"/>
                <circle cx="74" cy="48" r="8" fill="#0E1B30"/>
                <circle cx="74" cy="48" r="3" fill="#E2E8F0"/>
                <rect x="4" y="24" width="4" height="10" rx="2" fill="#F59E0B"/>
                <rect x="92" y="24" width="4" height="10" rx="2" fill="#EF4444"/>
            </svg>
        `
    };

    // --- Screen 01: Commuter Home ---
    function renderScreen01() {
        return `
        <div class="fig-mobile-screen" data-screen="01">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <!-- Header -->
                <div class="fig-header-row">
                    <div>
                        <h1 class="fig-brand-title">TransitPulse</h1>
                        <span class="fig-eyebrow">GOOD MORNING</span>
                    </div>
                    <div class="fig-avatar-btn" onclick="window.setFigmaScreen('11')">
                        <span>AK</span>
                    </div>
                </div>

                <div class="fig-hero-heading-row">
                    <h2 class="fig-main-heading">Where are you<br>headed?</h2>
                    <div class="fig-floating-bus-box">
                        ${SVG.bus3D}
                    </div>
                </div>

                <!-- Destination Search Field -->
                <div class="fig-search-card" onclick="window.setFigmaScreen('05')">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7a8f" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span>Search bus, stop or destination</span>
                </div>

                <!-- Your Nearby Stop -->
                <div class="fig-section-header">
                    <h3>Your nearby stop</h3>
                </div>
                <div class="fig-nearby-stop-card" onclick="window.setFigmaScreen('06')">
                    <div class="fig-stop-icon-bg">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#295ce8" stroke-width="2.2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                    </div>
                    <div class="fig-stop-info">
                        <h4>Jadavpur 8B Bus Stand</h4>
                        <p>2 buses approaching</p>
                        <span class="fig-pill fig-pill-green">350 m AWAY</span>
                    </div>
                </div>

                <!-- Buses Near You -->
                <div class="fig-section-header-between">
                    <h3>Buses near you</h3>
                    <a href="javascript:void(0)" class="fig-link" onclick="window.setFigmaScreen('05')">See all</a>
                </div>

                <!-- Bus Card 12A -->
                <div class="fig-bus-card" onclick="window.setFigmaScreen('02')">
                    <div class="fig-bus-card-top">
                        <span class="fig-pill fig-pill-green">ARRIVING IN 4 MIN</span>
                    </div>
                    <div class="fig-bus-route-row">
                        <div class="fig-bus-number-badge">12A</div>
                        <div class="fig-bus-route-text">
                            <strong>Jadavpur → Howrah</strong>
                            <small>Via: Gariahat · Park Circus</small>
                        </div>
                        <div class="fig-bus-eta-col">
                            <span class="fig-eta-num text-green">4 min</span>
                            <span class="fig-eta-sub">ETA</span>
                        </div>
                    </div>
                    <div class="fig-divider"></div>
                    <div class="fig-bus-comfort-row">
                        <span class="text-green text-bold">● Seats likely available</span>
                        <div class="fig-mini-progress">
                            <div class="fig-mini-progress-fill" style="width: 40%; background:#1a9e66"></div>
                        </div>
                    </div>
                </div>

                <!-- Bus Card 21B -->
                <div class="fig-bus-card" onclick="window.setFigmaScreen('03')">
                    <div class="fig-bus-route-row" style="margin-top:6px;">
                        <div class="fig-bus-number-badge">21B</div>
                        <div class="fig-bus-route-text">
                            <strong>Jadavpur → New Town</strong>
                            <small>11 min away</small>
                        </div>
                        <div class="fig-bus-eta-col">
                            <span class="fig-eta-num">11 min</span>
                            <span class="fig-eta-sub">ETA</span>
                        </div>
                    </div>
                    <div class="fig-bus-comfort-row" style="margin-top:10px;">
                        <span class="fig-pill fig-pill-amber">MODERATE CROWD</span>
                    </div>
                </div>
            </div>
            ${SVG.bottomNav('home')}
        </div>
        `;
    }

    // --- Screen 02: Commuter Live Tracking Map ---
    function renderScreen02() {
        return `
        <div class="fig-mobile-screen" data-screen="02">
            ${SVG.statusBar}
            <div class="fig-screen-body no-pad">
                <div class="fig-top-bar-nav">
                    <button class="fig-back-btn" onclick="window.setFigmaScreen('01')">‹ Back</button>
                    <span class="fig-pill fig-pill-green">LIVE LOCATION</span>
                </div>

                <div class="fig-page-header-text">
                    <span class="fig-eyebrow text-teal">LIVE BUS TRACKING</span>
                    <h2 class="fig-title-23">Your bus is on the way</h2>
                </div>

                <!-- Map Canvas -->
                <div class="fig-map-canvas-container">
                    <div class="fig-map-grid-roads">
                        <div class="road-v" style="left:20px;"></div>
                        <div class="road-v" style="left:77px;"></div>
                        <div class="road-v" style="left:134px;"></div>
                        <div class="road-v" style="left:191px;"></div>
                        <div class="road-v" style="left:248px;"></div>
                        <div class="road-v" style="left:305px;"></div>
                        <div class="road-v" style="left:362px;"></div>
                        <div class="road-h" style="top:20px;"></div>
                        <div class="road-h" style="top:68px;"></div>
                        <div class="road-h" style="top:116px;"></div>
                        <div class="road-h" style="top:164px;"></div>
                        <div class="road-h" style="top:212px;"></div>
                        <div class="road-h" style="top:260px;"></div>
                        <div class="road-h" style="top:308px;"></div>
                    </div>

                    <!-- Route SVG Path -->
                    <svg class="fig-route-svg-path" viewBox="0 0 390 390" fill="none">
                        <path d="M 36 290 Q 90 260 140 220 T 235 180 T 330 80" stroke="#295ce8" stroke-width="6" stroke-linecap="round"/>
                    </svg>

                    <!-- Origin & Destination Markers -->
                    <div class="fig-map-pin origin" style="left:28px; top:280px;" title="Jadavpur 8B">
                        <div class="pin-dot"></div>
                    </div>
                    <div class="fig-map-pin destination" style="left:328px; top:70px;" title="Howrah Station">
                        <div class="pin-dot"></div>
                    </div>

                    <!-- Bus Pin Floating Marker -->
                    <div class="fig-live-bus-marker" style="left:215px; top:160px;">
                        <div class="bus-halo-ring"></div>
                        <div class="bus-pin-core">🚌</div>
                    </div>

                    <div class="fig-map-floating-badge" style="left:24px; top:20px;">
                        <span class="fig-pill fig-pill-white">BUS 12A</span>
                    </div>
                </div>

                <!-- Live ETA Floating Card -->
                <div class="fig-live-eta-panel">
                    <span class="fig-panel-label">ESTIMATED ARRIVAL</span>
                    <div class="fig-eta-highlight-row">
                        <div>
                            <span class="fig-eta-huge">4 min</span>
                            <span class="fig-distance-sub">1.2 km away</span>
                        </div>
                        <span class="fig-pill fig-pill-green">ON SCHEDULE</span>
                    </div>

                    <div class="fig-divider"></div>

                    <div class="fig-next-stop-row">
                        <div>
                            <span class="text-secondary" style="font-size:10px;">Next stop</span>
                            <strong class="d-block" style="font-size:14px; margin-top:2px;">Gariahat Crossing</strong>
                        </div>
                        <span class="text-green text-bold" style="font-size:12px;">2 min</span>
                    </div>

                    <button class="fig-btn-dark full-w" onclick="window.setFigmaScreen('03')">
                        View bus details
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    // --- Screen 03: Commuter Bus Capacity & Comfort ---
    function renderScreen03() {
        const occPct = Math.round((state.paxCount / state.busCapacity) * 100);
        const freeSeats = state.busCapacity - state.paxCount;

        return `
        <div class="fig-mobile-screen" data-screen="03">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <div class="fig-top-bar-nav">
                    <button class="fig-back-btn" onclick="window.setFigmaScreen('02')">‹ Back</button>
                    <span class="fig-eyebrow">BUS DETAILS</span>
                </div>

                <div class="fig-title-block">
                    <h2 class="fig-main-heading">Bus 12A</h2>
                    <p class="fig-sub-text">Jadavpur → Howrah · Via Gariahat</p>
                </div>

                <!-- Bus Identity Card -->
                <div class="fig-identity-card">
                    <div class="fig-bus-tile-circle">🚌</div>
                    <div class="fig-id-text">
                        <h3>WB 19A 4821</h3>
                        <p>AC • Regular service</p>
                        <span class="fig-pill fig-pill-green" style="margin-top:4px;">LIVE</span>
                    </div>
                </div>

                <div class="fig-section-header">
                    <h3>Passenger comfort</h3>
                </div>

                <!-- Occupancy Summary Card -->
                <div class="fig-occupancy-summary-card">
                    <span class="fig-panel-label">Estimated occupancy</span>
                    <div class="fig-pax-count-row">
                        <span class="fig-pax-count-num">${state.paxCount} / ${state.busCapacity}</span>
                        <span class="fig-pill fig-pill-amber">MODERATE CROWD</span>
                    </div>

                    <div class="fig-capacity-bar-track">
                        <div class="fig-capacity-bar-fill" style="width: ${occPct}%; background: #0dad9e;"></div>
                    </div>

                    <div class="fig-occ-meta">
                        <strong>${occPct}% occupied</strong>
                        <p class="text-green text-bold">${freeSeats > 0 ? `${freeSeats} seats may be available` : 'Standing only'}</p>
                        <small class="text-secondary">Crowd level is an estimate via overhead optical sensors</small>
                    </div>
                </div>

                <!-- Upcoming Stops Timeline -->
                <div class="fig-section-header">
                    <h3>Upcoming stops</h3>
                </div>
                <div class="fig-stop-timeline">
                    <div class="fig-timeline-node">
                        <div class="timeline-dot current"></div>
                        <div class="timeline-line"></div>
                        <div class="timeline-info">
                            <strong>Gariahat Crossing</strong>
                        </div>
                        <span class="text-green text-bold">2 min</span>
                    </div>
                    <div class="fig-timeline-node">
                        <div class="timeline-dot"></div>
                        <div class="timeline-line"></div>
                        <div class="timeline-info">
                            <strong>Park Circus</strong>
                        </div>
                        <span class="text-secondary">8 min</span>
                    </div>
                    <div class="fig-timeline-node">
                        <div class="timeline-dot end"></div>
                        <div class="timeline-info">
                            <strong>Howrah Station</strong>
                        </div>
                        <span class="text-secondary">22 min</span>
                    </div>
                </div>

                <button class="fig-btn-blue full-w mt-3" onclick="window.setFigmaScreen('04')">
                    Track this bus & Conductor View
                </button>
            </div>
            ${SVG.bottomNav('explore')}
        </div>
        `;
    }

    // --- Screen 04: Conductor Trip Control ---
    function renderScreen04() {
        const occPct = Math.round((state.paxCount / state.busCapacity) * 100);

        return `
        <div class="fig-mobile-screen" data-screen="04">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <div class="fig-header-row">
                    <div>
                        <span class="fig-eyebrow text-teal">TRANSITPULSE</span>
                        <h2 class="fig-title-26">Trip control</h2>
                    </div>
                    <span class="fig-pill fig-pill-green">● SYNCED</span>
                </div>

                <!-- Active Trip Card -->
                <div class="fig-card mt-2">
                    <div class="fig-header-between">
                        <span class="fig-panel-label">ACTIVE ROUTE</span>
                        <span class="fig-pill fig-pill-green">IN SERVICE</span>
                    </div>
                    <h3 class="fig-card-route-title">Route 12A</h3>
                    <p class="fig-sub-text">Bus WB 19A 4821 · Shift 1</p>
                </div>

                <!-- Passenger Counter Card -->
                <div class="fig-card mt-2">
                    <div class="fig-header-between">
                        <span class="fig-panel-label">Passengers on board</span>
                        <span class="fig-pill fig-pill-blue">${occPct}% CAPACITY</span>
                    </div>
                    <div class="fig-counter-display">
                        <span class="fig-huge-counter">${state.paxCount}</span>
                        <span class="fig-of-seats">of ${state.busCapacity} seats</span>
                    </div>
                    <div class="fig-capacity-bar-track mt-2">
                        <div class="fig-capacity-bar-fill" style="width:${Math.min(occPct, 100)}%; background:#14b0a3;"></div>
                    </div>
                </div>

                <!-- Conductor Quick Buttons -->
                <div class="fig-conductor-buttons mt-2">
                    <button class="fig-btn-blue full-w" onclick="window.figmaPaxDelta(1)">
                        ＋ &nbsp; Passenger boarded
                    </button>
                    <button class="fig-btn-dark-outline full-w mt-2" onclick="window.figmaPaxDelta(-1)">
                        − &nbsp; Passenger alighted
                    </button>
                    <small class="text-secondary text-center d-block mt-1">Updates are saved automatically</small>
                </div>

                <!-- Next Stop Card -->
                <div class="fig-card fig-card-compact mt-2" onclick="window.setFigmaScreen('06')">
                    <div class="fig-next-stop-compact">
                        <div class="fig-pin-circle">📍</div>
                        <div class="fig-ns-text">
                            <span class="fig-panel-label" style="font-size:9px;">NEXT STOP</span>
                            <strong>Central Market</strong>
                        </div>
                        <span class="text-green text-bold">3 min</span>
                    </div>
                </div>

                <!-- Offline Sync Banner -->
                <div class="fig-offline-banner mt-2" onclick="window.setFigmaScreen('10')">
                    <span class="fig-wifi-icon">📶</span>
                    <span>Offline ready · 2 updates queued</span>
                </div>
            </div>
            ${SVG.bottomNav('explore')}
        </div>
        `;
    }

    // --- Screen 05: Search Routes & Results ---
    function renderScreen05() {
        const routes = [
            { num: '12A', from: 'Jadavpur', to: 'Howrah', freq: 'Every 8 mins', eta: '4 min', color: '#295ce8' },
            { num: '21B', from: 'Jadavpur', to: 'New Town', freq: 'Every 12 mins', eta: '11 min', color: '#10b981' },
            { num: '8C', from: 'Salt Lake', to: 'Airport', freq: 'Every 15 mins', eta: '18 min', color: '#f59e0b' },
            { num: '47A', from: 'Ruby Hospital', to: 'Tollygunge', freq: 'Every 10 mins', eta: '7 min', color: '#8b5cf6' }
        ];

        return `
        <div class="fig-mobile-screen" data-screen="05">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <div class="fig-header-row">
                    <div>
                        <h2 class="fig-title-26">Find your bus</h2>
                        <p class="fig-sub-text">Search Tier-3 corridors & schedules</p>
                    </div>
                </div>

                <div class="fig-search-card mt-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7a8f" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Search route number or stop..." value="${state.searchQuery}" oninput="window.updateFigmaSearch(this.value)">
                </div>

                <div class="fig-section-header">
                    <h3>Popular routes</h3>
                </div>

                <div class="fig-routes-list">
                    ${routes.map(r => `
                        <div class="fig-route-result-card" onclick="window.setFigmaScreen('06')">
                            <div class="fig-route-badge-box" style="background:${r.color};">
                                ${r.num}
                            </div>
                            <div class="fig-route-details">
                                <strong>${r.from} → ${r.to}</strong>
                                <small>${r.freq}</small>
                            </div>
                            <span class="fig-route-eta-tag">${r.eta}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${SVG.bottomNav('explore')}
        </div>
        `;
    }

    // --- Screen 06: Route Details & Stops ---
    function renderScreen06() {
        const stops = [
            { name: 'Jadavpur 8B Terminal', time: 'Departed', done: true },
            { name: 'Gariahat Crossing', time: '4 min (Next)', current: true },
            { name: 'Ballygunge Phari', time: '9 min' },
            { name: 'Park Circus 7-Point', time: '16 min' },
            { name: 'Exide Crossing / Rabindra Sadan', time: '24 min' },
            { name: 'Howrah Station Terminal', time: '35 min' }
        ];

        return `
        <div class="fig-mobile-screen" data-screen="06">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <div class="fig-top-bar-nav">
                    <button class="fig-back-btn" onclick="window.setFigmaScreen('05')">‹ Back</button>
                    <span class="fig-pill fig-pill-green">● LIVE SERVICE</span>
                </div>

                <h2 class="fig-title-26">Route 12A details</h2>
                <p class="fig-sub-text">Jadavpur 8B ⇄ Howrah Station</p>

                <div class="fig-card mt-2">
                    <span class="fig-panel-label">NEXT BUS ARRIVAL</span>
                    <div class="fig-header-between mt-1">
                        <span class="fig-eta-huge text-green">4 min</span>
                        <span class="fig-pill fig-pill-amber">MODERATE CROWD</span>
                    </div>
                </div>

                <div class="fig-section-header">
                    <h3>Major corridor stops</h3>
                </div>

                <div class="fig-stop-timeline">
                    ${stops.map((s, idx) => `
                        <div class="fig-timeline-node">
                            <div class="timeline-dot ${s.current ? 'current' : s.done ? 'done' : ''}"></div>
                            ${idx < stops.length - 1 ? '<div class="timeline-line"></div>' : ''}
                            <div class="timeline-info">
                                <strong>${s.name}</strong>
                            </div>
                            <span class="${s.current ? 'text-green text-bold' : 'text-secondary'}">${s.time}</span>
                        </div>
                    `).join('')}
                </div>

                <button class="fig-btn-blue full-w mt-3" onclick="window.setFigmaScreen('02')">
                    Open in Live Tracking Map
                </button>
            </div>
            ${SVG.bottomNav('explore')}
        </div>
        `;
    }

    // --- Screen 07: Notifications ---
    function renderScreen07() {
        const notifs = [
            { icon: '🚌', title: 'Bus 12A is approaching', body: 'Estimated arrival at Gariahat Crossing in 2 mins.', time: 'Just now', color: '#295ce8' },
            { icon: '⚠️', title: 'Route 21B delayed', body: 'Delay of 6 mins due to bypass road maintenance.', time: '14 min ago', color: '#e38c1f' },
            { icon: '💺', title: 'Low crowd alert', body: 'Bus WB 19A 4821 has 18 seats available right now.', time: '28 min ago', color: '#1a9e66' },
            { icon: '🎟️', title: 'Monthly pass active', body: 'TransitPulse Plus active until end of month.', time: '2 hours ago', color: '#8b5cf6' }
        ];

        return `
        <div class="fig-mobile-screen" data-screen="07">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <h2 class="fig-title-26">Notifications</h2>
                <p class="fig-sub-text">Live transit updates & alerts</p>

                <div class="fig-section-header">
                    <h3>Today</h3>
                </div>

                <div class="fig-notifs-list">
                    ${notifs.map(n => `
                        <div class="fig-notif-card">
                            <div class="fig-notif-icon-circle" style="background:${n.color}20; color:${n.color};">
                                ${n.icon}
                            </div>
                            <div class="fig-notif-content">
                                <h4>${n.title}</h4>
                                <p>${n.body}</p>
                                <small>${n.time}</small>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${SVG.bottomNav('saved')}
        </div>
        `;
    }

    // --- Screen 08: Profile & Settings ---
    function renderScreen08() {
        const menuItems = [
            { title: 'Notification settings', sub: 'Bus approach & delay alerts', screen: '07' },
            { title: 'Offline sync storage', sub: 'Cached corridor maps & timetables', screen: '10' },
            { title: 'Passenger subscription', sub: 'TransitPulse Plus Plan details', screen: '12' },
            { title: 'Trip history', sub: 'View completed journeys', screen: '09' },
            { title: 'App language', sub: 'English (US) / Hindi / Bengali', screen: '11' },
            { title: 'Help & support', sub: 'Emergency contacts & depot helpline', screen: '11' }
        ];

        return `
        <div class="fig-mobile-screen" data-screen="08">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <h2 class="fig-title-26">Profile & settings</h2>
                <p class="fig-sub-text">Preferences & conductor identity</p>

                <!-- Profile Identity Card -->
                <div class="fig-profile-card mt-2" onclick="window.setFigmaScreen('11')">
                    <div class="fig-avatar-circle-lg">
                        <span>${state.userProfile.initials}</span>
                    </div>
                    <div class="fig-profile-text">
                        <h3>${state.userProfile.name}</h3>
                        <p>${state.userProfile.email}</p>
                        <span class="fig-pill fig-pill-blue" style="margin-top:4px;">${state.userProfile.role}</span>
                    </div>
                </div>

                <!-- Settings Rows -->
                <div class="fig-settings-list mt-3">
                    ${menuItems.map(m => `
                        <div class="fig-settings-row" onclick="window.setFigmaScreen('${m.screen}')">
                            <div class="fig-sr-text">
                                <strong>${m.title}</strong>
                                <small>${m.sub}</small>
                            </div>
                            <span class="fig-chevron">›</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${SVG.bottomNav('profile')}
        </div>
        `;
    }

    // --- Screen 09: Trip History ---
    function renderScreen09() {
        const trips = [
            { bus: '12A', route: 'Jadavpur 8B → Howrah', date: 'Today · 8:30 AM', fare: '₹15' },
            { bus: '21B', route: 'New Town → Jadavpur', date: 'Yesterday · 6:45 PM', fare: '₹20' },
            { bus: '12A', route: 'Gariahat → Howrah Station', date: '06 Nov · 9:15 AM', fare: '₹15' },
            { bus: '8C', route: 'Salt Lake → Airport Gate 1', date: '04 Nov · 11:20 AM', fare: '₹25' },
            { bus: '47A', route: 'Ruby Hospital → Tollygunge', date: '02 Nov · 5:10 PM', fare: '₹15' }
        ];

        return `
        <div class="fig-mobile-screen" data-screen="09">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <h2 class="fig-title-26">Your trips</h2>
                <p class="fig-sub-text">Completed passenger travel history</p>

                <div class="fig-filter-row mt-2">
                    <span class="fig-pill fig-pill-blue">November 2026 ▾</span>
                    <span class="text-secondary" style="font-size:12px; margin-left:auto;">Total: ₹90 spent</span>
                </div>

                <div class="fig-trips-list mt-2">
                    ${trips.map(t => `
                        <div class="fig-trip-card" onclick="window.setFigmaScreen('03')">
                            <div class="fig-trip-badge">${t.bus}</div>
                            <div class="fig-trip-info">
                                <strong>${t.route}</strong>
                                <small>${t.date}</small>
                            </div>
                            <span class="fig-trip-fare">${t.fare}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${SVG.bottomNav('saved')}
        </div>
        `;
    }

    // --- Screen 10: Conductor Passenger Count ---
    function renderScreen10() {
        const occPct = Math.round((state.paxCount / state.busCapacity) * 100);

        return `
        <div class="fig-mobile-screen" data-screen="10">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <div class="fig-header-row">
                    <div>
                        <h2 class="fig-title-26">Passenger count</h2>
                        <p class="fig-sub-text">Trip 12A · Jadavpur → Howrah</p>
                    </div>
                </div>

                <div class="fig-offline-tag mt-1">
                    <span>● OFFLINE · SAVED LOCALLY</span>
                </div>

                <!-- Big Count Card -->
                <div class="fig-count-card mt-2">
                    <span class="fig-panel-label">PASSENGERS ONBOARD</span>
                    <div class="fig-count-huge-val">${state.paxCount}</div>
                    <span class="fig-of-seats">of ${state.busCapacity} seats</span>

                    <div class="fig-capacity-bar-track mt-2">
                        <div class="fig-capacity-bar-fill" style="width:${occPct}%; background:#0dad9e;"></div>
                    </div>
                    <span class="text-green text-bold d-block mt-1" style="font-size:11px;">${occPct}% capacity</span>
                </div>

                <div class="fig-section-header">
                    <h3>Update passenger count</h3>
                </div>

                <!-- Boarding Counter Card -->
                <div class="fig-counter-interactive-card">
                    <div class="fig-counter-text">
                        <strong>Boarded at this stop</strong>
                    </div>
                    <div class="fig-stepper-btn-group">
                        <button class="fig-mini-step-btn" onclick="window.figmaBoardDelta(-1)">−</button>
                        <span class="fig-step-val text-green">+ ${state.conductorBoardedThisStop}</span>
                        <button class="fig-mini-step-btn" onclick="window.figmaBoardDelta(1)">＋</button>
                    </div>
                </div>

                <!-- Alighting Counter Card -->
                <div class="fig-counter-interactive-card mt-2">
                    <div class="fig-counter-text">
                        <strong>Alighted at this stop</strong>
                    </div>
                    <div class="fig-stepper-btn-group">
                        <button class="fig-mini-step-btn" onclick="window.figmaAlightDelta(-1)">−</button>
                        <span class="fig-step-val text-amber">− ${state.conductorAlightedThisStop}</span>
                        <button class="fig-mini-step-btn" onclick="window.figmaAlightDelta(1)">＋</button>
                    </div>
                </div>

                <button class="fig-btn-blue full-w mt-3" onclick="window.figmaSyncStopCount()">
                    Save stop count & continue
                </button>
            </div>
            ${SVG.bottomNav('explore')}
        </div>
        `;
    }

    // --- Screen 11: My Profile Account Overview ---
    function renderScreen11() {
        return `
        <div class="fig-mobile-screen" data-screen="11">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <h2 class="fig-title-26">My profile</h2>
                <p class="fig-sub-text">Commuter & staff credentials</p>

                <div class="fig-account-overview-card mt-2">
                    <div class="fig-avatar-circle-lg">
                        <span>AK</span>
                    </div>
                    <div class="fig-account-details">
                        <h3>${state.userProfile.name}</h3>
                        <p>${state.userProfile.email}</p>
                        <button class="fig-btn-outline-sm mt-1" onclick="alert('Profile details edit modal')">Edit profile</button>
                    </div>
                </div>

                <div class="fig-section-header">
                    <h3>Account information</h3>
                </div>

                <div class="fig-settings-list">
                    <div class="fig-settings-row">
                        <div class="fig-sr-text">
                            <strong>Conductor License / ID</strong>
                            <small>UP-53-COND-8419</small>
                        </div>
                        <span class="fig-pill fig-pill-green">VERIFIED</span>
                    </div>
                    <div class="fig-settings-row">
                        <div class="fig-sr-text">
                            <strong>Depot Station</strong>
                            <small>Gorakhpur / Charphatak Municipal Depot</small>
                        </div>
                    </div>
                    <div class="fig-settings-row">
                        <div class="fig-sr-text">
                            <strong>Assigned Fleet Route</strong>
                            <small>Route 12A · Tata Ultra Electric</small>
                        </div>
                    </div>
                    <div class="fig-settings-row">
                        <div class="fig-sr-text">
                            <strong>Smart Card Wallet</strong>
                            <small>Balance: ₹340.00</small>
                        </div>
                        <button class="fig-link" onclick="window.setFigmaScreen('12')">Recharge</button>
                    </div>
                </div>
            </div>
            ${SVG.bottomNav('profile')}
        </div>
        `;
    }

    // --- Screen 12: Subscription & Plans ---
    function renderScreen12() {
        return `
        <div class="fig-mobile-screen" data-screen="12">
            ${SVG.statusBar}
            <div class="fig-screen-body">
                <h2 class="fig-title-26">Choose your plan</h2>
                <p class="fig-sub-text">Unlimited transit alerts & live seat reserving</p>

                <!-- Current Plan Banner -->
                <div class="fig-current-plan-banner mt-2">
                    <span class="fig-panel-label">CURRENT ACTIVE PLAN</span>
                    <strong class="d-block" style="font-size:15px; margin-top:2px;">Free Tier (Ad-Supported)</strong>
                </div>

                <!-- Plus Plan Card -->
                <div class="fig-plus-plan-card mt-3">
                    <div class="fig-header-between">
                        <h3 class="fig-plus-title">TransitPulse Plus</h3>
                        <span class="fig-pill fig-pill-blue">POPULAR</span>
                    </div>

                    <div class="fig-price-row mt-1">
                        <span class="fig-price-num">₹49</span>
                        <span class="fig-price-period">/ month</span>
                    </div>

                    <ul class="fig-benefit-list mt-2">
                        <li>✓ Real-time IR seat vacancy notifications</li>
                        <li>✓ Offline bus schedules & timetable sync</li>
                        <li>✓ Priority SOS distress alert line</li>
                        <li>✓ Free unlimited smart ticket recharges</li>
                    </ul>

                    <button class="fig-btn-blue full-w mt-2" onclick="alert('Subscribed to TransitPulse Plus!')">
                        Upgrade for ₹49
                    </button>
                </div>

                <!-- Free Plan -->
                <div class="fig-card mt-3">
                    <div class="fig-header-between">
                        <strong>Standard Municipal Pass</strong>
                        <span>₹0 / Free</span>
                    </div>
                    <p class="fig-sub-text mt-1">Basic live GPS tracking & stop arrivals with standard ads.</p>
                </div>
            </div>
            ${SVG.bottomNav('profile')}
        </div>
        `;
    }

    // --- Screen Router ---
    const screens = {
        '01': { title: '01 Commuter — Home', render: renderScreen01 },
        '02': { title: '02 Commuter — Live tracking', render: renderScreen02 },
        '03': { title: '03 Commuter — Bus capacity', render: renderScreen03 },
        '04': { title: '04 Conductor — Trip control', render: renderScreen04 },
        '05': { title: '05 Search — Routes & results', render: renderScreen05 },
        '06': { title: '06 Route details — Stops', render: renderScreen06 },
        '07': { title: '07 Notifications', render: renderScreen07 },
        '08': { title: '08 Profile & settings', render: renderScreen08 },
        '09': { title: '09 Trip history', render: renderScreen09 },
        '10': { title: '10 Conductor — Passenger count', render: renderScreen10 },
        '11': { title: '11 Profile — Account overview', render: renderScreen11 },
        '12': { title: '12 Subscription — Plans & benefits', render: renderScreen12 }
    };

    // Public API
    function renderActiveScreen() {
        const scr = screens[state.activeScreen] || screens['01'];
        return scr.render();
    }

    function renderAll12Gallery() {
        return `
        <div class="figma-gallery-view">
            <div class="gallery-toolbar">
                <div class="gallery-title-group">
                    <h2 class="gallery-heading">TransitPulse — Complete Figma Artboards (12 Screens)</h2>
                    <p class="text-secondary">Direct recreation of Figma prototype <code>DRhkpfA4SNlVEAR22jNA4G</code> in Dev Mode.</p>
                </div>
                <div class="gallery-actions">
                    <button class="btn btn-primary" onclick="window.setViewMode('simulator')">
                        Open Interactive Simulator
                    </button>
                </div>
            </div>

            <div class="figma-artboards-horizontal-scroll">
                ${Object.keys(screens).map(key => `
                    <div class="gallery-screen-item" onclick="window.setFigmaScreen('${key}'); window.setViewMode('simulator');">
                        <div class="gallery-screen-badge">${screens[key].title}</div>
                        <div class="gallery-screen-frame">
                            ${screens[key].render()}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    function setFigmaScreen(screenKey) {
        if (screens[screenKey]) {
            state.activeScreen = screenKey;
            const container = document.getElementById('figmaScreenMount');
            if (container) {
                container.innerHTML = screens[screenKey].render();
            }
            // Update active pill in switcher
            document.querySelectorAll('.screen-pill-btn').forEach(btn => {
                if (btn.getAttribute('data-screen') === screenKey) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }
    }

    function figmaPaxDelta(delta) {
        state.paxCount = Math.max(0, Math.min(state.busCapacity + 15, state.paxCount + delta));
        setFigmaScreen(state.activeScreen);
    }

    function figmaBoardDelta(delta) {
        state.conductorBoardedThisStop = Math.max(0, state.conductorBoardedThisStop + delta);
        setFigmaScreen('10');
    }

    function figmaAlightDelta(delta) {
        state.conductorAlightedThisStop = Math.max(0, state.conductorAlightedThisStop + delta);
        setFigmaScreen('10');
    }

    function figmaSyncStopCount() {
        state.paxCount = Math.max(0, state.paxCount + state.conductorBoardedThisStop - state.conductorAlightedThisStop);
        state.conductorBoardedThisStop = 0;
        state.conductorAlightedThisStop = 0;
        alert(`Stop count saved & synced to TransitPulse Depot! Total onboard now: ${state.paxCount}`);
        setFigmaScreen('04');
    }

    function updateFigmaSearch(val) {
        state.searchQuery = val;
    }

    // Attach to window
    window.FigmaScreens = {
        screens: screens,
        state: state,
        renderActiveScreen: renderActiveScreen,
        renderAll12Gallery: renderAll12Gallery,
        setFigmaScreen: setFigmaScreen
    };

    window.setFigmaScreen = setFigmaScreen;
    window.figmaPaxDelta = figmaPaxDelta;
    window.figmaBoardDelta = figmaBoardDelta;
    window.figmaAlightDelta = figmaAlightDelta;
    window.figmaSyncStopCount = figmaSyncStopCount;
    window.updateFigmaSearch = updateFigmaSearch;

})();
