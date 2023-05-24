import { collection, getDocs, deleteDoc, doc } from "@firebase/firestore";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import { db } from "../Config";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import styles from "./AccordionFolder.module.css";
import chevronDown from "./Chevron-down.svg";
import { SessionService } from "../SessionService";
import ConfirmationModal from "./ConfirmationModal";

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        <span className="text-purple-600 font-bold h-">{header}</span>
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

const MaterialModalAccordion = ({ folder, setMaterialLink, setIsOpen }) => {
  const uid = useParams().uid;
  const [materials, setMaterials] = useState([]);
  const user = SessionService.getUser();

  useEffect(() => {
    getDocs(
      collection(db, "collaborations", uid, "folders", folder.id, "materials")
    ).then((docs) =>
      setMaterials(
        docs.docs.map((material) => (
          <div
            key={material.id}
            className="p-2 flex items-center justify-between "
            onClick={() => {
              setMaterialLink(material.data().link);
              setIsOpen(false);
            }}
          >
            <span>{material.data().name}</span>

            <div className="flex gap-4"></div>
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
      ) : materials.length === 1 ? (
        <ul className={`${styles.item} p-2 `}>
          <b className="text-purple-600"> {folder.folderName}:</b> {"  "}
          <span>{materials}</span>
        </ul>
      ) : (
        <></>
      )}
    </>
  );
};

export default MaterialModalAccordion;
