import os

DATABASE_URL = os.getenv("DATABASE_URL")
API_KEY_SALT = os.getenv("API_KEY_SALT")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

if not API_KEY_SALT:
    raise RuntimeError("API_KEY_SALT not set")
