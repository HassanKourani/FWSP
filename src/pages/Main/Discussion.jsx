import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db, storage } from "../../Config";
import { SessionService } from "../../SessionService";
import Loading from "../../utils/Loading";
import QuestionCard from "../../utils/QuestionCard";
import MaterialModal from "../../utils/MaterialModal";
import CheckProfanity from "../../utils/ProfanityAPI";

const Discussion = ({ discussionId, setCurrentComponent }) => {
  const [comment, setComment] = useState();
  const [image, setImage] = useState("");
  const user = SessionService.getUser();
  const uid = useParams().uid;
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [allComments, setAllComments] = useState();
  const [discussion, setDiscussion] = useState();
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialLink, setMaterialLink] = useState();

  const discussionDocRef = doc(
    db,
    "collaborations",
    uid,
    "discussions",
    discussionId
  );
  useEffect(() => {
    Promise.all([
      CheckProfanity("fuck you"),
      CheckProfanity("damn this shit"),
    ]).then((res) => {});
  }, []);

  useEffect(() => {
    onSnapshot(discussionDocRef, (doc) => {
      setDiscussion({ ...doc.data(), id: doc.id });
    });
  }, []);

  const handleChooseAnswer = (e, commentId) => {
    e.preventDefault();
    updateDoc(doc(db, "collaborations", uid, "discussions", discussion.id), {
      isAnswered: true,
    });
    updateDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        discussion.id,
        "comments",
        commentId
      ),
      { isAnswer: true }
    );

    if (user.id != discussion.userId) {
      addDoc(collection(db, "users", discussion.userId, "notifications"), {
        message: `${user.name} selected your comment as the answer.`,
        type: "answer",
        discussionId: discussionId,
        collabId: uid,
        createdAt: serverTimestamp(),
        opened: false,
        link: materialLink,
      });
    }
  };
  const handleRemoveAnswer = (e, commentId) => {
    e.preventDefault();

    updateDoc(doc(db, "collaborations", uid, "discussions", discussion.id), {
      isAnswered: false,
    });
    updateDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        discussionId,
        "comments",
        commentId
      ),
      { isAnswer: false }
    );
  };

  const commentsColRef = collection(
    db,
    "collaborations",
    uid,
    "discussions",
    discussionId,
    "comments"
  );

  const q = query(
    commentsColRef,
    orderBy("isAnswer", "desc"),
    orderBy("createdAt", "desc")
  );
  const handleDeleteComment = (e, commentId) => {
    e.preventDefault();
    deleteDoc(
      doc(
        db,
        "collaborations",
        uid,
        "discussions",
        discussionId,
        "comments",
        commentId
      )
    );
  };

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const promises = snapshot.docs.map((comment) => {
        return getDoc(doc(db, "users", comment.data().userId));
      });

      Promise.all(promises).then((users) => {
        const comments = snapshot.docs.map((comment, index) => {
          const u = users[index];
          return (
            <div key={comment.id}>
              {discussion && (
                <div
                  className={
                    comment.data().isAnswer
                      ? "border border-green-500 p-4 mr-4  "
                      : "border-b-2 border-gray-400/50 p-4 mr-4  "
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <Link to={`/profile/${comment.data().userId}`}>
                        <img
                          className="w-8 h-8 rounded-full object-cover"
                          src={u.data().profile}
                          alt="user photo"
                        />
                      </Link>
                      <h1>{u.data().name}</h1>
                    </div>
                    <div className="flex gap-4 items-center">
                      {comment.data().isAnswer &&
                      user.id == discussion.userId ? (
                        <button
                          className="bg-red-500 px-4 py-2"
                          onClick={(e) => handleRemoveAnswer(e, comment.id)}
                        >
                          Remove
                        </button>
                      ) : (
                        ""
                      )}
                      {user.id == discussion.userId &&
                      !discussion.isAnswered ? (
                        <button
                          className="bg-emerald-500 px-4 py-2"
                          onClick={(e) => handleChooseAnswer(e, comment.id)}
                        >
                          Choose
                        </button>
                      ) : (
                        <></>
                      )}
                      {user.id === comment.data().userId && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:text-red-500 cursor-pointer"
                          onClick={(e) => handleDeleteComment(e, comment.id)}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="pl-8 pt-2">
                    <p className="mt-1">{comment.data().comment} </p>
                    {comment.data().link && (
                      <a
                        href={comment.data().link}
                        className="text-blue-600 underline"
                      >
                        Linked Material
                      </a>
                    )}
                    {comment.data().image ? (
                      <img src={comment.data().image} />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        });

        setAllComments(comments);
        setIsLoading(false);
      });
      setMaterialLink("");
    });
  }, [discussion]);

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

    CheckProfanity(comment).then((censored) => {
      console.log(censored);

      if (image) {
        const imageRef = ref(storage, image.name);
        uploadBytes(imageRef, image).then(() => {
          getDownloadURL(imageRef).then((url) => {
            addDoc(
              collection(
                db,
                "collaborations",
                uid,
                "discussions",
                discussion.id,
                "comments"
              ),
              {
                comment: censored,
                image: url,
                userId: user.id,
                userName: user.name,
                isAnswer: false,
                createdAt: serverTimestamp(),
                link: materialLink,
              }
            )
              .then(() => {
                setIsLoading(false);
                setComment("");
                setImage("");
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false);
              });
          });
        });
      } else {
        addDoc(
          collection(
            db,
            "collaborations",
            uid,
            "discussions",
            discussion.id,
            "comments"
          ),
          {
            comment: censored,
            image: "",
            userId: user.id,
            userName: user.name,
            isAnswer: false,
            link: materialLink,
            createdAt: serverTimestamp(),
          }
        )
          .then(() => {
            setIsLoading(false);
            setComment("");
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      }

      if (user.id != discussion.userId) {
        addDoc(collection(db, "users", discussion.userId, "notifications"), {
          message: `${user.name} commented on your discussion ${censored}`,
          type: "comment",
          discussionId: discussionId,
          createdAt: serverTimestamp(),
          collabId: uid,
          opened: false,
        });
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />{" "}
        </div>
      ) : (
        <div className="">
          <div className="h-100 sm:h-128 overflow-y-scroll">
            {discussion && (
              <QuestionCard
                question={discussion}
                setCurrentComponent={setCurrentComponent}
              />
            )}
            <div>{allComments}</div>
          </div>
          <form className="pr-4" onSubmit={handleFormSubmit}>
            <div className="">
              <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-800 text-white dark:bg-gray-700 dark:border-gray-600">
                <div className="px-4 py-2 bg-gray-800 text-white rounded-t-lg dark:bg-gray-800">
                  <textarea
                    id="comment"
                    rows={1}
                    className="w-full px-0 text-sm bg-gray-800 text-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                    placeholder="Write a comment..."
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-purple-700 rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 hover:bg-purple-800"
                  >
                    {isLoading ? "Loading..." : "Post comment"}
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
                    <div className="flex ">
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
                      <div className="flex pl-0 space-x-1 sm:pl-2">
                        <label
                          htmlFor="image"
                          className="inline-flex items-center justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Discussion;
