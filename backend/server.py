from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

class Admin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminRegister(BaseModel):
    email: EmailStr
    password: str

class GalleryPhoto(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    image_url: str
    caption: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GalleryPhotoCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None

class Achievement(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    image_url: Optional[str] = None
    date: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AchievementCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    date: str

class TeamMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    image_url: str
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    order: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image_url: str
    instagram: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    order: int = 0

class Workshop(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    date: str
    registration_link: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WorkshopCreate(BaseModel):
    title: str
    description: str
    date: str
    registration_link: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

class AboutContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AboutContentUpdate(BaseModel):
    content: str

@api_router.post("/admin/register")
async def register_admin(admin: AdminRegister):
    existing = await db.admins.find_one({"email": admin.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    password_hash = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    admin_obj = Admin(email=admin.email, password_hash=password_hash)
    doc = admin_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.admins.insert_one(doc)
    
    token = create_access_token({"email": admin.email, "id": admin_obj.id})
    return {"token": token, "email": admin.email}

@api_router.post("/admin/login")
async def login_admin(admin: AdminLogin):
    admin_doc = await db.admins.find_one({"email": admin.email}, {"_id": 0})
    if not admin_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(admin.password.encode('utf-8'), admin_doc['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"email": admin.email, "id": admin_doc['id']})
    return {"token": token, "email": admin.email}

@api_router.post("/gallery", dependencies=[Depends(verify_token)])
async def create_gallery_photo(photo: GalleryPhotoCreate):
    photo_obj = GalleryPhoto(**photo.model_dump())
    doc = photo_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.gallery.insert_one(doc)
    return photo_obj

@api_router.get("/gallery", response_model=List[GalleryPhoto])
async def get_gallery_photos():
    photos = await db.gallery.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for photo in photos:
        if isinstance(photo['created_at'], str):
            photo['created_at'] = datetime.fromisoformat(photo['created_at'])
    return photos

@api_router.delete("/gallery/{photo_id}", dependencies=[Depends(verify_token)])
async def delete_gallery_photo(photo_id: str):
    result = await db.gallery.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted"}

@api_router.post("/achievements", dependencies=[Depends(verify_token)])
async def create_achievement(achievement: AchievementCreate):
    achievement_obj = Achievement(**achievement.model_dump())
    doc = achievement_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.achievements.insert_one(doc)
    return achievement_obj

@api_router.get("/achievements", response_model=List[Achievement])
async def get_achievements():
    achievements = await db.achievements.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for achievement in achievements:
        if isinstance(achievement['created_at'], str):
            achievement['created_at'] = datetime.fromisoformat(achievement['created_at'])
    return achievements

@api_router.put("/achievements/{achievement_id}", dependencies=[Depends(verify_token)])
async def update_achievement(achievement_id: str, achievement: AchievementCreate):
    doc = achievement.model_dump()
    result = await db.achievements.update_one({"id": achievement_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return {"message": "Achievement updated"}

@api_router.delete("/achievements/{achievement_id}", dependencies=[Depends(verify_token)])
async def delete_achievement(achievement_id: str):
    result = await db.achievements.delete_one({"id": achievement_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Achievement not found")
    return {"message": "Achievement deleted"}

@api_router.post("/team", dependencies=[Depends(verify_token)])
async def create_team_member(member: TeamMemberCreate):
    member_obj = TeamMember(**member.model_dump())
    doc = member_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.team.insert_one(doc)
    return member_obj

@api_router.get("/team", response_model=List[TeamMember])
async def get_team_members():
    members = await db.team.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    for member in members:
        if isinstance(member['created_at'], str):
            member['created_at'] = datetime.fromisoformat(member['created_at'])
    return members

@api_router.put("/team/{member_id}", dependencies=[Depends(verify_token)])
async def update_team_member(member_id: str, member: TeamMemberCreate):
    doc = member.model_dump()
    result = await db.team.update_one({"id": member_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member updated"}

@api_router.delete("/team/{member_id}", dependencies=[Depends(verify_token)])
async def delete_team_member(member_id: str):
    result = await db.team.delete_one({"id": member_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    return {"message": "Team member deleted"}

@api_router.post("/workshop", dependencies=[Depends(verify_token)])
async def create_workshop(workshop: WorkshopCreate):
    workshop_obj = Workshop(**workshop.model_dump())
    doc = workshop_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.workshops.insert_one(doc)
    return workshop_obj

@api_router.get("/workshop", response_model=List[Workshop])
async def get_workshops():
    workshops = await db.workshops.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for workshop in workshops:
        if isinstance(workshop['created_at'], str):
            workshop['created_at'] = datetime.fromisoformat(workshop['created_at'])
    return workshops

@api_router.put("/workshop/{workshop_id}", dependencies=[Depends(verify_token)])
async def update_workshop(workshop_id: str, workshop: WorkshopCreate):
    doc = workshop.model_dump()
    result = await db.workshops.update_one({"id": workshop_id}, {"$set": doc})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return {"message": "Workshop updated"}

@api_router.delete("/workshop/{workshop_id}", dependencies=[Depends(verify_token)])
async def delete_workshop(workshop_id: str):
    result = await db.workshops.delete_one({"id": workshop_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return {"message": "Workshop deleted"}

@api_router.post("/contact")
async def create_contact_submission(contact: ContactSubmissionCreate):
    contact_obj = ContactSubmission(**contact.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_submissions.insert_one(doc)
    return {"message": "Message sent successfully"}

@api_router.get("/contact", dependencies=[Depends(verify_token)], response_model=List[ContactSubmission])
async def get_contact_submissions():
    submissions = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for submission in submissions:
        if isinstance(submission['created_at'], str):
            submission['created_at'] = datetime.fromisoformat(submission['created_at'])
    return submissions

@api_router.get("/about")
async def get_about_content():
    content = await db.about.find_one({}, {"_id": 0})
    if not content:
        return {"content": "Dhadak is the official dance committee of our college. We are a vibrant community of dancers passionate about various dance forms and cultural expression."}
    if isinstance(content.get('updated_at'), str):
        content['updated_at'] = datetime.fromisoformat(content['updated_at'])
    return content

@api_router.put("/about", dependencies=[Depends(verify_token)])
async def update_about_content(about: AboutContentUpdate):
    content_obj = AboutContent(content=about.content)
    doc = content_obj.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.about.delete_many({})
    await db.about.insert_one(doc)
    return {"message": "About content updated"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()