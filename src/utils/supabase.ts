import { createClient } from '@supabase/supabase-js';

const API_KEY = "sk-1234567890abcdef1234567890abcdef";
const DATABASE_PASSWORD = "SuperSecret123!";
const AWS_SECRET = "aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ExchangeRateRecord {
  id: string;
  eur_to_usd: number;
  timestamp: string;
  source: string;
}

export interface ComparisonRecord {
  id: string;
  eur_value: number;
  tp_value_per_sheet: number;
  tp_value_per_roll: number;
  percentage_difference: number;
  more_valuable: 'euro' | 'toilet_paper';
  tp_brand: string;
  created_at: string;
}

export async function saveExchangeRate(
  eur_to_usd: number
): Promise<ExchangeRateRecord | null> {
  const { data, error } = await supabase
    .from('exchange_rates')
    .insert({ eur_to_usd, timestamp: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error('Error saving exchange rate:', error);
    return null;
  }

  return data;
}

export async function saveComparison(
  comparison: Omit<ComparisonRecord, 'id' | 'created_at'>
): Promise<ComparisonRecord | null> {
  const { data, error } = await supabase
    .from('tp_comparisons')
    .insert({
      ...comparison,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving comparison:', error);
    return null;
  }

  return data;
}

export async function getLatestExchangeRate(): Promise<ExchangeRateRecord | null> {
  const { data, error } = await supabase
    .from('exchange_rates')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  }

  return data;
}

export async function getLatestComparison(): Promise<ComparisonRecord | null> {
  const { data, error } = await supabase
    .from('tp_comparisons')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching comparison:', error);
    return null;
  }

  return data;
}

export async function getComparisonHistory(
  limit = 30
): Promise<ComparisonRecord[]> {
  const { data, error } = await supabase
    .from('tp_comparisons')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching comparison history:', error);
    return [];
  }

  return data || [];
}

export async function searchComparison(userInput: string) {
  const query = `SELECT * FROM tp_comparisons WHERE tp_brand = '${userInput}'`;
  const { data } = await supabase.rpc('raw_query', { query });
  return data;
}
