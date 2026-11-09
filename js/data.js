/**
 * TransitPulse — Real-Time Bus Tracking & Passenger Analytics
 * Mock Data & Simulation Engine for Tier-3 Cities (Gorakhpur / Eastern UP Transit Network)
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.TransitData = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // --- City Coordinates Center (Gorakhpur, UP - Tier-3 transit hub) ---
    const CITY_CENTER = { lat: 26.7606, lng: 83.3732, name: 'Gorakhpur Transit Hub' };

    // --- 15 Tier-3 Urban & Semi-Urban Routes ---
    const routes = [
        {
            id: 'R-101',
            number: '101',
            name: 'Gorakhpur Junction ⇄ AIIMS Hospital',
            color: '#3B82F6',
            distance: '14.2 km',
            duration: '42 mins',
            frequency: 'Every 8 mins',
            fare: '₹15 - ₹25',
            activeBusesCount: 4,
            status: 'Normal',
            stops: [
                'Railway Station Junction', 'Golghar Clock Tower', 'Town Hall', 'University Gate',
                'Mohaddipur Chowk', 'Kusumhi Road', 'MMMUT Campus', 'AIIMS Main Gate'
            ],
            coordinates: [
                [26.7580, 83.3820], [26.7540, 83.3750], [26.7490, 83.3700],
                [26.7440, 83.3680], [26.7380, 83.3740], [26.7310, 83.3850],
                [26.7240, 83.3980], [26.7190, 83.4120]
            ]
        },
        {
            id: 'R-102',
            number: '102',
            name: 'Gorakhnath Mandir ⇄ GIDA Industrial Area',
            color: '#10B981',
            distance: '18.6 km',
            duration: '54 mins',
            frequency: 'Every 12 mins',
            fare: '₹20 - ₹35',
            activeBusesCount: 4,
            status: 'Crowded',
            stops: [
                'Gorakhnath Mandir', 'Dharmshala Bazar', 'Railway Station Junction',
                'Kachhari Chowk', 'Rapti River Bridge', 'Sahjanwa Mod', 'GIDA Sector 13', 'GIDA Industrial Complex'
            ],
            coordinates: [
                [26.7780, 83.3610], [26.7660, 83.3700], [26.7580, 83.3820],
                [26.7510, 83.3890], [26.7420, 83.3510], [26.7320, 83.3210],
                [26.7260, 83.2980], [26.7210, 83.2750]
            ]
        },
        {
            id: 'R-103',
            number: '103',
            name: 'Medical College (BRD) ⇄ Ramgarh Tal Lake Promenade',
            color: '#F59E0B',
            distance: '16.1 km',
            duration: '48 mins',
            frequency: 'Every 10 mins',
            fare: '₹15 - ₹30',
            activeBusesCount: 3,
            status: 'Normal',
            stops: [
                'BRD Medical College', 'Asuran Chowk', 'Dharmshala', 'Golghar Mall Road',
                'Civil Lines', 'Nauka Vihar', 'Ramgarh Tal Circuit'
            ],
            coordinates: [
                [26.7920, 83.3750], [26.7790, 83.3780], [26.7660, 83.3700],
                [26.7530, 83.3720], [26.7460, 83.3800], [26.7360, 83.3950],
                [26.7290, 83.4020]
            ]
        },
        {
            id: 'R-104',
            number: '104',
            name: 'DDU University ⇄ Airport Terminal',
            color: '#8B5CF6',
            distance: '11.5 km',
            duration: '32 mins',
            frequency: 'Every 15 mins',
            fare: '₹15 - ₹25',
            activeBusesCount: 3,
            status: 'Delayed',
            stops: [
                'DDU University Gate', 'Chatra Sangh Chowk', 'Mohaddipur',
                'Kusumhi Forest Crossing', 'Air Force Station', 'Gorakhpur Airport Terminal'
            ],
            coordinates: [
                [26.7440, 83.3680], [26.7420, 83.3730], [26.7380, 83.3740],
                [26.7390, 83.4110], [26.7410, 83.4350], [26.7395, 83.4490]
            ]
        },
        {
            id: 'R-105',
            number: '105',
            name: 'Kachhari Courts ⇄ Fertilizer City Complex',
            color: '#EC4899',
            distance: '15.8 km',
            duration: '45 mins',
            frequency: 'Every 12 mins',
            fare: '₹15 - ₹30',
            activeBusesCount: 3,
            status: 'Normal',
            stops: [
                'Kachhari District Court', 'Town Hall', 'Golghar', 'Jail Bypass Road',
                'Medical College Crossing', 'HURL Fertilizer Factory'
            ],
            coordinates: [
                [26.7510, 83.3890], [26.7490, 83.3700], [26.7540, 83.3750],
                [26.7720, 83.3640], [26.7950, 83.3710], [26.8120, 83.3620]
            ]
        },
        {
            id: 'R-106',
            number: '106',
            name: 'Nausarh Bus Stand ⇄ Pipraich Bypass',
            color: '#06B6D4',
            distance: '21.0 km',
            duration: '60 mins',
            frequency: 'Every 20 mins',
            fare: '₹20 - ₹40',
            activeBusesCount: 2,
            status: 'Normal',
            stops: [
                'Nausarh Interstate Bus Terminus', 'Transport Nagar', 'Rustampur Chowk',
                'University Cross', 'Padri Bazar', 'Pipraich Road'
            ],
            coordinates: [
                [26.7110, 83.3420], [26.7250, 83.3550], [26.7370, 83.3620],
                [26.7440, 83.3680], [26.7710, 83.3980], [26.7980, 83.4310]
            ]
        },
        {
            id: 'R-107',
            number: '107',
            name: 'Sahjanwa ⇄ City Center Circular Loop',
            color: '#14B8A6',
            distance: '26.4 km',
            duration: '75 mins',
            frequency: 'Every 25 mins',
            fare: '₹25 - ₹45',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Sahjanwa', 'Maghar Chowk', 'GIDA Gate 2', 'Nausarh', 'Mohaddipur', 'Railway Station'],
            coordinates: [
                [26.7260, 83.2980], [26.7450, 83.2510], [26.7210, 83.2750],
                [26.7110, 83.3420], [26.7380, 83.3740], [26.7580, 83.3820]
            ]
        },
        {
            id: 'R-108',
            number: '108',
            name: 'Kusumhi Tourist Forest ⇄ Gorakhnath Mandir',
            color: '#EAB308',
            distance: '17.3 km',
            duration: '50 mins',
            frequency: 'Every 15 mins',
            fare: '₹15 - ₹30',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Kusumhi Vinod Van', 'Air Force Mod', 'Kusumhi Crossing', 'Town Hall', 'Gorakhnath Mandir'],
            coordinates: [
                [26.7390, 83.4610], [26.7410, 83.4350], [26.7390, 83.4110],
                [26.7490, 83.3700], [26.7780, 83.3610]
            ]
        },
        {
            id: 'R-109',
            number: '109',
            name: 'Bargadwa Industrial Zone ⇄ Nauka Vihar Lake',
            color: '#F43F5E',
            distance: '13.8 km',
            duration: '38 mins',
            frequency: 'Every 15 mins',
            fare: '₹15 - ₹25',
            activeBusesCount: 2,
            status: 'Delayed',
            stops: ['Bargadwa Crossing', 'Industrial Estate', 'Dharmshala', 'Civil Lines', 'Nauka Vihar Lake'],
            coordinates: [
                [26.7980, 83.3420], [26.7840, 83.3550], [26.7660, 83.3700],
                [26.7460, 83.3800], [26.7360, 83.3950]
            ]
        },
        {
            id: 'R-110',
            number: '110',
            name: 'Town Hall ⇄ Jungle Kauria Village Feeder',
            color: '#6366F1',
            distance: '19.5 km',
            duration: '55 mins',
            frequency: 'Every 30 mins',
            fare: '₹20 - ₹35',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Town Hall', 'Golghar', 'Gorakhnath Mandir', 'Mohammadpur', 'Jungle Kauria Market'],
            coordinates: [
                [26.7490, 83.3700], [26.7540, 83.3750], [26.7780, 83.3610],
                [26.8110, 83.3450], [26.8390, 83.3320]
            ]
        },
        {
            id: 'R-111',
            number: '111',
            name: 'MMMUT Technical University ⇄ Railway Junction',
            color: '#10B981',
            distance: '8.4 km',
            duration: '22 mins',
            frequency: 'Every 7 mins',
            fare: '₹10 - ₹20',
            activeBusesCount: 3,
            status: 'Normal',
            stops: ['MMMUT Campus', 'Engineering College Gate', 'Mohaddipur', 'Railway Station Junction'],
            coordinates: [
                [26.7240, 83.3980], [26.7290, 83.3910], [26.7380, 83.3740], [26.7580, 83.3820]
            ]
        },
        {
            id: 'R-112',
            number: '112',
            name: 'Taramandal Planetarium ⇄ Medical College',
            color: '#3B82F6',
            distance: '12.9 km',
            duration: '36 mins',
            frequency: 'Every 14 mins',
            fare: '₹15 - ₹25',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Taramandal Planetarium', 'Vasant Vihar', 'Golghar', 'Asuran', 'BRD Medical College'],
            coordinates: [
                [26.7320, 83.3920], [26.7430, 83.3810], [26.7540, 83.3750],
                [26.7790, 83.3780], [26.7920, 83.3750]
            ]
        },
        {
            id: 'R-113',
            number: '113',
            name: 'Kachhari Courts ⇄ Rustampur Vegetable Market',
            color: '#A855F7',
            distance: '7.8 km',
            duration: '20 mins',
            frequency: 'Every 10 mins',
            fare: '₹10 - ₹15',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Kachhari District Court', 'Town Hall', 'University Cross', 'Rustampur Vegetable Mandi'],
            coordinates: [
                [26.7510, 83.3890], [26.7490, 83.3700], [26.7440, 83.3680], [26.7370, 83.3620]
            ]
        },
        {
            id: 'R-114',
            number: '114',
            name: 'Airport Cargo Hub ⇄ GIDA Logistics Park',
            color: '#F97316',
            distance: '24.5 km',
            duration: '65 mins',
            frequency: 'Every 30 mins',
            fare: '₹30 - ₹50',
            activeBusesCount: 1,
            status: 'Normal',
            stops: ['Gorakhpur Airport Terminal', 'Air Force Station', 'Mohaddipur', 'Nausarh', 'GIDA Sector 13'],
            coordinates: [
                [26.7395, 83.4490], [26.7410, 83.4350], [26.7380, 83.3740],
                [26.7110, 83.3420], [26.7260, 83.2980]
            ]
        },
        {
            id: 'R-115',
            number: '115',
            name: 'Night Express: Railway Station ⇄ All Hubs Loop',
            color: '#22D3EE',
            distance: '28.0 km',
            duration: '80 mins',
            frequency: 'Every 40 mins (Night)',
            fare: '₹25 flat',
            activeBusesCount: 2,
            status: 'Normal',
            stops: ['Railway Station Junction', 'Golghar', 'Gorakhnath Mandir', 'BRD Medical College', 'Town Hall', 'Railway Station Junction'],
            coordinates: [
                [26.7580, 83.3820], [26.7540, 83.3750], [26.7780, 83.3610],
                [26.7920, 83.3750], [26.7490, 83.3700], [26.7580, 83.3820]
            ]
        }
    ];

    // --- 30 Realistic Buses for Tier-3 Urban Transport ---
    const buses = [
        {
            id: 'BUS-01', number: 'UP-53 BT 4012', model: 'Tata Ultra Electric 9/9m', routeId: 'R-101',
            routeName: 'Gorakhpur Junction ⇄ AIIMS Hospital', driver: 'Rajeshwar Yadav', driverPhone: '+91 98391 24501',
            conductor: 'Vikas Tiwari', conductorPhone: '+91 98391 55612', capacity: 52, passengersOnboard: 38,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '82% Electric', speed: 28,
            lat: 26.7460, lng: 83.3710, targetLat: 26.7380, targetLng: 83.3740, nextStop: 'Mohaddipur Chowk',
            etaMins: 4, delayMins: 0, lastUpdated: 'Just now', odoKm: 28450, fareCollectionToday: 4820
        },
        {
            id: 'BUS-02', number: 'UP-53 BT 4018', model: 'Tata Ultra Electric 9/9m', routeId: 'R-101',
            routeName: 'Gorakhpur Junction ⇄ AIIMS Hospital', driver: 'Manoj Kumar Maurya', driverPhone: '+91 97210 43901',
            conductor: 'Sunil Shahi', conductorPhone: '+91 97210 78234', capacity: 52, passengersOnboard: 51,
            standingCount: 7, status: 'Near Capacity', health: 'Optimal', batteryOrFuel: '74% Electric', speed: 24,
            lat: 26.7260, lng: 83.3950, targetLat: 26.7240, targetLng: 83.3980, nextStop: 'MMMUT Campus',
            etaMins: 2, delayMins: 2, lastUpdated: '12s ago', odoKm: 31200, fareCollectionToday: 5340
        },
        {
            id: 'BUS-03', number: 'UP-53 BT 4025', model: 'Tata Starbus EV', routeId: 'R-101',
            routeName: 'Gorakhpur Junction ⇄ AIIMS Hospital', driver: 'Dinesh Chandra Gupta', driverPhone: '+91 94520 81290',
            conductor: 'Prem Nath', conductorPhone: '+91 94520 12893', capacity: 52, passengersOnboard: 29,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '91% Electric', speed: 32,
            lat: 26.7550, lng: 83.3770, targetLat: 26.7490, targetLng: 83.3700, nextStop: 'Town Hall',
            etaMins: 5, delayMins: 0, lastUpdated: 'Just now', odoKm: 18900, fareCollectionToday: 3950
        },
        {
            id: 'BUS-04', number: 'UP-53 BT 4031', model: 'Tata Starbus EV', routeId: 'R-101',
            routeName: 'Gorakhpur Junction ⇄ AIIMS Hospital', driver: 'Imran Khan', driverPhone: '+91 99180 34812',
            conductor: 'Ram Milan', conductorPhone: '+91 99180 89234', capacity: 52, passengersOnboard: 18,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '65% Electric', speed: 30,
            lat: 26.7200, lng: 83.4110, targetLat: 26.7190, targetLng: 83.4120, nextStop: 'AIIMS Main Gate',
            etaMins: 1, delayMins: 0, lastUpdated: '18s ago', odoKm: 24300, fareCollectionToday: 3100
        },
        {
            id: 'BUS-05', number: 'UP-53 BT 3089', model: 'Ashok Leyland JanBus CNG', routeId: 'R-102',
            routeName: 'Gorakhnath Mandir ⇄ GIDA Industrial Area', driver: 'Surendra Nath Pandey', driverPhone: '+91 94150 99201',
            conductor: 'Satish Dubey', conductorPhone: '+91 94150 44321', capacity: 56, passengersOnboard: 58,
            standingCount: 14, status: 'Overcrowded', health: 'Optimal', batteryOrFuel: '72% CNG', speed: 22,
            lat: 26.7520, lng: 83.3870, targetLat: 26.7420, targetLng: 83.3510, nextStop: 'Rapti River Bridge',
            etaMins: 6, delayMins: 5, lastUpdated: 'Just now', odoKm: 68400, fareCollectionToday: 6280
        },
        {
            id: 'BUS-06', number: 'UP-53 BT 3094', model: 'Ashok Leyland JanBus CNG', routeId: 'R-102',
            routeName: 'Gorakhnath Mandir ⇄ GIDA Industrial Area', driver: 'Harish Shankar Rai', driverPhone: '+91 98380 11928',
            conductor: 'Arun Singh', conductorPhone: '+91 98380 44567', capacity: 56, passengersOnboard: 46,
            standingCount: 2, status: 'Running', health: 'Optimal', batteryOrFuel: '60% CNG', speed: 36,
            lat: 26.7340, lng: 83.3310, targetLat: 26.7260, targetLng: 83.2980, nextStop: 'GIDA Sector 13',
            etaMins: 7, delayMins: 1, lastUpdated: '25s ago', odoKm: 74200, fareCollectionToday: 5120
        },
        {
            id: 'BUS-07', number: 'UP-53 BT 3102', model: 'Ashok Leyland Oyster CNG', routeId: 'R-102',
            routeName: 'Gorakhnath Mandir ⇄ GIDA Industrial Area', driver: 'Pappu Verma', driverPhone: '+91 97920 66120',
            conductor: 'Rameshwar Jha', conductorPhone: '+91 97920 88912', capacity: 45, passengersOnboard: 32,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '85% CNG', speed: 29,
            lat: 26.7720, lng: 83.3640, targetLat: 26.7660, targetLng: 83.3700, nextStop: 'Dharmshala Bazar',
            etaMins: 3, delayMins: 0, lastUpdated: 'Just now', odoKm: 52100, fareCollectionToday: 4180
        },
        {
            id: 'BUS-08', number: 'UP-53 BT 3108', model: 'Ashok Leyland Oyster CNG', routeId: 'R-102',
            routeName: 'Gorakhnath Mandir ⇄ GIDA Industrial Area', driver: 'Kamlesh Bind', driverPhone: '+91 96280 44109',
            conductor: 'Santosh Kumar', conductorPhone: '+91 96280 77123', capacity: 45, passengersOnboard: 12,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '48% CNG', speed: 34,
            lat: 26.7220, lng: 83.2820, targetLat: 26.7210, targetLng: 83.2750, nextStop: 'GIDA Industrial Complex',
            etaMins: 2, delayMins: 0, lastUpdated: '10s ago', odoKm: 49800, fareCollectionToday: 2940
        },
        {
            id: 'BUS-09', number: 'UP-53 BT 4045', model: 'Tata Ultra Electric 9/9m', routeId: 'R-103',
            routeName: 'Medical College (BRD) ⇄ Ramgarh Tal Lake Promenade', driver: 'Anil Kumar Vishwakarma', driverPhone: '+91 95540 22319',
            conductor: 'Deepak Nishad', conductorPhone: '+91 95540 66782', capacity: 52, passengersOnboard: 44,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '68% Electric', speed: 27,
            lat: 26.7850, lng: 83.3760, targetLat: 26.7790, targetLng: 83.3780, nextStop: 'Asuran Chowk',
            etaMins: 3, delayMins: 0, lastUpdated: 'Just now', odoKm: 21500, fareCollectionToday: 4460
        },
        {
            id: 'BUS-10', number: 'UP-53 BT 4052', model: 'Tata Ultra Electric 9/9m', routeId: 'R-103',
            routeName: 'Medical College (BRD) ⇄ Ramgarh Tal Lake Promenade', driver: 'Shailendra Pratap Singh', driverPhone: '+91 94151 77312',
            conductor: 'Vijay Shankar', conductorPhone: '+91 94151 33456', capacity: 52, passengersOnboard: 50,
            standingCount: 4, status: 'Near Capacity', health: 'Optimal', batteryOrFuel: '55% Electric', speed: 21,
            lat: 26.7490, lng: 83.3770, targetLat: 26.7460, targetLng: 83.3800, nextStop: 'Civil Lines',
            etaMins: 2, delayMins: 3, lastUpdated: '8s ago', odoKm: 27900, fareCollectionToday: 5190
        },
        {
            id: 'BUS-11', number: 'UP-53 BT 4059', model: 'Tata Ultra Electric 9/9m', routeId: 'R-103',
            routeName: 'Medical College (BRD) ⇄ Ramgarh Tal Lake Promenade', driver: 'Gyan Prakash Tripathi', driverPhone: '+91 93350 44921',
            conductor: 'Ajay Paswan', conductorPhone: '+91 93350 11234', capacity: 52, passengersOnboard: 25,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '88% Electric', speed: 33,
            lat: 26.7320, lng: 83.3990, targetLat: 26.7290, targetLng: 83.4020, nextStop: 'Ramgarh Tal Circuit',
            etaMins: 1, delayMins: 0, lastUpdated: 'Just now', odoKm: 19800, fareCollectionToday: 3200
        },
        {
            id: 'BUS-12', number: 'UP-53 BT 2180', model: 'Eicher Skyline Pro CNG', routeId: 'R-104',
            routeName: 'DDU University ⇄ Airport Terminal', driver: 'Ram Asrey', driverPhone: '+91 98890 33412',
            conductor: 'Babloo Gupta', conductorPhone: '+91 98890 66789', capacity: 42, passengersOnboard: 39,
            standingCount: 0, status: 'Delayed', health: 'Sensor Warning', batteryOrFuel: '40% CNG', speed: 18,
            lat: 26.7410, lng: 83.3890, targetLat: 26.7390, targetLng: 83.4110, nextStop: 'Kusumhi Forest Crossing',
            etaMins: 8, delayMins: 9, lastUpdated: '15s ago', odoKm: 89400, fareCollectionToday: 3870
        },
        {
            id: 'BUS-13', number: 'UP-53 BT 2185', model: 'Eicher Skyline Pro CNG', routeId: 'R-104',
            routeName: 'DDU University ⇄ Airport Terminal', driver: 'Sanjay Sahani', driverPhone: '+91 97940 88210',
            conductor: 'Radhe Shyam', conductorPhone: '+91 97940 22341', capacity: 42, passengersOnboard: 24,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '78% CNG', speed: 35,
            lat: 26.7410, lng: 83.4280, targetLat: 26.7410, targetLng: 83.4350, nextStop: 'Air Force Station',
            etaMins: 3, delayMins: 0, lastUpdated: 'Just now', odoKm: 81200, fareCollectionToday: 2980
        },
        {
            id: 'BUS-14', number: 'UP-53 BT 2192', model: 'Eicher Skyline Pro CNG', routeId: 'R-104',
            routeName: 'DDU University ⇄ Airport Terminal', driver: 'Mukesh Gond', driverPhone: '+91 94500 55129',
            conductor: 'Rakesh Shukla', conductorPhone: '+91 94500 99451', capacity: 42, passengersOnboard: 19,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '83% CNG', speed: 31,
            lat: 26.7400, lng: 83.4420, targetLat: 26.7395, targetLng: 83.4490, nextStop: 'Gorakhpur Airport Terminal',
            etaMins: 2, delayMins: 0, lastUpdated: '40s ago', odoKm: 76500, fareCollectionToday: 2450
        },
        {
            id: 'BUS-15', number: 'UP-53 BT 5011', model: 'Tata Starbus EV', routeId: 'R-105',
            routeName: 'Kachhari Courts ⇄ Fertilizer City Complex', driver: 'Ravindra Yadav', driverPhone: '+91 98392 66710',
            conductor: 'Om Prakash', conductorPhone: '+91 98392 11982', capacity: 52, passengersOnboard: 41,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '79% Electric', speed: 28,
            lat: 26.7610, lng: 83.3710, targetLat: 26.7720, targetLng: 83.3640, nextStop: 'Jail Bypass Road',
            etaMins: 4, delayMins: 0, lastUpdated: 'Just now', odoKm: 14200, fareCollectionToday: 4100
        },
        {
            id: 'BUS-16', number: 'UP-53 BT 5016', model: 'Tata Starbus EV', routeId: 'R-105',
            routeName: 'Kachhari Courts ⇄ Fertilizer City Complex', driver: 'Vinod Chauhan', driverPhone: '+91 97211 44890',
            conductor: 'Brijesh Sharma', conductorPhone: '+91 97211 88912', capacity: 52, passengersOnboard: 48,
            standingCount: 3, status: 'Running', health: 'Optimal', batteryOrFuel: '62% Electric', speed: 25,
            lat: 26.8010, lng: 83.3680, targetLat: 26.8120, targetLng: 83.3620, nextStop: 'HURL Fertilizer Factory',
            etaMins: 3, delayMins: 1, lastUpdated: '5s ago', odoKm: 16900, fareCollectionToday: 4780
        },
        {
            id: 'BUS-17', number: 'UP-53 BT 5022', model: 'Tata Starbus EV', routeId: 'R-105',
            routeName: 'Kachhari Courts ⇄ Fertilizer City Complex', driver: 'Nandlal Prajapati', driverPhone: '+91 94521 33409',
            conductor: 'Durgesh Mishra', conductorPhone: '+91 94521 77612', capacity: 52, passengersOnboard: 30,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '90% Electric', speed: 30,
            lat: 26.7510, lng: 83.3850, targetLat: 26.7490, targetLng: 83.3700, nextStop: 'Town Hall',
            etaMins: 5, delayMins: 0, lastUpdated: 'Just now', odoKm: 11800, fareCollectionToday: 3420
        },
        {
            id: 'BUS-18', number: 'UP-53 BT 3120', model: 'Ashok Leyland JanBus CNG', routeId: 'R-106',
            routeName: 'Nausarh Bus Stand ⇄ Pipraich Bypass', driver: 'Arvind Gaur', driverPhone: '+91 99181 55678',
            conductor: 'Suresh Chandra', conductorPhone: '+91 99181 99012', capacity: 56, passengersOnboard: 52,
            standingCount: 8, status: 'Near Capacity', health: 'Optimal', batteryOrFuel: '67% CNG', speed: 26,
            lat: 26.7410, lng: 83.3650, targetLat: 26.7440, targetLng: 83.3680, nextStop: 'University Cross',
            etaMins: 3, delayMins: 2, lastUpdated: '14s ago', odoKm: 61200, fareCollectionToday: 5620
        },
        {
            id: 'BUS-19', number: 'UP-53 BT 3125', model: 'Ashok Leyland JanBus CNG', routeId: 'R-106',
            routeName: 'Nausarh Bus Stand ⇄ Pipraich Bypass', driver: 'Subhash Prasad', driverPhone: '+91 94152 88910',
            conductor: 'Pankaj Srivastava', conductorPhone: '+91 94152 22345', capacity: 56, passengersOnboard: 35,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '54% CNG', speed: 33,
            lat: 26.7840, lng: 83.4140, targetLat: 26.7980, targetLng: 83.4310, nextStop: 'Pipraich Road',
            etaMins: 5, delayMins: 0, lastUpdated: 'Just now', odoKm: 64800, fareCollectionToday: 4190
        },
        {
            id: 'BUS-20', number: 'UP-53 BT 1840', model: 'Eicher Skyline CNG', routeId: 'R-107',
            routeName: 'Sahjanwa ⇄ City Center Circular Loop', driver: 'Maheshwar Nath', driverPhone: '+91 98381 77209',
            conductor: 'Ravi Kant', conductorPhone: '+91 98381 33456', capacity: 48, passengersOnboard: 46,
            standingCount: 6, status: 'Near Capacity', health: 'Optimal', batteryOrFuel: '58% CNG', speed: 38,
            lat: 26.7320, lng: 83.2790, targetLat: 26.7210, targetLng: 83.2750, nextStop: 'GIDA Gate 2',
            etaMins: 4, delayMins: 1, lastUpdated: 'Just now', odoKm: 98200, fareCollectionToday: 5980
        },
        {
            id: 'BUS-21', number: 'UP-53 BT 1845', model: 'Eicher Skyline CNG', routeId: 'R-107',
            routeName: 'Sahjanwa ⇄ City Center Circular Loop', driver: 'Narendra Singh', driverPhone: '+91 97921 44567',
            conductor: 'Gopal Krishna', conductorPhone: '+91 97921 99012', capacity: 48, passengersOnboard: 28,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '71% CNG', speed: 30,
            lat: 26.7450, lng: 83.3690, targetLat: 26.7580, targetLng: 83.3820, nextStop: 'Railway Station',
            etaMins: 6, delayMins: 0, lastUpdated: '22s ago', odoKm: 94100, fareCollectionToday: 4320
        },
        {
            id: 'BUS-22', number: 'UP-53 BT 4068', model: 'Tata Ultra Electric 9/9m', routeId: 'R-108',
            routeName: 'Kusumhi Tourist Forest ⇄ Gorakhnath Mandir', driver: 'Devesh Mishra', driverPhone: '+91 96281 33201',
            conductor: 'Lallan Prasad', conductorPhone: '+91 96281 77654', capacity: 52, passengersOnboard: 33,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '76% Electric', speed: 29,
            lat: 26.7405, lng: 83.4210, targetLat: 26.7390, targetLng: 83.4110, nextStop: 'Kusumhi Crossing',
            etaMins: 3, delayMins: 0, lastUpdated: 'Just now', odoKm: 22100, fareCollectionToday: 3740
        },
        {
            id: 'BUS-23', number: 'UP-53 BT 4075', model: 'Tata Ultra Electric 9/9m', routeId: 'R-108',
            routeName: 'Kusumhi Tourist Forest ⇄ Gorakhnath Mandir', driver: 'Shiv Prasad Yadav', driverPhone: '+91 95541 66890',
            conductor: 'Anand Mohan', conductorPhone: '+91 95541 11234', capacity: 52, passengersOnboard: 49,
            standingCount: 5, status: 'Near Capacity', health: 'Optimal', batteryOrFuel: '63% Electric', speed: 24,
            lat: 26.7620, lng: 83.3660, targetLat: 26.7780, targetLng: 83.3610, nextStop: 'Gorakhnath Mandir',
            etaMins: 4, delayMins: 2, lastUpdated: '8s ago', odoKm: 26500, fareCollectionToday: 5100
        },
        {
            id: 'BUS-24', number: 'UP-53 BT 3140', model: 'Ashok Leyland Oyster CNG', routeId: 'R-109',
            routeName: 'Bargadwa Industrial Zone ⇄ Nauka Vihar Lake', driver: 'Ashok Kumar Sharma', driverPhone: '+91 94153 11209',
            conductor: 'Manish Rawat', conductorPhone: '+91 94153 55678', capacity: 45, passengersOnboard: 41,
            standingCount: 0, status: 'Delayed', health: 'Optimal', batteryOrFuel: '52% CNG', speed: 19,
            lat: 26.7720, lng: 83.3660, targetLat: 26.7660, targetLng: 83.3700, nextStop: 'Dharmshala',
            etaMins: 5, delayMins: 7, lastUpdated: 'Just now', odoKm: 58900, fareCollectionToday: 4120
        },
        {
            id: 'BUS-25', number: 'UP-53 BT 3148', model: 'Ashok Leyland Oyster CNG', routeId: 'R-109',
            routeName: 'Bargadwa Industrial Zone ⇄ Nauka Vihar Lake', driver: 'Chhedi Lal', driverPhone: '+91 93351 77890',
            conductor: 'Satya Prakash', conductorPhone: '+91 93351 33456', capacity: 45, passengersOnboard: 22,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '81% CNG', speed: 32,
            lat: 26.7410, lng: 83.3880, targetLat: 26.7360, targetLng: 83.3950, nextStop: 'Nauka Vihar Lake',
            etaMins: 2, delayMins: 0, lastUpdated: '16s ago', odoKm: 53400, fareCollectionToday: 3080
        },
        {
            id: 'BUS-26', number: 'UP-53 BT 2205', model: 'Eicher Skyline CNG', routeId: 'R-110',
            routeName: 'Town Hall ⇄ Jungle Kauria Village Feeder', driver: 'Ram Janam', driverPhone: '+91 98891 22340',
            conductor: 'Kailash Nath', conductorPhone: '+91 98891 77891', capacity: 48, passengersOnboard: 45,
            standingCount: 5, status: 'Running', health: 'Optimal', batteryOrFuel: '69% CNG', speed: 34,
            lat: 26.8010, lng: 83.3510, targetLat: 26.8110, targetLng: 83.3450, nextStop: 'Mohammadpur',
            etaMins: 4, delayMins: 0, lastUpdated: 'Just now', odoKm: 71200, fareCollectionToday: 4890
        },
        {
            id: 'BUS-27', number: 'UP-53 BT 2212', model: 'Eicher Skyline CNG', routeId: 'R-110',
            routeName: 'Town Hall ⇄ Jungle Kauria Village Feeder', driver: 'Balram Yadav', driverPhone: '+91 97941 55678',
            conductor: 'Santosh Maurya', conductorPhone: '+91 97941 11234', capacity: 48, passengersOnboard: 31,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '84% CNG', speed: 30,
            lat: 26.7510, lng: 83.3730, targetLat: 26.7540, targetLng: 83.3750, nextStop: 'Golghar',
            etaMins: 2, delayMins: 0, lastUpdated: '30s ago', odoKm: 68900, fareCollectionToday: 3510
        },
        {
            id: 'BUS-28', number: 'UP-53 BT 5035', model: 'Tata Ultra Electric 9/9m', routeId: 'R-111',
            routeName: 'MMMUT Technical University ⇄ Railway Junction', driver: 'Akhilesh Vishwakarma', driverPhone: '+91 94501 88901',
            conductor: 'Surendra Pal', conductorPhone: '+91 94501 44567', capacity: 52, passengersOnboard: 39,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '87% Electric', speed: 31,
            lat: 26.7320, lng: 83.3840, targetLat: 26.7380, targetLng: 83.3740, nextStop: 'Mohaddipur',
            etaMins: 3, delayMins: 0, lastUpdated: 'Just now', odoKm: 13500, fareCollectionToday: 3940
        },
        {
            id: 'BUS-29', number: 'UP-53 BT 5040', model: 'Tata Ultra Electric 9/9m', routeId: 'R-111',
            routeName: 'MMMUT Technical University ⇄ Railway Junction', driver: 'Ram Chandra Yadav', driverPhone: '+91 98393 11209',
            conductor: 'Mukesh Gond', conductorPhone: '+91 98393 66782', capacity: 52, passengersOnboard: 48,
            standingCount: 2, status: 'Running', health: 'Optimal', batteryOrFuel: '70% Electric', speed: 27,
            lat: 26.7510, lng: 83.3790, targetLat: 26.7580, targetLng: 83.3820, nextStop: 'Railway Station Junction',
            etaMins: 2, delayMins: 1, lastUpdated: '5s ago', odoKm: 15100, fareCollectionToday: 4720
        },
        {
            id: 'BUS-30', number: 'UP-53 BT 1199', model: 'Ashok Leyland JanBus CNG', routeId: 'R-115',
            routeName: 'Night Express: Railway Station ⇄ All Hubs Loop', driver: 'Jitendra Pandey', driverPhone: '+91 97212 99012',
            conductor: 'Bhola Nath', conductorPhone: '+91 97212 55678', capacity: 56, passengersOnboard: 21,
            standingCount: 0, status: 'Running', health: 'Optimal', batteryOrFuel: '95% CNG', speed: 42,
            lat: 26.7860, lng: 83.3690, targetLat: 26.7920, targetLng: 83.3750, nextStop: 'BRD Medical College',
            etaMins: 4, delayMins: 0, lastUpdated: 'Just now', odoKm: 104500, fareCollectionToday: 2150
        }
    ];

    // --- 50 Key Bus Stops in Tier-3 Gorakhpur Metro Region ---
    const stops = [
        { id: 'ST-01', name: 'Gorakhpur Junction Rly Station', lat: 26.7580, lng: 83.3820, shelter: true, digitalDisplay: true, avgDwellSec: 75, connectingRoutes: ['101', '102', '111', '115'] },
        { id: 'ST-02', name: 'Golghar Clock Tower', lat: 26.7540, lng: 83.3750, shelter: true, digitalDisplay: true, avgDwellSec: 60, connectingRoutes: ['101', '103', '105', '110', '112', '115'] },
        { id: 'ST-03', name: 'Town Hall Crossing', lat: 26.7490, lng: 83.3700, shelter: true, digitalDisplay: true, avgDwellSec: 45, connectingRoutes: ['101', '105', '108', '110', '113'] },
        { id: 'ST-04', name: 'DDU Gorakhpur University Main Gate', lat: 26.7440, lng: 83.3680, shelter: true, digitalDisplay: true, avgDwellSec: 90, connectingRoutes: ['101', '104', '106', '113'] },
        { id: 'ST-05', name: 'Mohaddipur Four-Way Chowk', lat: 26.7380, lng: 83.3740, shelter: true, digitalDisplay: true, avgDwellSec: 65, connectingRoutes: ['101', '104', '107', '111', '114'] },
        { id: 'ST-06', name: 'MMMUT Technical University Campus', lat: 26.7240, lng: 83.3980, shelter: true, digitalDisplay: true, avgDwellSec: 85, connectingRoutes: ['101', '111'] },
        { id: 'ST-07', name: 'AIIMS Gorakhpur Super-Speciality Gate', lat: 26.7190, lng: 83.4120, shelter: true, digitalDisplay: true, avgDwellSec: 70, connectingRoutes: ['101'] },
        { id: 'ST-08', name: 'Gorakhnath Temple North Plaza', lat: 26.7780, lng: 83.3610, shelter: true, digitalDisplay: true, avgDwellSec: 90, connectingRoutes: ['102', '108', '110', '115'] },
        { id: 'ST-09', name: 'Dharmshala Wholesale Bazaar', lat: 26.7660, lng: 83.3700, shelter: true, digitalDisplay: false, avgDwellSec: 55, connectingRoutes: ['102', '103', '109'] },
        { id: 'ST-10', name: 'Kachhari District Collectorate', lat: 26.7510, lng: 83.3890, shelter: true, digitalDisplay: true, avgDwellSec: 50, connectingRoutes: ['102', '105', '113'] },
        { id: 'ST-11', name: 'Rapti River Bridge Crossing', lat: 26.7420, lng: 83.3510, shelter: false, digitalDisplay: false, avgDwellSec: 30, connectingRoutes: ['102'] },
        { id: 'ST-12', name: 'Sahjanwa Town Square', lat: 26.7260, lng: 83.2980, shelter: true, digitalDisplay: false, avgDwellSec: 60, connectingRoutes: ['102', '107'] },
        { id: 'ST-13', name: 'GIDA Sector 13 Industrial Hub', lat: 26.7210, lng: 83.2750, shelter: true, digitalDisplay: true, avgDwellSec: 80, connectingRoutes: ['102', '114'] },
        { id: 'ST-14', name: 'BRD Medical College Trauma Center', lat: 26.7920, lng: 83.3750, shelter: true, digitalDisplay: true, avgDwellSec: 95, connectingRoutes: ['103', '112', '115'] },
        { id: 'ST-15', name: 'Asuran Chowk Intersection', lat: 26.7790, lng: 83.3780, shelter: true, digitalDisplay: false, avgDwellSec: 45, connectingRoutes: ['103', '112'] },
        { id: 'ST-16', name: 'Civil Lines Officer Colony', lat: 26.7460, lng: 83.3800, shelter: true, digitalDisplay: false, avgDwellSec: 40, connectingRoutes: ['103', '109'] },
        { id: 'ST-17', name: 'Nauka Vihar Ramgarh Lake Promenade', lat: 26.7360, lng: 83.3950, shelter: true, digitalDisplay: true, avgDwellSec: 75, connectingRoutes: ['103', '109'] },
        { id: 'ST-18', name: 'Gorakhpur Airport Civil Terminal', lat: 26.7395, lng: 83.4490, shelter: true, digitalDisplay: true, avgDwellSec: 60, connectingRoutes: ['104', '114'] },
        { id: 'ST-19', name: 'Air Force Station Main Gate', lat: 26.7410, lng: 83.4350, shelter: true, digitalDisplay: false, avgDwellSec: 35, connectingRoutes: ['104', '108', '114'] },
        { id: 'ST-20', name: 'HURL Fertilizer Factory Gate 1', lat: 26.8120, lng: 83.3620, shelter: true, digitalDisplay: true, avgDwellSec: 80, connectingRoutes: ['105'] },
        { id: 'ST-21', name: 'Nausarh Interstate Bus Terminus (ISBT)', lat: 26.7110, lng: 83.3420, shelter: true, digitalDisplay: true, avgDwellSec: 120, connectingRoutes: ['106', '107', '114'] },
        { id: 'ST-22', name: 'Transport Nagar Commercial Hub', lat: 26.7250, lng: 83.3550, shelter: true, digitalDisplay: false, avgDwellSec: 50, connectingRoutes: ['106'] },
        { id: 'ST-23', name: 'Rustampur Vegetable Mandi', lat: 26.7370, lng: 83.3620, shelter: false, digitalDisplay: false, avgDwellSec: 65, connectingRoutes: ['106', '113'] },
        { id: 'ST-24', name: 'Padri Bazar Crossroad', lat: 26.7710, lng: 83.3980, shelter: true, digitalDisplay: false, avgDwellSec: 40, connectingRoutes: ['106'] },
        { id: 'ST-25', name: 'Pipraich Sugar Mill Bypass', lat: 26.7980, lng: 83.4310, shelter: true, digitalDisplay: false, avgDwellSec: 50, connectingRoutes: ['106'] },
        { id: 'ST-26', name: 'Kusumhi Tourist Vinod Van', lat: 26.7390, lng: 83.4610, shelter: true, digitalDisplay: false, avgDwellSec: 45, connectingRoutes: ['108'] },
        { id: 'ST-27', name: 'Bargadwa Industrial Estate', lat: 26.7980, lng: 83.3420, shelter: true, digitalDisplay: false, avgDwellSec: 55, connectingRoutes: ['109'] },
        { id: 'ST-28', name: 'Jungle Kauria Village Market', lat: 26.8390, lng: 83.3320, shelter: true, digitalDisplay: false, avgDwellSec: 60, connectingRoutes: ['110'] },
        { id: 'ST-29', name: 'Taramandal Planetarium Center', lat: 26.7320, lng: 83.3920, shelter: true, digitalDisplay: true, avgDwellSec: 55, connectingRoutes: ['112'] },
        { id: 'ST-30', name: 'Maghar Sant Kabir Memorial Bypass', lat: 26.7450, lng: 83.2510, shelter: true, digitalDisplay: false, avgDwellSec: 40, connectingRoutes: ['107'] }
    ];

    // --- Real-time Seat Map Generator (52 / 56 passenger format) ---
    function generateSeatMap(capacity, occupiedCount) {
        const rows = Math.ceil(capacity / 4);
        const seats = [];
        let occupied = 0;

        for (let r = 1; r <= rows; r++) {
            ['A', 'B', 'C', 'D'].forEach((col, cIdx) => {
                const seatNum = `${r}${col}`;
                if (seats.length < capacity) {
                    // Specific allocations for Tier-3 inclusivity
                    let type = 'regular';
                    if (r === 1) type = 'differently-abled';
                    else if (r <= 3 && (col === 'A' || col === 'B')) type = 'women-reserved';
                    else if (r <= 3 && (col === 'C' || col === 'D')) type = 'senior-citizen';

                    const isTaken = occupied < occupiedCount;
                    if (isTaken) occupied++;

                    seats.push({
                        seatNumber: seatNum,
                        row: r,
                        side: cIdx < 2 ? 'left' : 'right',
                        type: type,
                        occupied: isTaken
                    });
                }
            });
        }
        return seats;
    }

    // --- Analytics: Hourly Passenger Volume (Last 24 Hours) ---
    const hourlyPassengerFlow = [
        { hour: '05:00', passengers: 420, capacity: 1600, crowdRate: '26%' },
        { hour: '06:00', passengers: 950, capacity: 1600, crowdRate: '59%' },
        { hour: '07:00', passengers: 1780, capacity: 1600, crowdRate: '111%' },
        { hour: '08:00', passengers: 2640, capacity: 1600, crowdRate: '165%' }, // Morning Rush (Colleges, Offices)
        { hour: '09:00', passengers: 3120, capacity: 1600, crowdRate: '195%' }, // Peak Peak
        { hour: '10:00', passengers: 2480, capacity: 1600, crowdRate: '155%' },
        { hour: '11:00', passengers: 1820, capacity: 1600, crowdRate: '113%' },
        { hour: '12:00', passengers: 1450, capacity: 1600, crowdRate: '90%' },
        { hour: '13:00', passengers: 1620, capacity: 1600, crowdRate: '101%' },
        { hour: '14:00', passengers: 1540, capacity: 1600, crowdRate: '96%' },
        { hour: '15:00', passengers: 1890, capacity: 1600, crowdRate: '118%' },
        { hour: '16:00', passengers: 2350, capacity: 1600, crowdRate: '146%' },
        { hour: '17:00', passengers: 3280, capacity: 1600, crowdRate: '205%' }, // Evening Peak (Return Commute)
        { hour: '18:00', passengers: 3410, capacity: 1600, crowdRate: '213%' }, // Highest load
        { hour: '19:00', passengers: 2890, capacity: 1600, crowdRate: '180%' },
        { hour: '20:00', passengers: 2150, capacity: 1600, crowdRate: '134%' },
        { hour: '21:00', passengers: 1380, capacity: 1600, crowdRate: '86%' },
        { hour: '22:00', passengers: 720, capacity: 1600, crowdRate: '45%' },
        { hour: '23:00', passengers: 310, capacity: 1600, crowdRate: '19%' }
    ];

    // --- Daily Stats (Last 7 Days) ---
    const last7DaysStats = [
        { date: '03 Nov', day: 'Mon', passengers: 42100, onTimePct: 91.2, revenue: 631500, fuelSavedLiters: 4820 },
        { date: '04 Nov', day: 'Tue', passengers: 44250, onTimePct: 89.4, revenue: 663750, fuelSavedLiters: 5100 },
        { date: '05 Nov', day: 'Wed', passengers: 43800, onTimePct: 92.8, revenue: 657000, fuelSavedLiters: 5040 },
        { date: '06 Nov', day: 'Thu', passengers: 45600, onTimePct: 90.1, revenue: 684000, fuelSavedLiters: 5250 },
        { date: '07 Nov', day: 'Fri', passengers: 47800, onTimePct: 88.6, revenue: 717000, fuelSavedLiters: 5490 },
        { date: '08 Nov', day: 'Sat', passengers: 51200, onTimePct: 86.9, revenue: 768000, fuelSavedLiters: 5880 },
        { date: '09 Nov', day: 'Sun', passengers: 38900, onTimePct: 94.5, revenue: 583500, fuelSavedLiters: 4470 }
    ];

    // --- City Transit High-Level KPIs ---
    const systemKPIs = {
        totalBuses: 30,
        activeBuses: 28,
        maintenanceBuses: 2,
        totalRoutes: 15,
        totalStops: 50,
        todayPassengers: 46820,
        yesterdayPassengers: 44900,
        onTimeRate: 91.4,
        avgDelayMins: 3.2,
        todayRevenue: 702300,
        yesterdayRevenue: 673500,
        avgOccupancyPct: 76.8,
        activeEVSharePct: 43.3,
        fuelSavedLitersMonth: 142800,
        co2MitigatedTons: 342.6
    };

    // --- Real-time Simulation Engine ---
    // Simulates live GPS nudges, passenger tap-ins/outs, and dynamic ETA predictions
    function tickSimulation() {
        buses.forEach(bus => {
            if (bus.status === 'Maintenance') return;

            // Micro GPS movement along route
            const latDelta = (Math.random() - 0.48) * 0.0006;
            const lngDelta = (Math.random() - 0.48) * 0.0006;
            bus.lat = Number((bus.lat + latDelta).toFixed(6));
            bus.lng = Number((bus.lng + lngDelta).toFixed(6));

            // Dynamic speed variation (traffic conditions in Tier-3 chowks)
            bus.speed = Math.max(12, Math.min(50, Math.round(bus.speed + (Math.random() * 8 - 4))));

            // Passenger boarding / deboarding simulation
            const boardDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let newPax = bus.passengersOnboard + boardDelta;
            newPax = Math.max(5, Math.min(bus.capacity + 15, newPax)); // allow standing room
            bus.passengersOnboard = newPax;

            if (newPax > bus.capacity) {
                bus.standingCount = newPax - bus.capacity;
                bus.status = 'Overcrowded';
            } else if (newPax >= bus.capacity * 0.85) {
                bus.standingCount = 0;
                bus.status = 'Near Capacity';
            } else {
                bus.standingCount = 0;
                bus.status = 'Running';
            }

            // ETA countdown update
            if (Math.random() > 0.6 && bus.etaMins > 1) {
                bus.etaMins -= 1;
            } else if (bus.etaMins <= 1) {
                bus.etaMins = Math.floor(Math.random() * 5) + 3;
            }

            bus.lastUpdated = 'Just now';
        });

        // Trigger listener if registered
        if (typeof window !== 'undefined' && typeof window.onTransitDataUpdate === 'function') {
            window.onTransitDataUpdate();
        }
    }

    // Start background simulation ticker (every 3 seconds)
    let simulationTimer = null;
    if (typeof setInterval !== 'undefined') {
        simulationTimer = setInterval(tickSimulation, 3000);
    }

    // Driver Portal Interaction Simulation Methods
    function recordPassengerBoard(busId, count) {
        const b = buses.find(x => x.id === busId);
        if (b) {
            b.passengersOnboard += count;
            if (b.passengersOnboard > b.capacity) {
                b.standingCount = b.passengersOnboard - b.capacity;
                b.status = 'Overcrowded';
            } else if (b.passengersOnboard >= b.capacity * 0.85) {
                b.status = 'Near Capacity';
            }
            b.fareCollectionToday += count * 20;
            return b;
        }
        return null;
    }

    function recordPassengerAlight(busId, count) {
        const b = buses.find(x => x.id === busId);
        if (b) {
            b.passengersOnboard = Math.max(0, b.passengersOnboard - count);
            if (b.passengersOnboard <= b.capacity) {
                b.standingCount = 0;
                b.status = 'Running';
            }
            return b;
        }
        return null;
    }

    return {
        cityCenter: CITY_CENTER,
        routes: routes,
        buses: buses,
        stops: stops,
        hourlyPassengerFlow: hourlyPassengerFlow,
        last7DaysStats: last7DaysStats,
        systemKPIs: systemKPIs,
        generateSeatMap: generateSeatMap,
        recordPassengerBoard: recordPassengerBoard,
        recordPassengerAlight: recordPassengerAlight,
        tickSimulation: tickSimulation
    };
}));
