import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import FriendsList from "./FriendsList";
import Messages from "./Messages";
import cuteness from "../../images/cute-astronaut.png";
import MobileBurger from "../../utils/MobileBurger";

const Chat = () => {
  const { state = null } = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(state?.chatUserId);
  const [messages, setMessages] = useState();
  const [isListOpen, setIsListOpen] = useState(false);
  const user = SessionService.getUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 640; // Adjust the threshold value as needed
      setIsMobile(isMobile);
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
        <div className="z-50 fixed top-0 left-0 w-full sm:w-1/4 max-h-screen overflow-scroll sm:h-screen border-r border-purple-500/50  bg-gray-900">
          <div className="flex justify-start gap-4 items-center px-2 bg-gray-900">
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

          {isListOpen || !isMobile ? (
            <FriendsList
              setSelectedUser={setSelectedUser}
              setIsListOpen={setIsListOpen}
            />
          ) : null}
        </div>

        <div className="fixed w-full left-0 sm:left-1/4 sm:w-3/4 h-screen overflow-scroll">
          {selectedUser ? (
            <Messages messages={messages} selectedUser={selectedUser} />
          ) : (
            <div className="flex flex-col mt-20 sm:mt-0 justify-center items-center opacity-25">
              <img src={cuteness} alt="Cuteness" />
              <span className="text-purple-500 text-2xl">No chat selected</span>
            </div>
          )}
        </div>
      </div>
      <div className="sm:hidden fixed top-4 right-4 z-50">
        <MobileBurger
          setIsBurgerOpen={setIsListOpen}
          isBurgerOpen={isListOpen}
        />
      </div>
    </>
  );
};

export default Chat;
