import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createUploadSignature } from "@/lib/cloudinary/uploads";

export async function POST() {
  await requireAdmin();

  return NextResponse.json(createUploadSignature());
}