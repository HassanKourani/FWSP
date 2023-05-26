import React, { Fragment, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../Config";
import { SessionService } from "../../SessionService";
import HomeQuestionCard from "../../utils/HomeQuestionCard";
import Loading from "../../utils/Loading";
import cuteness from "../../images/cute-astronaut.png";
const HomeMain = () => {
  // States
  const [discussionsData, setDiscussionsData] = useState([]);
  const [isPending, setIsPending] = useState();
  // Global
  const user = SessionService.getUser();
  // Refs
  const followersColRef = collection(db, "users", user.id, "following");

  useEffect(() => {
    setIsPending(true);
    const fetchData = async () => {
      const discussions = [];
      const followersSnapshot = await getDocs(followersColRef);

      for (const userDoc of followersSnapshot.docs) {
        const followerDiscColRef = collection(
          db,
          "users",
          userDoc.data().userId,
          "discussions"
        );

        const followerDiscSnapshot = await getDocs(followerDiscColRef);

        for (const userDiscDoc of followerDiscSnapshot.docs) {
          const followerDiscDocRef = doc(
            db,
            "collaborations",
            userDiscDoc.data().collabId,
            "discussions",
            userDiscDoc.data().discId
          );

          const discDoc = await getDoc(followerDiscDocRef);

          discussions.push({ ...discDoc.data(), id: discDoc.id });
        }
      }
      discussions.sort((a, b) => b.createdAt - a.createdAt);
      setDiscussionsData(discussions);
    };

    fetchData().then(() => {
      setIsPending(false);
    });
  }, []);

  return (
    <Fragment>
      {isPending && (
        <div className="flex justify-center ">
          <Loading />
        </div>
      )}

      {discussionsData?.map((question) => (
        <Fragment key={question.id}>
          <HomeQuestionCard question={question} />
        </Fragment>
      ))}
      {discussionsData.length === 0 && !isPending && (
        <div className="flex justify-center">
          <img src={cuteness} alt="Cuteness" />
        </div>
      )}
    </Fragment>
  );
};

export default HomeMain;
