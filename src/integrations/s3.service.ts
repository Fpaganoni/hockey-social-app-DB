import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadBuffer(buffer: Buffer, keyPrefix = 'uploads') {
    const Key = `${keyPrefix}/${uuidv4()}`;
    await this.s3.upload({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key,
      Body: buffer,
    }).promise();
    return Key;
  }
}
