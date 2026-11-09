# TransitPulse — Real-Time Bus Tracking & Passenger Analytics for Tier-3 Cities

> **Figma Prototype Alignment**: Faithfully recreated from Figma prototype `DRhkpfA4SNlVEAR22jNA4G` (**TransitPulse — Bus Tracking & Analytics UI**), covering all **12 interactive mobile artboards** plus a full **Municipal Command Center** for Tier-3 urban transit authorities.

---

## 📱 Complete Figma Mobile Artboards (12 Screens)

| # | Screen Name | Node ID | Description & Key UI Elements |
|---|-------------|---------|--------------------------------|
| **01** | **Commuter — Home** | `11:51` | "Where are you headed?" search card, Jadavpur 8B nearby stop (350m away), Bus 12A (4 min ETA, seats likely available), Bus 21B (11 min away), floating 3D bus animation, 4-tab bottom navigation. |
| **02** | **Commuter — Live Tracking** | `11:114` | Full-screen transit canvas with arterial road grid, animated route vector, live bus pin with halo pulse, 4 min arrival countdown, next stop Gariahat Crossing (2 min), "View bus details" CTA. |
| **03** | **Commuter — Bus Capacity** | `11:162` | Bus 12A identity (WB 19A 4821 AC), Passenger Comfort card: **32 / 50 seats (64% occupied)**, teal capacity bar, 18 seats available tag, sequential stop timeline (Gariahat, Park Circus, Howrah). |
| **04** | **Conductor — Trip Control** | `11:220` | Active Route 12A, in-service badge, live passenger counter (**32 of 50 seats**), interactive `＋ Passenger boarded` & `− Passenger alighted` buttons, next stop Central Market, offline sync indicator. |
| **05** | **Search — Routes & Results** | `15:57` | Search input, popular corridors: Route 12A, Route 21B, Route 8C, Route 47A with route badges, frequencies, and real-time ETAs. |
| **06** | **Route Details — Stops** | `15:99` | Route 12A corridor timetable, next bus arrival (4 min), full sequential stop progression with dwell markers. |
| **07** | **Notifications** | `15:143` | Real-time push alerts: "Bus 12A is approaching in 2 mins", "Route 21B delayed", "Low crowd alert: 18 seats free", subscription confirmations. |
| **08** | **Profile & Settings** | `15:182` | Aryan Kalra profile card, preferences, notification options, offline cache controls, language options. |
| **09** | **Trip History** | `15:225` | Completed travel log, month filter (November 2026), spent summary (₹90), individual route cards with dates and fares. |
| **10** | **Conductor — Passenger Count** | `15:271` | Big **36** passenger count display, 72% capacity fill, interactive step counters for boardings (`+4`) and alightings (`-2`), "Save stop count & continue" depot sync. |
| **11** | **Profile — Account Overview** | `17:32` | Aryan Kalra verified badge, Conductor ID (`UP-53-COND-8419`), assigned depot, smart card wallet balance. |
| **12** | **Subscription — Plans & Benefits** | `17:87` | Plan picker, TransitPulse Plus (₹49/month) with real-time seat alerts, priority SOS line, and offline timetable sync. |

---

## 🎛️ Dual Operating Modes

1. **📱 Phone Simulator Mode (`#figma-app`)**:
   - iPhone 14 chassis frame with Dynamic Island.
   - Top screen selector allowing 1-click preview of any of the 12 screens.
   - Interactive buttons: boarding counter increments/decrements live seat availability in real time.
2. **🖼️ All 12 Artboards Gallery (`#figma-gallery`)**:
   - Side-by-side horizontal canvas view of all 12 Figma screens simultaneously (Dev Mode).
3. **🖥️ Municipal Command Suite (`#dashboard`, `#live-map`, `#routes`, `#buses`, `#analytics`)**:
   - Leaflet GIS fleet tracking with 30 municipal buses.
   - Congestion bottleneck matrix for Tier-3 railway crossings and chowks.
   - 2×2 urban bus chassis seat maps with optical sensor telemetry.

---

## 🚀 How to Run

Double click [`index.html`](file:///c:/Users/user/Downloads/BUS%20TRAKER/index.html) or run a lightweight local server:

```powershell
python -m http.server 8000
```
Open your browser at `http://localhost:8000`.
