import React, { useEffect, useRef } from "react";
import hebrewDict from "../dictionaries/hebrew_dictionary.json";
import greekDict from "../dictionaries/greek_dictionary.json";

export default function DefinitionsPopup({ code, position, onClose }) {
  const popupRef = useRef(null);

  const upperCode = code.toUpperCase();
  let def = null;

  if (upperCode.startsWith("H")) {
    def = hebrewDict.find((d) => d.hebrew_id.toUpperCase() === upperCode);
  } else if (upperCode.startsWith("G")) {
    def = greekDict.find((d) => d.greek_id.toUpperCase() === upperCode);
  }

  // Close if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!def) return null;

  const style = {
    position: "fixed",
    top: position.y + 5,
    left: position.x,
    background: "#171717",
    color: "white",
    border: "1px solid #49cce6",
    padding: "10px",
    borderRadius: "5px",
    zIndex: 1000,
    maxWidth: "250px",
    boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
  };

  return (
    <div ref={popupRef} style={style}>
      <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#49cce6" }}>
        {def.hebrew_id || def.greek_id} - {def.lemma} ({def.transliterated})
      </div>
      <div>Strong's Translation: {def.strong_translation}</div>
      <div>KJV Translation: {def.kjv_translation}</div>
      <div style={{ fontStyle: "italic", marginTop: "5px" }}>Click outside to close</div>
    </div>
  );
}
