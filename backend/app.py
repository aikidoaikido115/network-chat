from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from controllers.chat_controller import handle_message  # Import controller
from views.file_upload_view import upload_file, serve_file

app = Flask(__name__)
CORS(app)
app.config.from_pyfile('config.py')  # โหลดการตั้งค่าจาก config.py
socketio = SocketIO(app, cors_allowed_origins="*")

# ใช้ฟังก์ชันจาก controller ไม่ต้องใช้ @socketio.on('message') แล้วตามด้วยฟังก์ชันแล้ว
socketio.on_event('message', handle_message)

# File upload route
app.add_url_rule('/upload', 'upload_file', upload_file, methods=['POST'])
app.add_url_rule('/uploads/<filename>', 'serve_file', serve_file)

if __name__ == '__main__':
    socketio.run(app, debug=True)
