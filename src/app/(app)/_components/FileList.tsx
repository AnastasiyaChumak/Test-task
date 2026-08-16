"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import type { File } from "~/entities/file/domain";

export function FileList({ initialData, dataRoomId }: { initialData: File[]; dataRoomId: string }) {
    const utils = api.useUtils();
    const { data: files } = api.file.list.useQuery(
        { dataRoomId, folderId: null },
        { initialData }
    );

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="grid gap-3">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="border rounded-lg p-4 hover:bg-gray-50"
                        >
                            {file.name}
                        </div>
                    ))}
                    {files.length === 0 && (
                        <p className="text-gray-500">No files yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FileList;