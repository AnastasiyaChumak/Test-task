import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";

export async function POST(request: Request): Promise<NextResponse> {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async () => {
            return {
                allowedContentTypes: [
                    "application/pdf",
                    "image/*",
                    "text/*",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/msword",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ],
                addRandomSuffix: true,
            };
        },
        onUploadCompleted: async ({ blob }) => {
            console.log("upload completed", blob.url);
        },
    });

    return NextResponse.json(jsonResponse);
}