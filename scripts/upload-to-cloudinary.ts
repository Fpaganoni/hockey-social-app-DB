import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";
import * as path from "path";

config();

// Configure Cloudinary explicitly
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (!cloudinaryUrl) {
  console.error("❌ CLOUDINARY_URL not found in .env file!");
  process.exit(1);
}

// Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
const matches = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
if (!matches) {
  console.error("❌ Invalid CLOUDINARY_URL format!");
  console.error("Expected format: cloudinary://api_key:api_secret@cloud_name");
  process.exit(1);
}

cloudinary.config({
  cloud_name: matches[3],
  api_key: matches[1],
  api_secret: matches[2],
  secure: true,
});

console.log(`✅ Cloudinary configured for: ${matches[3]}\n`);

async function uploadImagesToCloudinary() {
  console.log("🌥️  Starting Cloudinary upload...\n");

  const imagesDir = path.join(__dirname, "..", "public", "images");
  const imageFiles = [
    "hockey_action.png",
    "hockey_training.png",
    "hockey_celebration.png",
    "hockey_goalkeeper.png",
    "hockey_equipment.png",
    "hockey_match.png",
    "hockey_youth.png",
    "hockey_stadium.png",
    "hockey_victory.png",
    "hockey_practice.png",
  ];

  const uploadedUrls: { file: string; url: string }[] = [];

  for (const fileName of imageFiles) {
    try {
      const filePath = path.join(imagesDir, fileName);

      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        continue;
      }

      console.log(`📤 Uploading ${fileName}...`);

      const result = await cloudinary.uploader.upload(filePath, {
        folder: "hockey-connect/posts",
        public_id: path.parse(fileName).name,
        overwrite: true,
        resource_type: "image",
      });

      uploadedUrls.push({
        file: fileName,
        url: result.secure_url,
      });

      console.log(`✅ Uploaded: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${fileName}:`, error);
    }
  }

  console.log("\n🎉 Upload complete!\n");
  console.log("📋 URLs for seed.ts:\n");
  console.log("const postImages = [");
  uploadedUrls.forEach((item) => {
    console.log(`  "${item.url}", // ${item.file.replace(".png", "")}`);
  });
  console.log("];\n");

  // Save URLs to a JSON file for reference
  const outputPath = path.join(__dirname, "cloudinary-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`💾 URLs saved to: ${outputPath}\n`);
}

uploadImagesToCloudinary().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
