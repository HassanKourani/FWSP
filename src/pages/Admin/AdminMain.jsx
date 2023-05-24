import { useState } from "react";
import { Link } from "react-router-dom";
import AllCollabs from "./AllCollabs";
import AllUsers from "./AllUsers";
import Reports from "./Reports";
import AddAdmin from "./AddAdmin";
import MobileBurger from "../../utils/MobileBurger";
import { SessionService } from "../../SessionService";

const AdminMain = () => {
  const [selectedComponent, setSelectedComponent] = useState("collabs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const user = SessionService.getUser();
  !user?.isAdmin && window.location.assign("/");
  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="block"
            aria-label="Cruip"
            onClick={() => SessionService.clearUser()}
          >
            <svg
              className="w-8 h-8 fill-current text-purple-600"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M31.952 14.751a260.51 260.51 0 00-4.359-4.407C23.932 6.734 20.16 3.182 16.171 0c1.634.017 3.21.28 4.692.751 3.487 3.114 6.846 6.398 10.163 9.737.493 1.346.811 2.776.926 4.262zm-1.388 7.883c-2.496-2.597-5.051-5.12-7.737-7.471-3.706-3.246-10.693-9.81-15.736-7.418-4.552 2.158-4.717 10.543-4.96 16.238A15.926 15.926 0 010 16C0 9.799 3.528 4.421 8.686 1.766c1.82.593 3.593 1.675 5.038 2.587 6.569 4.14 12.29 9.71 17.792 15.57-.237.94-.557 1.846-.952 2.711zm-4.505 5.81a56.161 56.161 0 00-1.007-.823c-2.574-2.054-6.087-4.805-9.394-4.044-3.022.695-4.264 4.267-4.97 7.52a15.945 15.945 0 01-3.665-1.85c.366-3.242.89-6.675 2.405-9.364 2.315-4.107 6.287-3.072 9.613-1.132 3.36 1.96 6.417 4.572 9.313 7.417a16.097 16.097 0 01-2.295 2.275z" />
            </svg>
          </Link>
          <div className="sm:hidden">
            <MobileBurger
              setIsBurgerOpen={setIsBurgerOpen}
              isBurgerOpen={isBurgerOpen}
            />
          </div>
          {isBurgerOpen && (
            <div className="h-52 left-10 w-4/5 fixed bg-purple-500 top-14 z-50 sm:hidden">
              <div className="flex flex-col gap-1 p-4">
                <button
                  className="focus:bg-purple-400 p-2 border-b"
                  onClick={() => {
                    setSelectedComponent("collabs");
                    setIsBurgerOpen(false);
                  }}
                >
                  Collabs
                </button>
                <button
                  className="focus:bg-purple-400 p-2 border-b"
                  onClick={() => {
                    setSelectedComponent("users");
                    setIsBurgerOpen(false);
                  }}
                >
                  Users
                </button>
                <button
                  className="focus:bg-purple-400 p-2 border-b"
                  onClick={() => {
                    setSelectedComponent("reports");
                    setIsBurgerOpen(false);
                  }}
                >
                  Reports
                </button>
                <button
                  className="focus:bg-purple-400 p-2"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                    setIsBurgerOpen(false);
                  }}
                >
                  Add Admin
                </button>
              </div>
            </div>
          )}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-search"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <span
                  className={
                    selectedComponent === "collabs"
                      ? "block py-2 pl-3 pr-4  rounded  md: text-purple-700 md:p-0 md:dark:text-purple-500 cursor-pointer"
                      : "block py-2 pl-3 pr-4 text-white rounded  md: hover:text-purple-700 md:p-0 md:hover:dark:text-purple-500 cursor-pointer"
                  }
                  aria-current="page"
                  onClick={() => setSelectedComponent("collabs")}
                >
                  Collabs
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedComponent === "users"
                      ? "block py-2 pl-3 pr-4  rounded  md: text-purple-700 md:p-0 md:dark:text-purple-500 cursor-pointer "
                      : "block py-2 pl-3 pr-4 text-white rounded  md: hover:text-purple-700 md:p-0 md:hover:dark:text-purple-500 cursor-pointer"
                  }
                  onClick={() => setSelectedComponent("users")}
                >
                  Users
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedComponent === "reports"
                      ? "block py-2 pl-3 pr-4  rounded  md: text-purple-700 md:p-0 md:dark:text-purple-500 cursor-pointer "
                      : "block py-2 pl-3 pr-4 text-white rounded  md: hover:text-purple-700 md:p-0 md:hover:dark:text-purple-500 cursor-pointer"
                  }
                  onClick={() => setSelectedComponent("reports")}
                >
                  Reports
                </span>
              </li>
              <li>
                <span
                  className={
                    selectedComponent === "add"
                      ? "block py-2 pl-3 pr-4  rounded  md: text-purple-700 md:p-0 md:dark:text-purple-500 cursor-pointer "
                      : "block py-2 pl-3 pr-4 text-white rounded  md: hover:text-purple-700 md:p-0 md:hover:dark:text-purple-500 cursor-pointer"
                  }
                  onClick={() => setIsModalOpen(!isModalOpen)}
                >
                  Add Admin
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {selectedComponent === "collabs" ? (
        <AllCollabs />
      ) : selectedComponent === "users" ? (
        <AllUsers />
      ) : (
        <Reports />
      )}
      <AddAdmin isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </>
  );
};

export default AdminMain;
