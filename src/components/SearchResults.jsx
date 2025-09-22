// src/components/SearchResults.jsx
import React, { useState } from "react";
import DefinitionsPopup from "./DefinitionsPopup";

export default function SearchResults({ results, searchTerm, showStrongs }) {
  const [popupCode, setPopupCode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const handleClick = (event, code) => {
    const rect = event.target.getBoundingClientRect();
    setPopupPosition({ x: rect.left, y: rect.bottom });
    setPopupCode(code);
  };

  const highlightText = (text) => {
    if (!text) return text;

    if (showStrongs) {
      // Strong's text: match word + optional Strong's code
      const regex = /(\S+\{[HG]\d+\}|\S+)/g;
      const segments = text.match(regex) || [];

      return segments.map((part, i) => {
        const codeMatch = part.match(/\{([HG]\d+)\}/);
        const code = codeMatch ? codeMatch[1] : null;
        const word = code ? part.replace(/\{[HG]\d+\}/, "") : part;

        // Highlight if word matches search term
        if (searchTerm && word.toLowerCase() === searchTerm.toLowerCase()) {
          return (
            <span
              key={i}
              className="highlight-blue"
              style={{ cursor: code ? "pointer" : "default" }}
              onClick={code ? (e) => handleClick(e, code) : undefined}
            >
              {part}
            </span>
          );
        }

        // Other Strong's codes → underline only
        if (code) {
          return (
            <span key={i}>
              {word}
              <span
                className="strongs-code"
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={(e) => handleClick(e, code)}
              >
                {`{${code}}`}
              </span>{" "}
            </span>
          );
        }

        return part + " ";
      });
    } else {
      // Normal text: split by word boundaries to match search term
      if (!searchTerm) return text;

      const regex = new RegExp(`\\b(${searchTerm})\\b`, "gi");
      const parts = text.split(regex);

      return parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="highlight-blue">
            {part}
          </span>
        ) : (
          part
        )
      );
    }
  };

  return (
    <div>
      {results.map((verse) => (
        <div key={verse.unique_id} className="search-result">
          <div className="verse-title">{verse.short_title}</div>
          <div className="verse-text">
            {showStrongs ? highlightText(verse.strongs_text) : highlightText(verse.text)}
          </div>
        </div>
      ))}

      {popupCode && (
        <DefinitionsPopup
          code={popupCode}
          position={popupPosition}
          onClose={() => setPopupCode(null)}
        />
      )}
    </div>
  );
}
