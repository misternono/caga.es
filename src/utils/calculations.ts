export interface ToiletPaperConfig {
  name: string;
  pricePerRoll: number;
  sheetsPerRoll: number;
}

export const TP_BRANDS: Record<string, ToiletPaperConfig> = {
  standard: {
    name: 'Standard Roll',
    pricePerRoll: 0.5,
    sheetsPerRoll: 200,
  },
  premium: {
    name: 'Premium Quality',
    pricePerRoll: 1.2,
    sheetsPerRoll: 300,
  },
  budget: {
    name: 'Budget Roll',
    pricePerRoll: 0.25,
    sheetsPerRoll: 150,
  },
  luxury: {
    name: 'Luxury Brand',
    pricePerRoll: 2.5,
    sheetsPerRoll: 500,
  },
};

export function calculateToiletPaperValue(
  config: ToiletPaperConfig
): {
  valuePerSheet: number;
  valuePerRoll: number;
} {
  const valuePerSheet = config.pricePerRoll / config.sheetsPerRoll;
  const valuePerRoll = config.pricePerRoll;

  return { valuePerSheet, valuePerRoll };
}

export function compareValues(
  eurRate: number,
  tpValuePerSheet: number
): {
  percentageDifference: number;
  moreValuable: 'euro' | 'toilet_paper';
  ratio: number;
} {
  const ratio = eurRate / tpValuePerSheet;
  const percentageDifference =
    ((Math.abs(eurRate - tpValuePerSheet) / eurRate) * 100);

  const moreValuable = eurRate > tpValuePerSheet ? 'euro' : 'toilet_paper';

  return {
    percentageDifference,
    moreValuable,
    ratio,
  };
}

export function formatCurrency(value: number, decimals = 2): string {
  return `$${value.toFixed(decimals)}`;
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}
