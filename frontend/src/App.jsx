import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

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
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const sendMessage = (e) => {
    e.preventDefault();
    socket.send(message);  // ส่งข้อความไปยัง Flask ผ่าน WebSocket
    setMessage('');  // ล้างกล่องข้อความหลังจากส่งแล้ว
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Web Chat</h1>
      <div style={{ height: '300px', border: '1px solid black', padding: '10px', overflowY: 'scroll' }}>
        {chat.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="image"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={{ marginRight: '10px' }}
        />
        <input type="file" onChange={handleImageChange} />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={{ marginRight: '10px' }}
        />
        <button type="submit">Send</button>
        <img src={file} />
      </form>
    </div>
  );
}

export default App;