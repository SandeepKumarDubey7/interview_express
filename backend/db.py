"""
MongoDB connection module.
Reads MONGODB_URI and MONGODB_DB_NAME from the .env file in the project root.
"""

import os
from pymongo import MongoClient
from pymongo.errors import OperationFailure, ConnectionFailure
from dotenv import load_dotenv

# Load .env from the project root (one level up from backend/)
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "interview_express")

_client = None
_db = None
_connection_attempted = False


def get_db():
    """Lazy MongoDB connection — connects on first use, retries on each call if failed."""
    global _client, _db, _connection_attempted

    if _db is not None:
        return _db

    if not MONGODB_URI:
        print("⚠️  MONGODB_URI is not set in .env file")
        return None

    try:
        _client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000, tls=True, tlsAllowInvalidCertificates=True)
        # Force a connection test
        _client.admin.command("ping")
        _db = _client[MONGODB_DB_NAME]
        print(f"✅ Connected to MongoDB database: {MONGODB_DB_NAME}")

        # Create indexes (idempotent)
        try:
            _db["users"].create_index("email", unique=True)
            _db["user_progress"].create_index("userId", unique=True)
            _db["dsa_progress"].create_index("userId", unique=True)
        except Exception as idx_err:
            print(f"⚠️  Index creation note: {idx_err}")

        return _db
    except Exception as e:
        print(f"⚠️  MongoDB connection failed: {e}")
        print("   Will retry on next request.")
        _client = None
        _db = None
        return None


def get_collection(name):
    """Get a MongoDB collection. Returns None if DB is unavailable."""
    db = get_db()
    if db is None:
        return None
    return db[name]
