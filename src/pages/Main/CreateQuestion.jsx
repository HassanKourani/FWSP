import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../../Config";
import { SessionService } from "../../SessionService";
import Discussions from "./Discussions";
import MaterialModal from "../../utils/MaterialModal";
import CheckProfanity from "../../utils/ProfanityAPI";

const CreateQuestion = ({ setCurrentComponent }) => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");
  const user = SessionService.getUser();
  const uid = useParams().uid;
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialLink, setMaterialLink] = useState();

  const handleAddImage = (e) => {
    e.preventDefault();
    e.target.files[0] && setImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);

    Promise.all([CheckProfanity(title), CheckProfanity(question)]).then(
      (censored) => {
        if (image) {
          const imageRef = ref(storage, image.name);
          uploadBytes(imageRef, image).then(() => {
            getDownloadURL(imageRef).then((url) => {
              addDoc(collection(db, "collaborations", uid, "discussions"), {
                title: censored[0],
                question: censored[1],
                image: url,
                userId: user.id,
                userName: user.name,
                isAnswered: false,
                createdAt: serverTimestamp(),
                collabId: uid,
                link: materialLink || null,
              })
                .then((res) => {
                  setIsLoading(false);
                  setCurrentComponent(
                    <Discussions setCurrentComponent={setCurrentComponent} />
                  );
                  addDoc(collection(db, "users", user.id, "discussions"), {
                    collabId: uid,
                    discId: res.id,
                    createdAt: serverTimestamp(),
                  }).catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                  });
                })
                .catch((err) => {
                  console.log(err);
                  setIsLoading(false);
                });
            });
          });
        } else {
          addDoc(collection(db, "collaborations", uid, "discussions"), {
            title: censored[0],
            question: censored[1],
            image: "",
            userId: user.id,
            userName: user.name,
            isAnswered: false,
            collabId: uid,
            createdAt: serverTimestamp(),
            link: materialLink || null,
          })
            .then((res) => {
              setIsLoading(false);
              setCurrentComponent(
                <Discussions setCurrentComponent={setCurrentComponent} />
              );
              addDoc(collection(db, "users", user.id, "discussions"), {
                collabId: uid,
                discId: res.id,
                createdAt: serverTimestamp(),
              });

              getDocs(collection(db, "collaborations", uid, "users"))
                .then((users) =>
                  users.docs.map((u) => {
                    console.log(u.id);
                    if (user.id != u.id) {
                      addDoc(collection(db, "users", u.id, "notifications"), {
                        message: `${user.name} added a new discussion: ${censored[0]}.`,
                        type: "discussion",
                        discussionId: res.id,
                        collabId: uid,
                        createdAt: serverTimestamp(),
                        opened: false,
                        link: materialLink || null,
                      });
                    }
                  })
                )

                .catch((err) => {
                  console.log(err);
                  setIsLoading(false);
                });
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        }
      }
    );
  };

  return (
    <>
      <div className="pr-4">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600 "
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600">
            <div className="px-4 py-2 bg-gray-800 text-white rounded-t-lg dark:bg-gray-800">
              <textarea
                id="comment"
                rows={4}
                className="w-full px-0 text-sm bg-gray-800 text-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a question..."
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 hover:bg-purple-800"
              >
                {isLoading ? "Loading..." : "Post question"}
              </button>
              <div className="flex gap-4">
                <div className="flex ">
                  {materialLink && (
                    <label
                      className="flex items-center"
                      onClick={() => {
                        setMaterialLink("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </label>
                  )}

                  <div className=" flex items-center">
                    <div
                      className="flex pl-0 space-x-1 sm:pl-2"
                      onClick={() => setIsMaterialModalOpen(true)}
                    >
                      <label className="inline-flex items-center justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke={materialLink ? "green" : "currentColor"}
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <MaterialModal
                    isOpen={isMaterialModalOpen}
                    setIsOpen={setIsMaterialModalOpen}
                    setMaterialLink={setMaterialLink}
                  />
                </div>
                <div className="flex pl-0 space-x-1 sm:pl-2">
                  {img && (
                    <label
                      className="flex items-center"
                      onClick={() => {
                        setImg("");
                        setImage("");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </label>
                  )}
                  <label
                    htmlFor="image"
                    className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={image ? "green" : "currentColor"}
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>

                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAddImage}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-gray-800/50 p-4 mr-4 cursor-pointer hover:bg-white/10">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={user.profile}
              alt="user photo"
            />
            <h1>{user.name}</h1>
          </div>
        </div>
        <div className="pl-8 pt-2">
          <h1 className="font-bold">{title ? title : "Title"}</h1>
          <p className="mt-1">{question ? question : "Description"}</p>
          {image ? <img src={img} /> : <></>}
          {materialLink && (
            <a href={materialLink} className="text-blue-600 underline">
              Linked Material
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateQuestion;
