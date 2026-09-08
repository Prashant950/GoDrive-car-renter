/**
 * Exact Duration-Based Discount Pricing Calculator for GoDrive Backend
 * Matches the official GoDrive rate sheet for all vehicle models.
 */

export const PRESET_CAR_SLABS = {
  safari: {
    base: 5000,
    price3to7Days: 4500,
    price7to15Days: 4000,
    price15to20Days: 3500,
    price20to29Days: 3300,
    price1to3Months: 70000,
    price3to6Months: 65000,
    priceMoreThan6Months: 60000,
  },
  hyryder: {
    base: 3500,
    price3to7Days: 3000,
    price7to15Days: 2700,
    price15to20Days: 2500,
    price20to29Days: 2250,
    price1to3Months: 55000,
    price3to6Months: 50000,
    priceMoreThan6Months: 45000,
  },
  vitara: {
    base: 3500,
    price3to7Days: 3000,
    price7to15Days: 2700,
    price15to20Days: 2500,
    price20to29Days: 2250,
    price1to3Months: 55000,
    price3to6Months: 50000,
    priceMoreThan6Months: 45000,
  },
  victoris: {
    base: 3200,
    price3to7Days: 2800,
    price7to15Days: 2500,
    price15to20Days: 2300,
    price20to29Days: 2150,
    price1to3Months: 52000,
    price3to6Months: 48000,
    priceMoreThan6Months: 43000,
  },
  creta: {
    base: 3800,
    price3to7Days: 3300,
    price7to15Days: 2900,
    price15to20Days: 2600,
    price20to29Days: 2400,
    price1to3Months: 58000,
    price3to6Months: 55000,
    priceMoreThan6Months: 50000,
  },
  ertiga: {
    base: 3500,
    price3to7Days: 3200,
    price7to15Days: 3000,
    price15to20Days: 2800,
    price20to29Days: 2500,
    price1to3Months: 60000,
    price3to6Months: 56000,
    priceMoreThan6Months: 52000,
  },
  rumion: {
    base: 3500,
    price3to7Days: 3200,
    price7to15Days: 3000,
    price15to20Days: 2800,
    price20to29Days: 2500,
    price1to3Months: 60000,
    price3to6Months: 56000,
    priceMoreThan6Months: 52000,
  },
  innova: {
    base: 5500,
    price3to7Days: 5000,
    price7to15Days: 4500,
    price15to20Days: 4200,
    price20to29Days: 3800,
    price1to3Months: 75000,
    price3to6Months: 70000,
    priceMoreThan6Months: 65000,
  },
  fortuner: {
    base: 10000,
    price3to7Days: 9500,
    price7to15Days: 9000,
    price15to20Days: 8500,
    price20to29Days: 8000,
    price1to3Months: 150000,
    price3to6Months: 140000,
    priceMoreThan6Months: 130000,
  },
  thar: {
    base: 5500,
    price3to7Days: 5000,
    price7to15Days: 4500,
    price15to20Days: 4200,
    price20to29Days: 3800,
    price1to3Months: 75000,
    price3to6Months: 70000,
    priceMoreThan6Months: 65000,
  },
  scorpio: {
    base: 5500,
    price3to7Days: 5000,
    price7to15Days: 4500,
    price15to20Days: 4200,
    price20to29Days: 4000,
    price1to3Months: 75000,
    price3to6Months: 70000,
    priceMoreThan6Months: 65000,
  },
  baleno: {
    base: 2300,
    price3to7Days: 2100,
    price7to15Days: 1900,
    price15to20Days: 1700,
    price20to29Days: 1500,
    price1to3Months: 40000,
    price3to6Months: 35000,
    priceMoreThan6Months: 30000,
  },
  fronx: {
    base: 2500,
    price3to7Days: 2300,
    price7to15Days: 2050,
    price15to20Days: 1850,
    price20to29Days: 1700,
    price1to3Months: 42000,
    price3to6Months: 37000,
    priceMoreThan6Months: 32000,
  },
  swift: {
    base: 2000,
    price3to7Days: 1800,
    price7to15Days: 1650,
    price15to20Days: 1500,
    price20to29Days: 1350,
    price1to3Months: 35000,
    price3to6Months: 30000,
    priceMoreThan6Months: 27000,
  },
};

const round50 = (val) => Math.round(val / 50) * 50;

/**
 * Resolves rates for any vehicle - either from vehicle DB fields, matching preset, or proportional fallback
 */
