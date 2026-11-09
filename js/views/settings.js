/**
 * TransitPulse — System Settings & Network Configuration
 */

(function () {
    let currentCity = 'Gorakhpur, UP';
    let simSpeed = '1x';
    let audioAlerts = true;
    let pushNotifs = true;

    function renderSettings() {
        return `
        <div class="view-header">
            <div>
                <h2>System Settings & Transit Configuration</h2>
                <p class="text-secondary">Configure municipal transit parameters, telemetry sensors, and IoT streaming settings.</p>
            </div>
        </div>

        <div class="settings-grid">
            <!-- Municipal Region -->
            <div class="card settings-card">
                <div class="card-header">
                    <h3>Tier-3 Municipal Deployment</h3>
                    <span class="badge badge-primary">Active Grid</span>
                </div>
                <div class="settings-body">
                    <div class="form-group mb-3">
                        <label class="form-label">Selected Metro/District:</label>
                        <select class="form-select" id="settingsCity" onchange="window.saveSettings()">
                            <option value="Gorakhpur, UP" ${currentCity === 'Gorakhpur, UP' ? 'selected' : ''}>Gorakhpur Smart City Transit (UP-53)</option>
                            <option value="Prayagraj, UP" ${currentCity === 'Prayagraj, UP' ? 'selected' : ''}>Prayagraj Sangam City Transit (UP-70)</option>
                            <option value="Varanasi, UP" ${currentCity === 'Varanasi, UP' ? 'selected' : ''}>Varanasi Kashi City Bus Service (UP-65)</option>
                            <option value="Jhansi, UP" ${currentCity === 'Jhansi, UP' ? 'selected' : ''}>Jhansi Bundelkhand Transit (UP-93)</option>
                            <option value="Bareilly, UP" ${currentCity === 'Bareilly, UP' ? 'selected' : ''}>Bareilly City Bus Transport (UP-25)</option>
                        </select>
                    </div>

                    <div class="form-group mb-3">
                        <label class="form-label">Simulation GPS Refresh Rate:</label>
                        <select class="form-select" id="settingsSimRate" onchange="window.saveSettings()">
                            <option value="3s" selected>Ultra-fast Real-time (Every 3 seconds)</option>
                            <option value="10s">Battery Saver Mode (Every 10 seconds)</option>
                            <option value="30s">Low Bandwidth Mode (Every 30 seconds)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- IoT & Sensors -->
            <div class="card settings-card">
                <div class="card-header">
                    <h3>IoT Hardware & Telemetry Stack</h3>
                    <span class="badge badge-running">Sensors Online</span>
                </div>
                <div class="settings-body">
                    <div class="toggle-setting-row">
                        <div>
                            <strong>Overhead IR Passenger Counters</strong>
                            <p class="text-secondary">Dual optical infrared beams at front & rear doors</p>
                        </div>
                        <input type="checkbox" checked disabled>
                    </div>

                    <div class="toggle-setting-row">
                        <div>
                            <strong>Audio & Vibration Alerts</strong>
                            <p class="text-secondary">Sound alarm when bus exceeds 90% seat capacity</p>
                        </div>
                        <input type="checkbox" id="settingsAudio" ${audioAlerts ? 'checked' : ''} onchange="window.saveSettings()">
                    </div>

                    <div class="toggle-setting-row">
                        <div>
                            <strong>Auto-Recalculate Dynamic ETA</strong>
                            <p class="text-secondary">Factor in live level-crossing jams & chowk congestion</p>
                        </div>
                        <input type="checkbox" checked disabled>
                    </div>
                </div>
            </div>

            <!-- System About Architecture -->
            <div class="card settings-card full-w">
                <div class="card-header">
                    <h3>About TransitPulse (Software Track Architecture)</h3>
                    <span class="badge badge-primary">Version 2.1.0-Release</span>
                </div>
                <div class="settings-body">
                    <p class="text-secondary mb-3">
                        TransitPulse is specifically engineered for Tier-3 Indian cities with irregular road grids, high peak-hour surges, and variable mobile connectivity. It delivers dual lightweight mobile and web interfaces for conductors and commuters, backed by real-time GPS tracking and seat occupancy analytics.
                    </p>
                    <div class="tech-stack-chips">
                        <div class="chip"><strong>Engine:</strong> Reactive SPA Architecture</div>
                        <div class="chip"><strong>Cartography:</strong> Leaflet.js with CartoDB Voyager Tiles (Figma Light Theme)</div>
                        <div class="chip"><strong>Data Visualizations:</strong> Chart.js 4.4</div>
                        <div class="chip"><strong>Seating Layout:</strong> 52/56-Passenger 2×2 Urban Chassis</div>
                        <div class="chip"><strong>Offline Strategy:</strong> Cached Network First with Local Storage Sync</div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function saveSettings() {
        const cityEl = document.getElementById('settingsCity');
        if (cityEl) currentCity = cityEl.value;
        const audioEl = document.getElementById('settingsAudio');
        if (audioEl) audioAlerts = audioEl.checked;
        if (window.showToast) window.showToast('System configuration saved.');
    }

    window.renderSettings = renderSettings;
    window.saveSettings = saveSettings;
})();
