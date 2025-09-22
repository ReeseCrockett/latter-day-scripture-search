import React from "react";

export default function SearchResults({ results, searchTerm, showStrongs }) {
  const highlightText = (text) => {
    if (!searchTerm) return text;

    const regex = showStrongs
      ? new RegExp(`(${searchTerm}\\{[HG]\\d+\\})`, "gi")
      : new RegExp(`\\b(${searchTerm})\\b`, "gi");

    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} style={{ color: "#49cce6", fontWeight: "bold" }}>{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      {results.map((verse) => (
        <div key={verse.unique_id}>
          <div>{verse.short_title}</div>
          <div>{highlightText(showStrongs ? verse.strongs_text : verse.text)}</div>
        </div>
      ))}
    </div>
  );
}
