"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";

export function FileUpload({
    dataRoomId,
    folderId,
}: {
    dataRoomId: string;
    folderId: string | null;
}) {
    const utils = api.useUtils();
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const createFileMutation = api.file.create.useMutation({
        onSuccess: () => void utils.file.list.invalidate(),
    });

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        try {
            const blob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/upload",
                onUploadProgress: (event) => setProgress(event.percentage),
            });

            await createFileMutation.mutateAsync({
                name: file.name,
                blobUrl: blob.url,
                size: file.size,
                mimeType: file.type,
                dataRoomId,
                folderId,
            });
        } finally {
            setUploading(false);
        }
    }


    return (
        <div className="mb-4">
            <input type="file" onChange={(e) => void handleFileChange(e)} disabled={uploading} />
            {uploading && <p className="text-sm text-gray-500">Uploading... {progress}%</p>}
        </div>
    );
}

export default FileUpload;