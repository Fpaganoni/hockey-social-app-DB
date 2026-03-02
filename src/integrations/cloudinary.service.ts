import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
  constructor() {
    if (process.env.CLOUDINARY_URL) {
      cloudinary.config({ secure: true });
    }
  }

  async uploadBase64(base64: string, folder = "app") {
    const result = await cloudinary.uploader.upload(base64, { folder });
    return result;
  }

  async uploadPdf(base64: string, folder = "cvs") {
    const result = await cloudinary.uploader.upload(base64, {
      folder,
      resource_type: "raw", // required for non-image files like PDFs
      format: "pdf",
    });
    return result;
  }
}
