import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "../../utils/Loading";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Config";

const Meeting = () => {
  const mid = useParams().mid;
  const uid = useParams().uid;

  useEffect(() => {
    getDoc(doc(db, "collaborations", uid, "meetings", mid)).then((res) => {
      console.log(res.data());
      const meetingSDK = new VideoSDKMeeting();
      const config = {
        name: `Guest`,
        apiKey: "8769e4f2-f266-4bf6-b0d3-275024b10e0b",
        meetingId: `${mid}`,
        redirectOnLeave: "",
        micEnabled: true,
        webcamEnabled: true,
        participantCanToggleSelfWebcam: true,
        participantCanToggleSelfMic: true,
        joinScreen: {
          visible: true,
          title: res.data().name,
          meetingUrl: `${window.location.href}`,
          target: "_blank",
        },
        screenShareEnabled: true,
      };
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.addEventListener("load", () => {
        // SDK loaded
      });
      script.src =
        "https://sdk.videosdk.live/rtc-js-prebuilt/0.3.23/rtc-js-prebuilt.js";
      document.getElementsByTagName("head")[0].appendChild(script);
      meetingSDK.init(config);
      // Clean up
      return () => {
        document.getElementsByTagName("head")[0].removeChild(script);
      };
    });
  }, []);

  return (
    <div className="flex items-center h-screen justify-center">
      <Loading />
    </div>
  );
};

export default Meeting;
