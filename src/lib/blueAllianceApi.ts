/**
 * Blue Alliance API v3 utilities
 * Handles fetching event data, matches, and schedule info
 */

const TBA_BASE_URL = 'https://www.thebluealliance.com/api/v3';

export interface TBAMatch {
  key: string;
  match_number: number;
  event_key: string;
  comp_level: string; // 'qm' for qualification, 'ef', 'qf', 'sf', 'f' for playoffs
  alliances: {
    red: {
      team_keys: string[];
      score: number;
    };
    blue: {
      team_keys: string[];
      score: number;
    };
  };
  scheduled_time?: number;
  actual_time?: number;
}

export interface TBAEvent {
  key: string;
  name: string;
  year: number;
  event_code: string;
}

export interface MatchScheduleEntry {
  matchNumber: number;
  matchKey: string;
  red1: string;
  red2: string;
  red3: string;
  blue1: string;
  blue2: string;
  blue3: string;
}

export interface ScheduleHistory {
  eventId: string;
  eventName?: string;
  timestamp: number;
  schedule: MatchScheduleEntry[];
}


/**
 * Fetch event matches from TBA
 */
export async function fetchEventMatches(
  eventId: string,
  apiKey: string
): Promise<TBAMatch[]> {
  try {
    const response = await fetch(
      `${TBA_BASE_URL}/event/${eventId}/matches`,
      {
        headers: {
          'X-TBA-Auth-Key': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TBA API error: ${response.status} ${response.statusText}`);
    }

    const matches: TBAMatch[] = await response.json();
    return matches;
  } catch (error) {
    console.error('Error fetching TBA matches:', error);
    throw error;
  }
}

/**
 * Convert raw TBA matches to schedule format
 */
export function parseMatchSchedule(matches: TBAMatch[]): MatchScheduleEntry[] {
  // Only include qualification matches (ignore playoffs)
  return matches
    .filter(match => (match.comp_level === 'qm') || (match.key && match.key.includes('_qm')))
    .sort((a, b) => a.match_number - b.match_number)
    .map(match => ({
      matchNumber: match.match_number,
      matchKey: match.key,
      red1: match.alliances.red.team_keys[0]?.replace('frc', '') || '—',
      red2: match.alliances.red.team_keys[1]?.replace('frc', '') || '—',
      red3: match.alliances.red.team_keys[2]?.replace('frc', '') || '—',
      blue1: match.alliances.blue.team_keys[0]?.replace('frc', '') || '—',
      blue2: match.alliances.blue.team_keys[1]?.replace('frc', '') || '—',
      blue3: match.alliances.blue.team_keys[2]?.replace('frc', '') || '—',
    }));
}

/**
 * Get cached schedule from localStorage
 */
export function getCachedSchedule(
  eventId: string
): { schedule: MatchScheduleEntry[]; timestamp: number } | null {
  try {
    const cached = localStorage.getItem(`tba_schedule_${eventId}`);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/**
 * Save schedule to localStorage cache
 */
export function cacheSchedule(
  eventId: string,
  schedule: MatchScheduleEntry[]
): void {
  try {
    localStorage.setItem(
      `tba_schedule_${eventId}`,
      JSON.stringify({
        schedule,
        timestamp: Date.now(),
      })
    );
    // Also add to history
    addToScheduleHistory(eventId, schedule);
  } catch (error) {
    console.warn('Failed to cache schedule:', error);
  }
}

/**
 * Get all schedule history entries
 */
export function getScheduleHistory(): ScheduleHistory[] {
  try {
    const history = localStorage.getItem('tba_schedule_history');
    if (!history) return [];
    return JSON.parse(history);
  } catch {
    return [];
  }
}

/**
 * Add a schedule to the history
 */
export function addToScheduleHistory(
  eventId: string,
  schedule: MatchScheduleEntry[],
  eventName?: string
): void {
  try {
    const history = getScheduleHistory();
    // Remove duplicate if it exists (to avoid duplicates, keep latest)
    const filtered = history.filter(h => h.eventId !== eventId);
    const entry: ScheduleHistory = {
      eventId,
      eventName,
      timestamp: Date.now(),
      schedule,
    };
    filtered.push(entry);
    // Keep last 20 schedules
    const limited = filtered.slice(-20);
    localStorage.setItem('tba_schedule_history', JSON.stringify(limited));
  } catch (error) {
    console.warn('Failed to add to schedule history:', error);
  }
}

/**
 * Get a specific schedule from history
 */
export function getScheduleFromHistory(eventId: string): ScheduleHistory | null {
  try {
    const history = getScheduleHistory();
    return history.find(h => h.eventId === eventId) || null;
  } catch {
    return null;
  }
}

/**
 * Delete a schedule from history
 */
export function deleteFromScheduleHistory(eventId: string): void {
  try {
    const history = getScheduleHistory();
    const filtered = history.filter(h => h.eventId !== eventId);
    localStorage.setItem('tba_schedule_history', JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to delete from schedule history:', error);
  }
}


/**
 * Get cached API key from localStorage
 */
export function getCachedApiKey(): string | null {
  try {
    return localStorage.getItem('tba_api_key') || null;
  } catch {
    return null;
  }
}

/**
 * Save API key to localStorage
 */
export function cacheApiKey(apiKey: string): void {
  try {
    localStorage.setItem('tba_api_key', apiKey);
  } catch (error) {
    console.warn('Failed to cache API key:', error);
  }
}
