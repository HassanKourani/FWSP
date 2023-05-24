import React, { useEffect } from "react";

import Header from "../../partials/Header";
import Banner from "../../partials/Banner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../Config";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { SessionService } from "../../SessionService";
import axios from "axios";

function UsersSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [name, setName] = useState("");
  const [isRequested, setIsRequested] = useState(false);
  const [randomNumber, setRandomNumber] = useState("");
  const [code, setCode] = useState("");
  const [passErr, setPassErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [codeErr, setCodeErr] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!randomNumber)
      setRandomNumber(
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      );
  }, []);

  const EmailVerificationOptions = {
    method: "POST",
    url: "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "6c813d40eemsh4b85bd226d7efc3p13fc54jsn57726975d5dd",
      "X-RapidAPI-Host": "rapidprod-sendgrid-v1.p.rapidapi.com",
    },
    data: `{"personalizations":[{"to":[{"email":"${email}"}],"subject":"Verification"}],"from":{"email":"noreply@seniorproject-cd393.firebaseapp.com"},"content":[{"type":"text/plain","value":"Hello! Thank you for signing up to collaborative learning. Please verify your account using this code: ${randomNumber}"}]}`,
  };
  console.log(randomNumber);

  const emailsQuery = query(
    collection(db, "users"),
    where("email", "==", email)
  );
  function isEduEmail(email) {
    var domain = email.split("@")[1];
    return domain.toLowerCase().includes(".edu");
  }
  const handleVerifyEmail = (e) => {
    e.preventDefault();

    setEmailErr(false);
    setNameErr(false);
    setPassErr(false);
    setCodeErr(false);
    if (!name) {
      setNameErr("Please enter a name.");
      return;
    }
    if (!email) {
      setEmailErr("Please enter an email.");
      return;
    }
    if (!password) {
      setPassErr("Please enter an password.");
      return;
    }
    setIsPending(true);
    getDocs(
      query(collection(db, "pendingAdmins")),
      where("email", "==", email)
    ).then((emailRes) => {
      if (emailRes.empty) {
        if (isEduEmail(email)) {
          if (password.length >= 6) {
            if (password === checkPassword) {
              getDocs(emailsQuery).then((res) => {
                console.log(res.empty);
                if (res.empty) {
                  axios
                    .request(EmailVerificationOptions)
                    .then((response) => {
                      setIsRequested(true);
                      setIsPending(false);
                    })
                    .catch((error) => {
                      setIsRequested(true);
                      setIsPending(false);
                    });
                } else {
                  setEmailErr("Email already taken");
                  setIsPending(false);
                }
              });
            } else {
              setPassword("");
              setCheckPassword("");
              setPassErr("Please check your password");
              setIsPending(false);
            }
          } else {
            setPassword("");
            setCheckPassword("");
            setPassErr("At least 6 characters");
            setIsPending(false);
          }
        } else {
          setEmailErr("Please enter a .edu email");
          setIsPending(false);
        }
      } else {
        if (password.length >= 6) {
          if (password === checkPassword) {
            getDocs(emailsQuery).then((res) => {
              console.log(res.empty);
              if (res.empty) {
                axios
                  .request(EmailVerificationOptions)
                  .then((response) => {
                    setIsRequested(true);
                    setIsPending(false);
                  })
                  .catch((error) => {
                    setIsRequested(true);
                    setIsPending(false);
                  });
              } else {
                setEmailErr("Email already taken");
                setIsPending(false);
              }
            });
          } else {
            setPassword("");
            setCheckPassword("");
            setPassErr("Please check your password");
            setIsPending(false);
          }
        } else {
          setPassword("");
          setCheckPassword("");
          setPassErr("At least 6 characters");
          setIsPending(false);
        }
      }
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setEmailErr(false);
    setPassErr(false);
    setCodeErr(false);
    setIsPending(true);
    if (code == randomNumber) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          getDocs(
            query(collection(db, "pendingAdmins")),
            where("email", "==", email)
          ).then((paRes) => {
            if (paRes.empty) {
              setDoc(doc(db, "users", res.user.uid), {
                email: email,
                name: name,
                image: "",
              }).then(() => {
                SessionService.setUser({
                  id: res.user.uid,
                  email: email,
                  name: name,
                  image: "",
                  password: password,
                });

                navigate(`/main`);
              });
            } else {
              setDoc(doc(db, "users", res.user.uid), {
                email: email,
                isAdmin: true,
                name: name,
              }).then(() => {
                SessionService.setUser({
                  id: res.user.uid,
                  email: email,
                  name: name,
                  isAdmin: true,
                  password: password,
                });
                paRes.forEach((doc) => {
                  deleteDoc(doc.ref);
                });
                navigate(`/admin`);
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);
          if (err.code === "auth/weak-password") {
            setPassErr("At least 6 characters");
          }
          if (err.code === "auth/email-already-in-use") {
            setEmailErr("Email already taken");
          }
          setIsPending(false);
        });
    } else {
      console.log("no no no ");
      setCodeErr(true);
      setIsPending(false);
    }
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
                  Welcome. We exist to make your studying easier.
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleFormSubmit}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="full-name"
                      >
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        className={
                          nameErr
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="First and last name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      {nameErr && (
                        <label
                          className="font-extralight text-red-600 text-xs"
                          htmlFor="password"
                        >
                          {nameErr}
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={
                          emailErr
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="you@edu.uni.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isRequested}
                        required
                      />
                      {emailErr && (
                        <label
                          className="font-extralight text-red-600 text-xs"
                          htmlFor="password"
                        >
                          {emailErr}
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3  mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        className={
                          passErr
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="Password (at least 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      {passErr && (
                        <label
                          className="font-extralight text-red-600 text-xs"
                          htmlFor="password"
                        >
                          {passErr}
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-4 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-300 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Retype Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="retypePassword"
                        type="password"
                        className={
                          passErr
                            ? "form-input w-full text-gray-300 border border-red-600"
                            : "form-input w-full text-gray-300"
                        }
                        placeholder="Retype Password"
                        value={checkPassword}
                        onChange={(e) => setCheckPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  {isRequested && (
                    <div className="flex flex-wrap -mx-3 mb-4">
                      <div className="w-full px-3">
                        <label
                          className="block text-gray-300 text-sm font-medium mb-1"
                          htmlFor="password"
                        >
                          Verification Code
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="code"
                          type="text"
                          className={
                            codeErr
                              ? "form-input w-full text-gray-300 border border-red-600"
                              : "form-input w-full text-gray-300"
                          }
                          placeholder="Enter 6 digits code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                        />
                        {codeErr && (
                          <label
                            className="font-extralight text-red-600 text-xs"
                            htmlFor="password"
                          >
                            Wrong Code!
                            <span className="text-red-600">*</span>
                          </label>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      {isRequested ? (
                        <button
                          className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                          type="submit"
                        >
                          {isPending ? "Loading..." : "Sign up"}
                        </button>
                      ) : (
                        <button
                          className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                          type="button"
                          onClick={(e) => handleVerifyEmail(e)}
                        >
                          {isPending ? "Loading..." : "Verify Email"}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
                <div className="text-gray-400 text-center mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                  >
                    Sign in
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

export default UsersSignUp;
