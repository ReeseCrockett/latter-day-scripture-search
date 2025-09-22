import { useState } from "react";

export default function Header({
  onSearch,
  showStrongs,
  setShowStrongs,
  showAlternate,
  setShowAlternate,
  filters,
  setFilters,
  strongsCodes,
  results,
}) {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch(input);
  };

  const testamentOptions = ["Old", "New", "BOM", "D&C", "PGP"];

  return (
    <header>
      <input
        type="text"
        value={input}
        placeholder="Search word..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button onClick={() => onSearch(input)}>Search</button>
      <button onClick={() => setShowStrongs(!showStrongs)}>
        {showStrongs ? "Show Normal Text" : "Show Strongs Text"}
      </button>
      <button onClick={() => setShowAlternate(!showAlternate)}>
        {showAlternate ? "Hide Alternate Verses" : "Show Alternate Verses"}
      </button>

      {results.length > 0 && (
        <div className="filters" style={{ marginTop: "10px" }}>
          {/* Testament Filters */}
          <div style={{ marginBottom: "5px" }}>
            <strong>Testaments:</strong>
            {testamentOptions.map((label) => (
              <button
                key={label}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    testament: prev.testament.includes(label)
                      ? prev.testament.filter((t) => t !== label)
                      : [...prev.testament, label],
                  }))
                }
                style={{
                  backgroundColor: filters.testament.includes(label) ? "#555" : "#49cce6",
                  color: "white",
                  margin: "0 4px",
                }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setFilters((prev) => ({ ...prev, testament: [] }))}
              style={{ marginLeft: "10px", backgroundColor: "#999", color: "white" }}
            >
              Clear
            </button>
          </div>

          {/* Strong's Filters */}
          {strongsCodes.length > 0 && (
            <div style={{ marginBottom: "5px" }}>
              <strong>Strong’s Filters:</strong>
              {strongsCodes.map((code) => (
                <button
                  key={code}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      strongs: prev.strongs.includes(code)
                        ? prev.strongs.filter((c) => c !== code)
                        : [...prev.strongs, code],
                    }))
                  }
                  style={{
                    backgroundColor: filters.strongs.includes(code) ? "#555" : "#49cce6",
                    color: "white",
                    margin: "0 4px",
                  }}
                >
                  {code}
                </button>
              ))}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, strongs: [] }))}
                style={{ marginLeft: "10px", backgroundColor: "#999", color: "white" }}
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
