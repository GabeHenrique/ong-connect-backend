import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>("AWS_REGION");
    const accessKeyId = this.configService.get<string>("AWS_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>(
      "AWS_SECRET_ACCESS_KEY",
    );
    const endpoint = this.configService.get<string>("AWS_ENDPOINT"); // Add this line to get the endpoint from the .env file
    if (!region || !accessKeyId || !secretAccessKey) {
      throw new Error("AWS credentials not properly configured");
    }

    this.s3Client = new S3Client({
      forcePathStyle: true,
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket: string =
      this.configService.get("AWS_BUCKET_NAME") || "ong-connect";
    const key = `${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    await this.s3Client.send(command);

    return `https://iefmybeqnivniklaxpbo.supabase.co/storage/v1/object/public/ong-connect//${key}`;
  }

  async deleteFile(url: string) {
    const bucket: string =
      this.configService.get("AWS_BUCKET_NAME") || "ong-connect";

    const key = url.split(
      `https://iefmybeqnivniklaxpbo.supabase.co/storage/v1/object/public/ong-connect//`,
    )[1];

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
    await this.s3Client.send(command);
    } catch (error) {
      console.log(error); 
    }
  }
}
