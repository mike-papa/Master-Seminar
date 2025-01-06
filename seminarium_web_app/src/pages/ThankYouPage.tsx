import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ThankYouPage.module.css";

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dziękujemy za udział w badaniu!</h1>
      <p className={styles.description}>
        Twoje odpowiedzi zostały zapisane i będą nieocenioną pomocą w naszym
        badaniu naukowym. 😊
      </p>
    </div>
  );
};

export default ThankYouPage;
