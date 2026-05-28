from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import text
from sqlalchemy.orm import Session


ROAD_ACCIDENT_RESPONSE = "road accident response"

FACILITY_SEEDS: list[dict] = [
	{
		"place_id": "aiims-bhopal",
		"name": "AIIMS Bhopal",
		"facility_type": "hospital",
		"address": "Saket Nagar, Bhopal, Madhya Pradesh 462020",
		"phone": "+917552481000",
		"latitude": 23.1939,
		"longitude": 77.4545,
		"specialties": ["trauma", "emergency", "orthopaedics", "cardiology", "paediatric"],
		"is_247": True,
	},
	{
		"place_id": "hamidia-hospital-bhopal",
		"name": "Hamidia Hospital",
		"facility_type": "hospital",
		"address": "Royal Market, Bhopal, Madhya Pradesh 462001",
		"phone": "+917552540032",
		"latitude": 23.2584,
		"longitude": 77.4093,
		"specialties": ["trauma", "emergency", "general surgery"],
		"is_247": True,
	},
	{
		"place_id": "bansal-hospital-bhopal",
		"name": "Bansal Hospital",
		"facility_type": "hospital",
		"address": "Near Shahpura Circle, Bhopal, Madhya Pradesh 462016",
		"phone": "+917552460770",
		"latitude": 23.2197,
		"longitude": 77.4432,
		"specialties": ["trauma", "orthopaedics", "cardiology", "icu"],
		"is_247": True,
	},
	{
		"place_id": "bhopal-memorial-hospital",
		"name": "Bhopal Memorial Hospital & Research Centre",
		"facility_type": "hospital",
		"address": "Karond, Bhopal, Madhya Pradesh 462038",
		"phone": "+917552711111",
		"latitude": 23.2822,
		"longitude": 77.3852,
		"specialties": ["emergency", "oncology", "internal medicine"],
		"is_247": True,
	},
	{
		"place_id": "chirayu-hospital-bhopal",
		"name": "Chirayu Hospital",
		"facility_type": "hospital",
		"address": "Raisen Road, Bhopal, Madhya Pradesh 462037",
		"phone": "+917552550404",
		"latitude": 23.2798,
		"longitude": 77.3907,
		"specialties": ["trauma", "neurosurgery", "emergency"],
		"is_247": True,
	},
	{
		"place_id": "habibganj-police-station",
		"name": "Habibganj Police Station",
		"facility_type": "police",
		"address": "Habibganj, Bhopal, Madhya Pradesh 462023",
		"phone": "+917554255500",
		"latitude": 23.2249,
		"longitude": 77.4330,
		"specialties": ["traffic control", ROAD_ACCIDENT_RESPONSE],
		"is_247": True,
	},
	{
		"place_id": "tt-nagar-police-station",
		"name": "TT Nagar Police Station",
		"facility_type": "police",
		"address": "TT Nagar, Bhopal, Madhya Pradesh 462003",
		"phone": "+917552550100",
		"latitude": 23.2323,
		"longitude": 77.4001,
		"specialties": [ROAD_ACCIDENT_RESPONSE, "crowd control"],
		"is_247": True,
	},
	{
		"place_id": "ashoka-garden-police-station",
		"name": "Ashoka Garden Police Station",
		"facility_type": "police",
		"address": "Ashoka Garden, Bhopal, Madhya Pradesh 462023",
		"phone": "+917552550222",
		"latitude": 23.2467,
		"longitude": 77.4178,
		"specialties": [ROAD_ACCIDENT_RESPONSE, "traffic policing"],
		"is_247": True,
	},
	{
		"place_id": "108-ambulance-bhopal-central",
		"name": "108 Emergency Ambulance Service - Bhopal Central",
		"facility_type": "ambulance",
		"address": "Regional Control Room, Bhopal, Madhya Pradesh",
		"phone": "+917552108108",
		"latitude": 23.2599,
		"longitude": 77.4126,
		"specialties": ["basic life support", "advanced life support", "road rescue"],
		"is_247": True,
	},
	{
		"place_id": "apollo-ambulance-bhopal",
		"name": "Apollo Ambulance Service Bhopal",
		"facility_type": "ambulance",
		"address": "M.P. Nagar, Bhopal, Madhya Pradesh 462011",
		"phone": "+917552672222",
		"latitude": 23.2338,
		"longitude": 77.4344,
		"specialties": ["advanced life support", "patient transfer"],
		"is_247": True,
	},
	{
		"place_id": "sahara-ambulance-bhopal",
		"name": "Sahara Private Ambulance Bhopal",
		"facility_type": "ambulance",
		"address": "Arera Colony, Bhopal, Madhya Pradesh 462016",
		"phone": "+917552781234",
		"latitude": 23.2181,
		"longitude": 77.4376,
		"specialties": ["patient transfer", "basic life support"],
		"is_247": True,
	},
	{
		"place_id": "hamidia-trauma-centre",
		"name": "Hamidia Trauma Centre",
		"facility_type": "hospital",
		"address": "Hamidia Road, Bhopal, Madhya Pradesh 462001",
		"phone": "+917552540090",
		"latitude": 23.2581,
		"longitude": 77.4098,
		"specialties": ["trauma", "orthopaedics", "emergency surgery"],
		"is_247": True,
	},
	{
		"place_id": "rks-trauma-centre",
		"name": "R.K. Shah Trauma Centre",
		"facility_type": "hospital",
		"address": "Nehru Nagar, Bhopal, Madhya Pradesh 462003",
		"phone": "+917552343333",
		"latitude": 23.2360,
		"longitude": 77.4108,
		"specialties": ["trauma", "spine care", "emergency"],
		"is_247": True,
	},
	{
		"place_id": "nh-46-rescue",
		"name": "NH-46 Vehicle Rescue Unit",
		"facility_type": "rescue",
		"address": "Bhopal Bypass, NH-46, Bhopal, Madhya Pradesh",
		"phone": "+917553001100",
		"latitude": 23.1898,
		"longitude": 77.4832,
		"specialties": ["highway patrol", "vehicle extraction", "tow rescue"],
		"is_247": True,
	},
	{
		"place_id": "bhopal-highway-patrol",
		"name": "Bhopal Highway Patrol Rescue",
		"facility_type": "rescue",
		"address": "Bairagarh Bypass, Bhopal, Madhya Pradesh 462030",
		"phone": "+917553001200",
		"latitude": 23.2461,
		"longitude": 77.4361,
		"specialties": ["highway patrol", "roadside recovery"],
		"is_247": True,
	},
]


def seed_facilities(session: Session) -> int:
	insert_sql = text(
		"""
		INSERT INTO facilities (
			place_id, name, facility_type, address, phone, latitude, longitude, location,
			specialties, is_247, verified_at
		)
		VALUES (
			:place_id, :name, :facility_type, :address, :phone, :latitude, :longitude,
			ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
			:specialties, :is_247, :verified_at
		)
		ON CONFLICT (place_id) DO NOTHING
		"""
	)

	inserted = 0
	for facility in FACILITY_SEEDS:
		result = session.execute(
			insert_sql,
			{
				**facility,
				"specialties": facility.get("specialties") or [],
				"verified_at": datetime.now(timezone.utc),
			},
		)
		inserted += int(result.rowcount or 0)

	session.commit()
	return inserted