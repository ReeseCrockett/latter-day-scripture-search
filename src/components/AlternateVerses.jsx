import React, { useState } from "react";
import oldTestament from "../scriptures/old_testament.json";
import newTestament from "../scriptures/new_testament.json";
import bookOfMormon from "../scriptures/book_of_mormon.json";
import doctrineAndCovenants from "../scriptures/doctrine_and_covenants.json";
import pearlOfGreatPrice from "../scriptures/pearl_of_great_price.json";
import strongsIndex from "../scriptures/strongs_index.json";

const allScriptures = [
  ...oldTestament,
  ...newTestament,
  ...bookOfMormon,
  ...doctrineAndCovenants,
  ...pearlOfGreatPrice,
];

export default function AlternateVerses({ strongsCodes, excludeVerses }) {
  const [selectedCode, setSelectedCode] = useState(null);
  const [altVerses, setAltVerses] = useState([]);

  const handleCodeClick = (code) => {
    setSelectedCode(code);
    const verseIds = (strongsIndex[code] || []).filter((id) => !excludeVerses.includes(id));
    const collected = allScriptures.filter((v) => verseIds.includes(v.unique_id));
    setAltVerses(collected);
  };

  const highlightAlternates = (text) => {
    const regex = /\S+\{[HG]\d+\}/g;
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const code = match[0].match(/\{[HG]\d+\}/)[0].slice(1, -1);
      const start = match.index;
      const end = regex.lastIndex;

      if (selectedCode && code === selectedCode) {
        if (start > lastIndex) result.push(text.slice(lastIndex, start));
        result.push(
          <span key={start} className="highlight-pink">
            {match[0]}
          </span>
        );
        lastIndex = end;
      }
    }

    if (lastIndex < text.length) result.push(text.slice(lastIndex));
    return result;
  };

  return (
    <div className="alternate-verses-container">
      <h4>Alternate Strong Code Verses</h4>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
        {strongsCodes.map((code) => {
          const verseIds = strongsIndex[code] || [];
          const count = verseIds.filter((id) => !excludeVerses.includes(id)).length;

          return (
            <button
              key={code}
              className={`primary-button alternate-button ${selectedCode === code ? "button-active" : ""}`}
              onClick={() => handleCodeClick(code)}
            >
              ({count}) {code}
            </button>
          );
        })}
      </div>

      {altVerses.map((verse) => (
        <div key={verse.unique_id} className="alt-verse-entry">
          <div className="verse-title">{verse.short_title}</div>
          <div className="verse-text">{highlightAlternates(verse.strongs_text)}</div>
        </div>
      ))}
    </div>
  );
}
