import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import styles from "./HomePage.module.css";

const shuffleArray = <T,>(array: T[]): T[] => {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
};

const loadVideoEffects = async (): Promise<string[]> => {
  const response = await fetch("/video.json");
  if (!response.ok) {
    throw new Error(`Błąd ładowania pliku: ${response.statusText}`);
  }

  const data: string[] = await response.json();

  if (data.length !== 10) {
    throw new Error("Plik video.json musi zawierać dokładnie 10 elementów.");
  }

  return data;
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      const videoEffects = await loadVideoEffects();
      const firstShuffled = shuffleArray([...videoEffects]);
      const secondShuffled = shuffleArray([...videoEffects]);
      const combinedEffects = [...firstShuffled, ...secondShuffled];

      let structuredEffects = combinedEffects.map((file, index) => ({
        id: index + 1,
        filename: file,
      }));
      structuredEffects = shuffleArray([...structuredEffects]);

      Cookies.set("video_effects", JSON.stringify(structuredEffects), {
        expires: 1,
      });
      console.log(structuredEffects);

      const surveyId = uuidv4();
      Cookies.set("survey_id", surveyId, { expires: 7 });

      navigate("/target");
    } catch (error) {
      console.error("Błąd podczas ładowania efektów:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Badanie Pracy Magisterskiej</h1>
        <p className={styles.description}>
          Witamy! Dziękujemy za udział w naszym badaniu. Celem tego badania jest
          zbadanie wpływu <strong>efektów graficznych</strong> na rozpoznawanie
          twarzy.
        </p>
        <p className={styles.description}>
          Badanie polega na przedstawieniu dwóch nagrań wideo:
        </p>
        <ul className={styles.list}>
          <li>Pierwsze wideo ukazuje celebrytę bez efektów graficznych.</li>
          <li>
            Drugie wideo zawiera efekty graficzne naniesione na twarz celebryty{" "}
            <em>lub</em> innej osoby.
          </li>
        </ul>
        <p className={styles.description}>
          Twoim zadaniem będzie ocenić, czy osoba widoczna na drugim nagraniu to
          ta sama osoba, która występowała na pierwszym nagraniu.
        </p>
        <p className={styles.description}>
          Badanie składa się z <strong>20 pytań</strong>, które pomagają nam
          zbadać, jak efekty graficzne wpływają na rozpoznawanie twarzy.
        </p>
        <button className={styles.button} onClick={handleStart}>
          Rozpocznij
        </button>
      </div>
    </div>
  );
};

export default HomePage;
