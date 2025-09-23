import React, { useEffect, useState } from "react";
import hebrewDict from "../dictionaries/hebrew_dictionary.json";
import greekDict from "../dictionaries/greek_dictionary.json";
import dictionary1828 from "../dictionaries/1828_dictionary.json";

export default function Definitions({ strongsCodes, searchTerm }) {
  const [definitions, setDefinitions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded1828, setExpanded1828] = useState(false);

  // --- Normalization for 1828 dictionary ---
  const normalizeSearchTerm = (word) => {
    if (!word) return "";
    let w = word.toLowerCase();
    if (w.endsWith("s") && !dictionary1828[w]) w = w.slice(0, -1);
    if (w.endsWith("ing") && !dictionary1828[w]) w = w.slice(0, -3);
    return w;
  };

  useEffect(() => {
    if (!strongsCodes || strongsCodes.length === 0) {
      setDefinitions([]);
      return;
    }

    const defs = strongsCodes
      .map((code) => {
        const upperCode = code.toUpperCase();
        if (upperCode.startsWith("H")) {
          return hebrewDict.find(
            (entry) => entry.hebrew_id.toUpperCase() === upperCode
          );
        } else if (upperCode.startsWith("G")) {
          return greekDict.find(
            (entry) => entry.greek_id.toUpperCase() === upperCode
          );
        } else return null;
      })
      .filter(Boolean);

    setDefinitions(defs);
  }, [strongsCodes]);

  const dictDefinition = searchTerm
    ? dictionary1828[normalizeSearchTerm(searchTerm)]
    : null;

  return (
    <div className="definitions-container">
      <h3>Word Definitions</h3>

      {!collapsed && (
        <>
          {/* 1828 Dictionary */}
          {dictDefinition && (
            <div
              className="definition-entry dictionary-tile"
              style={{ cursor: "pointer", marginBottom: "1rem" }}
              onClick={() => setExpanded1828(!expanded1828)}
            >
              <strong>{searchTerm} (1828 Dictionary):</strong>
              <div style={{ marginTop: "0.5rem" }}>
                {(expanded1828 ? dictDefinition : [dictDefinition[0]]).map(
                  (def, i) => (
                    <div key={i} style={{ marginBottom: "0.5rem" }}>
                      {def}
                    </div>
                  )
                )}
              </div>
              {dictDefinition.length > 1 && (
                <span className="action-link">
                  {expanded1828 ? "Show less" : "Read more"}
                </span>
              )}
            </div>
          )}

          {/* Hebrew/Greek Strong’s Definitions */}
          {Array.from(
            new Set(definitions.map((d) => d.hebrew_id || d.greek_id))
          ).map((id) => {
            const def = definitions.find(
              (d) => (d.hebrew_id || d.greek_id) === id
            );
            const code = def.hebrew_id || def.greek_id;
            return (
              <div
                key={id}
                className="definition-entry"
                style={{ marginBottom: "1rem" }}
              >
                <span className="strong-code">{code}</span>:
                <span className="lemma"> {def.lemma} ({def.transliterated})</span>
                <div className="translations">
                  {def.strong_translation} - {def.kjv_translation}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
