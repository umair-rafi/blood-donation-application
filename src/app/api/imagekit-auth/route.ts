import { createHmac, randomUUID } from "crypto";

export async function GET() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    return Response.json(
      { error: "ImageKit private key not configured" },
      { status: 500 },
    );
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400;
  const signature = createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  return Response.json({ token, expire, signature });
}
