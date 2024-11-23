from flask import Flask, request
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from app import app

# Set the secret key from environment variable
app.secret_key = os.environ.get('FLASK_SECRET_KEY', os.urandom(24))

# Handler for Vercel serverless function
def handler(request):
    if request.method == "POST":
        return app.view_functions[request.endpoint]()
    return app.view_functions[request.endpoint]()
