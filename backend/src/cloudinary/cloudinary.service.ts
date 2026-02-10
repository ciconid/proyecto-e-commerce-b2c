import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadStream } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
    constructor(private configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
            api_key: this.configService.get("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get("CLOUDINARY_API_SECRET")
        });
    }

    async uploadImage(file: Express.Multer.File): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: "ecommerce-products",
                resource_type: "auto"
            },
                (error, result) => {
                    if (error) return reject(error);

                    if (!result || !result.secure_url) {
                        return reject(new Error("Upload failed: no URL returned"));
                    }

                    resolve(result?.secure_url);
                })

            const stream = Readable.from(file.buffer);
            stream.pipe(uploadStream);
        });
    }

    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const publicId = this.extractPublicId(imageUrl);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        } catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }

    private extractPublicId(url: string): string | null {
        const matches = url.match(/\/ecommerce\/products\/([^/.]+)/);
        return matches ? `ecommerce/products/${matches[1]}` : null;
    }


}
