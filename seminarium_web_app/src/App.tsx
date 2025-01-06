import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TargetPage from "./pages/TargetPage";
import ThankYouPage from "./pages/ThankYouPage";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/target" element={<TargetPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
