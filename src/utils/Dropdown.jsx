import { useNavigate } from "react-router-dom";
import { SessionService } from "../SessionService";
import "./Tabs.css";

const Dropdown = ({ setSettingsComponent, handleTabSelect }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="hs-dropdown relative inline-flex m-auto">
        <button
          id="hs-dropdown-custom-icon-trigger"
          type="button"
          className="hs-dropdown-toggle flex items-center justify-center "
        >
          Settings
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
        </button>
        <div
          className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[15rem] shadow-md rounded-lg p-2 mt-2 bg-gray-800 dark:border dark:border-gray-700"
          aria-labelledby="hs-dropdown-custom-icon-trigger"
        >
          <label
            className="radio"
            onClick={() => {
              setSettingsComponent("details");
              handleTabSelect("settings");
            }}
          >
            <input type="radio" name="radio" />
            <span className="name hover:bg-gray-600">Details</span>
          </label>
          <label
            className="radio"
            onClick={() => {
              setSettingsComponent("password");
              handleTabSelect("settings");
            }}
          >
            <input type="radio" name="radio" />
            <span className="name hover:bg-gray-600 my-2">Update Password</span>
          </label>
          <label
            className="radio"
            onClick={() => {
              SessionService.clearUser();
              navigate("/");
            }}
          >
            <input type="radio" name="radio" />
            <span className="name hover:bg-red-600">Logout</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Dropdown;
