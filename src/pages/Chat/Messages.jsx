import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";

const Messages = ({ messages, selectedUser }) => {
  const [textMessage, setTextMessage] = useState();
  const [userInChat, setUserInChat] = useState();
  const user = SessionService.getUser();

  useEffect(() => {
    getDoc(doc(db, "users", selectedUser)).then((res) => {
      setUserInChat({ ...res.data(), id: res.id });
    });
  }, [selectedUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const messagesColRef = collection(
      db,
      "users",
      user.id,
      "chat",
      selectedUser,
      "messages"
    );
    const messagesToColRef = collection(
      db,
      "users",
      selectedUser,
      "chat",
      user.id,
      "messages"
    );
    addDoc(messagesColRef, {
      message: textMessage,
      createdAt: serverTimestamp(),
      from: user.id,
    }).then(() => {
      setTextMessage("");
    });
    setDoc(doc(db, "users", selectedUser, "chat", user.id), {
      userId: user.id,
    });
    addDoc(messagesToColRef, {
      message: textMessage,
      createdAt: serverTimestamp(),
      from: user.id,
    });
  };
  return (
    <>
      <div className="fixed top-0 w-full h-16 p-2 border-b border-purple-600/50 bg-gray-900">
        {userInChat && (
          <div className="flex gap-3 items-center">
            <img
              src={userInChat.profile}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />
            {userInChat.name}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 p-4 pb-16 pt-20">
        {messages &&
          messages.map((message) => (
            <div
              className={
                user.id === message?.from
                  ? "self-end bg-purple-700 w-max p-2 rounded-md"
                  : "bg-purple-400 w-max p-2 rounded-md"
              }
              key={message.id}
            >
              {message.message}
            </div>
          ))}
      </div>
      <div className="fixed w-3/4 bottom-0 flex justify-center gap-2 bg-gray-900 py-2">
        <input
          type="text"
          className="w-3/4 bg-gray-800 border border-purple-500 focus:border-purple-600"
          placeholder="Enter Message here..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
        />
        <button
          className="w-32 bg-purple-500 p-2"
          onClick={(e) => {
            handleSendMessage(e);
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default Messages;
