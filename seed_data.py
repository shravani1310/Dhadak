import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from datetime import datetime, timezone
import uuid

# Load environment variables
load_dotenv('/app/backend/.env')

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

async def seed_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("🌱 Seeding database with placeholder data...")
    
    # Gallery Photos
    gallery_photos = [
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.unsplash.com/photo-1593708446743-702a9dab8c28?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85",
            "caption": "Opening performance at College Fest 2024",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.unsplash.com/photo-1668619383160-e163c585a50e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85",
            "caption": "Contemporary dance showcase",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.pexels.com/photos/8973536/pexels-photo-8973536.jpeg",
            "caption": "Bollywood fusion night",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.unsplash.com/photo-1679640933527-c96c91df0e46?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85",
            "caption": "Hip-hop battle competition",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.unsplash.com/photo-1698303098477-fac2428d9dfe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHw0fHxlbmVyZ2V0aWMlMjBkYW5jZSUyMGNyZXclMjBwZXJmb3JtYW5jZSUyMHN0YWdlJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzY1MDgzNjY2fDA&ixlib=rb-4.1.0&q=85",
            "caption": "Team practice session",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "image_url": "https://images.unsplash.com/photo-1757346143598-d1f97a47050d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxjb250ZW1wb3JhcnklMjBkYW5jZSUyMHdvcmtzaG9wJTIwc3R1ZGVudHMlMjBzdHVkaW98ZW58MHx8fHwxNzY1MDgzNjY5fDA&ixlib=rb-4.1.0&q=85",
            "caption": "Workshop participants",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # Achievements
    achievements = [
        {
            "id": str(uuid.uuid4()),
            "title": "First Prize - Inter-College Dance Competition 2024",
            "description": "Our team secured first place at the annual inter-college dance competition with a stunning contemporary performance.",
            "image_url": None,
            "date": "March 2024",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Best Choreography Award - Cultural Fest 2024",
            "description": "Recognized for innovative choreography blending traditional and modern dance forms.",
            "image_url": None,
            "date": "February 2024",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Winner - National Dance Championship",
            "description": "Represented our college at the national level and brought home the championship trophy.",
            "image_url": None,
            "date": "December 2023",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Best Team Spirit Award",
            "description": "Awarded for exceptional teamwork and coordination throughout the college fest season.",
            "image_url": None,
            "date": "January 2024",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # Team Members
    team_members = [
        {
            "id": str(uuid.uuid4()),
            "name": "Arjun Sharma",
            "role": "President",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/arjunsharma",
            "linkedin": "https://linkedin.com/in/arjunsharma",
            "twitter": None,
            "order": 1,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Priya Patel",
            "role": "Vice President",
            "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/priyapatel",
            "linkedin": None,
            "twitter": None,
            "order": 2,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rahul Kumar",
            "role": "Choreographer",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/rahulkumar",
            "linkedin": None,
            "twitter": None,
            "order": 3,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sneha Reddy",
            "role": "Creative Head",
            "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/snehareddy",
            "linkedin": "https://linkedin.com/in/snehareddy",
            "twitter": None,
            "order": 4,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Vikram Singh",
            "role": "Hip-Hop Coordinator",
            "image_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
            "instagram": None,
            "linkedin": "https://linkedin.com/in/vikramsingh",
            "twitter": None,
            "order": 5,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Ananya Kapoor",
            "role": "Classical Dance Head",
            "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/ananyakapoor",
            "linkedin": None,
            "twitter": None,
            "order": 6,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Rohan Mehta",
            "role": "Event Coordinator",
            "image_url": "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=400&h=400&fit=crop",
            "instagram": None,
            "linkedin": "https://linkedin.com/in/rohanmehta",
            "twitter": None,
            "order": 7,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Kavya Nair",
            "role": "Social Media Manager",
            "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
            "instagram": "https://instagram.com/kavyanair",
            "linkedin": None,
            "twitter": None,
            "order": 8,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # Workshops
    workshops = [
        {
            "id": str(uuid.uuid4()),
            "title": "Annual Dance Workshop 2024",
            "description": "Join us for our signature 3-day intensive workshop featuring professional choreographers from across the country. Learn various dance styles including contemporary, hip-hop, and Bollywood fusion.",
            "date": "August 15-17, 2024",
            "registration_link": "https://forms.google.com/dhadak-workshop-2024",
            "image_url": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Beginners' Bootcamp",
            "description": "A special workshop designed for beginners who want to explore the world of dance. No prior experience required!",
            "date": "September 10, 2024",
            "registration_link": "https://forms.google.com/dhadak-bootcamp",
            "image_url": None,
            "is_active": True,
            "created_at": datetime.now(timezone.utc).isoformat()
        },
    ]
    
    # About Content
    about_content = {
        "id": str(uuid.uuid4()),
        "content": "Dhadak is the official dance committee of our college, established in 2015. We are a vibrant community of passionate dancers dedicated to promoting various dance forms and cultural expression. From traditional classical dances to contemporary hip-hop, we embrace all styles and celebrate the universal language of movement. Our team consists of talented choreographers, performers, and enthusiasts who come together to create magic on stage. We organize workshops, competitions, and performances throughout the year, providing a platform for students to showcase their talent and learn from professionals. Join us in our journey to spread the joy of dance!",
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Clear existing data
    print("Clearing existing data...")
    await db.gallery.delete_many({})
    await db.achievements.delete_many({})
    await db.team.delete_many({})
    await db.workshops.delete_many({})
    await db.about.delete_many({})
    
    # Insert new data
    print("Inserting gallery photos...")
    await db.gallery.insert_many(gallery_photos)
    print(f"✅ Added {len(gallery_photos)} gallery photos")
    
    print("Inserting achievements...")
    await db.achievements.insert_many(achievements)
    print(f"✅ Added {len(achievements)} achievements")
    
    print("Inserting team members...")
    await db.team.insert_many(team_members)
    print(f"✅ Added {len(team_members)} team members")
    
    print("Inserting workshops...")
    await db.workshops.insert_many(workshops)
    print(f"✅ Added {len(workshops)} workshops")
    
    print("Inserting about content...")
    await db.about.insert_one(about_content)
    print("✅ Added about content")
    
    print("\n🎉 Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
