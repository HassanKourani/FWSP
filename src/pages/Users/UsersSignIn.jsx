import React from "react";

import Header from "../../partials/Header";
import PageIllustration from "../../partials/PageIllustration";
import Banner from "../../partials/Banner";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../Config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../Config";
import { doc, getDoc } from "firebase/firestore";
import { SessionService } from "../../SessionService";

function UsersSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError(false);
    setIsBanned(false);
    setIsPending(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        getDoc(doc(db, "users", userCredential.user.uid)).then((response) => {
          if (!response.data().isBanned) {
            SessionService.setUser({
              ...response.data(),
              password: password,
              id: userCredential.user.uid,
            });
            if (response.data().isAdmin) {
              navigate("/admin");
            } else navigate(`/main`);
            setIsPending(false);
          } else {
            signOut(auth).then(() => setIsBanned(true));
          }
        });
      })
      .catch((error) => {
        setEmail("");
        setPassword("");
        setError(true);
        setIsPending(false);
      });
  };
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">
                  Welcome back. We exist to make your studying easier.
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={
                          error
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="you@edu.uni.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        className={
                          error
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="Password (at least 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      {error && (
                        <label
                          className="font-extralight text-red-600 text-xs"
                          htmlFor="password"
                        >
                          Wrong Email and/or Password
                        </label>
                      )}
                      {isBanned && (
                        <label
                          className="font-extralight text-red-600 text-xs"
                          htmlFor="password"
                        >
                          Account is not available
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                        type="submit"
                      >
                        {isPending ? "Loading..." : "Sign in"}
                      </button>
                    </div>
                  </div>
                </form>
                <div className="text-gray-400 text-center mt-6">
                  Don't you have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Banner />
    </div>
  );
}

export default UsersSignIn;
