// Simple in-memory cache for team names
const teamNameCache: Record<number, string> = {};

import { getTeamName as fetchTeamName } from './blueAlliance';

export async function getCachedTeamName(teamNumber: number): Promise<string> {
  if (teamNameCache[teamNumber]) {
    return teamNameCache[teamNumber];
  }
  const name = await fetchTeamName(teamNumber);
  teamNameCache[teamNumber] = name;
  return name;
}
