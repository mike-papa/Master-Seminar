// File: seminarium_web_app/src/pages/TargetPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import VideoPlayer from "../components/VideoPlayer";
import Questionnaire from "../components/Questionnaire";
import styles from "./TargetPage.module.css";

const TargetPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [compareVideoUrl, setCompareVideoUrl] = useState<string | null>(null);
  const [isCompareVideoEnded, setIsCompareVideoEnded] = useState(false);
  const [isMainVideoVisible, setIsMainVideoVisible] = useState(false);
  const [isMainVideoEnded, setIsMainVideoEnded] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  // Używamy stanu, by przechowywać aktualny indeks pytania.
  const [currentIndexState, setCurrentIndexState] = useState<number>(() => {
    const cookieIndex = Cookies.get("current_index");
    return cookieIndex ? parseInt(cookieIndex) : 0;
  });

  const surveyId = Cookies.get("survey_id");
  const videoEffects = Cookies.get("video_effects");
  const totalQuestions = 20;
  // Korzystamy z aktualnego stanu zamiast ciasteczka:
  const currentQuestionIndex = currentIndexState;
  const remainingQuestions = totalQuestions - currentQuestionIndex;

  const navigate = useNavigate();

  // Funkcja ładująca ścieżki do wideo – korzystamy z currentIndexState
  const loadVideo = () => {
    if (videoEffects) {
      try {
        const parsedEffects = JSON.parse(videoEffects);
        if (currentIndexState >= parsedEffects.length) {
          navigate("/thank-you");
          return;
        }
        const effect = parsedEffects[currentIndexState];
        if (effect && effect.filename) {
          const videoPath = `/video/${effect.id}/${effect.filename}`;
          const compareVideoPath = `/video/${effect.id}/compare_cut.mp4`;
          setVideoUrl(videoPath);
          setCompareVideoUrl(compareVideoPath);
        }
      } catch (error) {
        console.error("Error parsing video effects:", error);
      }
    }
  };

  useEffect(() => {
    loadVideo();
    // Global listener – odtwarzanie wideo po kliknięciu (gdyby autoplay był zablokowany)
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
    // Nie umieszczamy currentIndexState w zależnościach, by nie powodować ponownego ładowania wideo przy każdej zmianie – ładowanie wykonamy
    // w handleQuestionAnswered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoEffects, navigate]);

  // Obsługa zakończenia odtwarzania wideo porównawczego
  const handleCompareVideoEnd = () => {
    setIsCompareVideoEnded(true);
  };

  // Akcja do wyświetlenia głównego wideo
  const handlePlayMainVideo = () => {
    setIsMainVideoVisible(true);
  };

  // Obsługa udzielenia odpowiedzi i przejścia do kolejnego pytania:
  const handleQuestionAnswered = (answer: string) => {
    console.log("User answered:", answer);
    const nextIndex = currentIndexState + 1;
    setCurrentIndexState(nextIndex);
    Cookies.set("current_index", nextIndex.toString());
    setQuestionAnswered(true);
    setTimeout(() => {
      setQuestionAnswered(false);
      setIsCompareVideoEnded(false);
      setIsMainVideoVisible(false);
      setIsMainVideoEnded(false);
      loadVideo();
    }, 1000);
  };

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

      {/* Odtwarzacz wideo porównawczego */}
      {compareVideoUrl && !isMainVideoVisible && (
        <div>
          <p className={styles.paragraph}>Wideo porównawcze:</p>
          <VideoPlayer
            src={compareVideoUrl}
            autoPlay
            onVideoEnd={handleCompareVideoEnd}
          />
        </div>
      )}

      {/* Przycisk do uruchomienia głównego wideo */}
      {isCompareVideoEnded && !isMainVideoVisible && (
        <div>
          <button onClick={handlePlayMainVideo} className={styles.button}>
            Zobacz główne wideo
          </button>
        </div>
      )}

      {/* Główne wideo */}
      {isMainVideoVisible && videoUrl && (
        <div>
          <p className={styles.paragraph}>Wideo:</p>
          <VideoPlayer
            src={videoUrl}
            autoPlay
            onVideoEnd={() => setIsMainVideoEnded(true)}
          />
        </div>
      )}

      {/* Pytanie po zakończeniu głównego wideo */}
      {isMainVideoEnded && !questionAnswered && (
        <Questionnaire onAnswer={handleQuestionAnswered} />
      )}

      {!compareVideoUrl && (
        <p className={styles.paragraph}>Nie udało się załadować wideo.</p>
      )}
    </div>
  );
};

export default TargetPage;
