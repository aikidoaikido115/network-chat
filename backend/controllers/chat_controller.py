from flask_socketio import send, emit, SocketIO
from flask import jsonify
import json

def handle_message(msg_json):
    # แปลง JSON ให้ดึงค่าได้เพื่อแสดงผล
    json_load = json.loads(msg_json)
    message, username = json_load["msg"], json_load["username"]
    # Handle incoming message from client
    print(f"Message: {message} from {username}")

    # print(f"Message: {msg}")
    send(msg_json, broadcast=True)