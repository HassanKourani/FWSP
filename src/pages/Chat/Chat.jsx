import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";

const Chat = () => {
  const uid = useParams().userId;
  const user = SessionService.getUser();
  useEffect(() => {
    onSnapshot(collection(db, "users", user.id, "chat", uid, "messages"));
  }, []);

  return <>Hello Dan!</>;
};

export default Chat;
