export interface MonthlySummaryResponse {
  income: number;
  expense: number;
  balance: number;
  byCategory: Record<string, number>;
}

export interface TimelinePoint {
  month: string;   // ex: "2025-09"
  balance: number;
}

export interface BalanceTimelineResponse {
  timeline: TimelinePoint[];
}
