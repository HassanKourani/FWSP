import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../Config";
import Meeting from "./Meeting";
import { SessionService } from "../../SessionService";
import EmptyPage from "../../utils/EmptyPage";
import Loading from "../../utils/Loading";
import ConfirmationModal from "../../utils/ConfirmationModal";
import SnackBar from "../../utils/SnackBar";

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meetingUser, setMeetingUser] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [meetingId, setMeetingId] = useState();
  const user = SessionService.getUser();

  const cid = useParams().uid;
  const meetingsColRef = collection(db, "collaborations", cid, "meetings");

  const handleDelete = (e) => {
    e.preventDefault();
    const docRef = doc(db, "collaborations", cid, "meetings", meetingId);
    deleteDoc(docRef).then(() => setIsOpen(false));
  };

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(meetingsColRef, async (snapshot) => {
      setIsLoading(false);
      const meetingPromises = snapshot.docs.map(async (meeting) => {
        const et = new Date(meeting.data().endTime);
        const ct = new Date();
        if (et - ct > 0) {
          const userDocRef = doc(db, "users", meeting.data().uid);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          return (
            <div
              key={meeting.id}
              className="bg-gray-800/50  p-2 flex flex-col  gap-4  "
            >
              <div className="flex items-center justify-between ">
                <div className="flex items-center ">
                  <img
                    src={userData?.profile}
                    className="w-12 h-12  rounded-full object-cover "
                  />

                  <div className="pl-4 text-lg">{userData.name}</div>
                </div>
                {user.id === meeting.data().uid && (
                  <div
                    className="hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      setIsOpen(true);
                      setMeetingId(meeting.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="pl-4 text-lg">{meeting.data().name}</div>
              <div className="text-sm flex gap-2 items-center pl-4">
                <div className="flex gap-2 ">
                  <div className="flex flex-col ">
                    <span>From:</span>
                    <div>
                      <span>
                        {new Date(
                          meeting.data().startTime
                        ).toLocaleDateString()}{" "}
                      </span>

                      <span>
                        {new Date(
                          meeting.data().startTime
                        ).toLocaleTimeString()}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                -
                <div className="flex gap-2">
                  <div className="flex flex-col ">
                    <span>To:</span>
                    <div>
                      <span>
                        {new Date(meeting.data().endTime).toLocaleDateString()}{" "}
                      </span>
                      <span>
                        {new Date(meeting.data().endTime).toLocaleTimeString()}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <a
                href={`/main/${cid}/${meeting.id}`}
                target="_blank"
                className="bg-purple-600 text-lg m-4 px-4 py-2 text-center hover:bg-purple-800"
              >
                Join
              </a>
            </div>
          );
        }
      });

      const meetingComponents = await Promise.all(meetingPromises);
      setMeetings(meetingComponents.filter((meet) => !!meet));
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : meetings && meetings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-2 pr-4">{meetings}</div>
      ) : (
        <EmptyPage message={"No meetings yet"} />
      )}
      <ConfirmationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClick={(e) => handleDelete(e)}
      />
    </>
  );
};

export default Meetings;
