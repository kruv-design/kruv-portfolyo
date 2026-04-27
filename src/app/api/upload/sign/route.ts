import { NextResponse } from "next/server";
import { buildUploadSignature } from "@/lib/cloudinary";
import { requireUser } from "@/lib/auth-guard";

export async function POST() {
  try {
    await requireUser();
  } catch (res) {
    return res as Response;
  }
  const sig = buildUploadSignature();
  return NextResponse.json({ data: sig });
}
