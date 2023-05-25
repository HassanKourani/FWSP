import { Link, useNavigate, useParams } from "react-router-dom";
import EditInput from "../../utils/EditInput";
import Tabs from "../../utils/Tabs";
import { Fragment, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage, auth } from "../../Config";
import { SessionService } from "../../SessionService";
import Loading from "../../utils/Loading";
import ProfileAccordionFolder from "./ProfileAccordionFolder";
import { Accordion } from "@szhsin/react-accordion";
import Settings from "./Settings";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import MiniSideBar from "../../utils/MiniSideBar";
import { updatePassword } from "firebase/auth";
import FriendsModal from "../../utils/FriendsModal";

const Profile2 = () => {
  const user = SessionService.getUser();
  !user && window.location.assign("/");
  const [updatedUser, setUpdatedUser] = useState();
  const [allDiscs, setAllDiscs] = useState();
  const [allCollabs, setAllCollabs] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState();
  const [folders, setFolders] = useState();
  const [newName, setNewName] = useState(user.name);
  const [newDescription, setNewDescription] = useState(user.description);
  const [newPassword, setNewPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loader, setLoader] = useState("");
  const [error, setError] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [type, setType] = useState();
  const [settingsComponent, setSettingsComponent] = useState("details");
  const authUser = auth.currentUser;

  const navigate = useNavigate();
  const uid = useParams().userId;

  const discColRef = query(
    collection(db, "users", uid, "discussions"),
    orderBy("createdAt", "desc")
  );
  const foldersColRef = collection(db, "users", uid, "folders");
  const collabsColRef = collection(db, "users", uid, "collabs");

  const isUserProfile = () => {
    return user.id === uid;
  };

  const handleFollow = (e) => {
    e.preventDefault();
    setDoc(doc(db, "users", user.id, "following", uid), { userId: uid });
    setDoc(doc(db, "users", uid, "followers", user.id), { userId: user.id });
    // setDoc(doc(db, "users", user.id, "chat", uid), {
    //   userId: uid,
    // });
    // setDoc(doc(db, "users", uid, "chat", user.id), {
    //   userId: user.id,
    // });
  };
  const handleUnfollow = (e) => {
    e.preventDefault();
    deleteDoc(doc(db, "users", user.id, "following", uid));
    deleteDoc(doc(db, "users", uid, "followers", user.id));
  };

  useEffect(() => {
    onSnapshot(collection(db, "users", uid, "followers"), (followers) => {
      setFollowers(
        followers.docs.map((follower) => {
          return { ...follower.data(), id: follower.id };
        })
      );
    });
    onSnapshot(collection(db, "users", uid, "following"), (followings) => {
      setFollowing(
        followings.docs.map((following) => {
          return { ...following.data(), id: following.id };
        })
      );
    });

    onSnapshot(
      query(
        collection(db, "users", user.id, "following"),
        where("userId", "==", uid)
      ),
      (following) => {
        setIsFollowing(!following.empty);
      }
    );
  }, [uid]);

  useEffect(() => {
    isUserProfile()
      ? setUpdatedUser(SessionService.getUser())
      : getDoc(doc(db, "users", uid)).then((res) => {
          console.log(res);
          setUpdatedUser({ ...res.data(), id: res.id });
        });
  }, [uid]);

  useEffect(() => {
    console.log(updatedUser);
  }, [updatedUser]);

  const handleUpdateProfile = (e) => {
    setLoader("info");
    updateDoc(doc(db, "users", user.id), {
      name: newName,
      description: newDescription,
    }).then(() => {
      console.log("name and description are updated");
      setLoader();
    });

    SessionService.setUser({
      name: newName,
      description: newDescription,
      banner: user.banner,
      profile: user.profile,
      id: user.id,
      email: user.email,
      password: user.password,
    });
    setUpdatedUser(SessionService.getUser());
  };

  const handleUpdatePassword = (e) => {
    setLoader("pass");
    setError("");
    e.preventDefault();
    if (oldPassword === user.password) {
      if (newPassword === checkPassword) {
        if (newPassword !== user.password) {
          updatePassword(authUser, newPassword)
            .then(() => {
              console.log("password updated");
              setNewPassword("");
              setCheckPassword("");
              setOldPassword("");
              setLoader("");
              SessionService.setUser({
                name: user.name,
                description: user.description,
                banner: user.banner,
                profile: user.profile,
                id: user.id,
                email: user.email,
                password: newPassword,
              });
            })
            .catch((err) => console.log(err));
        } else {
          setError("Can't use old password");
          setNewPassword("");
          setCheckPassword("");
          setOldPassword("");
          setLoader("");
        }
      } else {
        setError("Passwords don't match");
        setNewPassword("");
        setCheckPassword("");
        setOldPassword("");
        setLoader("");
      }
    } else {
      setError("Wrong password");
      setNewPassword("");
      setCheckPassword("");
      setOldPassword("");
      setLoader("");
    }
  };

  const handleChangeBanner = (e) => {
    e.preventDefault();
    setLoader("banner");
    if (e.target.files && e.target.files[0]) {
      const bannerRef = ref(storage, e.target.files[0].name);
      uploadBytes(bannerRef, e.target.files[0]).then(() => {
        getDownloadURL(bannerRef).then((url) => {
          updateDoc(doc(db, "users", user.id), {
            banner: url,
          }).then((res) => {
            console.log("updated banner");
            setLoader("");
          });
          SessionService.setUser({
            name: user.name,
            description: user.description,
            banner: url,
            profile: user.profile,
            id: user.id,
            email: user.email,
            password: user.password,
          });
          setUpdatedUser(SessionService.getUser());
        });
      });
    }
  };
  const handleChangeProfilePicture = (e) => {
    e.preventDefault();
    setLoader("profile");
    if (e.target.files && e.target.files[0]) {
      const profileRef = ref(storage, e.target.files[0].name);
      uploadBytes(profileRef, e.target.files[0]).then(() => {
        getDownloadURL(profileRef).then((url) => {
          updateDoc(doc(db, "users", user.id), {
            profile: url,
          }).then((res) => {
            console.log("updated profile");
            setLoader("");
          });
          SessionService.setUser({
            name: user.name,
            description: user.description,
            banner: user.banner,
            profile: url,
            id: user.id,
            email: user.email,
            password: user.password,
          });
          setUpdatedUser(SessionService.getUser());
        });
      });
    }
  };

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
  const handleGoToCollab = (e, collabId) => {
    getDoc(doc(db, "collaborations", collabId)).then((collab) => {
      navigate(`/main/${collabId}`, {
        state: {
          collabName: collab.data().title,
        },
      });
    });
  };

  const handleTabSelect = (selected) => {
    if (selected === "discussions") setSelectedTab(allDiscs);
    else if (selected === "materials") setSelectedTab(folders);
    else if (selected === "settings") setSelectedTab("settings");
    else if (selected === "collabs") setSelectedTab(allCollabs);
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
        console.log(allValues);
        setAllDiscs(
          allValues.map((disc) => {
            return (
              <div
                className="py-2 px-4 m-1 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                key={disc.id}
                onClick={(e) => handleGoToDisc(e, disc.collabId, disc.id)}
              >
                <div className="flex items-center justify-between">
                  <h1>{disc.title}</h1>

                  <h1>
                    {disc.createdAt && (
                      <div className="flex gap-1 items-center text-gray-400/75 text-xs	">
                        {new Date(disc.createdAt.seconds * 1000).getDate()} /
                        {new Date(disc.createdAt.seconds * 1000).getMonth() + 1}
                        /{new Date(disc.createdAt.seconds * 1000).getFullYear()}
                      </div>
                    )}
                  </h1>
                </div>
                <h1>{disc.question}</h1>
              </div>
            );
          })
        );
        setIsLoading(false);
      });
    });

    onSnapshot(collabsColRef, (snapshot) => {
      Promise.all(
        snapshot.docs.map((collabInfo) => {
          return getDoc(doc(db, "collaborations", collabInfo.id)).then(
            (res) => {
              return {
                ...res.data(),
                id: res.id,
              };
            }
          );
        })
      ).then((allValues) => {
        setAllCollabs(
          allValues
            .filter((fCollab) => !fCollab.isBanned)
            .map((collab) => {
              return (
                <div
                  className="py-2 px-4 m-1 bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer"
                  key={collab.id}
                  onClick={(e) => handleGoToCollab(e, collab.id)}
                >
                  <div className="flex flex-col">
                    <h1>{collab.title}</h1>

                    <h1>{collab.description}</h1>
                  </div>
                </div>
              );
            })
        );
        setIsLoading(false);
      });
    });

    onSnapshot(
      foldersColRef,
      (snapshot) => {
        const folderPromises = snapshot.docs.map((folder) => {
          return getDocs(
            collection(db, "users", uid, "folders", folder.id, "materials")
          ).then((res) => {
            if (res.docs.length > 0) {
              return (
                <Fragment key={folder.id}>
                  <ProfileAccordionFolder
                    folder={{ ...folder.data(), id: folder.id }}
                  />
                </Fragment>
              );
            }
          });
        });

        Promise.all(folderPromises).then((folders) => {
          setFolders(folders.filter((folder) => folder));
        });
      },
      []
    );
  }, [uid]);

  useEffect(() => {
    allDiscs && setSelectedTab(allDiscs);
  }, [allDiscs]);

  const handleGoToChat = (e, uid) => {
    e.preventDefault();
    setDoc(doc(db, "users", user.id, "chat", uid), { userId: uid }).then(() => {
      navigate("/chat", { state: { chatUserId: uid } });
    });
  };

  return (
    <>
      {/* --------------------LOGO --------------------------------*/}
      {updatedUser && (
        <div className=" bg-gray-900 flex flex-col h-full  lg:px-36 lg:py-8">
          <div className="absolute top-8 left-8 z-50 ">
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

          {/* -------------------- Header --------------------------------*/}
          <div className=" bg-gray-700/25 h-full rounded-lg">
            <div className="relative h-72 ">
              {/* -------------------- Banner --------------------------------*/}
              <div className=" relative w-full h-56 rounded-lg">
                {loader === "banner" && (
                  <div
                    role="status"
                    className="absolute top-1/3 left-41/100 sm:top-1/2 sm:left-1/2"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
                {loader !== "banner" && selectedTab === "settings" && (
                  <div className="absolute top-1/3 left-41/100 sm:top-1/2 sm:left-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-16 h-16 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
                <img
                  src={updatedUser.banner}
                  className="w-full h-full rounded-lg object-cover cursor-pointer"
                />
                {selectedTab === "settings" && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full h-full absolute top-0  bg-transparent text-transparent file:bg-transparent file:text-transparent file:border-transparent focus:outline-none"
                      onChange={handleChangeBanner}
                    />
                  </>
                )}
              </div>

              {/*-------------------- profile picture --------------------------*/}
              <div className="absolute top-36 sm:left-16 w-36 h-36 left-1/3">
                {loader === "profile" && (
                  <div role="status" className="absolute top-1/3 left-1/3">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                )}
                {loader !== "profile" && selectedTab === "settings" && (
                  <div className="absolute top-1/3 left-1/3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}
                <img
                  className="rounded-full w-32 h-32 object-cover cursor-pointer"
                  src={updatedUser.profile}
                  alt="user photo"
                />
                {selectedTab === "settings" && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute top-0  w-32 h-32 rounded-full  bg-transparent text-transparent file:bg-transparent file:text-transparent file:border-transparent cursor-pointer"
                      onChange={handleChangeProfilePicture}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:justify-between sm:flex-row">
              <div className="flex flex-col ">
                <div className="flex justify-center items-center gap-2 sm:justify-start sm:ml-16">
                  <div className="flex items-center gap-2">
                    <label className="text-3xl">{updatedUser.name}</label>
                    {uid !== user.id && (
                      <div
                        onClick={(e) => {
                          handleGoToChat(e, uid);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:text-purple-400 cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {user.id !== uid && !isFollowing && (
                    <button
                      className="bg-purple-600 text-sm px-2 flex items-center gap-1 rounded-lg"
                      onClick={(e) => handleFollow(e)}
                    >
                      <div>Follow </div>
                      <div className="text-lg">+</div>
                    </button>
                  )}
                  {user.id !== uid && isFollowing && (
                    <button
                      className="bg-gray-600 text-sm px-2 flex items-center gap-1 rounded-lg"
                      onClick={(e) => handleUnfollow(e)}
                    >
                      <div>Unfollow </div>
                      <div className="text-lg">-</div>
                    </button>
                  )}
                </div>
                <div className="flex justify-center sm:justify-start sm:pl-16 pt-4">
                  <label className="text-xl">{updatedUser.description}</label>
                </div>
              </div>

              <div className="flex justify-center items-center gap-2  sm:justify-end sm:mr-16">
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setFriends(followers);
                    setType("Followers");
                  }}
                  className="cursor-pointer"
                >
                  <div className="text-center">{followers.length}</div>
                  <div className="text-sm">Followers</div>
                </div>
                <div
                  onClick={() => {
                    setIsOpen(true);
                    setFriends(following);
                    setType("Following");
                  }}
                  className="cursor-pointer"
                >
                  <div className="text-center">{following.length} </div>
                  <div className="text-sm">Following</div>
                </div>
              </div>
            </div>

            {/* main */}

            <div className="p-8 m-auto">
              <Tabs
                handleTabSelect={handleTabSelect}
                isUserProfile={isUserProfile}
                setSettingsComponent={setSettingsComponent}
                settingsComponent={settingsComponent}
              />

              {selectedTab === folders ? (
                <div className="app pr-4 mt-4">
                  <Accordion transition transitionTimeout={1000}>
                    {folders && folders}
                  </Accordion>
                </div>
              ) : selectedTab === allDiscs ? (
                <div className="app p-4">{allDiscs && allDiscs}</div>
              ) : selectedTab === allCollabs ? (
                <div className="app p-4">{allCollabs && allCollabs}</div>
              ) : selectedTab === "settings" ? (
                <div className="flex  py-12 gap-24  ">
                  {settingsComponent === "details" ? (
                    <div className="flex flex-col gap-4 items-start visible">
                      <input
                        type="text"
                        placeholder="New Name"
                        className="bg-gray-700/50 w-full rounded-lg"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <textarea
                        placeholder="New Description"
                        className="bg-gray-700/50 w-full rounded-lg"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                      ></textarea>
                      <button
                        className={
                          loader === "info"
                            ? "bg-gray-600 p-2 w-full rounded-lg"
                            : "bg-purple-600 p-2 w-full rounded-lg"
                        }
                        onClick={(e) => handleUpdateProfile(e)}
                        disabled={loader === "info"}
                      >
                        {loader === "info" ? "Loading..." : "Update Profile"}
                      </button>
                    </div>
                  ) : (
                    settingsComponent === "password" && (
                      <div className="flex flex-col p-4  gap-4 items-start visible">
                        <input
                          type="password"
                          placeholder="Old Password"
                          className="bg-gray-700/50 w-full rounded-lg"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="bg-gray-700/50 w-full rounded-lg"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Retype New Password"
                          className="bg-gray-700/50 w-full rounded-lg"
                          value={checkPassword}
                          onChange={(e) => setCheckPassword(e.target.value)}
                        />
                        {error && <span>{error}</span>}

                        <button
                          className={
                            loader === "pass"
                              ? "bg-gray-600 p-2 w-full rounded-lg"
                              : "bg-purple-600 p-2 w-full rounded-lg"
                          }
                          onClick={(e) => handleUpdatePassword(e)}
                          disabled={loader === "pass"}
                        >
                          {loader === "pass" ? "Loading..." : "Update Password"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <></>
              )}
              {isLoading && <Loading />}
            </div>
          </div>
        </div>
      )}
      <FriendsModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        friends={friends}
        setFriends={setFriends}
        type={type}
      />
    </>
  );
};

export default Profile2;
