import { SessionService } from "../../SessionService";
import MainHeader from "./MainHeader";
import EmptyPage from "../../utils/EmptyPage";
import "./Main.css";
import { useEffect, useState } from "react";
import { db } from "../../Config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Loading from "../../utils/Loading";
import FancyCard from "../../utils/FancyCard";
import { useNavigate } from "react-router-dom";
import HomeMain from "../Home/HomeMain";
import { MainTabs } from "../../utils/MainTab";

const Main = () => {
  const navigate = useNavigate();
  const user = SessionService.getUser();
  let domain;
  try {
    domain = user.email.split("@")[1];
  } catch (error) {
    console.log(error);
    window.location.assign("/");
  }

  const [collaborations, setCollaborations] = useState();
  const [searchedCollabs, setSearchedCollabs] = useState();
  const [favCollabs, setFavCollabs] = useState();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(true);
  const [component, setComponent] = useState("Home");

  const q = query(
    collection(db, "collaborations"),
    where("domain", "==", domain)
  );
  const favCollabsColRef = collection(db, "users", user.id, "favorite");

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setCollaborations(
        snapshot.docs.filter((collab) => !collab.data().isBanned)
      );
      setPending(false);
    });

    onSnapshot(favCollabsColRef, (snapshot) => {
      setFavCollabs(snapshot.docs.filter((collab) => !collab.data().isBanned));
    });
  }, []);

  useEffect(() => {
    const sorterdArr = [];

    if (collaborations && favCollabs) {
      collaborations.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sorterdArr.unshift(collab);
        } else {
          sorterdArr.push(collab);
        }
      });
      setSearchedCollabs(sorterdArr);
    }
  }, [collaborations, favCollabs]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.length > 1) {
      const filteredCollabs = collaborations.filter((collab) =>
        collab.data().title.toLowerCase().includes(search.toLowerCase())
      );

      const sortedArr = [];
      filteredCollabs.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sortedArr.unshift(collab);
        } else {
          sortedArr.push(collab);
        }
      });
      setSearchedCollabs(sortedArr);
    } else {
      const sortedArr = [];
      collaborations.map((collab) => {
        if (favCollabs.find((fav) => fav.id === collab.id)) {
          sortedArr.unshift(collab);
        } else {
          sortedArr.push(collab);
        }
      });
      setSearchedCollabs(sortedArr);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/*  Site header */}
        <MainHeader
          setSearch={setSearch}
          search={search}
          handleSearch={handleSearch}
        />
        {/* <Loading /> */}
        {/*  Page content */}

        <main className="grow flex justify-center">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20 sm:w-3/4">
            <div className="w-52 ml-4 mb-12">
              <MainTabs setComponent={setComponent} />
            </div>
            {component === "Collabs" && (
              <>
                {!pending ? (
                  <div className="grid grid-cols-2 gap-4 mx-10 sm:gird-cols-3 md:grid-cols-3 lg:grid-cols-4">
                    {searchedCollabs && searchedCollabs.length > 0 ? (
                      searchedCollabs.map((collab) => (
                        <div
                          key={collab.id}
                          onClick={() =>
                            navigate(`/main/${collab.id}`, {
                              state: {
                                collabName: collab.data().title,
                              },
                            })
                          }
                        >
                          <FancyCard
                            collab={{ ...collab.data(), id: collab.id }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center col-span-full">
                        <EmptyPage message={"No collabs yet"} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center mt-20 ">
                    <Loading />
                  </div>
                )}
              </>
            )}
            {component === "Home" && <HomeMain />}
          </div>
        </main>
        <div
          onClick={(e) => {
            navigate(`/chat`);
          }}
          className="bg-purple-500 rounded-full fixed bottom-4 right-4 h-16 w-16 flex justify-center items-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-white"
          >
            <path
              fillRule="evenodd"
              d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Main;
