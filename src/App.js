import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';

function App() {
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Pusher.logToConsole = true;

    // Your Api
    const pusher = null;

    const channel = pusher.subscribe('chat');
    channel.bind('message', function(data) {
      setMessages(prevMessages => [...prevMessages, data]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const submit = async e => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        message: message
      })
    });
    setMessage("");
  };

  return (
    <div className='container mt-3'>
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
          <input type='text' className='fs-5 fw-semibold form-control' value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((msg, index) => (
            <div key={index} className="list-group-item list-group-item-action py-3 lh-sm">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">{msg.username}</strong>
              </div>
              <div className="col-10 mb-1 small">{msg.message}</div>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={submit}>
        <input className='form-control' placeholder='Write a message' value={message} onChange={e => setMessage(e.target.value)} />
      </form>
    </div>
  );
}

export default App;