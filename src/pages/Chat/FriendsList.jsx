import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";

const FriendsList = ({ setSelectedUser }) => {
  const [list, setList] = useState();

  const user = SessionService.getUser();
  const chatColRef = collection(db, "users", user.id, "chat");
  useEffect(() => {
    onSnapshot(chatColRef, (snapshot) => {
      Promise.all(
        snapshot.docs.map((chat) => {
          const userDocRef = doc(db, "users", chat.id);
          return getDoc(userDocRef).then((res) => {
            return { ...res.data(), id: res.id };
          });
        })
      ).then((user) => {
        setList(
          user.map((res) => {
            return (
              <div
                className=" flex  gap-4 items-center p-4 bg-gray-600/50 cursor-pointer hover:bg-gray-500/50 border-b border-gray-500/50"
                onClick={() => {
                  setSelectedUser(res.id);
                }}
              >
                <img
                  src={res.profile}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="">{res.name}</div>
              </div>
            );
          })
        );
      });
    });
  }, []);
  return <>{list}</>;
};

export default FriendsList;
