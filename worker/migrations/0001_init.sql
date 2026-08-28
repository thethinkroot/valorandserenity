CREATE TABLE tributes (
  token TEXT PRIMARY KEY,
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'family', 'community')),
  title TEXT NOT NULL,
  privacy_word_hash TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_tributes_visibility ON tributes (visibility);
