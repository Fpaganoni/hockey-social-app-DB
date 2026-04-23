/**
 * Generates SVG club logos and uploads them to Cloudinary.
 * Run with: node scripts/generate-and-upload-logos.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dlv9qzhzr",
  api_key: "678129465428692",
  api_secret: "mREg_hKlVrwvJPEcSsIJQg3RoG8",
});

// ---------------------------------------------------------------------------
// Club logo definitions
// Each club gets a unique color scheme and initials
// ---------------------------------------------------------------------------
const clubs = [
  {
    publicId: "hockey-connect/clubs/ccvm_logo",
    abbr: "CCVM",
    line1: "CLUB DE CAMPO",
    line2: "VILLA DE MADRID",
    primary: "#1a5c2e",   // Dark green
    secondary: "#c8a84b", // Gold
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/rcpolo_logo",
    abbr: "RCP",
    line1: "RC POLO",
    line2: "BARCELONA",
    primary: "#003399",   // Blue
    secondary: "#cc0000", // Red
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/realclubpolo_logo",
    abbr: "RCP",
    line1: "REAL CLUB",
    line2: "DE POLO",
    primary: "#1a237e",   // Dark blue
    secondary: "#ffd600", // Yellow
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/cdterrassa_logo",
    abbr: "CDT",
    line1: "CD TERRASSA",
    line2: "HC",
    primary: "#b71c1c",   // Dark red
    secondary: "#212121", // Black
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/atleticterrassa_logo",
    abbr: "ATC",
    line1: "ATLÈTIC",
    line2: "TERRASSA HC",
    primary: "#0d47a1",   // Blue
    secondary: "#ffffff", // White
    accent: "#0d47a1",
  },
  {
    publicId: "hockey-connect/clubs/sanisidro_logo",
    abbr: "CASI",
    line1: "CLUB ATL.",
    line2: "SAN ISIDRO",
    primary: "#1a237e",   // Dark navy
    secondary: "#ffd600", // Gold
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/belgrano_logo",
    abbr: "CAB",
    line1: "CLUB AT.",
    line2: "BELGRANO",
    primary: "#1565c0",   // Sky blue
    secondary: "#ffffff", // White
    accent: "#1565c0",
  },
  {
    publicId: "hockey-connect/clubs/gimnasia_logo",
    abbr: "GEBA",
    line1: "GIMNASIA",
    line2: "Y ESGRIMA BA",
    primary: "#283593",   // Blue
    secondary: "#e53935", // Red
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/italiano_logo",
    abbr: "CI",
    line1: "CLUB",
    line2: "ITALIANO",
    primary: "#2e7d32",   // Italian green
    secondary: "#c62828", // Italian red
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/lomas_logo",
    abbr: "LAC",
    line1: "LOMAS",
    line2: "ATHLETIC CLUB",
    primary: "#4a148c",   // Purple
    secondary: "#ffd600", // Yellow
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/rotterdam_logo",
    abbr: "HCR",
    line1: "HC",
    line2: "ROTTERDAM",
    primary: "#bf360c",   // Dutch orange-red
    secondary: "#212121", // Black
    accent: "#ffffff",
  },
  {
    publicId: "hockey-connect/clubs/amsterdam_logo",
    abbr: "AHC",
    line1: "AMSTERDAM",
    line2: "HC",
    primary: "#b71c1c",   // Red (Amsterdam city color)
    secondary: "#212121", // Black
    accent: "#ffffff",
  },
];

// ---------------------------------------------------------------------------
// SVG template — professional circular badge with hockey stick icon
// ---------------------------------------------------------------------------
function makeSvg(club) {
  const { abbr, line1, line2, primary, secondary, accent } = club;
  // Determine font sizes based on text length
  const abbrSize = abbr.length <= 3 ? 42 : abbr.length === 4 ? 36 : 28;
  const lineSize = Math.max(10, Math.min(13, Math.floor(160 / Math.max(line1.length, line2.length))));

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <clipPath id="circle">
      <circle cx="100" cy="100" r="95"/>
    </clipPath>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${primary}dd;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Outer ring -->
  <circle cx="100" cy="100" r="98" fill="${secondary}" />
  <!-- Inner ring -->
  <circle cx="100" cy="100" r="93" fill="${primary}" />
  <!-- Second decorative ring -->
  <circle cx="100" cy="100" r="88" fill="none" stroke="${secondary}" stroke-width="2"/>

  <!-- Field hockey stick silhouette (simplified) -->
  <g clip-path="url(#circle)" opacity="0.12">
    <!-- Stick shaft -->
    <rect x="88" y="20" width="8" height="100" rx="4" fill="${accent}" transform="rotate(-15 100 80)"/>
    <!-- Stick hook -->
    <ellipse cx="70" cy="128" rx="18" ry="8" fill="${accent}" transform="rotate(-15 70 128)"/>
  </g>

  <!-- Top arc text background -->
  <path id="topArc" d="M 15,100 a 85,85 0 0,1 170,0" fill="none"/>
  <!-- Bottom arc text background -->
  <path id="bottomArc" d="M 20,105 a 80,80 0 0,0 160,0" fill="none"/>

  <!-- Abbreviation in center -->
  <text x="100" y="108" 
        font-family="'Arial Black', 'Arial', sans-serif" 
        font-size="${abbrSize}" 
        font-weight="900"
        fill="${accent}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="1">${abbr}</text>

  <!-- Top banner -->
  <rect x="10" y="56" width="180" height="22" rx="2" fill="${secondary}" opacity="0.9"/>
  <text x="100" y="67" 
        font-family="'Arial', sans-serif" 
        font-size="${lineSize}" 
        font-weight="700"
        fill="${primary}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="0.5">${line1}</text>

  <!-- Bottom banner -->
  <rect x="10" y="122" width="180" height="22" rx="2" fill="${secondary}" opacity="0.9"/>
  <text x="100" y="133" 
        font-family="'Arial', sans-serif" 
        font-size="${lineSize}" 
        font-weight="700"
        fill="${primary}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="0.5">${line2}</text>

  <!-- Stars decoration -->
  <text x="100" y="158" font-size="10" fill="${secondary}" text-anchor="middle" opacity="0.9">★  ★  ★</text>

  <!-- Outer glow ring -->
  <circle cx="100" cy="100" r="98" fill="none" stroke="${secondary}" stroke-width="1.5" opacity="0.6"/>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const tmpDir = path.join(__dirname, "..", ".tmp-logos");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

console.log("🎨 Generating SVG logos and uploading to Cloudinary...\n");

const results = [];

for (const club of clubs) {
  const name = path.basename(club.publicId);
  const svgPath = path.join(tmpDir, `${name}.svg`);

  // Write SVG
  fs.writeFileSync(svgPath, makeSvg(club));
  process.stdout.write(`  ⏳ ${name}... `);

  try {
    const result = await cloudinary.uploader.upload(svgPath, {
      public_id: club.publicId,
      overwrite: true,
      resource_type: "image",
      format: "png",
      // Rasterize the SVG at 400x400 for crisp display
      transformation: [{ width: 400, height: 400, crop: "pad", background: "white" }],
    });
    console.log(`✅ ${result.secure_url}`);
    results.push({ name, status: "OK", url: result.secure_url });
    fs.unlinkSync(svgPath);
  } catch (e) {
    console.log(`❌ ${e.message}`);
    results.push({ name, status: "FAILED", error: e.message });
  }
}

// Cleanup tmp dir
try { fs.rmdirSync(tmpDir); } catch (_) {}

console.log("\n📊 Results:");
console.table(results.map(r => ({ Name: r.name, Status: r.status, Detail: r.url || r.error })));

const failed = results.filter(r => r.status !== "OK");
if (failed.length === 0) {
  console.log("\n🎉 All logos uploaded! You can now re-seed the database.");
  console.log("   Run: pnpm seed\n");
} else {
  console.log(`\n⚠️  ${failed.length} failed.`);
  process.exit(1);
}
