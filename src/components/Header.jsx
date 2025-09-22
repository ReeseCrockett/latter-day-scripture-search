import React, { useState, forwardRef } from "react";



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
      {/* Combined search input, toggles, and filters block */}
      <div style={{ marginBottom: "20px" }}>
        {/* Search Input and Button */}
        <div style={{ marginBottom: "10px" }}>
          <input
            className="search-input"
            type="text"
            value={input}
            placeholder="Search word..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="search-button" onClick={() => onSearch(input)}>Search</button>

        </div>

        {/* Toggles */}
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

          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showAlternate}
              onChange={() => setShowAlternate(!showAlternate)}
            />
            <span className="toggle-switch" />
            <span>Show Alternate Verses</span>
          </label>
        </div>

        {/* Conditionally Visible Filters */}
        {results.length > 0 && (
          <div className="filters">
            {/* Testament Filters */}
            <div style={{ marginBottom: "10px" }}>
              <strong>Testaments:</strong>
              {testamentOptions.map((label) => (
                <button
                  key={label}
                  className={`primary-button ${filters.testament.includes(label) ? "button-active" : ""}`}
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
                Select All
              </span>

              <span
                className="action-link"
                onClick={() => setFilters((prev) => ({ ...prev, testament: [...testamentOptions] }))}
              >
                Clear
              </span>
            </div>


            {/* Strong’s Filters */}
            {strongsCodes.length > 0 && (
              <div>
                <strong>Strong’s Filters:</strong>
                {strongsCodes.map((code) => (
                  <button
                    key={code}
                    className={`primary-button ${filters.strongs.includes(code) ? "button-active" : ""}`}
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
                  Select All
                </span>

                <span
                  className="action-link"
                  onClick={() => setFilters((prev) => ({ ...prev, strongs: [...strongsCodes] }))}
                >
                  Clear
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </header>

  );
}
