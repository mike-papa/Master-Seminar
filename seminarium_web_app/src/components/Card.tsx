import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </div>
  );
};

export default Card;
