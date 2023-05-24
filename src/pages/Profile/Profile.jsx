import { Link, useNavigate } from "react-router-dom";
import EditInput from "../../utils/EditInput";
import Tabs from "../../utils/Tabs";
import { Fragment, useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import Loading from "../../utils/Loading";
import ProfileAccordionFolder from "./ProfileAccordionFolder";
import { Accordion } from "@szhsin/react-accordion";
import Settings from "./Settings";

const Profile = () => {
  const [allDiscs, setAllDiscs] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState();
  const [folders, setFolders] = useState();

  const user = SessionService.getUser();
  const navigate = useNavigate();

  const discColRef = collection(db, "users", user.id, "discussions");
  const foldersColRef = collection(db, "users", user.id, "folders");

  const handleGoToDisc = (e, collabId, discId) => {
    getDoc(doc(db, "collaborations", collabId)).then((collab) => {
      navigate(`/main/${collabId}`, {
        state: {
          collabName: collab.data().title,
          discId: discId,
        },
      });
    });
  };

  const handleTabSelect = (selected) => {
    if (selected === "discussions") setSelectedTab(allDiscs);
    else if (selected === "materials") setSelectedTab(folders);
    else if (selected === "settings") setSelectedTab("settings");
  };

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(discColRef, (snapshot) => {
      Promise.all(
        snapshot.docs.map((discInfo) => {
          return getDoc(
            doc(
              db,
              "collaborations",
              discInfo.data().collabId,
              "discussions",
              discInfo.data().discId
            )
          ).then((res) => {
            return {
              ...res.data(),
              id: res.id,
              collabId: discInfo.data().collabId,
            };
          });
        })
      ).then((allValues) => {
        setAllDiscs(
          allValues.map((disc) => (
            <div
              key={disc.id}
              onClick={(e) => handleGoToDisc(e, disc.collabId, disc.id)}
            >
              {disc.title}
            </div>
          ))
        );
        setIsLoading(false);
      });
    });
    onSnapshot(foldersColRef, (snapshot) => {
      setFolders(
        snapshot.docs.map((folder) => {
          console.log(folder.id);
          return (
            <Fragment key={folder.id}>
              <ProfileAccordionFolder
                folder={{ ...folder.data(), id: folder.id }}
              />
            </Fragment>
          );
        })
      );
    });
  }, []);

  useEffect(() => {
    allDiscs && setSelectedTab(allDiscs);
  }, [allDiscs]);

  return (
    <>
      <div className=" h-[41rem] p-4 gap-2 flex flex-col sm:flex-row ">
        <div className="h-full bg-gray-700/25 w-full flex flex-col items-center justify-between p-8 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <div className="absolute top-8 left-8 ">
            <Link to="/main" className="block">
              <svg
                className="w-8 h-8 fill-current text-purple-600"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
              </svg>
            </Link>
          </div>
          <div className="w-32 h-32  relative ">
            <img
              className="w-32 h-32 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="user photo"
            />
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-gray-500 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </div>
          </div>
          <EditInput />
          <EditInput />
          <EditInput />
          <button className="bg-purple-600 p-2 w-52 rounded-md">Logout</button>
        </div>
        <div className="h-full bg-gray-700/25 w-full p-4 flex flex-col items-center sm:w-1/2 md:w-2/3 lg:w-3/4">
          <Tabs selectedTab={selectedTab} handleTabSelect={handleTabSelect} />

          {selectedTab === folders ? (
            <div className="app pr-4">
              <Accordion transition transitionTimeout={1000}>
                {folders && folders}
              </Accordion>
            </div>
          ) : selectedTab === allDiscs ? (
            <div className="app pr-4">{allDiscs && allDiscs}</div>
          ) : selectedTab === "settings" ? (
            <Settings />
          ) : (
            <></>
          )}
          {isLoading && <Loading />}
        </div>
      </div>
    </>
  );
};

export default Profile;
