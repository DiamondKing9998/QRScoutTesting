// Node.js script to fetch TBA avatars and save as PNGs for self-hosting
// Usage: node fetch-avatars.js <TBA_API_KEY> <year> <team1> <team2> ...

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const [,, TBA_API_KEY, YEAR, ...TEAM_NUMBERS] = process.argv;
if (!TBA_API_KEY || !YEAR || TEAM_NUMBERS.length === 0) {
  console.error('Usage: node fetch-avatars.js <TBA_API_KEY> <year> <team1> <team2> ...');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '../public/icons');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function fetchAndSaveAvatar(teamNumber) {
  const url = `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/media/${YEAR}`;
  const response = await fetch(url, {
    headers: { 'X-TBA-Auth-Key': TBA_API_KEY },
  });
  if (!response.ok) {
    console.error(`Failed to fetch media for team ${teamNumber}`);
    return false;
  }
  const data = await response.json();
  const avatar = data.find(item => item.type === 'avatar' && item.details && item.details.base64Image);
  if (avatar && avatar.details && avatar.details.base64Image) {
    const buffer = Buffer.from(avatar.details.base64Image, 'base64');
    const outPath = path.join(OUT_DIR, `frc${teamNumber}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved avatar for team ${teamNumber} to ${outPath}`);
    return true;
  } else {
    console.log(`No avatar found for team ${teamNumber}`);
    return false;
  }
}

(async () => {
  for (const team of TEAM_NUMBERS) {
    await fetchAndSaveAvatar(team);
  }
})();
