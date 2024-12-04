import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});


const uploadImageToCloudinary = async (image) => {
    if (!image) throw new Error("Image is required for upload");

    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

    try {
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "binkeyit" },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return uploadResult;
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw new Error("Failed to upload image");
    }
};

export { uploadImageToCloudinary };
