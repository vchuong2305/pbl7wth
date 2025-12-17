from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import weather
from .database import engine, Base
from . import models

# Tạo bảng trong database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thêm router
app.include_router(weather.router, prefix="/api") 