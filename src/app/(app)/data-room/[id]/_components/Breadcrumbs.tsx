"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import type { Folder } from "~/entities/folder/domain";

export function Breadcrumbs({
    dataRoomId,
    path,
    initialData,
}: {
    dataRoomId: string;
    path: string[];
    initialData: Folder[];
}) {
    const { data: folders } = api.folder.getByIds.useQuery(
        { ids: path },
        { initialData, enabled: path.length > 0 }
    );

    return (
        <div className="flex gap-2 items-center text-sm text-gray-500 mb-4">
            <Link href={`/data-room/${dataRoomId}`} className="hover:underline">
                Data Room
            </Link>
            {folders?.map((folder, index) => (
                <span key={folder.id} className="flex gap-2 items-center">
                    <span>/</span>
                    <Link
                        href={`/data-room/${dataRoomId}/${path.slice(0, index + 1).join("/")}`}
                        className="hover:underline"
                    >
                        {folder.name}
                    </Link>
                </span>
            ))}
        </div>
    );
}

export default Breadcrumbs;