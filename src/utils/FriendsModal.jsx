import { deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Config";
import { SessionService } from "../SessionService";
import { Link, useNavigate } from "react-router-dom";

const FriendsModal = ({ isOpen, setIsOpen, friends, setFriends, type }) => {
  const [friendsList, setFriendsList] = useState();
  const [isPending, setIsPending] = useState(false);
  const user = SessionService.getUser();
  const navigate = useNavigate();
  const handleFriends = (e, exists, friendId) => {
    e.preventDefault();
    if (exists) {
      deleteDoc(doc(db, "users", user.id, "following", friendId));
      deleteDoc(doc(db, "users", friendId, "followers", user.id)).then(() => {
        setIsOpen(false);
        setFriends();
      });
    } else {
      setDoc(doc(db, "users", user.id, "following", friendId), {
        userId: friendId,
      });
      setDoc(doc(db, "users", friendId, "followers", user.id), {
        userId: user.id,
      }).then(() => {
        setIsOpen(false);
        setFriends();
      });
    }
  };

  useEffect(() => {
    setIsPending(true);
    Promise.all(
      friends?.map((friend) => {
        return getDoc(doc(db, "users", friend.id));
      })
    ).then((friendsPromise) =>
      Promise.all(
        friendsPromise.map((friend) => {
          return getDoc(doc(db, "users", user.id, "following", friend.id)).then(
            (res) => {
              return res;
            }
          );
        })
      ).then((followingPromise) => {
        setFriendsList(
          followingPromise.map((dan, index) => {
            const friend = friendsPromise[index];
            return (
              <div
                key={friend.id}
                className="flex items-center justify-between py-2 px-4 border-b border-gray-600"
                onClick={() => {
                  navigate(`/profile/${friend.id}`);
                  setIsOpen(false);
                }}
              >
                <div className="flex gap-2">
                  <img
                    src={friend.data().profile}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>{friend.data().name}</div>
                </div>
                <div>
                  <button
                    className="bg-purple-500 text-sm rounded-lg px-2"
                    onClick={(e) => {
                      handleFriends(e, dan.exists(), friend.id);
                    }}
                  >
                    {dan.exists() ? "Unfollow" : "Follow"}
                  </button>
                </div>
              </div>
            );
          })
        );
      })
    );
  }, [friends]);

  return (
    <>
      {isOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed w-full left-0 top-1/4 sm:left-1/2 sm:w-1/2 md:left-1/3 m-auto z-50  p-4 overflow-x-hidden overflow-y-auto "
        >
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative h-72 bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 text-center">
                <div className="p-4 text-center">{type}</div>
                {friendsList}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendsModal;
