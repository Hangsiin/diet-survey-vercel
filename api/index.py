import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from app import app

# Set the secret key from environment variable
app.secret_key = os.environ.get('FLASK_SECRET_KEY', os.urandom(24))
