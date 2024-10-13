from flask import request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    username = request.form['username']
    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        file_url = f"{os.getenv('URL_TO_FLASK')}/uploads/{filename}"
        return jsonify({'fileUrl': file_url, 'username': username})

    return jsonify({'error': 'Invalid file format'}), 400

def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)
