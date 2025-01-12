import React from "react";
import styles from "./Questionnaire.module.css";

interface QuestionnaireProps {
  onAnswer: (answer: string) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onAnswer }) => {
  return (
    <div className={styles.questionContainer}>
      <p className={styles.question}>
        Czy postać na obecnym nagraniu to ta sama postać z pierwszego nagrania?
      </p>
      <button onClick={() => onAnswer("prawda")} className={styles.button}>
        Prawda
      </button>
      <button onClick={() => onAnswer("fałsz")} className={styles.button}>
        Fałsz
      </button>
    </div>
  );
};

export default Questionnaire;
