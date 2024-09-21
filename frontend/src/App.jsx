import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');  // เชื่อมต่อไปยัง Flask

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);  // เมื่อมีข้อความใหม่ เข้ามาจะเพิ่มในแชท
    });

    return () => {
      socket.off('message');
    };
  }, []);
  const handleImageChange = (e) => {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.send(message);  // ส่งข้อความไปยัง Flask ผ่าน WebSocket
    setMessage('');  // ล้างกล่องข้อความหลังจากส่งแล้ว
  };

  return (
    <div className="text-center mt-12">
        <h1 className="text-3xl font-bold mb-4">Web Chat</h1>
        <div className="h-72 border border-black p-2 overflow-y-scroll">
            {chat.map((msg, index) => (
            <div key={index} className='border border-red-400 my-1'>{msg}</div>
            ))}
        </div>
        <form onSubmit={sendMessage} className="mt-4">
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="border p-2 rounded-md"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message"
                    className="border p-2 rounded-md flex-1"
                />
        
                <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
            {file && <img src={file} className="mt-4 max-w-full h-auto" />}
        </form>
    </div>

  );
}

export default App;