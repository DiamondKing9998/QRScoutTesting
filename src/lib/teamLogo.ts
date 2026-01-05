// Utility to fetch team logo URL from The Blue Alliance API
// Usage: getTeamLogoUrl(teamNumber: number): Promise<string | null>

const BLUE_ALLIANCE_API_BASE = 'https://www.thebluealliance.com/api/v3';
const BLUE_ALLIANCE_API_KEY = 'WECk4nqehq4gxN5LWHvG7KbYkKOswHtXwqrhH8tpoooVcyyN33UX6vnJBB8F10Q6';

export async function getTeamLogoUrl(teamNumber: number): Promise<string | null> {
  const currentYear = new Date().getFullYear();
  // Only use the TBA media API (base64 avatar, CORS-safe)
  const url = `${BLUE_ALLIANCE_API_BASE}/team/frc${teamNumber}/media/${currentYear}`;
  const response = await fetch(url, {
    headers: {
      'X-TBA-Auth-Key': BLUE_ALLIANCE_API_KEY,
    },
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  // Look for avatar type and use base64 if present
  const avatar = data.find((item: any) => item.type === 'avatar' && item.details && item.details.base64);
  if (avatar && avatar.details && avatar.details.base64) {
    return `data:image/png;base64,${avatar.details.base64}`;
  }
  // Fallback: look for a media item with a direct_url
  const firstImage = data.find((item: any) => item.direct_url);
  return firstImage ? firstImage.direct_url : null;
}
