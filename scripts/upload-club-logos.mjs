/**
 * Script to download field hockey club logos and upload them to Cloudinary
 * Matches the public_id paths expected in prisma/seed.ts
 *
 * Run with: node scripts/upload-club-logos.mjs
 */

import { v2 as cloudinary } from "cloudinary";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure Cloudinary from the env var
const CLOUDINARY_URL =
  process.env.CLOUDINARY_URL ||
  "cloudinary://678129465428692:mREg_hKlVrwvJPEcSsIJQg3RoG8@dlv9qzhzr";

const match = CLOUDINARY_URL.match(
  /cloudinary:\/\/(\d+):([^@]+)@([a-zA-Z0-9_-]+)/
);
if (!match) {
  console.error("❌ Invalid CLOUDINARY_URL");
  process.exit(1);
}

cloudinary.config({
  cloud_name: match[3],
  api_key: match[1],
  api_secret: match[2],
});

console.log(`☁️  Cloudinary cloud: ${match[3]}\n`);

// ---------------------------------------------------------------------------
// Club definitions: name -> { publicId, logoUrl }
// publicId must match what's in seed.ts (without /image/upload/vXXXX/ prefix)
// ---------------------------------------------------------------------------
const clubs = [
  {
    name: "Club de Campo Villa de Madrid",
    publicId: "hockey-connect/clubs/ccvm_logo",
    // Official logo from Wikimedia / open sources
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Club_de_Campo_Villa_de_Madrid.svg/200px-Club_de_Campo_Villa_de_Madrid.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Club_de_Campo_Villa_de_Madrid.svg",
  },
  {
    name: "RC Polo Barcelona",
    publicId: "hockey-connect/clubs/rcpolo_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/RC_Polo_Barcelona.svg/200px-RC_Polo_Barcelona.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/RC_Polo_Barcelona.svg",
  },
  {
    name: "Real Club de Polo",
    publicId: "hockey-connect/clubs/realclubpolo_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/RC_Polo_Barcelona.svg/200px-RC_Polo_Barcelona.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/RC_Polo_Barcelona.svg",
  },
  {
    name: "CD Terrassa HC",
    publicId: "hockey-connect/clubs/cdterrassa_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/CD_Terrassa_logo.svg/200px-CD_Terrassa_logo.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/en/b/b8/CD_Terrassa_logo.svg",
  },
  {
    name: "Atlètic Terrassa HC",
    publicId: "hockey-connect/clubs/atleticterrassa_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Atletico_Terrassa.png/200px-Atletico_Terrassa.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Atletico_Terrassa.png",
  },
  {
    name: "Club Atlético San Isidro",
    publicId: "hockey-connect/clubs/sanisidro_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/San_isidro_logo.png/200px-San_isidro_logo.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/10/San_isidro_logo.png",
  },
  {
    name: "Club Atletico Belgrano",
    publicId: "hockey-connect/clubs/belgrano_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Escudo_del_Club_Atletico_Belgrano.svg/200px-Escudo_del_Club_Atletico_Belgrano.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/52/Escudo_del_Club_Atletico_Belgrano.svg",
  },
  {
    name: "Gimnasia y Esgrima Buenos Aires",
    publicId: "hockey-connect/clubs/gimnasia_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Escudo_del_Club_de_Gimnasia_y_Esgrima_de_Buenos_Aires.svg/200px-Escudo_del_Club_de_Gimnasia_y_Esgrima_de_Buenos_Aires.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/ab/Escudo_del_Club_de_Gimnasia_y_Esgrima_de_Buenos_Aires.svg",
  },
  {
    name: "Club Italiano",
    publicId: "hockey-connect/clubs/italiano_logo",
    // Generic Italian sports club; use a hockey-themed placeholder from a public CDN
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Club_Italiano_de_Buenos_Aires.svg/200px-Club_Italiano_de_Buenos_Aires.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c6/Club_Italiano_de_Buenos_Aires.svg",
  },
  {
    name: "Lomas Athletic Club",
    publicId: "hockey-connect/clubs/lomas_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Lomas_Athletic_Club_badge.svg/200px-Lomas_Athletic_Club_badge.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Lomas_Athletic_Club_badge.svg",
  },
  {
    name: "HC Rotterdam",
    publicId: "hockey-connect/clubs/rotterdam_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/HC_Rotterdam.svg/200px-HC_Rotterdam.svg.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/HC_Rotterdam.svg",
  },
  {
    name: "Amsterdam HC",
    publicId: "hockey-connect/clubs/amsterdam_logo",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Amsterdam_HC_logo.png/200px-Amsterdam_HC_logo.png",
    fallbackUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Amsterdam_HC_logo.png",
  },
];

// ---------------------------------------------------------------------------
// Helper: download a URL into a tmp file
// ---------------------------------------------------------------------------
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(destPath);
    let redirectCount = 0;

    function get(currentUrl) {
      const options = {
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      };

      proto.get(currentUrl, options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          if (++redirectCount > 5) return reject(new Error("Too many redirects"));
          file.destroy();
          const newProto = res.headers.location.startsWith("https") ? https : http;
          newProto.get(res.headers.location, options, (res2) => {
            res2.pipe(file);
            file.on("finish", () => file.close(resolve));
            file.on("error", reject);
          });
          return;
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${currentUrl}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
        file.on("error", reject);
      }).on("error", reject);
    }
    get(url);
  });
}

// ---------------------------------------------------------------------------
// Helper: upload a local file to Cloudinary with a specific public_id
// ---------------------------------------------------------------------------
async function uploadToCloudinary(filePath, publicId) {
  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
    // Keep original format but convert to PNG for consistency
    format: "png",
  });
  return result.secure_url;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const tmpDir = path.join(__dirname, "..", ".tmp-logos");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

console.log("📥 Downloading and uploading club logos...\n");

const results = [];

for (const club of clubs) {
  const ext = club.logoUrl.includes(".svg") ? "svg" : "png";
  const tmpFile = path.join(tmpDir, `${path.basename(club.publicId)}.${ext}`);

  process.stdout.write(`  ⏳ ${club.name}... `);

  let downloaded = false;

  // Try primary URL
  try {
    await downloadFile(club.logoUrl, tmpFile);
    downloaded = true;
  } catch (e) {
    // Try fallback
    try {
      await downloadFile(club.fallbackUrl, tmpFile);
      downloaded = true;
    } catch (e2) {
      console.log(`❌ Download failed: ${e2.message}`);
      results.push({ club: club.name, status: "FAILED", error: e2.message });
      continue;
    }
  }

  if (!downloaded) continue;

  // Upload to Cloudinary
  try {
    const url = await uploadToCloudinary(tmpFile, club.publicId);
    console.log(`✅ ${url}`);
    results.push({ club: club.name, status: "OK", url });
    fs.unlinkSync(tmpFile);
  } catch (e) {
    console.log(`❌ Upload failed: ${e.message}`);
    results.push({ club: club.name, status: "UPLOAD_FAILED", error: e.message });
  }
}

// Cleanup tmp dir
try { fs.rmdirSync(tmpDir); } catch (_) {}

console.log("\n📊 Summary:");
console.table(results.map(r => ({ Club: r.club, Status: r.status, URL: r.url || r.error })));

const failed = results.filter(r => r.status !== "OK");
if (failed.length > 0) {
  console.log(`\n⚠️  ${failed.length} clubs failed. You may need to upload their logos manually.`);
  process.exit(1);
} else {
  console.log("\n🎉 All club logos uploaded successfully!");
}
