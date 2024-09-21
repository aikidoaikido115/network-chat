from flask_socketio import send

def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)