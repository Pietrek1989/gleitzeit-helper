export interface Week {
  id: number;
  weekTitle?: string;
}

export interface Day {
  id: number;
  weekTitle?: string;
  day: string; // Day of the week (e.g., "Monday", "Tuesday", etc.)
  start: string; // Start time for the day
  end: string; // End time for the day
  breakTime: string; // Lunch break duration
}
