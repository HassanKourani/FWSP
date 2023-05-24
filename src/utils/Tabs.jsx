import Dropdown from "./Dropdown";
import "./Tabs.css";

const Tabs = ({
  handleTabSelect,
  isUserProfile,
  setSettingsComponent,
  settingsComponent,
}) => {
  return (
    <>
      <div className="radio-inputs m-auto">
        <label className="radio" onClick={() => handleTabSelect("discussions")}>
          <input type="radio" name="radio" defaultChecked />
          <span className="name">Discussions</span>
        </label>
        <label className="radio" onClick={() => handleTabSelect("collabs")}>
          <input type="radio" name="radio" />
          <span className="name">Collabs</span>
        </label>
        <label className="radio" onClick={() => handleTabSelect("materials")}>
          <input type="radio" name="radio" />
          <span className="name">Materials</span>
        </label>
        {isUserProfile() && (
          <label className="radio flex items-center">
            <Dropdown
              setSettingsComponent={setSettingsComponent}
              handleTabSelect={handleTabSelect}
            />
          </label>
        )}
      </div>
    </>
  );
};

export default Tabs;
