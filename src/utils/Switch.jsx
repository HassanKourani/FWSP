import { doc, updateDoc } from "firebase/firestore";
import "./Switch.css";
import { db } from "../Config";
import { useParams } from "react-router-dom";
import { useState } from "react";

const Switch = ({ isPrivate, setIsPrivate }) => {
  const uid = useParams().uid;
  const [isDisabled, setIsDisabled] = useState(false);

  const handleIsPrivateChange = (e) => {
    setIsDisabled(true);

    updateDoc(doc(db, "collaborations", uid), {
      isPrivate: e.target.checked,
    });
    setIsDisabled(false);
    setIsPrivate(e.target.checked);
  };

  return (
    <>
      <div className="switch">
        <input
          type="checkbox"
          defaultChecked={isPrivate}
          disabled={isDisabled}
          onChange={(e) => handleIsPrivateChange(e)}
        />
        <div className="left"></div>
        <div className="right"></div>
        <div className="switcher"></div>
      </div>
    </>
  );
};

export default Switch;
