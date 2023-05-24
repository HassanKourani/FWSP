import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config";
import { useEffect, useState } from "react";
import Loading from "../../utils/Loading";

const Reports = () => {
  const [reports, setReports] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const reportRef = collection(db, "reports");
      const unsubscribe = onSnapshot(reportRef, async (snapshot) => {
        const promises = snapshot.docs.map(async (report) => {
          const discussionRef = doc(
            db,
            "collaborations",
            report.data().collabId,
            "discussions",
            report.id
          );
          const discussionSnap = await getDoc(discussionRef);
          const discussionData = discussionSnap.data();

          // Get the number of users for the report
          const usersSnapshot = await getDocs(
            collection(db, "reports", report.id, "users")
          );
          const numberOfUsers = usersSnapshot.size;

          return {
            ...discussionData,
            collabId: report.data().collabId,
            discId: report.id,
            numberOfUsers: numberOfUsers,
          };
        });
        const resolvedData = await Promise.all(promises);
        setReports(resolvedData);
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const handleDeleteDiscussion = (e, collabId, discId, userId) => {
    e.preventDefault();
    deleteDoc(doc(db, "collaborations", collabId, "discussions", discId));
    deleteDoc(doc(db, "reports", discId));
    const q = query(
      collection(db, "users", userId, "discussions"),
      where("discId", "==", discId)
    );
    getDocs(q).then((res) =>
      deleteDoc(doc(db, "users", userId, "discussions", res.docs[0].id))
    );
  };

  const handleDenyReport = (e, collabId, discId, userId) => {
    e.preventDefault();
    getDocs(collection(db, "reports", discId, "users"))
      .then((docs) => {
        docs.forEach((doc) => {
          deleteDoc(doc.ref);
        });
      })
      .then(() => {
        deleteDoc(doc(db, "reports", discId));
      });

    getDocs(
      collection(
        db,
        "collaborations",
        collabId,
        "discussions",
        discId,
        "reports"
      )
    ).then((docs) => {
      docs.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
  };

  return (
    <>
      {!reports && (
        <div className="flex justify-center">
          <Loading />
        </div>
      )}
      {reports &&
        reports.map((report) => (
          <div className="bg-gray-800/50 p-4 mb-4 mx-4 cursor-pointer hover:bg-white/10">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <h1>{report.userName}</h1>
              </div>
              <div className="flex gap-4 items-center">
                {report.createdAt && (
                  <div className="flex gap-1 items-center text-gray-400/75 text-xs	">
                    {report &&
                      new Date(report.createdAt.seconds * 1000).getDate()}
                    /
                    {report &&
                      new Date(report.createdAt.seconds * 1000).getMonth() + 1}
                    /
                    {report &&
                      new Date(report.createdAt.seconds * 1000).getFullYear()}
                  </div>
                )}
              </div>
            </div>

            <div className="pl-8 pt-2 ">
              <h1 className="font-bold">{report.title}</h1>
              <div className=" ">
                <p className="mt-1">{report.question}</p>
                {report.link && (
                  <a href={report.link} className="text-blue-600 underline">
                    Linked Material
                  </a>
                )}
              </div>
              <div className="flex justify-between items-start ">
                {report.image ? (
                  <img src={report.image} className="max-h-32 mt-2	" />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t">
              <div>Number of reports: {report.numberOfUsers}</div>
              <div className="flex gap-4">
                <div
                  className=" hover:text-red-500 flex cursor-pointer items-center"
                  onClick={(e) =>
                    handleDeleteDiscussion(
                      e,
                      report.collabId,
                      report.discId,
                      report.userId
                    )
                  }
                >
                  Delete
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </div>
                <div
                  className="hover:text-red-500 flex cursor-pointer items-center"
                  onClick={(e) =>
                    handleDenyReport(
                      e,
                      report.collabId,
                      report.discId,
                      report.userId
                    )
                  }
                >
                  Deny
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Reports;
