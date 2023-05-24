import { collection, onSnapshot } from "firebase/firestore";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Config";
import Loading from "../../utils/Loading";
import AccordionFolder from "../../utils/AccordionFolder";
import { Accordion } from "@szhsin/react-accordion";
import EmptyPage from "../../utils/EmptyPage";
//import "../../Utils/AccordionFolder.module.css";

const Materials = () => {
  const uid = useParams().uid;
  const [folders, setFolders] = useState();
  const foldersColRef = collection(db, "collaborations", uid, "folders");
  const [isLoading, setIsLoading] = useState(true);
  const [searchedFolders, setSearchedFolders] = useState([]);
  const [search, setSearch] = useState([]);

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

  useEffect(() => {
    setSearchedFolders(folders);
  }, [folders]);

  const handleSearchMaterials = (e) => {
    e.preventDefault();
    if (search) {
      setSearchedFolders(
        folders.filter((folder) => {
          return folder.folderName.toLowerCase().includes(search.toLowerCase());
        })
      );
    } else {
      setSearchedFolders(folders);
    }
  };

  return (
    <>
      <form className="pr-4 mb-4">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-white border border-gray-300 rounded-lg bg-gray-800 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            onClick={handleSearchMaterials}
          >
            Search
          </button>
        </div>
      </form>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : searchedFolders && searchedFolders.length > 0 ? (
        <div className="app pr-4">
          <Accordion transition transitionTimeout={1000}>
            {searchedFolders.map((folder) => {
              return (
                <Fragment key={folder.id}>
                  <AccordionFolder folder={{ ...folder }} />
                </Fragment>
              );
            })}
          </Accordion>
        </div>
      ) : (
        <EmptyPage message={"No materials yet"} />
      )}
    </>
  );
};

export default Materials;
