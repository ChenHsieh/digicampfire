/*
  # Create shared poems table

  1. New Tables
    - `shared_poems`
      - `id` (uuid, primary key)
      - `whisper` (text, the poetic phrase from news)
      - `anchor` (text, the repeated word in the poem)
      - `feeling` (text, optional user feeling input)
      - `text` (text, the complete poem)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `shared_poems` table
    - Add policy for anyone to read shared poems
    - Add policy for anyone to insert new shared poems (anonymous sharing)
*/

CREATE TABLE IF NOT EXISTS shared_poems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whisper text NOT NULL,
  anchor text NOT NULL,
  feeling text,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shared_poems ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read shared poems (they are public)
CREATE POLICY "Anyone can read shared poems"
  ON shared_poems
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert new shared poems (anonymous sharing)
CREATE POLICY "Anyone can share poems"
  ON shared_poems
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create an index for better performance when ordering by creation date
CREATE INDEX IF NOT EXISTS shared_poems_created_at_idx ON shared_poems(created_at DESC);

-- Create an index for filtering by anchor word
CREATE INDEX IF NOT EXISTS shared_poems_anchor_idx ON shared_poems(anchor);