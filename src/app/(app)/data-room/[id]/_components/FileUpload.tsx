"use client";

import { useState, useRef } from "react";
import { upload } from "@vercel/blob/client";
import { api } from "~/trpc/react";

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
    const inputRef = useRef<HTMLInputElement>(null);

    const createFileMutation = api.file.create.useMutation({
        onSuccess: () => void utils.file.list.invalidate(),
        onError: (error) => alert(error.message),
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
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="mb-4">
            <input
                type="file"
                ref={inputRef}
                onChange={(e) => void handleFileChange(e)}
                disabled={uploading}
                className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white file:text-sm hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
            />
            {uploading && <p className="text-sm text-gray-500 pt-2">Uploading... {progress}%</p>}
        </div>
    );
}

export default FileUpload;
