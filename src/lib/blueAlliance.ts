// Utility to fetch team names from The Blue Alliance API
// Usage: getTeamName(teamNumber: number): Promise<string>

const BLUE_ALLIANCE_API_BASE = 'https://www.thebluealliance.com/api/v3';
// TODO: Replace with your actual Blue Alliance API key
const BLUE_ALLIANCE_API_KEY = 'WECk4nqehq4gxN5LWHvG7KbYkKOswHtXwqrhH8tpoooVcyyN33UX6vnJBB8F10Q6';

export async function getTeamName(teamNumber: number): Promise<string> {
  const url = `${BLUE_ALLIANCE_API_BASE}/team/frc${teamNumber}`;
  const response = await fetch(url, {
    headers: {
      'X-TBA-Auth-Key': BLUE_ALLIANCE_API_KEY,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch team info for team ${teamNumber}`);
  }
  const data = await response.json();
  return data.nickname || `Team ${teamNumber}`;
}
