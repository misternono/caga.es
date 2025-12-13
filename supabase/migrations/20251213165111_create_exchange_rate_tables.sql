/*
  # Create Exchange Rate and Comparison Tables

  1. New Tables
    - `exchange_rates`
      - `id` (uuid, primary key)
      - `eur_to_usd` (numeric, stores the exchange rate)
      - `timestamp` (timestamptz, when the rate was fetched)
      - `source` (text, API source)
    
    - `tp_comparisons`
      - `id` (uuid, primary key)
      - `eur_value` (numeric, EUR exchange rate at time)
      - `tp_value_per_sheet` (numeric, calculated TP value)
      - `tp_value_per_roll` (numeric, calculated TP value for full roll)
      - `percentage_difference` (numeric, % more valuable)
      - `more_valuable` (text, 'euro' or 'toilet_paper')
      - `tp_brand` (text, type of toilet paper)
      - `created_at` (timestamptz, timestamp of comparison)

  2. Security
    - Enable RLS on both tables
    - Add policy to allow public read access
    - No write access for public users
*/

CREATE TABLE IF NOT EXISTS exchange_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eur_to_usd numeric(10, 6) NOT NULL,
  timestamp timestamptz DEFAULT now(),
  source text DEFAULT 'exchangerate-api.com'
);

CREATE TABLE IF NOT EXISTS tp_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  eur_value numeric(10, 6) NOT NULL,
  tp_value_per_sheet numeric(10, 8) NOT NULL,
  tp_value_per_roll numeric(10, 6) NOT NULL,
  percentage_difference numeric(10, 2) NOT NULL,
  more_valuable text CHECK (more_valuable IN ('euro', 'toilet_paper')),
  tp_brand text DEFAULT 'standard',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_timestamp ON exchange_rates(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tp_comparisons_created_at ON tp_comparisons(created_at DESC);

ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tp_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exchange rates are publicly readable"
  ON exchange_rates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "TP comparisons are publicly readable"
  ON tp_comparisons
  FOR SELECT
  TO public
  USING (true);