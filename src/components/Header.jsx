import React, { useState } from "react";

export default function Header({
  onSearch,
  showStrongs,
  setShowStrongs,
  filters,
  setFilters,
  strongsCodes,
  results,
  showAlternate,
  setShowAlternate,
  showDefinitions,
  setShowDefinitions,
}) {
  const [input, setInput] = useState("");
  const testamentOptions = ["Old", "New", "BOM", "D&C", "PGP"];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch(input);
  };

  return (
    <header>
      {/* Top section: search input and Strong's toggle */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
          <input
            className="search-input"
            type="text"
            value={input}
            placeholder="Search word..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="search-button"
            onClick={() => onSearch(input)}
          >
            Search
          </button>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showStrongs}
              onChange={() => setShowStrongs(!showStrongs)}
            />
            <span className="toggle-switch" />
            <span>Show Strong’s Text</span>
          </label>
        </div>

        {/* Conditionally visible filters */}
        {results.length > 0 && (
          <div className="filters">
            {/* Testament Filters */}
            <div style={{ marginBottom: "10px" }}>
              <strong>Testaments:</strong>
              {testamentOptions.map((label) => (
                <button
                  key={label}
                  className={`primary-button ${filters.testament.includes(label) ? "button-active" : ""
                    }`}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      testament: prev.testament.includes(label)
                        ? prev.testament.filter((t) => t !== label)
                        : [...prev.testament, label],
                    }))
                  }
                  style={{ margin: "0 4px" }}
                >
                  {label}
                </button>
              ))}

              <span
                className="action-link"
                onClick={() => setFilters((prev) => ({ ...prev, testament: [] }))}
              >
                Clear
              </span>
              <span
                className="action-link"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, testament: [...testamentOptions] }))
                }
              >
                Select All
              </span>
            </div>

            {/* Strong’s Filters */}
            {strongsCodes.length > 0 && (
              <div>
                <strong>Strong’s Filters:</strong>
                {strongsCodes.map((code) => (
                  <button
                    key={code}
                    className={`primary-button ${filters.strongs.includes(code) ? "button-active" : ""
                      }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        strongs: prev.strongs.includes(code)
                          ? prev.strongs.filter((c) => c !== code)
                          : [...prev.strongs, code],
                      }))
                    }
                    style={{ margin: "0 4px" }}
                  >
                    {code}
                  </button>
                ))}

                <span
                  className="action-link"
                  onClick={() => setFilters((prev) => ({ ...prev, strongs: [] }))}
                >
                  Clear
                </span>

                <span
                  className="action-link"
                  onClick={() => setFilters((prev) => ({ ...prev, strongs: [...strongsCodes] }))}
                >
                  Select All
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom toggles: icon buttons flush left/right */}
      <div className="bottom-toggles">
        {/* Definitions */}
        <button
          className={`icon-toggle ${showAlternate ? "active" : ""}`}
          onClick={() => setShowDefinitions(!showDefinitions)}
          title="Show Alternate Verses"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <text
              x="12"
              y="70%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="26"
              fontFamily="Arial, serif"
            >
              A
            </text>
          </svg>
        </button>

        {/* Alternate Verses */}
        <button
          className={`icon-toggle ${showAlternate ? "active" : ""}`}
          onClick={() => setShowAlternate(!showAlternate)}
          title="Show Alternate Verses"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <text
              x="12"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="26"
              fontFamily="Arial, serif"
            >
              א
            </text>
          </svg>
        </button>
      </div>
    </header>
  );
}
