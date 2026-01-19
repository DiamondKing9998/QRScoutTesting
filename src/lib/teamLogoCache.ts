
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
    // Import getCachedApiKey dynamically to avoid circular dependencies
    const { getCachedApiKey } = await import('./blueAllianceApi');
    const apiKey = getCachedApiKey();
    if (!apiKey) {
      // No API key available, return generic logo
      logoCache[teamNumber] = GENERIC_FIRST_LOGO;
      return GENERIC_FIRST_LOGO;
    }

    const year = new Date().getFullYear();
    const url = `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/media/${year}`;
    const response = await fetch(url, {
      headers: { 'X-TBA-Auth-Key': apiKey },
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
