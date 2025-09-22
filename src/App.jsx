import React, { useState, Suspense } from "react";
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

  const [filters, setFilters] = useState({
    testament: [],
    strongs: [],
  });

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

    // Extract only Strong's codes corresponding to the searched word
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

  // Apply exclusion filters
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
      <Header
        onSearch={handleSearch}
        showStrongs={showStrongs}
        setShowStrongs={setShowStrongs}
        showAlternate={showAlternate}
        setShowAlternate={setShowAlternate}
        filters={filters}
        setFilters={setFilters}
        strongsCodes={strongsCodes}
        results={results}
      />

      <Definitions strongsCodes={strongsCodes.filter((code) => !filters.strongs.includes(code))} />

      <div className="main-content">
        <SearchResults
          results={filteredResults}
          searchTerm={searchTerm}
          showStrongs={showStrongs}
        />

        {showAlternate && (
          <Suspense fallback={<div>Loading Alternate Verses...</div>}>
            <AlternateVerses
              strongsCodes={strongsCodes}
              excludeVerses={filteredResults.map((v) => v.unique_id)}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;
