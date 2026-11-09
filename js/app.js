/**
 * TransitPulse — Master Application Controller & SPA Router
 */

(function () {
    // Current route state
    let currentRoute = 'dashboard';

    // Mock initial notifications
    const notifications = [
        { id: 1, title: 'Overcrowding Alert', text: 'Bus UP-53 BT 3089 (Route 102) has 14 standing passengers.', time: '2m ago', type: 'alert' },
        { id: 2, title: 'Railway Crossing Jam Cleared', text: 'Route 101 normal speed resumed at Level Crossing.', time: '8m ago', type: 'info' },
        { id: 3, title: 'Driver Shift Commenced', text: 'Rajeshwar Yadav started morning shift on Bus 4012.', time: '14m ago', type: 'success' },
        { id: 4, title: 'EV Fleet Battery Status', text: 'Bus 4025 charged to 91% at Charphatak Depot.', time: '22m ago', type: 'info' },
        { id: 5, title: 'Scheduled Trip Alert', text: 'Night Express Loop departing Gorakhpur Junction at 22:30.', time: '40m ago', type: 'info' }
    ];

    // --- Toast Notification Handler ---
    function showToast(message, duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast-pill';
        toast.innerHTML = `
            <span class="toast-dot"></span>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => { toast.remove(); }, 300);
        }, duration);
    }
    window.showToast = showToast;

    // --- Clock Updater ---
    function updateClock() {
        const clockEl = document.getElementById('liveClock');
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST';
    }

    // --- Notification Dropdown Handlers ---
    function initNotifications() {
        const notifBtn = document.getElementById('notificationBtn');
        const notifDropdown = document.getElementById('notifDropdown');
        const notifList = document.getElementById('notifList');
        const notifBadge = document.getElementById('notifBadge');
        const clearBtn = document.getElementById('clearNotifs');

        if (!notifBtn || !notifDropdown) return;

        function renderNotifItems() {
            if (notifications.length === 0) {
                notifList.innerHTML = `<div class="empty-notif">No new notifications</div>`;
                if (notifBadge) notifBadge.style.display = 'none';
                return;
            }
            if (notifBadge) {
                notifBadge.style.display = 'inline-block';
                notifBadge.textContent = notifications.length;
            }
            notifList.innerHTML = notifications.map(n => `
                <div class="notif-item ${n.type}">
                    <div class="notif-item-title">${n.title}</div>
                    <div class="notif-item-text">${n.text}</div>
                    <div class="notif-item-time">${n.time}</div>
                </div>
            `).join('');
        }

        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
            renderNotifItems();
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
                notifDropdown.classList.remove('active');
            }
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                notifications.length = 0;
                renderNotifItems();
            });
        }

        renderNotifItems();
    }

    // --- Mobile Sidebar Controls ---
    function initMobileSidebar() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const closeBtn = document.getElementById('sidebarClose');

        if (!sidebar) return;

        function openSidebar() {
            sidebar.classList.add('open');
            if (overlay) overlay.classList.add('active');
        }

        function closeSidebar() {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }

        if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Close on route navigation in mobile
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', closeSidebar);
        });
    }

    // --- Theme Toggle ---
    function initThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        const moonIcon = toggleBtn.querySelector('.icon-moon');
        const sunIcon = toggleBtn.querySelector('.icon-sun');

        // Default to clean Figma Light Theme
        let currentTheme = localStorage.getItem('transitpulse_theme') || 'light';

        function applyTheme() {
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                if (moonIcon) moonIcon.style.display = 'none';
                if (sunIcon) sunIcon.style.display = 'block';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                document.body.classList.add('light-theme');
                document.body.classList.remove('dark-theme');
                if (moonIcon) moonIcon.style.display = 'block';
                if (sunIcon) sunIcon.style.display = 'none';
            }
        }

        applyTheme();

        toggleBtn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('transitpulse_theme', currentTheme);
            applyTheme();
        });
    }

    // --- Global Search Input ---
    function initGlobalSearch() {
        const searchInput = document.getElementById('globalSearch');
        if (!searchInput) return;

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.hash = '#buses';
                    setTimeout(() => {
                        const busSearch = document.getElementById('busSearchInput');
                        if (busSearch) {
                            busSearch.value = query;
                            busSearch.dispatchEvent(new Event('input'));
                        }
                    }, 200);
                }
            }
        });
    }

    // --- Router & View Controller ---
    function renderFigmaAppShell() {
        if (!window.FigmaScreens) return '<div>Loading Figma UI...</div>';
        
        const screenKeys = Object.keys(window.FigmaScreens.screens);
        const currentActive = window.FigmaScreens.state.activeScreen;

        return `
        <div class="figma-app-wrapper">
            <!-- Screen Quick Switcher Bar -->
            <div class="figma-mode-switcher-bar">
                <div class="screen-pills-scroller">
                    ${screenKeys.map(k => `
                        <button class="screen-pill-btn ${k === currentActive ? 'active' : ''}" data-screen="${k}" onclick="window.setFigmaScreen('${k}')">
                            ${window.FigmaScreens.screens[k].title}
                        </button>
                    `).join('')}
                </div>
                <div class="view-mode-tabs">
                    <button class="view-mode-tab active" onclick="window.location.hash='#figma-app'">📱 Phone Simulator</button>
                    <button class="view-mode-tab" onclick="window.location.hash='#figma-gallery'">🖼️ All 12 Artboards</button>
                </div>
            </div>

            <!-- Phone Frame -->
            <div class="mobile-device-chassis">
                <div class="mobile-dynamic-island"></div>
                <div id="figmaScreenMount">
                    ${window.FigmaScreens.renderActiveScreen()}
                </div>
            </div>
        </div>
        `;
    }

    window.setViewMode = function(mode) {
        if (mode === 'simulator') window.location.hash = '#figma-app';
        else if (mode === 'gallery') window.location.hash = '#figma-gallery';
    };

    function navigateTo(hash) {
        let viewName = hash.replace(/^#\/?/, '').trim();
        if (!viewName) viewName = 'figma-app';

        // Cleanup before navigating away from live map
        if (currentRoute === 'live-map' && viewName !== 'live-map') {
            if (window.destroyLiveMap) window.destroyLiveMap();
        }

        currentRoute = viewName;

        // Update active sidebar nav
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            const dataView = link.getAttribute('data-view');
            if (dataView === viewName || (viewName === 'drivers' && dataView === 'drivers')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const container = document.getElementById('content') || document.getElementById('viewContainer');
        if (!container) return;

        // Render appropriate view
        switch (viewName) {
            case 'figma-app':
            case 'mobile':
            case 'app':
                container.innerHTML = renderFigmaAppShell();
                break;

            case 'figma-gallery':
            case 'gallery':
                if (window.FigmaScreens) {
                    container.innerHTML = window.FigmaScreens.renderAll12Gallery();
                }
                break;

            case 'dashboard':
                if (window.renderDashboard) {
                    container.innerHTML = window.renderDashboard();
                    if (window.initDashboardCharts) window.initDashboardCharts();
                    if (window.initDashboardMap) window.initDashboardMap();
                }
                break;

            case 'live-map':
                if (window.renderLiveMap) {
                    container.innerHTML = window.renderLiveMap();
                    if (window.initLiveMap) window.initLiveMap();
                }
                break;

            case 'routes':
                if (window.renderRoutes) {
                    container.innerHTML = window.renderRoutes();
                    if (window.initRoutes) window.initRoutes();
                }
                break;

            case 'buses':
                if (window.renderBuses) {
                    container.innerHTML = window.renderBuses();
                    if (window.initBuses) window.initBuses();
                }
                break;

            case 'analytics':
                if (window.renderAnalytics) {
                    container.innerHTML = window.renderAnalytics();
                    if (window.initAnalyticsCharts) window.initAnalyticsCharts();
                }
                break;

            case 'drivers':
            case 'driver':
                if (window.renderDriver) {
                    container.innerHTML = window.renderDriver();
                }
                break;

            case 'commuter':
                if (window.renderCommuter) {
                    container.innerHTML = window.renderCommuter();
                }
                break;

            case 'settings':
                if (window.renderSettings) {
                    container.innerHTML = window.renderSettings();
                }
                break;

            default:
                container.innerHTML = renderFigmaAppShell();
                break;
        }

        window.scrollTo(0, 0);
    }

    // Initialize application on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
        updateClock();
        setInterval(updateClock, 1000);

        initNotifications();
        initMobileSidebar();
        initThemeToggle();
        initGlobalSearch();

        // Listen for URL hash changes
        window.addEventListener('hashchange', () => {
            navigateTo(window.location.hash);
        });

        // Initial route defaults to Figma Mobile App
        navigateTo(window.location.hash || '#figma-app');
    });

})();
