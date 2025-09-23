import React, { useState, useEffect } from "react";

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 960);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch(input);
  };

  return (
    <header>
      {/* Top section: search input and Strong's toggle */}
      <div style={{ marginBottom: "20px" }}>
        <h1 className="app-title">Latter-Day Scripture Search</h1>
        <div className="search-bar-container">
          <div className="search-top-row">
            <input
              className="search-input"
              type="text"
              value={input}
              placeholder="Search word..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="search-button" onClick={() => onSearch(input)}>
              Search
            </button>
          </div>
        </div>

        {/* Conditionally visible filters */}
        {results.length > 0 && (!isMobile || showMobileFilters) && (
          <div className="filters">
            {/* Testament Filters */}
            <div style={{ marginBottom: "10px" }}>
              <strong>Book:</strong>
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
                Select All
              </span>
              <span
                className="action-link"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, testament: [...testamentOptions] }))
                }
              >
                Clear
              </span>
            </div>

            {/* Strong’s Filters */}
            {strongsCodes.length > 0 && (
              <div>
                <strong>Code:</strong>
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

      {/* Bottom toggles: icon buttons flush left/right */}
      <div className="bottom-toggles">
        {/* Definitions Icon */}
        <button
          className={`icon-toggle ${showDefinitions ? "active" : ""}`}
          onClick={() => setShowDefinitions(!showDefinitions)}
          title="Show Definitions"
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

        {/* Strong's Codes Toggle (as icon button) */}
        <button
          className={`icon-toggle ${showStrongs ? "active" : ""}`}
          onClick={() => setShowStrongs(!showStrongs)}
          title="Show Strong’s Codes"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <text
              x="12"
              y="70%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="20"
              fontFamily="Arial, serif"
            >
              S
            </text>
          </svg>
        </button>

        {/* Filter Toggle Button (mobile) */}
        {isMobile && (
          <button
            className={`icon-toggle ${showMobileFilters ? "active" : ""}`}
            onClick={() => setShowMobileFilters((prev) => !prev)}
            title={showMobileFilters ? "Hide Filters" : "Show Filters"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <text
                x="12"
                y="70%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="currentColor"
                fontSize="20"
                fontFamily="Arial, serif"
              >
                F
              </text>
            </svg>
          </button>
        )}


        {/* Alternate Verses Icon */}
        <button
          className={`icon-toggle alternate-toggle ${showAlternate ? "active" : ""}`}
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