export function resolveVehicleTierRates(vehicle = {}) {
  const base = vehicle.pricePerDay || 3000;
  const name = (vehicle.name || "").toLowerCase();

  // 1. Check if DB has custom tier fields populated
  if (vehicle.price3to7Days && vehicle.price3to7Days > 0) {
    return {
      base: vehicle.pricePerDay || base,
      price3to7Days: vehicle.price3to7Days,
      price7to15Days: vehicle.price7to15Days || round50(base * 0.8),
      price15to20Days: vehicle.price15to20Days || round50(base * 0.7),
      price20to29Days: vehicle.price20to29Days || round50(base * 0.65),
      price1to3Months: vehicle.price1to3Months || round50(base * 15),
      price3to6Months: vehicle.price3to6Months || round50(base * 14),
      priceMoreThan6Months: vehicle.priceMoreThan6Months || round50(base * 13),
    };
  }

  // 2. Check matched name preset from rate sheet
  for (const [key, preset] of Object.entries(PRESET_CAR_SLABS)) {
    if (name.includes(key)) {
      return {
        base: vehicle.pricePerDay || preset.base,
        price3to7Days: preset.price3to7Days,
        price7to15Days: preset.price7to15Days,
        price15to20Days: preset.price15to20Days,
        price20to29Days: preset.price20to29Days,
        price1to3Months: preset.price1to3Months,
        price3to6Months: preset.price3to6Months,
        priceMoreThan6Months: preset.priceMoreThan6Months,
      };
    }
  }

  // 3. Dynamic proportional fallback for any generic vehicle added to DB
  return {
    base,
    price3to7Days: round50(base * 0.9),
    price7to15Days: round50(base * 0.8),
    price15to20Days: round50(base * 0.7),
    price20to29Days: round50(base * 0.65),
    price1to3Months: round50(base * 15),
    price3to6Months: round50(base * 14),
    priceMoreThan6Months: round50(base * 13),
  };
}

/**
 * Calculates dynamic rent, applicable slab rate, savings, and total for any duration
 */
export function calculateVehicleRent(vehicle = {}, days = 1, withDriver = false) {
  const safeDays = Math.max(1, parseInt(days) || 1);
  const tiers = resolveVehicleTierRates(vehicle);
  const driverRate = withDriver ? (vehicle.withDriverPrice ?? 800) : 0;

  let tierName = "0-3 Days (Standard)";
  let dailyRate = tiers.base;
  let isMonthly = false;
  let totalVehicleRent = 0;

  if (safeDays >= 1 && safeDays <= 3) {
    tierName = "0 - 3 Days (Standard Rate)";
    dailyRate = tiers.base;
    totalVehicleRent = dailyRate * safeDays;
  } else if (safeDays > 3 && safeDays <= 7) {
    tierName = "3 - 7 Days Slab";
    dailyRate = tiers.price3to7Days;
    totalVehicleRent = dailyRate * safeDays;
  } else if (safeDays > 7 && safeDays <= 15) {
    tierName = "7 - 15 Days Slab";
    dailyRate = tiers.price7to15Days;
    totalVehicleRent = dailyRate * safeDays;
  } else if (safeDays > 15 && safeDays <= 20) {
    tierName = "15 - 20 Days Slab";
    dailyRate = tiers.price15to20Days;
    totalVehicleRent = dailyRate * safeDays;
  } else if (safeDays > 20 && safeDays < 30) {
    tierName = "20 - 29 Days Slab";
    dailyRate = tiers.price20to29Days;
    totalVehicleRent = dailyRate * safeDays;
  } else if (safeDays >= 30 && safeDays < 90) {
    tierName = "1 - 3 Months Monthly Subscription";
    isMonthly = true;
    const monthlyRate = tiers.price1to3Months;
    dailyRate = Math.round(monthlyRate / 30);
    totalVehicleRent = Math.round((monthlyRate / 30) * safeDays);
  } else if (safeDays >= 90 && safeDays <= 180) {
    tierName = "3 - 6 Months Long-Term";
    isMonthly = true;
    const monthlyRate = tiers.price3to6Months;
    dailyRate = Math.round(monthlyRate / 30);
    totalVehicleRent = Math.round((monthlyRate / 30) * safeDays);
  } else {
    tierName = ">6 Months Executive Long-Term";
    isMonthly = true;
    const monthlyRate = tiers.priceMoreThan6Months;
    dailyRate = Math.round(monthlyRate / 30);
    totalVehicleRent = Math.round((monthlyRate / 30) * safeDays);
  }

  const driverTotal = driverRate * safeDays;
  const estimatedTotal = totalVehicleRent + driverTotal;
  const standardTotalWithoutDiscount = (tiers.base + driverRate) * safeDays;
  const savings = Math.max(0, standardTotalWithoutDiscount - estimatedTotal);
  const discountPercent = tiers.base > 0 ? Math.round(((tiers.base - dailyRate) / tiers.base) * 100) : 0;

  return {
    days: safeDays,
    baseDailyRate: tiers.base,
    effectiveDailyRate: dailyRate,
    driverDailyRate: driverRate,
    driverTotal,
    tierName,
    isMonthly,
    totalVehicleRent,
    estimatedTotal,
    standardTotalWithoutDiscount,
    savings,
    discountPercent: Math.max(0, discountPercent),
    tiers,
  };
}
