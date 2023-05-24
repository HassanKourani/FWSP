import { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import Discussions from "../pages/Main/Discussions";
import { db } from "../Config";
import { SessionService } from "../SessionService";
import ReportModal from "./ReportModal";
import CheckProfanity from "./ProfanityAPI";

const QuestionCard = ({ question, onClick, setCurrentComponent }) => {
  console.log(question);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [profile, setProfile] = useState();
  const [type, setType] = useState();
  const [userName, setUserName] = useState();
  const [isReported, setIsReported] = useState(false);

  const uid = useParams().uid;
  const user = SessionService.getUser();
  //console.log(user.id, question.userId);
  const handleConfirmDeleteModal = (e) => {
    e.preventDefault();
    deleteDoc(doc(db, "collaborations", uid, "discussions", question.id)).then(
      () => {
        setCurrentComponent(
          <Discussions setCurrentComponent={setCurrentComponent} />
        );
      }
    );
    getDocs(
      query(
        collection(db, "users", user.id, "discussions"),
        where("discId", "==", question.id)
      )
    ).then((disc) =>
      deleteDoc(doc(db, "users", user.id, "discussions", disc.docs[0].id))
    );
  };

  useEffect(() => {
    getDoc(doc(db, "users", question.userId)).then((user) => {
      setProfile(user.data().profile);
      setUserName(user.data().name);
    });

    onSnapshot(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        question.id,
        "reports",
        user.id
      ),
      (snapshot) => {
        setIsReported(snapshot.data() === undefined ? false : true);
      }
    );
  }, []);

  const handleReport = (e) => {
    e.preventDefault();
    console.log(type);

    getDoc(doc(db, "reports", question.id)).then((res) => {
      if (!res.data()) {
        setDoc(doc(db, "reports", question.id), {
          collabId: uid,
        }).then(() => {
          addDoc(collection(db, "reports", question.id, "users"), {
            type: type,
            reporterId: user.id,
          });
        });
      } else {
        addDoc(collection(db, "reports", question.id, "users"), {
          type: type,
          reporterId: user.id,
        });
      }
    });

    setDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        question.id,
        "reports",
        user.id
      ),
      { type: type }
    );
    setIsReportModalOpen(false);
  };

  return (
    <>
      <div
        className="bg-gray-800/50 p-4 mb-4 mr-4 cursor-pointer hover:bg-white/10"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {profile && (
              <Link to={`/profile/${question.userId}`}>
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={profile}
                  alt="user photo"
                />
              </Link>
            )}
            <h1>{userName}</h1>
          </div>
          <div className="flex gap-4 items-center">
            {question.createdAt && (
              <div className="flex gap-1 items-center text-gray-400/75 text-xs	">
                {question &&
                  new Date(question.createdAt.seconds * 1000).getDate()}
                /
                {question &&
                  new Date(question.createdAt.seconds * 1000).getMonth() + 1}
                /
                {question &&
                  new Date(question.createdAt.seconds * 1000).getFullYear()}
              </div>
            )}
            {user.id === question.userId && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 hover:text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            )}
            {/* Report button unfilled */}

            {!isReported && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsReportModalOpen(true);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                />
              </svg>
            )}
            {/* Report button filled */}
            {isReported && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="pl-8 pt-2 ">
          <h1 className="font-bold">{question.title}</h1>
          <div className=" ">
            <p className="mt-1">{question.question}</p>
            {question.link && (
              <a href={question.link} className="text-blue-600 underline">
                Linked Material
              </a>
            )}
          </div>
          <div className="flex justify-between items-start ">
            {question.image ? (
              <img src={question.image} className="max-h-32 mt-2	" />
            ) : (
              <div></div>
            )}

            <div className="flex gap-1 items-center ">
              {!question.isAnswered ? (
                <>
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
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <label className="text-xs">Not Answered</label>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <label className="text-xs">Answered</label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onClick={(e) => handleConfirmDeleteModal(e)}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        setIsOpen={setIsReportModalOpen}
        onClick={(e) => handleReport(e)}
        setType={setType}
      />
    </>
  );
};

export default QuestionCard;
