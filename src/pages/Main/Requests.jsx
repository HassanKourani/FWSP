import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "../../Config";
import Loading from "../../utils/Loading";

const Requests = () => {
  const uid = useParams().uid;
  const [requests, setRequests] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useLocation();
  const { collabName } = state;

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(
      collection(db, "collaborations", uid, "requests"),
      async (snapshot) => {
        const requestPromises = snapshot.docs.map(async (request) => {
          const user = await getDoc(
            doc(db, "users", request.data().requestedId)
          );

          return (
            <div key={request.id}>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={user.data().profile}
                    alt="user photo"
                  />
                  <h1>{user.data().name}</h1>
                </div>
                <div className="flex items-centers gap-2 pr-4">
                  <button
                    className="p-2 bg-red-600 text-xs"
                    onClick={() => handleDelete(request.id)}
                  >
                    Decline
                  </button>
                  <button
                    className="p-2 bg-green-600 text-xs"
                    onClick={() => handleAccept(request)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        });

        const requestComponents = await Promise.all(requestPromises);
        setRequests(requestComponents);
        setIsLoading(false);
      }
    );
  }, []);

  const handleDelete = (requestId) => {
    deleteDoc(doc(db, "collaborations", uid, "requests", requestId));
  };
  const handleAccept = (request) => {
    setDoc(
      doc(db, "collaborations", uid, "users", request.data().requestedId),
      {
        userName: request.data().requestedName,
      }
    );
    setDoc(doc(db, "users", request.data().requestedId, "collabs", uid), {
      collabName: collabName,
    });

    addDoc(
      collection(db, "users", request.data().requestedId, "notifications"),
      {
        message: `You were accepted to ${collabName}.`,
        type: "accepted",
        collabId: uid,
        createdAt: serverTimestamp(),
        opened: false,
      }
    );

    deleteDoc(doc(db, "collaborations", uid, "requests", request.id));
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : requests && requests.length ? (
        requests
      ) : (
        <div className="flex justify-center text-xl text-gray-300/50 items-center gap-4 pt-12">
          No incoming requests
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
            />
          </svg>
        </div>
      )}
    </>
  );
};

export default Requests;
