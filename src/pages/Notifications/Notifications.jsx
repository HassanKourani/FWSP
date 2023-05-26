import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Config";
import { useEffect, useState } from "react";
import { SessionService } from "../../SessionService";
import { Link, useNavigate } from "react-router-dom";
import SnackBar from "../../utils/SnackBar";
import cuteness from "../../images/cute-astronaut.png";

const Notifications = () => {
  const user = SessionService.getUser();
  !user && window.location.assign("/");
  const [allNotifications, setAllNotifications] = useState([]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = (notification, id) => {
    updateDoc(doc(db, "users", user.id, "notifications", id), { opened: true });

    if (
      notification.type === "comment" ||
      notification.type === "answer" ||
      notification.type === "discussion"
    ) {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          getDoc(
            doc(
              db,
              "collaborations",
              notification.collabId,
              "discussions",
              notification.discussionId
            )
          ).then((discRes) => {
            if (discRes.exists()) {
              navigate(`/main/${notification.collabId}`, {
                state: {
                  collabName: collab.data().title,
                  discId: notification.discussionId,
                },
              });
            } else {
              setIsOpen(true);
            }
          });
        }
      );
    } else if (notification.type === "request") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
              request: true,
            },
          });
        }
      );
    } else if (notification.type === "join") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
              detail: true,
            },
          });
        }
      );
    } else if (notification.type === "accepted") {
      getDoc(doc(db, "collaborations", notification.collabId)).then(
        (collab) => {
          navigate(`/main/${notification.collabId}`, {
            state: {
              collabName: collab.data().title,
            },
          });
        }
      );
    }
  };

  useEffect(() => {
    getDocs(
      query(
        collection(db, "users", user.id, "notifications"),
        orderBy("createdAt", "desc")
      )
    ).then((res) => {
      setAllNotifications(
        res.docs.map((notification) => (
          <div
            onClick={() =>
              handleNotificationClick(notification.data(), notification.id)
            }
            key={notification.id}
            className={
              notification.data().opened
                ? "px-2 py-4 gap-2  flex flex-col border-b border-gray-600 cursor-pointer hover:bg-gray-700/50 "
                : "px-2 py-4 gap-2  flex flex-col border-b border-gray-600 cursor-pointer hover:bg-gray-700/50  font-bold"
            }
          >
            <div className=" flex items-center justify-between">
              <div className=" flex items-center gap-4">
                {!notification.data().opened && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                )}
                {notification.data().opened && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="gray"
                    className="w-5 h-5"
                  >
                    <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 01-.712 1.321l-5.683-3.06a1.5 1.5 0 00-1.422 0l-5.683 3.06a.75.75 0 01-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 003 3h15z" />
                    <path d="M1.5 9.589v-.745a3 3 0 011.578-2.641l7.5-4.039a3 3 0 012.844 0l7.5 4.039A3 3 0 0122.5 8.844v.745l-8.426 4.926-.652-.35a3 3 0 00-2.844 0l-.652.35L1.5 9.59z" />
                  </svg>
                )}
                <div className="text-center w-24 py-1 rounded-full text-xs bg-purple-600">
                  {notification.data().type.charAt(0).toUpperCase() +
                    notification.data().type.slice(1)}
                </div>
              </div>
              <div className="text-xs text-gray-500/75">
                {notification.data() &&
                  new Date(
                    notification.data().createdAt.seconds * 1000
                  ).getDate()}
                /
                {notification.data() &&
                  new Date(
                    notification.data().createdAt.seconds * 1000
                  ).getMonth() + 1}
                /
                {notification.data() &&
                  new Date(
                    notification.data().createdAt.seconds * 1000
                  ).getFullYear()}
              </div>
            </div>
            <span
              className={
                notification.data().opened
                  ? "px-8 truncate text-gray-400 "
                  : "px-8 truncate "
              }
            >
              {notification.data().message}
            </span>
          </div>
        ))
      );
    });
  }, []);

  return (
    <>
      {/* --------------------LOGO --------------------------------*/}

      <div className=" bg-gray-900 flex flex-col h-full pt-16 md:w-2/3 m-auto ">
        <div className="absolute top-8 left-8 z-50 flex items-center gap-4">
          <Link to="/main" className="block">
            <svg
              className="w-8 h-8 fill-current text-purple-600"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
            </svg>
          </Link>
        </div>{" "}
        <div className="text-3xl m-auto w-3/4">Notifications</div>
        <div className="bg-gray-800/50 px-10 py-5  h-full rounded-lg">
          {allNotifications.length > 0 ? (
            <div className="">{allNotifications}</div>
          ) : (
            <div className="flex flex-col items-center justify-center opacity-25">
              <img src={cuteness} alt="Cuteness" />
              <span className="text-2xl text-purple-500">No notification</span>
            </div>
          )}
        </div>
      </div>
      <SnackBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Notifications;
