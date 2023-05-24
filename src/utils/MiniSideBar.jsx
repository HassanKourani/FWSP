import { useNavigate } from "react-router-dom";
import { SessionService } from "../SessionService";

const MiniSideBar = ({ setSettingsComponent }) => {
  const navigate = useNavigate();

  return (
    <>
      <aside className=" h-full p-2 sm:w-60 dark:bg-gray-900/50 dark:text-gray-100">
        <nav className="space-y-8 text-sm">
          <div className="space-y-2">
            <div className="flex flex-col  ">
              <span
                className="cursor-pointer hover:bg-purple-500/50 rounded-md px-4 sm:px-8 py-4"
                onClick={() => setSettingsComponent("details")}
              >
                Details
              </span>

              <span
                className="cursor-pointer hover:bg-purple-500/50 rounded-md px-4 sm:px-8 py-4"
                onClick={() => setSettingsComponent("changePassword")}
              >
                Change Password
              </span>
              <span
                className="cursor-pointer hover:bg-red-500/50 rounded-md px-4 sm:px-8 py-4  "
                onClick={() => {
                  SessionService.clearUser();
                  navigate("/");
                }}
              >
                Logout
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default MiniSideBar;
