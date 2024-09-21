from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from controllers.chat_controller import *  # Import controller

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# ใช้ฟังก์ชันจาก controller ไม่ต้องใช้ @socketio.on('message') แล้วตามด้วยฟังก์ชันแล้ว
socketio.on_event('sendData', handle_data)
if __name__ == '__main__':
    socketio.run(app, debug=True)
