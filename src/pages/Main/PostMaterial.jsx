import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { useState } from "react";
import { db, storage } from "../../Config";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import { useParams } from "react-router";
import { SessionService } from "../../SessionService";

const PostMaterial = () => {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const uid = useParams().uid;
  const user = SessionService.getUser();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles(e.dataTransfer.files);
  };

  const handleRemove = (e, selectedFile) => {
    e.preventDefault();

    setFiles(
      Array.from(files).filter((file) => file.name !== selectedFile.name)
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    if (files.length !== 0) {
      addDoc(collection(db, "collaborations", uid, "folders"), {
        folderName: title,
        userId: user.id,
      }).then((res) => {
        setDoc(doc(db, "users", user.id, "folders", res.id), {
          folderName: title,
          userId: user.id,
        }).then((userRes) => {
          let i = 1;
          Array.from(files).map((file) => {
            const fileRef = ref(storage, file.name);
            uploadBytes(fileRef, file).then(() => {
              getDownloadURL(fileRef).then((url) => {
                addDoc(
                  collection(
                    db,
                    "collaborations",
                    uid,
                    "folders",
                    res.id,
                    "materials"
                  ),
                  {
                    name: file.name,
                    type: "",
                    link: url,
                    userId: user.id,
                    createdAt: serverTimestamp(),
                  }
                )
                  .then((response) => {
                    if (i === files.length) setIsLoading(false);
                    i++;
                    setDoc(
                      doc(
                        db,
                        "users",
                        user.id,
                        "folders",
                        res.id,
                        "materials",
                        response.id
                      ),
                      {
                        name: file.name,
                        type: "",
                        link: url,
                        userId: user.id,
                        createdAt: serverTimestamp(),
                      }
                    ).catch((err) => {
                      console.log(err);
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                  });
              });
            });
          });
        });
      });
    } else {
      console.log("upload something please  <3 ");
    }
  };

  return (
    <>
      <div className=" px-4 lg: px-32 md:px-12">
        <h1 className="text-purple-600 text-lg font-bold">Upload Material!</h1>

        <form className="mt-8 space-y-3" onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold text-gray-500 tracking-wide">
              Title
            </label>
            <input
              className="text-purple-600 p-2 border border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {files.length === 0 && (
            <div
              className="grid grid-cols-1 space-y-2"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
            >
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attach Documents
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <svg
                        className="text-purple-600 w-24 mx-auto mt-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="pointer-none text-gray-500 ">
                      <span className="text-sm">Drag and drop</span> files here{" "}
                      <br /> or{" "}
                      <span className="text-purple-600 hover:underline">
                        select a file
                      </span>{" "}
                      from your computer
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </label>
              </div>
            </div>
          )}
          {files.length !== 0 && (
            <div className="grid grid-cols-1 space-y-2">
              <label className="text-sm font-bold text-gray-500 tracking-wide">
                Attached Documents
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                  {Array.from(files).map((file) => (
                    <div className="flex items-center justify-between">
                      <label>{file.name}</label>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 hover:text-red-500"
                        onClick={(e) => handleRemove(e, file)}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  ))}
                </label>
              </div>
            </div>
          )}
          <p className="text-sm text-gray-300">
            <span>File type: doc,pdf,types of images</span>
          </p>
          <div>
            <button
              type="submit"
              className="my-5 w-full flex justify-center bg-purple-500 text-gray-100 p-4  rounded-full tracking-wide
                                    font-semibold  focus:outline-none focus:shadow-outline hover:bg-purple-600 shadow-lg cursor-pointer transition ease-in duration-300"
            >
              {isLoading ? "Loading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PostMaterial;
