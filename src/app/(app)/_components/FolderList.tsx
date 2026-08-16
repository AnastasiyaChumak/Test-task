"use client";

import { api } from "~/trpc/react";
import type { Folder } from "~/entities/folder/domain";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import { useState } from "react";
import Link from "next/link";
import { X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/shared/ui/alert-dialog";

export function FolderList({
    initialData,
    dataRoomId,
    parentId,
    path,
}: {
    initialData: Folder[];
    dataRoomId: string;
    parentId: string | null;
    path: string[];
}) {
    const utils = api.useUtils();
    const { data: folders } = api.folder.list.useQuery(
        { dataRoomId, parentId },
        { initialData }
    );

    const [name, setName] = useState("");
    const createMutation = api.folder.create.useMutation({
        onSuccess: () => {
            setName("");
            void utils.folder.list.invalidate();
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const deleteMutation = api.folder.delete.useMutation({
        onSuccess: () => {
            console.log("invalidating file list");
            void utils.file.list.invalidate();
        },
    });

    const [countTarget, setCountTarget] = useState<string | null>(null);
    const { data: count } = api.folder.countSubtree.useQuery(
        { folderId: countTarget! },
        { enabled: !!countTarget }
    );

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New folder name"
                />
                <Button
                    onClick={() => name.trim() && createMutation.mutate({ name, dataRoomId, parentId })}
                    disabled={createMutation.isPending}
                >
                    Create
                </Button>
            </div>
            <div className="flex gap-2 mb-6">
                <div className="grid gap-3">
                    {folders.map((folder) => (
                        <div key={folder.id} className="flex items-center gap-2 border rounded-lg p-4">
                            <Link href={`/data-room/${dataRoomId}/${[...path, folder.id].join("/")}`} className="flex-1">
                                {folder.name}
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" onClick={() => setCountTarget(folder.id)}>
                                        <X />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete "{folder.name}"?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will delete {count?.folders ?? "..."} folder(s) and {count?.files ?? "..."} file(s) inside. This cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteMutation.mutate({ folderId: folder.id })}>
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
}

export default FolderList;