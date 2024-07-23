// components/Chat.js
import React, { useState, useEffect } from 'react';
import { getFirestore, addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './Chat.css';

const Chat = ({ authenticatedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShrinked, setIsShrinked] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [db]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const { uid, displayName } = auth.currentUser;
    await addDoc(collection(db, 'messages'), {
      text: newMessage,
      user: displayName,
      uid,
      timestamp: new Date()
    });
    setNewMessage('');
  };

  const handleResize = () => {
    if (isShrinked) {
      setIsShrinked(false);
    } else if (isExpanded) {
      setIsExpanded(false);
      setIsShrinked(true);
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <div className={`chat-container ${isExpanded ? 'expanded' : ''} ${isShrinked ? 'shrinked' : ''}`}>
      <button onClick={handleResize}>
        {isShrinked ? 'Chat' : isExpanded ? 'Shrink' : 'Expand'}
      </button>
      {!isShrinked && (
        <>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                <p>{msg.text}</p>
                <span>{msg.user}</span>
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={handleSendMessage}>
            <input
              className="chat-input"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
            />
            <button className="chat-button" type="submit">Send</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
