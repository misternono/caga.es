<script setup lang="ts">
import { computed } from 'vue';

const { moreValuable, eurValue, tpValue } = defineProps<{
  moreValuable: 'euro' | 'toilet_paper';
  percentageDifference: number;
  eurValue: number;
  tpValue: number;
}>();

const resultText = computed(() => {
  if (Math.abs(eurValue - tpValue) < 0.01) {
    return 'They\'re basically equal!';
  }
  return moreValuable === 'euro'
    ? 'Euro is more valuable'
    : 'Toilet paper is more valuable!';
});

const euroPercentageMore = computed(() => {
  const diff = eurValue - tpValue;
  return ((diff / tpValue) * 100).toFixed(1);
});
</script>

<template>
  <div class="comparison-indicator">
    <div class="indicator-content">
      <h3 class="indicator-title">Comparison Result</h3>
      <p class="indicator-text" :class="moreValuable">
        {{ resultText }}
      </p>
      <div class="percentage">
        <span class="percent-value">{{ Math.abs(percentageDifference).toFixed(1) }}%</span>
        <span class="percent-label">more valuable</span>
      </div>
      <div class="fun-fact">
        <p v-if="moreValuable === 'euro'" class="fact-text">
          1 Euro is worth {{ euroPercentageMore }}% more than one sheet of standard toilet paper!
        </p>
        <p v-else class="fact-text">
          A single sheet of toilet paper is worth {{ euroPercentageMore }}% more than 1 Euro!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comparison-indicator {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #e5e7eb;
}

.indicator-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.indicator-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0;
}

.indicator-text {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
}

.indicator-text.euro {
  color: #2563eb;
  background-color: #eff6ff;
}

.indicator-text.toilet_paper {
  color: #10b981;
  background-color: #f0fdf4;
}

.percentage {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.percent-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
}

.percent-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.fun-fact {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: left;
}

.fact-text {
  font-size: 0.875rem;
  color: #92400e;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .comparison-indicator {
    padding: 16px;
  }

  .indicator-text {
    font-size: 1.125rem;
  }

  .percent-value {
    font-size: 1.5rem;
  }
}
</style>
