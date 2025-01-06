import React from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.navbar}>
        <nav className={styles.nav}>
          <h1 className={styles.logo}>Praca Dyplomowa</h1>
          <p className={styles.tagline}>
            Badanie wpływu efektów graficznych na rozpoznawanie obrazu
          </p>
        </nav>
      </header>
      <main className={styles.content}>{children}</main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; 2024 Autor: Imię Nazwisko. Wszystkie prawa zastrzeżone.
        </p>
      </footer>
    </div>
  );
};

export default Layout;
