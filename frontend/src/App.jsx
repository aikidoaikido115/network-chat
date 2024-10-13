import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(import.meta.env.VITE_URL_TO_FLASK);  // เชื่อมต่อไปยัง Flask

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [file, setFile] = useState();
  const [username, setUserName] = useState("Guest")
  


  useEffect(() => {
    socket.on('message', (msg_json) => {
      let parsed_json = JSON.parse(msg_json)
      setChat((prevChat) => [...prevChat, { "msg": parsed_json.msg, "username": parsed_json.username }]);  // เมื่อมีข้อความใหม่ เข้ามาจะเพิ่มในแชท 
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
    console.log(chat)
    console.log(file)
    if (file) {
        // Handle file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', username) // ส่งชื่อ username ไปแสดงผลด้วย
  
        try {
          const response = await axios.post(`${import.meta.env.VITE_URL_TO_FLASK}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          socket.send(JSON.stringify({msg: response.data.fileUrl, username: response.data.username}));  // Send the file URL via WebSocket, convert to JSON to send username
          setFile(null);  // Clear the file input
        } catch (error) {
          console.error('Error uploading file', error);
        }
      } else {
        // Handle text message
        socket.send(JSON.stringify({"msg":message, "username": username}));  
      }
      setMessage(''); 
  };

  return (
    <div className="h-[90vh] border border-green-400">
        <h1 className="text-3xl font-bold mb-4">Web Chat</h1>
        <div className="h-4/5 border-2 border-black p-2 overflow-y-scroll">
            {chat.map((message, index) => (
            <div key={index} className='my-2'>
                {message.msg.startsWith('http') ? (
                    <div>
                        <p>{message.username} ส่งรูป</p>
                        <img src={message.msg} className="w-1/6 h-auto"/>
                    </div>
            ) : (
              `${message.username}: ${message.msg}`
            )}
            </div>
            ))}
        </div>
        <form onSubmit={sendMessage} className="mt-4">
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Type your username"
                    className="border p-2 rounded-md flex-none"
                />
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