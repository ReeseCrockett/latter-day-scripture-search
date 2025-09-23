import React, { useState, Suspense, useRef, useEffect } from "react";
import Header from "./components/Header";
import SearchResults from "./components/SearchResults";
import Definitions from "./components/Definitions";
import oldTestament from "./scriptures/old_testament.json";
import newTestament from "./scriptures/new_testament.json";
import bookOfMormon from "./scriptures/book_of_mormon.json";
import doctrineAndCovenants from "./scriptures/doctrine_and_covenants.json";
import pearlOfGreatPrice from "./scriptures/pearl_of_great_price.json";

import "./App.css";

const AlternateVerses = React.lazy(() => import("./components/AlternateVerses"));

const allScriptures = [
  ...oldTestament,
  ...newTestament,
  ...bookOfMormon,
  ...doctrineAndCovenants,
  ...pearlOfGreatPrice,
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [strongsCodes, setStrongsCodes] = useState([]);
  const [showStrongs, setShowStrongs] = useState(false);
  const [showAlternate, setShowAlternate] = useState(false);
  const [filters, setFilters] = useState({ testament: [], strongs: [] });
  const [showDefinitions, setShowDefinitions] = useState(false);

  const topPanelRef = useRef(null);

  // Dynamically update CSS variable for top panel height
  useEffect(() => {
    const updateHeight = () => {
      if (topPanelRef.current) {
        document.documentElement.style.setProperty(
          "--top-panel-height",
          `${topPanelRef.current.offsetHeight}px`
        );
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    if (topPanelRef.current) observer.observe(topPanelRef.current);

    return () => observer.disconnect();
  }, []);

  const handleSearch = (term) => {
    if (!term) return;
    setSearchTerm(term);
    setFilters({ testament: [], strongs: [] });
    setShowAlternate(false);

    const regex = new RegExp(`\\b${term}\\b`, "i");

    const searchResults = allScriptures.filter(
      (verse) => regex.test(verse.text) || regex.test(verse.strongs_text)
    );

    setResults(searchResults);

    // Extract Strong's codes
    const codes = new Set();
    const strongsRegex = /\b(\S+)\{([HG]\d+)\}/g;

    searchResults.forEach((verse) => {
      let match;
      while ((match = strongsRegex.exec(verse.strongs_text)) !== null) {
        const [, word, code] = match;
        if (regex.test(word)) codes.add(code);
      }
    });

    setStrongsCodes(Array.from(codes));
  };

  const filteredResults = results.filter((verse) => {
    const testamentMap = { Old: "old", New: "new", BOM: "bom", "D&C": "d&c", PGP: "pgp" };
    const matchTestament =
      filters.testament.length === 0 ||
      !filters.testament.some((t) => verse.testament === testamentMap[t]);
    const matchStrongs =
      filters.strongs.length === 0 ||
      !filters.strongs.some((code) => verse.strongs_text.includes(`{${code}}`));
    return matchTestament && matchStrongs;
  });

  return (
    <div className="App">
      {/* Sticky top panel */}
      <div className="top-panel" ref={topPanelRef}>
        <Header
          onSearch={handleSearch}
          showStrongs={showStrongs}
          setShowStrongs={setShowStrongs}
          showAlternate={showAlternate}
          setShowAlternate={setShowAlternate}
          showDefinitions={showDefinitions}
          setShowDefinitions={setShowDefinitions}
          filters={filters}
          setFilters={setFilters}
          strongsCodes={strongsCodes}
          results={results}
        />
      </div>

      {/* Main scrollable content */}
      <div className="main-content">
        <div
          className={`search-results-wrapper ${showAlternate ? "shifted" : ""
            } ${showDefinitions ? "shifted-left" : ""}`}
        >
          <SearchResults
            results={filteredResults}
            searchTerm={searchTerm}
            showStrongs={showStrongs}
          />
        </div>
      </div>

      {/* Left-side Definitions panel */}
      {showDefinitions && strongsCodes.length > 0 && (
        <div className="definitions-panel">
          <Definitions
            strongsCodes={strongsCodes.filter((code) => !filters.strongs.includes(code))}
            searchTerm={searchTerm}
          />
        </div>
      )}


      {/* Right-side AlternateVerses panel */}
      {showAlternate && (
        <Suspense fallback={<div>Loading Alternate Verses...</div>}>
          <div className="alternate-verses">
            <AlternateVerses
              strongsCodes={strongsCodes}
              excludeVerses={filteredResults.map((v) => v.unique_id)}
            />
          </div>
        </Suspense>
      )}
    </div>
  );
}

export default App;
