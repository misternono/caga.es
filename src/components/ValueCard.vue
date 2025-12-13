<script setup lang="ts">
defineProps<{
  title: string;
  mainValue: string;
  subValue?: string;
  icon: string;
  color: 'primary' | 'accent';
  highlight?: boolean;
}>();
</script>

<template>
  <div class="value-card" :class="{ highlight, [color]: true }">
    <div class="card-icon">{{ icon }}</div>
    <h2 class="card-title">{{ title }}</h2>
    <div class="card-value">{{ mainValue }}</div>
    <div v-if="subValue" class="card-sub-value">{{ subValue }}</div>
  </div>
</template>

<style scoped>
.value-card {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.value-card.highlight {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.value-card.primary {
  border-color: #2563eb;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
}

.value-card.primary.highlight {
  border-color: #1d4ed8;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
}

.value-card.accent {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.value-card.accent.highlight {
  border-color: #059669;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  display: inline-block;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.card-sub-value {
  font-size: 0.875rem;
  color: #9ca3af;
}

@media (max-width: 768px) {
  .value-card {
    padding: 16px;
  }

  .card-icon {
    font-size: 2rem;
  }

  .card-value {
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 0.75rem;
  }
}
</style>
