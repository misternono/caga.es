<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useExchangeRate } from '../composables/useExchangeRate';
import {
  TP_BRANDS,
  calculateToiletPaperValue,
  compareValues,
  formatCurrency,
  type ToiletPaperConfig,
} from '../utils/calculations';
import { saveComparison } from '../utils/supabase';
import ValueCard from './ValueCard.vue';
import ComparisonIndicator from './ComparisonIndicator.vue';

const {
  eurToUsd,
  formattedRate,
  loading,
  error,
  lastUpdated,
  fetchExchangeRate,
  initializeRate,
} = useExchangeRate();

const selectedBrand = ref<string>('standard');
const refreshing = ref(false);
const autoRefreshInterval = ref<number | null>(null);

const selectedTpConfig = computed<ToiletPaperConfig>(
  () => TP_BRANDS[selectedBrand.value]
);

const tpValues = computed(() => calculateToiletPaperValue(selectedTpConfig.value));

const comparison = computed(() =>
  compareValues(eurToUsd.value, tpValues.value.valuePerSheet)
);

const formattedLastUpdated = computed(() => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - lastUpdated.value.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)} h ago`;
});

const brandOptions = computed(() =>
  Object.entries(TP_BRANDS).map(([key, value]) => ({
    key,
    label: value.name,
  }))
);

async function handleRefresh(): Promise<void> {
  refreshing.value = true;
  await fetchExchangeRate();

  if (!error.value && eurToUsd.value > 0) {
    await saveComparison({
      eur_value: eurToUsd.value,
      tp_value_per_sheet: tpValues.value.valuePerSheet,
      tp_value_per_roll: tpValues.value.valuePerRoll,
      percentage_difference: comparison.value.percentageDifference,
      more_valuable: comparison.value.moreValuable,
      tp_brand: selectedBrand.value,
    });
  }

  refreshing.value = false;
}

function startAutoRefresh(): void {
  autoRefreshInterval.value = window.setInterval(() => {
    handleRefresh();
  }, 60000);
}

function stopAutoRefresh(): void {
  if (autoRefreshInterval.value !== null) {
    clearInterval(autoRefreshInterval.value);
    autoRefreshInterval.value = null;
  }
}

onMounted(async () => {
  await initializeRate();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<template>
  <div class="currency-comparison">
    <header class="header">
      <h1 class="title">Euro vs Toilet Paper Value Tracker</h1>
      <p class="subtitle">A humorous comparison of real-world values</p>
    </header>

    <div class="controls">
      <div class="brand-selector">
        <label for="brand-select">Toilet Paper Type:</label>
        <select
          id="brand-select"
          v-model="selectedBrand"
          class="select-input"
        >
          <option
            v-for="brand in brandOptions"
            :key="brand.key"
            :value="brand.key"
          >
            {{ brand.label }}
          </option>
        </select>
      </div>

      <button
        class="refresh-button"
        :disabled="loading || refreshing"
        @click="handleRefresh"
      >
        <span v-if="loading || refreshing" class="spinner"></span>
        <span v-else>⟳</span>
        {{ refreshing ? 'Refreshing...' : 'Refresh Now' }}
      </button>
    </div>

    <div v-if="error" class="error-banner">
      <p>{{ error }}</p>
    </div>

    <div class="values-grid">
      <ValueCard
        title="Euro Value"
        :main-value="formatCurrency(eurToUsd)"
        sub-value="Current EUR to USD"
        icon="💶"
        color="primary"
        :highlight="comparison.moreValuable === 'euro'"
      />

      <ValueCard
        title="Toilet Paper Value"
        :main-value="formatCurrency(tpValues.valuePerSheet, 4)"
        :sub-value="`Per sheet (${selectedTpConfig.name})`"
        icon="🧻"
        color="accent"
        :highlight="comparison.moreValuable === 'toilet_paper'"
      />
    </div>

    <ComparisonIndicator
      :more-valuable="comparison.moreValuable"
      :percentage-difference="comparison.percentageDifference"
      :eur-value="eurToUsd"
      :tp-value="tpValues.valuePerSheet"
    />

    <div class="additional-info">
      <div class="info-card">
        <h3>Roll Statistics</h3>
        <p>
          <strong>Price per roll:</strong> {{ formatCurrency(selectedTpConfig.pricePerRoll) }}
        </p>
        <p>
          <strong>Sheets per roll:</strong> {{ selectedTpConfig.sheetsPerRoll }}
        </p>
        <p>
          <strong>Value per roll:</strong> {{ formatCurrency(tpValues.valuePerRoll) }}
        </p>
      </div>

      <div class="info-card">
        <h3>Exchange Info</h3>
        <p>
          <strong>Base Rate:</strong> 1 EUR = {{ formattedRate }} USD
        </p>
        <p>
          <strong>Last Updated:</strong> {{ formattedLastUpdated }}
        </p>
        <p class="note">
          Data updates automatically every 60 seconds
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.currency-comparison {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.controls {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.brand-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-selector label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.select-input {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select-input:hover {
  border-color: #2563eb;
}

.select-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.refresh-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.error-banner {
  background-color: #fee2e2;
  border: 2px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
}

.error-banner p {
  margin: 0;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.additional-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
}

.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.info-card h3 {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.info-card p {
  font-size: 0.875rem;
  color: #4b5563;
  margin: 8px 0;
}

.info-card p:first-of-type {
  margin-top: 0;
}

.info-card strong {
  color: #1f2937;
}

.note {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 8px;
  font-style: italic;
}

@media (max-width: 768px) {
  .currency-comparison {
    padding: 0 12px;
  }

  .title {
    font-size: 1.875rem;
  }

  .controls {
    flex-direction: column;
    gap: 12px;
  }

  .brand-selector {
    width: 100%;
    justify-content: space-between;
  }

  .select-input {
    flex: 1;
  }

  .refresh-button {
    width: 100%;
    justify-content: center;
  }

  .values-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .additional-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
