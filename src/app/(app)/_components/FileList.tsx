"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import type { File } from "~/entities/file/domain";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/shared/ui/select";

export function FileList({
    dataRoomId,
    folderId,
}: {
    dataRoomId: string;
    folderId: string | null;
}) {
    const utils = api.useUtils();
    const { data: files } = api.file.list.useQuery({ dataRoomId, folderId });

    const deleteMutation = api.file.delete.useMutation({
        onSuccess: () => void utils.file.list.invalidate(),
    });

    const { data: allFolders } = api.folder.listAll.useQuery({ dataRoomId });

    const moveMutation = api.file.move.useMutation({
        onSuccess: () => void utils.file.list.invalidate(),
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const renameMutation = api.file.rename.useMutation({
        onSuccess: () => {
            setEditingId(null);
            void utils.file.list.invalidate();
        },
    });

    if (!files) return <p className="text-gray-500">Loading...</p>;

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <div className="grid gap-3">
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2 border rounded-lg p-4">
                            {editingId === file.id ? (
                                <Input
                                    autoFocus
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onBlur={() => editName.trim() && renameMutation.mutate({ id: file.id, name: editName })}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.currentTarget.blur();
                                        }
                                        if (e.key === "Escape") {
                                            setEditingId(null);
                                        }
                                    }}
                                    className="flex-1"
                                />
                            ) : (
                                <span
                                    className="flex-1 cursor-pointer hover:underline"
                                    onClick={() => {
                                        setEditingId(file.id);
                                        setEditName(file.name);
                                    }}
                                >
                                    {file.name}
                                </span>
                            )}
                            <Select
                                onValueChange={(value) =>
                                    moveMutation.mutate({ id: file.id, folderId: value === "root" ? null : value })
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Move to..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="root">Data Room root</SelectItem>
                                    {allFolders?.map((folder) => (
                                        <SelectItem key={folder.id} value={folder.id}>
                                            {folder.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMutation.mutate({ id: file.id })}
                            >
                                Delete
                            </Button>
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