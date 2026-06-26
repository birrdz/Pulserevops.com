// Build 300-entry electronic reviews sprint queue er0577–er0876 (skip existing titles).
const fs = require('fs');
const mk = (title, slug) => ({ title, slug });
const sl = (s) => ('er-' + s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const existing = fs.existsSync('C:/Users/koryj/website/_er_existing_titles.json')
  ? new Set(JSON.parse(fs.readFileSync('C:/Users/koryj/website/_er_existing_titles.json', 'utf8')))
  : new Set();

const SUFFIX = ' in 2027 — Best Overall + Best Value';

const categories = [
  'iPhone Cases', 'Samsung Galaxy Cases', 'MagSafe Chargers', 'Phone Gimbals', 'Clip-On Phone Lenses',
  'iPad Keyboard Cases', 'Tablet Floor Stands', 'Phone Cooling Fans', 'Phone Solar Chargers',
  'Phone Ring Holders', 'Car Phone Chargers', 'Wireless Car Chargers', 'Phone Tripod Mounts',
  'Selfie Sticks with Remote', 'Portable Phone Printers', 'Phone Game Controllers',
  'Foldable Phone Stands', 'Waterproof Phone Pouches', 'Tempered Glass Screen Protectors',
  'Privacy Screen Protectors for Laptops', 'Phone Battery Cases', 'MagSafe Power Banks',
  'Laptop Sleeves', 'Laptop Cooling Pads', 'Laptop Security Locks', 'Thunderbolt 4 Docks',
  'USB-C to HDMI Adapters', 'Ethernet Adapters for MacBook', 'WiFi 6E USB Adapters',
  'Compact Bluetooth Keyboards', 'Split Ergonomic Keyboards', 'Trackball Mice',
  'GPU Vertical Mounts', 'DDR5 RAM Kits', 'NVMe SSD Enclosures', 'SATA SSDs',
  'UPS Battery Backups for Gaming PCs', 'Surge Protectors for Home Office',
  'Monitor Privacy Filters', 'Monitor Calibrators', 'Webcam Privacy Covers',
  'Anti-Glare Screen Filters', 'Laptop Screen Extenders', 'Docking Station Monitors',
  'Open-Back Audiophile Headphones', 'Closed-Back Studio Headphones', 'Planar Magnetic Headphones',
  'In-Ear Monitors for Audiophiles', 'Portable DAC/AMP Combos', 'DJ Headphones',
  'Podcast Mixers', 'Shotgun Microphones for Video', 'Boom Pole Kits',
  'Acoustic Panels for Home Studio', 'Bass Traps', 'Swimming Earbuds',
  'Bone Conduction Headphones for Cycling', 'Kids Volume-Limiting Headphones',
  'TV Headphones for Seniors', 'Bluetooth Transmitters for TV', 'Vinyl Record Cleaning Kits',
  '360 Cameras', '8K Cameras', 'Vlogging Cameras', 'YouTube Lighting Kits',
  'Teleprompters', 'HDMI Capture Switches', 'Camera Sliders', 'Motorized Camera Sliders',
  'ND Filter Kits', 'Variable ND Filters', 'Polarizing Filters', 'Camera Rain Covers',
  'Macro Lens Attachments', 'Astrophotography Star Trackers', 'Intervalometers',
  'Remote Camera Shutters', 'Camera Sensor Cleaning Kits', 'Matter-Compatible Smart Bulbs',
  'Zigbee Smart Hubs', 'Z-Wave Smart Hubs', 'Smart Motorized Blinds', 'Smart Curtains',
  'Smart Garage Door Sensors', 'Smart Mailbox Cameras', 'Smart Package Lockers',
  'Smart Irrigation Controllers', 'Smart Hose Timers', 'Robot Pool Skimmers',
  'Smart Meat Thermometers for Smokers', 'Smart Soap Dispensers', 'Smart Showers',
  'Smart Toilets', 'Home Assistant Hardware', 'Smart Displays with Alexa',
  '60% Gaming Keyboards', 'TKL Gaming Keyboards', 'Arcade Fight Sticks',
  'Retro Handheld Gaming Consoles', 'Steam Deck Docks', 'Pro Gaming Controllers',
  'Racing Pedals', 'Sim Racing Rigs', 'VR Treadmills', 'Gaming Glasses',
  'L-Shaped Gaming Desks', 'LED Gaming Room Lights', 'XXL Gaming Mousepads',
  'Controller Charging Stations', 'PS5 SSD Expansion Drives', 'Nintendo Switch Cases',
  'Switch Pro Controller Alternatives', 'Adjustable Dumbbells', 'Smart Kettlebells',
  'Peloton Alternatives', 'Smart Yoga Mats', 'Golf Launch Monitors', 'Golf Rangefinders',
  'Golf GPS Watches', 'Smart Bike Trainers', 'Physical Therapy Recovery Devices',
  'Heart Rate Chest Straps', 'Power Meters for Cycling', 'Smart Resistance Bands',
  'Recovery Compression Boots', 'Wine Preservers', 'Electric Whisks',
  'Electric Matcha Whisks', 'Smart Tea Brewers', 'Electric Tea Kettles with Temperature Control',
  'Sous Vide Containers', 'Food Dehydrators', 'Electric Pasta Makers',
  'Electric Tortilla Presses', 'Cotton Candy Machines', 'Countertop Ice Cream Makers',
  'Portable Satellite Messengers', 'GPS Hiking Watches', 'Solar Power Banks for Camping',
  'Rechargeable Camping Lanterns', 'Portable Camping Fans', 'Portable Camp Showers',
  'Camping Water Filters', 'Travel Garment Steamers', 'Digital Luggage Scales',
  'Luggage Trackers', 'RFID Passport Holders', 'Smart Travel Pill Organizers',
  'Portable DVD Players', 'Car Seat Heaters', 'Cordless Car Vacuums',
  'Car Organizers', 'Roof Rack Cargo Boxes', 'Bike Computers', 'Rechargeable Bike Lights',
  'Head-Up Car Displays', 'Wireless Backup Cameras', '360-Degree Dash Cams',
  'Car Audio Amplifiers', 'Car Subwoofers', 'Bluetooth FM Transmitters',
  'Tire Pressure Monitoring Systems', 'Battery Maintainers', 'Jump Starter Air Compressor Combos',
  'Advanced Car Diagnostic Tablets', 'Motorcycle Dash Cams', 'Baby Sound Machines',
  'Split-Screen Baby Monitors', 'Baby Breathing Monitors', 'Smart Baby Socks',
  'Amazon Fire Kids Tablets', 'Kids Smartwatches', 'Educational Robot Toys',
  'Coding Kits for Kids', 'Kids Digital Cameras', 'Kids Walkie Talkies',
  'Safe Kids Drones', 'UV Bottle Sterilizers', 'Electric Nasal Aspirators',
  'Digital Baby Scales', 'Cross-Cut Paper Shredders', 'Home Office Laminators',
  'Binding Machines', 'Postage Scales', 'Barcode Scanners for Small Business',
  'Receipt Printers', 'POS Tablets', 'Digital Signature Pads',
  'Biometric Time Clocks', 'Conference Room Video Bars', 'Room Scheduling Displays',
  'Interactive Whiteboards', 'Digital Signage Displays', 'HDMI Fiber Cables Long Run',
  'Projector Screens', 'TV Wall Mounts', 'Karaoke Machines', 'Digital Pianos with Weighted Keys',
  'MIDI Keyboard Controllers', 'Handheld Ham Radios', 'Mobile CB Radios',
  'Long-Range Two-Way Radios', 'FPV Goggles', 'Brushless RC Cars',
  'Automatic Dog Ball Launchers', 'Smart Cat Water Fountains', 'Smart Aquarium Heaters',
  'Dog Training E-Collars', 'Baby Bottle Warmers', 'Posture Correctors with Sensors',
  'Bottom-Load Water Dispensers', 'Skincare Mini Fridges', 'UV Phone Sanitizers',
  'Smart Mug Warmers', 'Electric Lunch Boxes', 'Desk Mini Steppers',
  'Smart Weighted Hula Hoops', 'Vibration Plates', 'Smart Jump Ropes',
  'Heated Vests with Battery', 'Rechargeable Hand Warmers', 'Heated Socks',
  'Heated Gloves', 'Metal Detectors for Beginners', 'Fish Finders for Kayaks',
  'Kayak Trolling Motors', 'Marine Bluetooth Stereos', 'RV Surge Protectors',
  'Driveway Alarm Sensors', 'Rechargeable Electric Lighters', 'Laser Engravers for Hobbyists',
  'Vinyl Cutters', 'Heat Press Machines', 'Sublimation Printers', 'Reflow Ovens for PCB',
  'Hobby CNC Routers', 'Fabric Digital Cutters', 'Smart Digital Picture Frames',
  'Pen Display Drawing Monitors', 'Studio Strobe Flashes', 'Camera Speedlights',
  'CFexpress Type B Memory Cards', 'SD Cards V90', 'USB-C Memory Card Readers',
  'Drone Landing Pads', 'Handheld Gaming PCs', 'Electric Skateboards for Commuters',
  'UL-Certified Hoverboards', 'Kids Electric Scooters', 'Dog GPS Tracker Collars',
  'Smart Plant Sensors', 'TDS Water Testers', 'Clamp Meters', 'Borescope Inspection Cameras',
  'Heat Guns', 'Infrared Thermometer Guns', 'Outlet Testers', 'Wood Moisture Meters',
  'Thermal Imaging Cameras', 'Laser Measures', 'Rotary Laser Levels',
  'Thermal Label Printers for Shipping', 'Smart Pill Dispensers', 'Continuous Glucose Monitors',
  'Light Therapy Lamps', 'Radon Detectors', 'Indoor Air Quality Monitors',
  'Smart Water Leak Detectors', 'Smart Smoke Detectors', 'Smart Doorbell Chime Kits',
  'Video Doorbells Without Subscription', 'DIY Home Security Systems',
  'Smart Thermostats for Alexa', 'Smart Locks with Keypads', 'Motorized Smart Shades',
  'Smart Grill Thermometers', 'Electric Wine Openers', 'Soda Makers',
  'Bread Makers', 'Belgian Waffle Makers', 'Countertop Deep Fryers', 'Panini Press Grills',
  'Yogurt Makers', 'Electric Griddles', 'Raclette Party Grills', 'Chocolate Fountains',
  'Popcorn Machines', 'Smart Kitchen Scales', 'Electric Spice Grinders',
  'Electric Can Openers', 'Electric Tankless Water Heaters', 'Sump Pump Backup Systems',
  'Electric Garage Heaters', 'Smart Bird Feeder Cameras', 'Indoor Smart Gardens',
  'LED Grow Lights for Indoor Plants', 'Smart Sprinkler Controllers',
  'Robot Window Cleaners', 'Cordless Pole Saws', 'Backpack Leaf Blowers',
  'Electric Snow Shovels', 'Cordless Tillers and Cultivators', 'MIG Welders',
  'Plasma Cutters', 'Oscillating Multi-Tools', 'Rotary Tools', 'Benchtop Band Saws',
  'Track Saws', 'Pocket Hole Jigs', 'Shop Dust Collectors', 'Fight Sticks for Fighting Games',
  'Steam Deck Docks with Ethernet', 'Controller Charging Docks', 'Phone Lens Filter Kits',
  'MacBook Thunderbolt Docks', 'KVM Switches for Dual Monitors', 'Monitor Light Bars',
  'Under-Desk Treadmills', 'Blue-Light-Blocking Glasses', 'Smart Water Bottles',
  'Portable Monitors for MacBook', 'Laptop Privacy Screens', 'Ergonomic Vertical Mice',
  'Wired Pro Headsets for Call Centers', 'Conference Speakerphones',
  '4K Webcams for Content Creators', 'Key Lights for Video Recording',
  'Green Screens for Streaming', 'Wireless Presenters for Pitches',
  'Glass Magnetic Whiteboards', 'Mobile Rolling Whiteboards',
  'Premium Business Card Cases', 'Leather Padfolios', 'RFID-Blocking Wallets',
  'Bluetooth Item Trackers', 'Mobile Wi-Fi Hotspots', 'GaN Fast Wall Chargers',
  'Car Phone Mounts with MagSafe', 'Portable Printers for Field Work',
  'UPS Battery Backups for Home Office', 'Monitor Risers with Storage',
  'Cable Management Boxes', 'Anti-Fatigue Mats for Standing Desks',
  'Footrests for Standing Desk Users', 'Document Holders for Desk Work',
  'Premium Travel Coffee Mugs', 'Insulated Water Bottles', 'Travel Neck Pillows',
  'Sleep Masks with Bluetooth', 'Compression Socks for Flights',
  'TSA-Approved Toiletry Bags', 'International Travel Adapters',
  'Plug-In Travel Webcams', 'Folding Travel Keyboards', 'Bluetooth Travel Mice',
  '16-Inch Laptop Backpacks', 'Roller Carry-On Bags', 'Premium Fountain Pens',
  'Smart Pens with OCR', 'Noise-Cancelling Earbuds for Quick Calls',
  'Wireless Lavalier Mics for Video', 'Studio Headphones for Podcast Recording',
  'Portable Projectors for Demos', 'Stream Decks for Webinar Hosts',
  'Lumbar Support Cushions', 'Desk Treadmills for Active Work',
  'Under-Desk Ellipticals', 'Vibrating Foam Rollers', 'Electric Back Massagers',
  'Electric Scalp Massagers', 'Anti-Snoring Devices', 'Smart Sleep Masks',
  'Infrared Sauna Blankets', 'Red Light Therapy Panels', 'Electric Foot Spas',
  'Electric Heating Pads', 'Sunrise Alarm Clocks', 'White Noise Machines',
  'Cool Mist Humidifiers', 'Filtered Shower Heads', 'Smart Vents',
  'Breast Pumps', 'Solar Pathway Lights', 'Aquarium Power Filters',
  'Electric Pizza Ovens', 'Cold Brew Coffee Makers', 'Immersion Blenders',
  'Electric Smokers', 'Hand Mixers', 'Electric Fondue Pots',
  'Electric Crepe Makers', 'Electric Donut Makers', 'Bread Proofers',
  'Facial Steamers', 'Electric Callus Removers', 'Electric Nail Drills',
  'Electric Kitchen Composters', 'Automatic Pour-Over Coffee Makers',
  'Coffee Scales with Timer', 'Cold Plunge Chillers', 'Nugget Ice Makers',
];

const useCases = [
  'for College Dorms', 'for Small Apartments', 'for Seniors', 'for Students',
  'for Content Creators', 'for Podcasters', 'for Remote Workers', 'for Gamers',
  'for Home Theater', 'for RV Living', 'for Van Life', 'for Camping',
  'Under $100', 'Under $200', 'Under $500', 'for Apple Users', 'for Android Users',
  'for MacBook Users', 'for iPhone Users', 'for Samsung Galaxy Users',
];

const pools = [];
for (const c of categories) {
  pools.push(mk(`Top 10 ${c}${SUFFIX}`, sl(c)));
}
for (const c of categories.slice(0, 80)) {
  for (const u of useCases.slice(0, 6)) {
    pools.push(mk(`Top 10 ${c} ${u} in 2027`, sl(`${c}-${u}`)));
  }
}

const seen = new Set(existing);
const unique = [];
for (const row of pools) {
  if (seen.has(row.title)) continue;
  seen.add(row.title);
  unique.push(row);
}

let n = 0;
while (unique.length < 300) {
  const c = categories[n % categories.length];
  const u = useCases[n % useCases.length];
  const row = mk(`Top 10 ${c} ${u} for 2027`, sl(`${c}-${u}-alt-${n}`));
  if (!seen.has(row.title)) {
    seen.add(row.title);
    unique.push(row);
  }
  n++;
}

const START = 577;
const out = unique.slice(0, 300).map((e, i) => ({
  id: 'er' + String(START + i).padStart(4, '0'),
  title: e.title,
  slug: e.slug,
}));

fs.writeFileSync('C:/Users/koryj/website/_er_sprint300.json', JSON.stringify(out, null, 2));
console.log('queue', out.length, 'first', out[0].id, out[0].title, 'last', out[out.length - 1].id);
