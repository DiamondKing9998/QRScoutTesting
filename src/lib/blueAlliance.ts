// Utility to fetch team names from The Blue Alliance API
// Usage: getTeamName(teamNumber: number): Promise<string>

import { getCachedApiKey } from './blueAllianceApi';

const BLUE_ALLIANCE_API_BASE = 'https://www.thebluealliance.com/api/v3';

export async function getTeamName(teamNumber: number): Promise<string> {
  const apiKey = getCachedApiKey();
  if (!apiKey) {
    throw new Error('No TBA API key available. Please set an API key in the schedule viewer.');
  }

  const url = `${BLUE_ALLIANCE_API_BASE}/team/frc${teamNumber}`;
  const response = await fetch(url, {
    headers: {
      'X-TBA-Auth-Key': apiKey,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch team info for team ${teamNumber}`);
  }
  const data = await response.json();
  return data.nickname || `Team ${teamNumber}`;
}
