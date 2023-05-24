import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../Config";
import { useParams } from "react-router-dom";
import { SessionService } from "../SessionService";

const CreateMeetingModal = ({ isOpen, setIsOpen }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const cid = useParams().uid;
  const user = SessionService.getUser();

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    setError("");
    const et = new Date(endTime);
    const st = new Date(startTime);
    const ct = new Date();

    if (title && startTime && endTime) {
      if (st >= et) setError("Start time must be before end time.");
      else if (st < ct) setError("Start time must be in the future.");
      else {
        addDoc(collection(db, "collaborations", cid, "meetings"), {
          name: title,
          startTime: startTime,
          endTime: endTime,
          uid: user.id,
        }).then(() => {
          setTitle("");
          setStartTime("");
          setEndTime("");
          setIsOpen(false);
        });
      }
    } else setError("Please fill all fields");
  };

  return (
    <>
      {isOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed w-full left-0 top-1/4 sm:left-1/2 sm:w-1/2 md:left-1/3 m-auto z-50  p-4 overflow-x-hidden overflow-y-auto "
        >
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative p-8 bg-white rounded-lg shadow dark:bg-gray-700">
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

              <div className="text-center text-2xl text-purple-600">
                Create a meeting
              </div>
              <div className="p-6 text-center">
                <form onSubmit={(e) => handleCreateMeeting(e)}>
                  <input
                    type="text"
                    placeholder="Title"
                    className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-600/50 dark:border-purple-600/50 "
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col bg-transparent">
                      <label>Start time: </label>
                      <input
                        type="datetime-local"
                        className="bg-gray-600/50 rounded-lg  text-gray-300/50 border-purple-600/50"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label>End time: </label>
                      <input
                        type="datetime-local"
                        className="bg-gray-600/50 rounded-lg text-gray-300/50 border-purple-600/50"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-500 text-xs mt-2">{error}</div>
                  )}

                  <div className="flex  gap-4">
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-gray-500 w-1/2 mt-4 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>

                    <button
                      data-modal-hide="popup-modal"
                      type="submit"
                      className="text-white w-1/2 mt-4 bg-purple-600 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-200 rounded-lg  text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-purple-700 dark:text-white dark:hover:text-white dark:hover:bg-purple-600 dark:focus:ring-purple-600"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMeetingModal;
