import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import Header from "../../partials/Header";
import FriendsList from "./FriendsList";
import Messages from "./Messages";

const Chat = () => {
  const { state = null } = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(state?.chatUserId);
  const [messages, setMessages] = useState();
  const user = SessionService.getUser();
  useEffect(() => {
    //console.log(selectedUser);
    if (selectedUser) {
      onSnapshot(
        query(
          collection(db, "users", user.id, "chat", selectedUser, "messages"),
          orderBy("createdAt")
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((message) => {
              return { ...message.data(), id: message.id };
            })
          );
        }
      );
    }
  }, [selectedUser]);
  return (
    <>
      <div className="flex">
        <div className="fixed top-0 left-0 w-1/4 h-screen border-r border-purple-500/50">
          <div className="flex justify-start gap-6 items-center px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 cursor-pointer hover:text-purple-500"
              onClick={() => {
                navigate(-1);
              }}
            >
              <path
                fillRule="evenodd"
                d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-2xl m-2 flex justify-center">Chat</div>
          </div>

          <FriendsList setSelectedUser={setSelectedUser} />
        </div>
        <div className="fixed left-1/4 w-3/4 h-screen overflow-scroll">
          {selectedUser ? (
            <Messages messages={messages} selectedUser={selectedUser} />
          ) : (
            <>Select a Chat</>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
