import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../../utils/Dropdown";
import { SessionService } from "../../SessionService";

function MainHeader({ setSearch, search, handleSearch, setComponent }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = SessionService.getUser();
  const path = window.location.pathname;
  const navigate = useNavigate();

  const trigger = useRef(null);
  const mobileNav = useRef(null);

  // close the mobile menu on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!mobileNav.current || !trigger.current) return;
      if (
        !mobileNavOpen ||
        mobileNav.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setMobileNavOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close the mobile menu if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!mobileNavOpen || keyCode !== 27) return;
      setMobileNavOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
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
          </div>
          {/* Desktop navigation */}

          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <input
                  id="search"
                  type="text"
                  autoComplete="off"
                  className="form-input text-gray-300"
                  placeholder="Search Collab"
                  required
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    handleSearch(e);
                  }}
                />
              </li>

              <li>
                <Link
                  to={`/notifications`}
                  className="font-medium text-purple-600 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>

              <li>
                <Link
                  to={`/profile/${user.id}`}
                  className="font-medium text-purple-600 hover:text-gray-200 px-4 py-3 flex items-center transition duration-150 ease-in-out"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/createCollab"
                  className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3"
                >
                  Collab
                </Link>
              </li>
              <li
                className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3 cursor-pointer"
                onClick={() => {
                  setComponent("home");
                }}
              >
                Home
              </li>
              <li
                className="btn-sm text-white bg-purple-600 hover:bg-purple-700 ml-3 cursor-pointer"
                onClick={() => {
                  setComponent("collabs");
                }}
              >
                Collabs
              </li>
            </ul>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden flex gap-2">
            {/* Search beside the hamburger */}
            <input
              id="search"
              type="text"
              autoComplete="off"
              className="form-input text-gray-300"
              placeholder="Search Collab"
              required
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch(e);
              }}
            />

            {/* Hamburger button */}
            <button
              ref={trigger}
              className={`hamburger ${mobileNavOpen && "active"}`}
              aria-controls="mobile-nav"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span className="sr-only">Menu</span>
              <svg
                className="w-6 h-6 fill-current text-gray-300 hover:text-gray-200 transition duration-150 ease-in-out"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="4" width="24" height="2" rx="1" />
                <rect y="11" width="24" height="2" rx="1" />
                <rect y="18" width="24" height="2" rx="1" />
              </svg>
            </button>

            {/* Mobile navigation */}
            <nav
              id="mobile-nav"
              ref={mobileNav}
              className="absolute top-full z-20 left-0 w-full px-4 sm:px-6 overflow-hidden transition-all duration-300 ease-in-out"
              style={
                mobileNavOpen
                  ? { maxHeight: mobileNav.current.scrollHeight, opacity: 1 }
                  : { maxHeight: 0, opacity: 0.8 }
              }
            >
              <ul className="bg-gray-800 px-4 py-2">
                <li>
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/notifications`}
                    className="flex font-medium w-full text-purple-600 hover:text-gray-200 py-2 justify-center"
                  >
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link
                    to="/createCollab"
                    className="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded-sm text-white bg-purple-600 hover:bg-purple-700 transition duration-150 ease-in-out"
                  >
                    Create
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
