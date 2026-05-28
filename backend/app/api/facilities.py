from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.errors import problem_details
from app.db.repository import get_facility_by_place_id
from app.db.session import get_db
from app.models.response_models import FacilityLookupResponse
from app.services.ranking import rank_facilities


router = APIRouter()


@router.get("/facility/{place_id}", response_model=FacilityLookupResponse)
def get_facility(
	place_id: str,
	lat: float = Query(default=23.2599, ge=-90, le=90),
	lng: float = Query(default=77.4126, ge=-180, le=180),
	db=Depends(get_db),
):
	facility = get_facility_by_place_id(db, place_id)
	if facility is None:
		raise HTTPException(
			status_code=404,
			detail=problem_details(
				type="not_found",
				title="Facility not found",
				detail=f"No facility found for place_id '{place_id}'",
				status=404,
			),
		)

	ranked = rank_facilities([facility], user_lat=lat, user_lng=lng)
	facility_payload = ranked[0] if ranked else facility
	distance_km = round(float(facility_payload.get("eta", {}).get("distance_meters", 0)) / 1000, 2)
	eta_minutes = max(1, round(float(facility_payload.get("eta", {}).get("duration_seconds", 0)) / 60))
	facility_lat = float(facility_payload["latitude"])
	facility_lng = float(facility_payload["longitude"])
	directions_url = (
		f"https://www.google.com/maps/dir/?api=1&destination={facility_lat},{facility_lng}"
		f"&destination_place_id={facility_payload['place_id']}&travelmode=driving"
	)

	return FacilityLookupResponse(
		place_id=facility_payload["place_id"],
		name=facility_payload["name"],
		facility_type=facility_payload["facility_type"],
		address=facility_payload.get("address"),
		phone=facility_payload.get("phone"),
		specialties=list(facility_payload.get("specialties") or []),
		is_247=bool(facility_payload.get("is_247", False)),
		distance_km=distance_km,
		eta_minutes=eta_minutes,
		directions_url=directions_url,
	)
