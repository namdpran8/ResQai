export const emergencyContacts = [
  {
    id: 1,
    name: "Sarah Johnson",
    relation: "Spouse",
    phone: "+1 (555) 234-5678",
    avatar: "SJ",
    avatarColor: "from-pink-500 to-rose-600",
    isPrimary: true,
  },
  {
    id: 2,
    name: "Michael Johnson",
    relation: "Father",
    phone: "+1 (555) 876-5432",
    avatar: "MJ",
    avatarColor: "from-blue-500 to-indigo-600",
    isPrimary: false,
  },
  {
    id: 3,
    name: "Emma Johnson",
    relation: "Sister",
    phone: "+1 (555) 345-6789",
    avatar: "EJ",
    avatarColor: "from-violet-500 to-purple-600",
    isPrimary: false,
  },
  {
    id: 4,
    name: "Dr. Alan Park",
    relation: "Family Doctor",
    phone: "+1 (555) 987-3210",
    avatar: "AP",
    avatarColor: "from-emerald-500 to-teal-600",
    isPrimary: false,
  },
];

export const nearbyServices = [
  {
    id: 1,
    name: "City General Hospital",
    type: "Hospital",
    distance: "0.8 mi",
    eta: "3 min",
    status: "Open",
    available: true,
    beds: 12,
    icon: "hospital",
  },
  {
    id: 2,
    name: "Metro Fire Station",
    type: "Fire",
    distance: "1.2 mi",
    eta: "4 min",
    status: "Available",
    available: true,
    units: 3,
    icon: "fire",
  },
  {
    id: 3,
    name: "Central Police Dept.",
    type: "Police",
    distance: "0.5 mi",
    eta: "2 min",
    status: "On Duty",
    available: true,
    officers: 8,
    icon: "police",
  },
  {
    id: 4,
    name: "Riverside Trauma Center",
    type: "Hospital",
    distance: "2.1 mi",
    eta: "7 min",
    status: "Open",
    available: true,
    beds: 5,
    icon: "hospital",
  },
];

export const emergencyClassifications = [
  {
    type: "Vehicle Collision",
    severity: "Critical",
    color: "red",
    actions: [
      "Call 911 immediately",
      "Do not move injured persons",
      "Turn on hazard lights",
      "Set up warning triangles",
      "Wait for emergency services",
    ],
    description: "High-impact collision detected. Multiple injuries possible.",
  },
  {
    type: "Medical Emergency",
    severity: "Serious",
    color: "orange",
    actions: [
      "Keep patient conscious",
      "Do not give food or water",
      "Apply pressure to wounds",
      "Stay on the line with 911",
    ],
    description: "Medical assistance required urgently.",
  },
  {
    type: "Roadside Breakdown",
    severity: "Minor",
    color: "yellow",
    actions: [
      "Move vehicle to shoulder",
      "Turn on hazard lights",
      "Call roadside assistance",
      "Stay inside if on highway",
    ],
    description: "Vehicle malfunction. No immediate injury risk.",
  },
];

export const userProfile = {
  name: "Alex Johnson",
  age: 32,
  bloodGroup: "O+",
  allergies: ["Penicillin", "Latex"],
  medicalConditions: [],
  emergencyId: "RSQ-2024-7834",
  location: "123 Main Street, Downtown",
  coordinates: "40.7128° N, 74.0060° W",
};

export const cachedHospitals = [
  { name: "City General Hospital", phone: "555-1234", distance: "0.8 mi" },
  { name: "Riverside Trauma Center", phone: "555-5678", distance: "2.1 mi" },
  { name: "Metro Medical Center", phone: "555-9012", distance: "3.4 mi" },
];

export const emergencyNumbers = [
  { service: "Emergency (All)", number: "911", icon: "🚨" },
  { service: "Ambulance", number: "911", icon: "🚑" },
  { service: "Police", number: "911", icon: "👮" },
  { service: "Fire Department", number: "911", icon: "🚒" },
  { service: "Poison Control", number: "1-800-222-1222", icon: "☠️" },
  { service: "Coast Guard", number: "1-800-368-5647", icon: "⚓" },
];

export const ambulanceUpdates = [
  { time: "14:32", message: "Emergency dispatch accepted", status: "done" },
  { time: "14:33", message: "Ambulance unit AMB-047 assigned", status: "done" },
  { time: "14:35", message: "En route to your location", status: "active" },
  { time: "14:38", message: "Estimated arrival 3 minutes", status: "pending" },
  { time: "14:41", message: "Paramedics on scene", status: "pending" },
];
