"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #111111;
    color: #ffffff;
    font-family: 'IBM Plex Sans', sans-serif;
    min-height: 100vh;
  }


  /* HERO */


  .hero {
    max-width: 700px;
    margin: 4rem auto 3rem;
    padding: 0 2rem;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    letter-spacing: -1px;
    line-height: 1.1;
    margin-bottom: 2rem;
  }

  /* SEARCH */


  .search-row {
    display: flex;
    gap: 0.5rem;
    max-width: 500px;
    margin: 0 auto;
  }
  .search-input {
    flex: 1;
    border: 1px solid #000;
    border-radius: 0;
    padding: 0.7rem 1rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.875rem;
    outline: none;
    background: #fff;
    color: #000;
  }
  .search-input::placeholder { color: #999; }
  .search-input:focus { outline: 2px solid #000; outline-offset: -1px; }
  .search-btn {
    background: #000;
    color: #fff;
    border: none;
    padding: 0.7rem 1.25rem;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .search-btn:hover { opacity: 0.75; }

  /* SECTION */


  .section {
    max-width: 900px;
    margin: 3rem auto 0;
    padding: 0 2rem 4rem;
  }
  .section-title {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #ffffff;
  }

  /* CARDS */


  .card-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .card {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1.25rem 0;
    border-bottom: 1px solid #e0e0e0;
    text-decoration: none;
    color: inherit;
    transition: background 0.1s;
    gap: 1.5rem;
  }
  .card:hover { background: #000000; padding-left: 0.5rem; }
  .card-left { flex: 1; min-width: 0; }
  .card-num {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    color: #999;
    margin-bottom: 0.3rem;
  }
  .card-title {
    font-size: 0.975rem;
    font-weight: 700;
    margin-bottom: 0.35rem;
  }
  .card-desc {
    font-size: 0.825rem;
    color: #555;
    line-height: 1.55;
  }
  .card-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    flex-shrink: 0;
  }
  .difficulty {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: 1px solid #000;
    padding: 0.15rem 0.5rem;
  }
  .tags {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .tag {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: #888;
  }
  .tag + .tag::before { content: '·'; margin-right: 0.35rem; }

  .empty {
    color: #999;
    font-size: 0.875rem;
    padding: 2rem 0;
  }
`;

// ── CARD ─────────────────────────────────────────────────────────────────────
function ProblemCard({ problem }) {
  const { problemId, title, description, tags } = problem;
  return (
    <Link href={`/solve/${problemId}`} className="card">
      <div className="card-left">
        <div className="card-title">{title}</div>
        <div className="card-desc">{description}</div>
      </div>
      <div className="card-right">
        {/* <div className="tags"> */}
        {/* {tags.map((t) => <span key={t} className="tag">{t}</span>)} */}
      </div>
      {/* </div> */}
    </Link>
  );
}

// ── HOME ─────────────────────────────────────────────────────────────────────
export default function HomeClient({ problems }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    console.log("query:", query);
    console.log("problems:", problems);

    if (!query.trim()) return problems;
    const q = query.toLowerCase();
    return problems.filter(({ title, description }) =>
      `${title} ${description}`.toLowerCase().includes(q),
    );
  }, [problems, query]);

  return (
    <>
      <style>{styles}</style>

      <section className="hero">
        <h1>Coding Problems</h1>
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search problems..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>
      </section>

      <div className="section">
        <div className="section-title">Problems — {visible.length} results</div>
        <div className="card-list">
          {visible.length === 0 ? (
            <p className="empty">No problems match your search.</p>
          ) : (
            visible.map((p) => <ProblemCard key={p.problemId} problem={p} />)
          )}
        </div>
      </div>
    </>
  );
}
