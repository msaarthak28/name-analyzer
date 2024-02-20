"use client";

// pages/index.js

import { useState } from "react";
import Loader from "./Loader";
import styles from "./styles/Home.module.css";

const HomePage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(null);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const [agifyResponse, genderizeResponse, nationalizeResponse] =
        await Promise.all([
          fetch(`https://api.agify.io?name=${name}`),
          fetch(`https://api.genderize.io?name=${name}`),
          fetch(`https://api.nationalize.io?name=${name}`),
        ]);

      const [agifyData, genderizeData, nationalizeData] = await Promise.all([
        agifyResponse.json(),
        genderizeResponse.json(),
        nationalizeResponse.json(),
      ]);

      setAge(agifyData.age);
      setGender(genderizeData.gender);
      setCountry(nationalizeData.country[0]?.country_id || "Unknown");
      setIsLoading(false);
      setShowInfo(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Name Analyzer</h1>
      </header>
      <main className={styles.main}>
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
            <button
              className={styles.button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Analyze" : "Submit"}
            </button>
          </form>
          {showInfo && !error && (
            <div className={styles.info}>
              <p className={styles.infoText}>Age: {age}</p>
              <p className={styles.infoText}>Gender: {gender}</p>
              <p className={styles.infoText}>Country: {country}</p>
            </div>
          )}
          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          © 2024 Name Analyzer. All rights reserved.
        </p>
      </footer>
      {isLoading && <Loader />}
    </div>
  );
};

export default HomePage;
