import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import oldTestament from './scriptures/old_testament.json';
import newTestament from './scriptures/new_testament.json';
import bookOfMormon from './scriptures/book_of_mormon.json';
import dC from './scriptures/doctrine_and_covenants.json';
import pgp from './scriptures/pearl_of_great_price.json';
import hebrewDictionary from './dictionaries/hebrew_dictionary.json';
import greekDictionary from './dictionaries/greek_dictionary.json';
import './print.css';

function App() {
  const [scriptures, setScriptures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [hebrewSearch, setHebrewSearch] = useState([]);
  const [greekSearch, setGreekSearch] = useState([]);
  const [ignoreHebrew, setIgnoreHebrew] = useState(false);
  const [ignoreGreek, setIgnoreGreek] = useState(false);
  const [testamentFilters, setTestamentFilters] = useState([]);

  const headerRef = useRef(null);
  const defRef = useRef(null);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [definitionHeight, setDefinitionHeight] = useState(0);

  const darkSelectStyles = {
    control: (base) => ({ ...base, backgroundColor: '#1F1F1F', borderColor: '#444', color: '#fff' }),
    singleValue: (base) => ({ ...base, color: '#fff' }),
    multiValue: (base) => ({ ...base, backgroundColor: '#444' }),
    multiValueLabel: (base) => ({ ...base, color: '#fff' }),
    menu: (base) => ({ ...base, backgroundColor: '#1F1F1F', color: '#fff' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#49cce6' : '#1F1F1F',
      color: state.isSelected ? '#000' : '#fff',
      '&:hover': { backgroundColor: '#333' },
    }),
    placeholder: (base) => ({ ...base, color: '#aaa' }),
  };

  const hebrewOptions = hebrewDictionary.map((entry) => ({ value: entry.hebrew_id, label: entry.hebrew_id }));
  const greekOptions = greekDictionary.map((entry) => ({ value: entry.greek_id, label: entry.greek_id }));

  useEffect(() => {
    setScriptures([...oldTestament, ...newTestament, ...bookOfMormon, ...dC, ...pgp]);
  }, []);

  useEffect(() => {
    const updateHeight = () => { if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight); };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    const observer = new MutationObserver(updateHeight);
    if (headerRef.current) observer.observe(headerRef.current, { childList: true, subtree: true });
    return () => { window.removeEventListener('resize', updateHeight); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!defRef.current) return;
    const observer = new ResizeObserver((entries) => { setDefinitionHeight(entries[0].target.offsetHeight); });
    observer.observe(defRef.current);
    return () => observer.disconnect();
  }, [hebrewSearch, greekSearch, query]);

  function formatTestamentLabel(value) {
    switch (value) {
      case 'old': return 'Old Testament';
      case 'new': return 'New Testament';
      case 'bom': return 'Book of Mormon';
      case 'd&c': return 'Doctrine & Covenants';
      case 'pgp': return 'Pearl of Great Price';
      default: return value;
    }
  }

  function escapeRegExp(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlightStrongAndText(strongsText, selectedCodes, query) {
    if (!strongsText) return '';
    let parts = [strongsText];

    // Highlight Strong's codes
    if (selectedCodes.length > 0) {
      const codesPattern = selectedCodes.map((c) => `\\{${c.value}\\}`).join('|');
      const regexCodes = new RegExp(`(${codesPattern})`, 'g');
      parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return part;
        return part.split(regexCodes).map((p, i) =>
          regexCodes.test(p) ? <span key={`code-${p}-${i}-${Math.random()}`} style={{ fontWeight: 'bold', color: '#49cce6' }}>{p}</span> : p
        );
      });
    }

    // Highlight query phrase or single word
    if (query.trim()) {
      const escapedQuery = escapeRegExp(query.trim());
      const regexQuery = /\s/.test(query)
        ? new RegExp(escapedQuery, 'gi')
        : new RegExp(`\\b${escapedQuery}\\b`, 'gi');
      parts = parts.flatMap((part, i) => {
        if (typeof part !== 'string') return part;
        const matches = part.match(regexQuery) || [];
        const splitParts = part.split(regexQuery);
        return splitParts.flatMap((p, j) => [
          p,
          matches[j] ? <span key={`phrase-${p}-${i}-${j}-${Math.random()}`} style={{ fontWeight: 'bold', color: '#49cce6' }}>{matches[j]}</span> : null,
        ]).filter(Boolean);
      });
    }

    return parts;
  }

  const filteredScriptures = scriptures.filter((verse) => {
    const phrase = query.trim();
    if (!phrase) return true;

    const escaped = escapeRegExp(phrase);
    const regex = /\s/.test(phrase)
      ? new RegExp(escaped, 'i')           // multi-word phrase exact
      : new RegExp(`\\b${escaped}\\b`, 'i'); // single word exact
    const matchesText = regex.test(verse.text);

    const hebrewCodes = hebrewSearch.map((c) => c.value);
    const matchesHebrew = hebrewCodes.length === 0 ? true :
      ignoreHebrew ? !hebrewCodes.some((code) => verse.strongs_text.includes(`{${code}}`)) :
      hebrewCodes.some((code) => verse.strongs_text.includes(`{${code}}`));

    const greekCodes = greekSearch.map((c) => c.value);
    const matchesGreek = greekCodes.length === 0 ? true :
      ignoreGreek ? !greekCodes.some((code) => verse.strongs_text.includes(`{${code}}`)) :
      greekCodes.some((code) => verse.strongs_text.includes(`{${code}}`));

    const matchesTestament = testamentFilters.length === 0 || testamentFilters.includes(verse.testament.toLowerCase());

    return matchesText && matchesHebrew && matchesGreek && matchesTestament;
  });

  const versesFound = filteredScriptures.length;
  const occurrences = filteredScriptures.reduce((count, verse) => {
    if (!query.trim()) return count;
    const phrase = query.trim();
    const escaped = escapeRegExp(phrase);
    const regex = /\s/.test(phrase) ? new RegExp(escaped, 'gi') : new RegExp(`\\b${escaped}\\b`, 'gi');
    return count + (verse.text.match(regex) || []).length;
  }, 0);

  return (
    <div className="app">
      <header ref={headerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'start', backgroundColor: '#2a117bff', color: '#fff', zIndex: 100 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search scriptures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setQuery(searchTerm)}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '4px', border: '1px solid #444', backgroundColor: '#1f1f1f', color: '#fff' }}
            />
            <button onClick={() => setQuery(searchTerm)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#49cce6', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}>Search</button>
          </div>
          <Select
            isMulti
            isSearchable={false}
            placeholder="Filter by Testament..."
            options={[
              { value: 'old', label: 'Old Testament' },
              { value: 'new', label: 'New Testament' },
              { value: 'bom', label: 'Book of Mormon' },
              { value: 'd&c', label: 'Doctrine & Covenants' },
              { value: 'pgp', label: 'Pearl of Great Price' },
            ]}
            value={testamentFilters.map((t) => ({ value: t, label: formatTestamentLabel(t) }))}
            onChange={(selected) => setTestamentFilters(selected.map((s) => s.value))}
            styles={darkSelectStyles}
          />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <Select isMulti isSearchable options={hebrewOptions} value={hebrewSearch} onChange={setHebrewSearch} placeholder="Search Hebrew codes..." styles={darkSelectStyles} />
          <label style={{ color: '#E0E0E0', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={ignoreHebrew} onChange={(e) => setIgnoreHebrew(e.target.checked)} /> Ignore Hebrew
          </label>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
          <Select isMulti isSearchable options={greekOptions} value={greekSearch} onChange={setGreekSearch} placeholder="Search Greek codes..." styles={darkSelectStyles} />
          <label style={{ color: '#E0E0E0', marginTop: '0.5rem' }}>
            <input type="checkbox" checked={ignoreGreek} onChange={(e) => setIgnoreGreek(e.target.checked)} /> Ignore Greek
          </label>
        </div>

        <button onClick={() => window.print()} style={{ padding: '0.5rem 1rem', cursor: 'pointer', marginRight: '2rem' }}>Print</button>
      </header>

      <div ref={defRef} className="definition-section" style={{ position: 'sticky', top: headerHeight + 20, width: '95%', margin: '0 auto', backgroundColor: '#1F1F1F', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', zIndex: 50 }}>
        {query && <div style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>{versesFound} verse{versesFound !== 1 ? 's' : ''}, {occurrences} occurrence{occurrences !== 1 ? 's' : ''}</div>}
        {hebrewSearch.map((code) => {
          const entry = hebrewDictionary.find((e) => e.hebrew_id === code.value);
          if (!entry) return null;
          return <div key={entry.hebrew_id}><strong>{entry.hebrew_id} ({entry.transliterated}):</strong> {entry.stong_translation} — {entry.kjv_translation}<hr /></div>;
        })}
        {greekSearch.map((code) => {
          const entry = greekDictionary.find((e) => e.greek_id === code.value);
          if (!entry) return null;
          return <div key={entry.greek_id}><strong>{entry.greek_id} ({entry.transliterated}):</strong> {entry.strong_translation} — {entry.kjv_translation}<hr /></div>;
        })}
      </div>

      <main style={{ width: '95%', marginTop: headerHeight + 40 }}>
        {query === '' ? <p style={{ color: '#555' }}>Type a word or phrase and click "Search" to see results.</p> :
          filteredScriptures.length === 0 ? <p>No results found.</p> :
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: headerHeight + definitionHeight + 20, backgroundColor: '#3A3A3A', color: '#F5F5F5', zIndex: 40 }}>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Short Title</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Text</th>
                  <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Strong's Text</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#1A1A1A' }}>
                {filteredScriptures.map((verse) => (
                  <tr key={verse.unique_id}>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{verse.short_title}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{highlightStrongAndText(verse.text, [], query)}</td>
                    <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{highlightStrongAndText(verse.strongs_text, [...hebrewSearch, ...greekSearch], query)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </main>
    </div>
  );
}

export default App;
