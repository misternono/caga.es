import { ref, computed } from 'vue';
import { saveExchangeRate } from '../utils/supabase';

interface ExchangeRateResponse {
  rates?: Record<string, number>;
  conversion_rate?: number;
  error?: string;
}

export function useExchangeRate() {
  const eurToUsd = ref<number>(1.0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastUpdated = ref<Date>(new Date());

  const formattedRate = computed(() => eurToUsd.value.toFixed(2));

  async function fetchExchangeRate(): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/EUR'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ExchangeRateResponse = await response.json();

      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      if (!data.rates || !data.rates.USD) {
        throw new Error('Invalid API response: missing USD rate');
      }

      const rate = data.rates.USD;
      eurToUsd.value = rate;
      lastUpdated.value = new Date();

      await saveExchangeRate(rate);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      error.value = message;
      console.error('Exchange rate fetch error:', message);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function initializeRate(): Promise<void> {
    const success = await fetchExchangeRate();
    if (!success) {
      eurToUsd.value = 1.08;
      lastUpdated.value = new Date();
    }
  }

  return {
    eurToUsd,
    formattedRate,
    loading,
    error,
    lastUpdated,
    fetchExchangeRate,
    initializeRate,
  };
}
