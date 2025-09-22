import React, { useEffect, useState } from "react";
import hebrewDict from "../dictionaries/hebrew_dictionary.json";
import greekDict from "../dictionaries/greek_dictionary.json";

export default function Definitions({ strongsCodes }) {
  const [definitions, setDefinitions] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!strongsCodes || strongsCodes.length === 0) {
      setDefinitions([]);
      return;
    }

    const defs = strongsCodes
      .map((code) => {
        const upperCode = code.toUpperCase();
        if (upperCode.startsWith("H")) {
          return hebrewDict.find((entry) => entry.hebrew_id.toUpperCase() === upperCode);
        } else if (upperCode.startsWith("G")) {
          return greekDict.find((entry) => entry.greek_id.toUpperCase() === upperCode);
        } else return null;
      })
      .filter(Boolean);

    setDefinitions(defs);
  }, [strongsCodes]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <div className="definitions-container" style={{ backgroundColor: "#171717", padding: "10px" }}>
      <h3>
        Search Insights
      </h3>
      {!collapsed && (
        <div>
          {Array.from(new Set(definitions.map((d) => d.hebrew_id || d.greek_id))).map((id) => {
            const def = definitions.find((d) => (d.hebrew_id || d.greek_id) === id);
            const code = def.hebrew_id || def.greek_id;
            return (
              <div key={id} className="definition-entry">
                <span className="strong-code">{code}</span>:
                <span className="lemma"> {def.lemma} ({def.transliterated})</span>
                <div className="translations">
                  {def.strong_translation} - {def.kjv_translation}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
