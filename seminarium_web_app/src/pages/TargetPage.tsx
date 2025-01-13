// File: seminarium_web_app/src/pages/TargetPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VideoPlayer from "../components/VideoPlayer";
import Questionnaire from "../components/Questionnaire";
import styles from "./TargetPage.module.css";
import { submitSurveyAnswer } from "../services/SurveyService";

const TargetPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [compareVideoUrl, setCompareVideoUrl] = useState<string | null>(null);
  const [isCompareVideoEnded, setIsCompareVideoEnded] = useState(false);
  const [isMainVideoVisible, setIsMainVideoVisible] = useState(false);
  const [isMainVideoEnded, setIsMainVideoEnded] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const surveyId = Cookies.get("survey_id");
  const videoEffects = Cookies.get("video_effects");
  const totalQuestions = 20;

  // Function to load video paths based on the current index from cookies.
  const loadVideo = () => {
    // Always get the current index from cookies (if cookie does not exist, index = 0)
    const currentIndex = parseInt(Cookies.get("current_index") || "0", 10);

    // If video effects are available, parse them and load the video for current index.
    if (videoEffects) {
      try {
        const parsedEffects = JSON.parse(videoEffects);
        if (currentIndex >= parsedEffects.length) {
          // If currentIndex is equal or greater than available effects, navigate to thank-you page.
          navigate("/thank-you");
          return;
        }
        const effect = parsedEffects[currentIndex];
        if (effect && effect.filename) {
          const videoPath = `/video/${effect.id}/${effect.filename}`;
          const compareVideoPath = `/video/${effect.id}/compare_cut.mp4`;

          // Log the current index, folder (effect.id) and video filename for the compare video.
          console.log(
            `Loading compare video: index = ${currentIndex}, folder = ${effect.id}, filename = compare_cut.mp4`
          );

          setVideoUrl(videoPath);
          setCompareVideoUrl(compareVideoPath);
        }
      } catch (error) {
        console.error("Error parsing video effects:", error);
      }
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    loadVideo();
    // Global listener – play video on click when autoplay is blocked.
    const playVideoOnClick = () => {
      document.querySelectorAll("video").forEach((video) => {
        if (video.paused) {
          video
            .play()
            .catch((error) => console.error("Error playing video:", error));
        }
      });
    };
    document.addEventListener("click", playVideoOnClick);
    return () => {
      document.removeEventListener("click", playVideoOnClick);
    };
    // Dependencies: videoEffects and navigate.
  }, [videoEffects, navigate]);

  // Handler for the end of the compare video playback.
  const handleCompareVideoEnd = () => {
    setIsCompareVideoEnded(true);
  };

  // Handler to show the main video.
  const handlePlayMainVideo = () => {
    setIsMainVideoVisible(true);
  };

  const handleQuestionAnswered = async (answer: string) => {
    console.log("User answered:", answer);

    const currentIndex = parseInt(Cookies.get("current_index") || "0", 10);
    const videoEffects = JSON.parse(Cookies.get("video_effects") || "[]");
    const surveyId = Cookies.get("survey_id");

    if (!surveyId || currentIndex >= videoEffects.length) {
      console.error("Missing survey ID or invalid index.");
      return;
    }

    // Przygotowanie danych do wysyłki
    const currentEffect = videoEffects[currentIndex];
    const answerPayload = {
      answer: answer === "prawda",
      videoEffectName: currentEffect.filename,
      videoId: currentEffect.id,
      frontendId: surveyId,
    };

    try {
      // Wysyłka odpowiedzi do API
      console.log("Answer payload:", answerPayload);
      const response = await submitSurveyAnswer(answerPayload);
      console.log("Answer submitted:", response);

      // Aktualizacja stanu po wysyłce odpowiedzi
      const nextIndex = currentIndex + 1;
      Cookies.set("current_index", nextIndex.toString());
      setQuestionAnswered(true);
      setTimeout(() => {
        setQuestionAnswered(false);
        setIsCompareVideoEnded(false);
        setIsMainVideoVisible(false);
        setIsMainVideoEnded(false);
        loadVideo();
      }, 1000);
    } catch (error) {
      console.error("Error submitting survey answer:", error);
    }
  };

  // Always use the current index from cookies for display purposes.
  const currentIndexDisplay = parseInt(Cookies.get("current_index") || "0", 10);
  const remainingQuestions = totalQuestions - currentIndexDisplay;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Target Page</h1>
      {surveyId ? (
        <p className={styles.paragraph}>
          Your survey ID: <strong>{surveyId}</strong>
        </p>
      ) : (
        <p className={styles.paragraph}>No survey ID found.</p>
      )}
      <p className={styles.paragraph}>
        {currentIndexDisplay + 1} / {totalQuestions} - Remaining questions:{" "}
        {remainingQuestions}
      </p>

      {/* Compare video player */}
      {compareVideoUrl && !isMainVideoVisible && (
        <div>
          <p className={styles.paragraph}>Compare Video:</p>
          <VideoPlayer
            src={compareVideoUrl}
            autoPlay
            onVideoEnd={handleCompareVideoEnd}
          />
        </div>
      )}

      {/* Button to play the main video */}
      {isCompareVideoEnded && !isMainVideoVisible && (
        <div>
          <button onClick={handlePlayMainVideo} className={styles.button}>
            Watch Main Video
          </button>
        </div>
      )}

      {/* Main video player */}
      {isMainVideoVisible && videoUrl && (
        <div>
          <p className={styles.paragraph}>Video:</p>
          <VideoPlayer
            src={videoUrl}
            autoPlay
            onVideoEnd={() => setIsMainVideoEnded(true)}
          />
        </div>
      )}

      {/* Questionnaire displayed after main video ends */}
      {isMainVideoEnded && !questionAnswered && (
        <Questionnaire onAnswer={handleQuestionAnswered} />
      )}

      {!compareVideoUrl && (
        <p className={styles.paragraph}>Failed to load video.</p>
      )}
    </div>
  );
};

export default TargetPage;
