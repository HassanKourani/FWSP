import { useState } from "react";

const ReportModal = ({ isOpen, setIsOpen, onClick, setType }) => {
  return (
    <>
      {isOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed w-full left-0 top-1/4 sm:left-1/2 sm:w-1/2 md:left-1/3 m-auto z-50  p-4 overflow-x-hidden overflow-y-auto "
        >
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
              <div className="p-6 text-center">
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Report!
                </h3>
                <div className="flex justify-center">
                  <div className="flex flex-col items-start gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="abuse"
                        name="report"
                        onClick={(e) => setType(e.target.value)}
                      />
                      <label>Harassment or bullying</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="spam"
                        name="report"
                        onClick={(e) => setType(e.target.value)}
                      />
                      <label>Spam</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="misinformation"
                        name="report"
                        onClick={(e) => setType(e.target.value)}
                      />

                      <label>Misinformation</label>
                    </div>
                  </div>
                </div>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                  onClick={onClick}
                >
                  Report
                </button>
                <button
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportModal;
