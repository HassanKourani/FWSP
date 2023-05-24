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

const AccordionFolder = ({ folder }) => {
  const uid = useParams().uid;
  const [materials, setMaterials] = useState([]);
  const user = SessionService.getUser();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState();

  const handleConfirmDeleteModal = (e) => {
    e.preventDefault();
    deleteDoc(
      doc(
        db,
        "collaborations",
        uid,
        "folders",
        folder.id,
        "materials",
        selectedMaterial
      )
    );

    deleteDoc(
      doc(
        db,
        "users",
        user.id,
        "folders",
        folder.id,
        "materials",
        selectedMaterial
      )
    );
  };

  useEffect(() => {
    getDocs(
      collection(db, "collaborations", uid, "folders", folder.id, "materials")
    ).then((docs) =>
      setMaterials(
        docs.docs.map((material) => (
          <div
            key={material.id}
            className="p-2 flex items-center justify-between "
          >
            <span>{material.data().name}</span>
            <div className="flex gap-4">
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
              {user.id === material.data().userId && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                    setSelectedMaterial(material.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 hover:text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              )}
            </div>
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
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onClick={(e) => handleConfirmDeleteModal(e)}
      />
    </>
  );
};

export default AccordionFolder;
