import { collection, getDocs } from "@firebase/firestore";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { db } from "../../Config";
import { useEffect, useState } from "react";
import styles from "../../utils/AccordionFolder.module.css";
import chevronDown from "../../utils/Chevron-down.svg";
import { SessionService } from "../../SessionService";
import { useParams } from "react-router-dom";

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <img className={styles.chevron} src={chevronDown} alt="Chevron Down" />
      </>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) =>
        `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
);

const ProfileAccordionFolder = ({ folder }) => {
  const [materials, setMaterials] = useState([]);
  const uid = useParams().userId;

  useEffect(() => {
    getDocs(
      collection(db, "users", uid, "folders", folder.id, "materials")
    ).then((docs) =>
      setMaterials(
        docs.docs.map((material) => (
          <div className="p-2 flex items-center justify-between">
            <li key={material.id}>{material.data().name}</li>

            <a href={material.data().link} download>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </a>
          </div>
        ))
      )
    );
  }, []);

  return (
    <>
      {materials.length > 1 ? (
        <AccordionItem header={folder.folderName}>
          <ul>{materials}</ul>
        </AccordionItem>
      ) : (
        <ul className={`${styles.item} p-2`}>{materials}</ul>
      )}
    </>
  );
};

export default ProfileAccordionFolder;
