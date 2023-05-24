import React from "react";

import MainHeader from "./MainHeader";
import PageIllustration from "../../partials/PageIllustration";
import Banner from "../../partials/Banner";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../Config";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { SessionService } from "../../SessionService";
import "./Main.css";

function CreateCollab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const navigate = useNavigate();
  const user = SessionService.getUser();
  const domain = user.email.split("@")[1];

  const handleFormSubmit = (e) => {
    e.preventDefault();

    addDoc(collection(db, "collaborations"), {
      description: description,
      domain: domain,
      uid: user.id,
      isPrivate: isPrivate,
      title: title,
    }).then((res) => {
      const usersColRef = doc(db, "collaborations", res.id, "users", user.id);
      setDoc(doc(db, "users", user.id, "collabs", res.id), {
        collabName: title,
      });
      setDoc(usersColRef, { userId: user.id }).then(() => navigate("/main"));
    });
  };
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <MainHeader />

      {/*  Page content */}
      <main className="grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">Create a new collab</h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        className="form-input w-full text-gray-300"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="description"
                      >
                        Description
                      </label>
                      <input
                        id="description"
                        type="text"
                        className="form-input w-full text-gray-300"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="cntr">
                    <input
                      checked={isPrivate}
                      type="checkbox"
                      id="cbx"
                      className="hidden-xs-up"
                      onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <label htmlFor="cbx" className="cbx"></label>
                    <label>Private?</label>
                  </div>

                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                        type="submit"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Banner />
    </div>
  );
}

export default CreateCollab;
