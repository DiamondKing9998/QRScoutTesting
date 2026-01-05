// Simple in-memory cache for team logos
const teamLogoCache: Record<number, string | null> = {};

import { getTeamLogoUrl } from './teamLogo';

// Use a generic FIRST logo as fallback (using a public icon as placeholder)
const GENERIC_FIRST_LOGO = '/icons/first-generic.png';

export async function getCachedTeamLogo(teamNumber: number): Promise<string> {
  if (teamLogoCache[teamNumber] !== undefined) {
    return teamLogoCache[teamNumber] || GENERIC_FIRST_LOGO;
  }
  const url = await getTeamLogoUrl(teamNumber);
  teamLogoCache[teamNumber] = url;
  return url || GENERIC_FIRST_LOGO;
}
