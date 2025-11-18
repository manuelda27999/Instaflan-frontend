import cloudinary from "./cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret as string
  );

  return NextResponse.json({ signature });
}
