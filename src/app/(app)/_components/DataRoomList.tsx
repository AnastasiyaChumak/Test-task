"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import Link from "next/link";
import type { DataRoom } from "~/entities/data-room/domain";
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

export function DataRoomList({ initialData }: { initialData: DataRoom[] }) {
    const utils = api.useUtils();
    const { data: dataRooms } = api.dataRoom.list.useQuery(undefined, {
        initialData,
    });

    const [name, setName] = useState("");
    const createMutation = api.dataRoom.create.useMutation({
        onSuccess: () => {
            setName("");
            void utils.dataRoom.list.invalidate();
        },
    });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const renameMutation = api.dataRoom.rename.useMutation({
        onSuccess: () => {
            setEditingId(null);
            void utils.dataRoom.list.invalidate();
        },
    });

    const deleteMutation = api.dataRoom.delete.useMutation({
        onSuccess: () => void utils.dataRoom.list.invalidate(),
    });

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="New Data Room name"
                />
                <Button
                    onClick={() => name.trim() && createMutation.mutate({ name })}
                    disabled={createMutation.isPending}
                >
                    Create
                </Button>
            </div>

            <div className="grid gap-3">
                {dataRooms.map((room) => (
                    <div key={room.id} className="flex items-center gap-2 border rounded-lg p-4">
                        {editingId === room.id ? (
                            <input
                                autoFocus
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onBlur={() => editName.trim() && renameMutation.mutate({ id: room.id, name: editName })}
                                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                                className="flex-1 border rounded px-2 py-1"
                            />
                        ) : (
                            <Link href={`/data-room/${room.id}`} className="flex-1 hover:underline">
                                {room.name}
                            </Link>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setEditingId(room.id);
                                setEditName(room.name);
                            }}
                        >
                            Rename
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm"><X /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete &quot;{room.name}&quot;?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete this Data Room and everything inside it — all folders and files. This cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteMutation.mutate({ id: room.id })}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
                {dataRooms.length === 0 && (
                    <p className="text-gray-500">No Data Rooms yet — create one above.</p>
                )}
            </div>
        </div>
    );
}

export default DataRoomList;