// ImageKit server-side helper — used by /api/admin/upload.
// Needs IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in .env.
import ImageKit from "imagekit";

let client: ImageKit | null = null;

export function getImageKit() {
  if (!client) {
    client = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
    });
  }
  return client;
}
