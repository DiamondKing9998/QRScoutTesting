
// Use a generic FIRST logo as fallback (using a public icon as placeholder)
const BASE = import.meta.env.BASE_URL || '/';
const GENERIC_FIRST_LOGO = `${BASE}icons/first-generic.png`;

const logoCache: Record<number, string> = {};

export async function getCachedTeamLogo(teamNumber: number): Promise<string> {
  if (logoCache[teamNumber]) {
    return logoCache[teamNumber];
  }
  // Only run in browser
  if (typeof window === 'undefined') {
    return GENERIC_FIRST_LOGO;
  }
  try {
    const year = new Date().getFullYear();
    const url = `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/media/${year}`;
    const response = await fetch(url, {
      headers: { 'X-TBA-Auth-Key': 'WECk4nqehq4gxN5LWHvG7KbYkKOswHtXwqrhH8tpoooVcyyN33UX6vnJBB8F10Q6' },
    });
    if (!response.ok) throw new Error('TBA fetch failed');
    const data = await response.json();
    const avatar = data.find((item: any) => item.type === 'avatar' && item.details && item.details.base64Image);
    if (avatar && avatar.details && avatar.details.base64Image) {
      const dataUrl = `data:image/png;base64,${avatar.details.base64Image}`;
      logoCache[teamNumber] = dataUrl;
      return dataUrl;
    }
  } catch (e) {
    // ignore
  }
  logoCache[teamNumber] = GENERIC_FIRST_LOGO;
  return GENERIC_FIRST_LOGO;
}
