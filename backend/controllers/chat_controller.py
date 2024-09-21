from flask_socketio import emit

def handle_data(data):
    message = data.get('message')
    image = data.get('image')
    
    # ประมวลผลข้อความและรูปภาพตามต้องการ
    if message:
        emit('message', message)  # ส่งข้อความกลับไปยัง Client
    if image:
        # คุณสามารถจัดการกับข้อมูลรูปภาพที่นี่ได้
        print("Received image data:", image)

