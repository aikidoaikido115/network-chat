import os

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))

SECRET_KEY = 'secret!'

UPLOAD_FOLDER = os.path.join(BACKEND_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
