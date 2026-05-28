from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.requests import Request

from app.api.triage import router as triage_router
from app.api.ranking import router as ranking_router
from app.api.health import router as health_router
from app.api.facilities import router as facility_router
from app.api.contacts import router as contacts_router
from app.routers.sos import router as sos_router

from app.core.constants import (
    APP_NAME,
    VERSION,
    DESCRIPTION,
    API_PREFIX
)
from app.core.errors import problem_details, problem_response

# Create FastAPI app
app = FastAPI(
    title=APP_NAME,
    version=VERSION,
    description=DESCRIPTION
)

# Register API routes
app.include_router(triage_router, prefix=API_PREFIX)
app.include_router(ranking_router, prefix=API_PREFIX)
app.include_router(health_router, prefix=API_PREFIX)
app.include_router(facility_router, prefix=API_PREFIX)
app.include_router(contacts_router, prefix=API_PREFIX)
app.include_router(sos_router, prefix=API_PREFIX)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    message = "Invalid request"
    for error in exc.errors():
        if error.get("msg"):
            message = error["msg"]
            break
    payload = problem_details(
        type="validation_error",
        title="Invalid request",
        detail=message,
        status=422,
        extra={"errors": exc.errors()},
    )
    return problem_response(payload, 422)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and {"type", "title", "detail", "status"}.issubset(exc.detail):
        return problem_response(exc.detail, exc.status_code)

    payload = problem_details(
        type="http_error",
        title="Request failed",
        detail=str(exc.detail),
        status=exc.status_code,
    )
    return problem_response(payload, exc.status_code)


# Root endpoint
@app.get("/")
def root():

    return {
        "message": "RoadSoS AI Backend Running"
    }