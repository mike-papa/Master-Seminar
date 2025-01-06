import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./TargetPage.module.css";

const TargetPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [compareVideoUrl, setCompareVideoUrl] = useState<string | null>(null);
  const [isCompareVideoEnded, setIsCompareVideoEnded] =
    useState<boolean>(false);
  const [isMainVideoEnded, setIsMainVideoEnded] = useState<boolean>(false);

  const [isMainVideoVisible, setIsMainVideoVisible] = useState<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);

  const [compareVideoElapsedTime, setCompareVideoElapsedTime] =
    useState<number>(0);
  const [mainVideoElapsedTime, setMainVideoElapsedTime] = useState<number>(0);
  const [compareVideoDuration, setCompareVideoDuration] = useState<number>(0);
  const [mainVideoDuration, setMainVideoDuration] = useState<number>(0);

  const surveyId = Cookies.get("survey_id");

  const videoEffects = Cookies.get("video_effects");
  const currentIndex = Cookies.get("current_index");

  const totalQuestions = 20;
  const currentQuestionIndex = currentIndex ? parseInt(currentIndex) : 0;
  const remainingQuestions = totalQuestions - currentQuestionIndex;

  useEffect(() => {
    const loadVideo = () => {
      if (videoEffects) {
        try {
          const parsedEffects = JSON.parse(videoEffects);
          const index = currentIndex ? parseInt(currentIndex) : 0;

          const effect = parsedEffects[index];

          if (effect && effect.filename) {
            const videoPath = `/video/${effect.id}/${effect.filename}`;
            const compareVideoPath = `/video/${effect.id}/compare_cut.mp4`;
            console.log("compareVideoPath: " + compareVideoPath);
            console.log("videoPath: " + videoPath);

            setVideoUrl(videoPath);
            setCompareVideoUrl(compareVideoPath);
          }
        } catch (error) {
          console.error("Error parsing video effects:", error);
        }
      }
    };

    loadVideo();
  }, [videoEffects, currentIndex]);

  useEffect(() => {
    let interval: number | null = null;
    if (!isCompareVideoEnded && compareVideoDuration > 0) {
      interval = window.setInterval(() => {
        setCompareVideoElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isCompareVideoEnded, compareVideoDuration]);

  useEffect(() => {
    let interval: number | null = null;
    if (isMainVideoVisible && !questionAnswered && mainVideoDuration > 0) {
      interval = window.setInterval(() => {
        setMainVideoElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [isMainVideoVisible, questionAnswered, mainVideoDuration]);

  const handleCompareVideoEnd = () => {
    setIsCompareVideoEnded(true);
  };

  const handlePlayMainVideo = () => {
    setIsMainVideoVisible(true);
  };

  const handleQuestionAnswered = (answer: string) => {
    console.log("User answered:", answer);

    const nextIndex = (parseInt(currentIndex || "0") + 1).toString();
    Cookies.set("current_index", nextIndex);

    setQuestionAnswered(true);
    setTimeout(() => {
      setQuestionAnswered(false);
      setIsCompareVideoEnded(false);
      setIsMainVideoVisible(false);
      setIsMainVideoEnded(false);
      setCompareVideoElapsedTime(0);
      setMainVideoElapsedTime(0);
      loadVideo();
    }, 1000);
  };

  const playVideoOnClick = () => {
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      if (video.paused) {
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    });
  };

  useEffect(() => {
    // Add global listener after installation
    document.addEventListener("click", playVideoOnClick);
    return () => {
      // Remove the listener after unmounting
      document.removeEventListener("click", playVideoOnClick);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Strona Docelowa</h1>
      {surveyId ? (
        <p className={styles.paragraph}>
          Twój identyfikator badania: <strong>{surveyId}</strong>
        </p>
      ) : (
        <p className={styles.paragraph}>Brak identyfikatora badania.</p>
      )}

      <p className={styles.paragraph}>
        {currentQuestionIndex + 1} / {totalQuestions} - Pozostało pytań:{" "}
        {remainingQuestions}
      </p>

      {compareVideoUrl && !isMainVideoVisible && (
        <div>
          <p className={styles.paragraph}>Wideo porównawcze:</p>
          <video
            controls={false}
            width="640"
            autoPlay
            onEnded={handleCompareVideoEnd}
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              setCompareVideoDuration(duration);
            }}
          >
            <source src={compareVideoUrl} type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
          <p className={styles.paragraph}>
            Pozostało:{" "}
            {Math.max(
              compareVideoDuration - compareVideoElapsedTime,
              0
            ).toFixed(0)}{" "}
            sekund
          </p>
        </div>
      )}

      {isCompareVideoEnded && !isMainVideoVisible && (
        <div>
          <button onClick={handlePlayMainVideo} className={styles.button}>
            Zobacz główne wideo
          </button>
        </div>
      )}

      {isMainVideoVisible && videoUrl && (
        <div>
          <p className={styles.paragraph}>Wideo:</p>
          <video
            controls={false}
            width="640"
            autoPlay
            onLoadedMetadata={(e) => {
              const duration = e.currentTarget.duration;
              setMainVideoDuration(duration);
            }}
            onEnded={() => setIsMainVideoEnded(true)}
          >
            <source src={videoUrl} type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
          <p className={styles.paragraph}>
            Pozostało:{" "}
            {Math.max(mainVideoDuration - mainVideoElapsedTime, 0).toFixed(0)}{" "}
            sekund
          </p>
        </div>
      )}

      {isMainVideoEnded && !questionAnswered && (
        <div>
          <p className={styles.paragraph}>
            Czy postać na obecnym nagraniu to ta sama postać z pierwszego
            nagrania?
          </p>
          <button
            onClick={() => handleQuestionAnswered("prawda")}
            className={styles.button}
          >
            Prawda
          </button>
          <button
            onClick={() => handleQuestionAnswered("falsz")}
            className={styles.button}
          >
            Falsz
          </button>
        </div>
      )}

      {!compareVideoUrl && (
        <p className={styles.paragraph}>Nie udało się załadować wideo.</p>
      )}
    </div>
  );
};

export default TargetPage;
