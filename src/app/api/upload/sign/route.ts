import { NextResponse } from "next/server";
import { buildUploadSignature } from "@/lib/cloudinary";
import { requireUser, isAuthFailureResponse } from "@/lib/auth-guard";

export async function POST() {
  try {
    await requireUser();
  } catch (e) {
    if (isAuthFailureResponse(e)) return e;
    throw e;
  }
  const sig = buildUploadSignature();
  return NextResponse.json({ data: sig });
}
