from flask import Flask, request, render_template, redirect, url_for, session, jsonify
import sys
import os
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from app import app

# Set the secret key from environment variable
app.secret_key = os.environ.get('FLASK_SECRET_KEY', os.urandom(24))

# For Vercel serverless function
def handler(request):
    """Handle incoming HTTP request as a WSGI application."""
    from io import BytesIO
    import sys

    # Create WSGI environment
    environ = {
        'REQUEST_METHOD': request.method,
        'SCRIPT_NAME': '',
        'PATH_INFO': request.url.path,
        'QUERY_STRING': request.url.query,
        'SERVER_NAME': 'vercel',
        'SERVER_PORT': '443',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': BytesIO(request.body or b''),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }

    # Add HTTP headers
    for key, value in request.headers.items():
        key = key.upper().replace('-', '_')
        if key not in ('CONTENT_TYPE', 'CONTENT_LENGTH'):
            key = 'HTTP_' + key
        environ[key] = value

    # Response data
    response_data = {}

    def start_response(status, headers):
        response_data['status'] = status
        response_data['headers'] = headers

    # Get response from Flask app
    response_body = b''.join(app(environ, start_response))

    # Parse status code
    status_code = int(response_data['status'].split()[0])

    # Convert headers to dict
    headers = dict(response_data['headers'])

    # Return response
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': response_body.decode('utf-8')
    }
