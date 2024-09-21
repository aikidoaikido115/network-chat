import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');  // เชื่อมต่อไปยัง Flask

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState();
  


  useEffect(() => {
    socket.on('message', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);  // เมื่อมีข้อความใหม่ เข้ามาจะเพิ่มในแชท
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleImageChange = (e) => {
    setFile(e.target.files[0]);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          socket.send(response.data.fileUrl);  // Send the file URL via WebSocket
          setFile(null);  // Clear the file input
        } catch (error) {
          console.error('Error uploading file', error);
        }
      } else {
        // Handle text message
        socket.send(message);  
      }
      setMessage(''); 
  };

  return (
    <div className="h-[90vh] border border-green-400">
        <h1 className="text-3xl font-bold mb-4">Web Chat</h1>
        <div className="h-4/5 border-2 border-black p-2 overflow-y-scroll">
            {chat.map((msg, index) => (
            <div key={index} className='my-2'>
                {msg.startsWith('http') ? (
                    <img src={msg} className="w-1/6 h-auto"/>
            ) : (
              msg
            )}
            </div>
            ))}
        </div>
        <form onSubmit={sendMessage} className="mt-4">
            <div className="flex items-center space-x-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="border p-2 rounded-md flex-1"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="border p-2 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                Send
            </button>
            </div>
            {file && <img src={URL.createObjectURL(file)} className="mt-4 max-w-full h-auto" />}
        </form>
        </div>
  );
}

export default App;