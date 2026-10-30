import { v2 as cloudinary } from "cloudinary";

import { getCloudinaryEnv } from "@/lib/env";

const { cloudName, apiKey, apiSecret } = getCloudinaryEnv();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };