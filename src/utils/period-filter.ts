import type { PeriodFilter } from "@/types";

export const PERIODS: { label: string; value: PeriodFilter }[] = [
  { label: "Hari Ini", value: "daily" },
  { label: "Minggu Ini", value: "weekly" },
  { label: "Bulan Ini", value: "monthly" },
  { label: "Tahun Ini", value: "yearly" },
];
