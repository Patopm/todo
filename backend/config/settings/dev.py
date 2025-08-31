from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Permite localhost:3000 (Next.js dev)
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")

# Logging sencillo
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler"
        }
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG"
    },
}
