import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Config";
import { Accordion } from "@szhsin/react-accordion";
import AccordionFolder from "./AccordionFolder";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MaterialModalAccordion from "./MaterialModalAccordion";

const MaterialModal = ({ isOpen, setIsOpen, setMaterialLink }) => {
  const uid = useParams().uid;
  const [folders, setFolders] = useState();
  const foldersColRef = collection(db, "collaborations", uid, "folders");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(foldersColRef, (snapshot) => {
      setFolders(
        snapshot.docs.map((folder) => {
          return { ...folder.data(), id: folder.id };
        })
      );
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      {isOpen && (
        <div
          id="popup-modal"
          tabIndex={-1}
          className="fixed w-full  left-0 top-1/4 sm:left-1/2 sm:w-1/2 md:left-1/3 m-auto z-50  p-4 overflow-x-hidden overflow-y-auto "
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
              <div className="p-6 h-72 overflow-y-scroll">
                <div className="app pr-4">
                  <Accordion transition transitionTimeout={1000}>
                    {folders.map((folder) => {
                      return (
                        <Fragment key={folder.id}>
                          <MaterialModalAccordion
                            folder={{ ...folder }}
                            setMaterialLink={setMaterialLink}
                            setIsOpen={setIsOpen}
                          />
                        </Fragment>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialModal;
