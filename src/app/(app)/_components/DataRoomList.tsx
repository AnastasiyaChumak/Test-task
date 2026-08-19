"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import Link from "next/link";
import type { DataRoom } from "~/entities/data-room/domain";
import { X, CirclePlus, Pencil, Trash2 } from 'lucide-react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/shared/ui/dialog";
import {
    SidebarMenuSubItem,
} from "~/shared/ui/sidebar";
import { CreateDataRoom } from "./CreateDataRoom";


export function DataRoomList({ initialData }: { initialData: DataRoom[] }) {

    const [createOpen, setCreateOpen] = useState(false);

    const utils = api.useUtils();
    const { data: dataRooms } = api.dataRoom.list.useQuery(undefined, {
        initialData,
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
        <div className="grid gap-1">
            {dataRooms.map((room) => (
                <div
                    key={room.id}
                    className="group flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                >
                    {editingId === room.id ? (
                        <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={() => editName.trim() && renameMutation.mutate({ id: room.id, name: editName })}
                            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                            className="flex-1 border rounded px-2 py-1 text-sm" 
                        />
                    ) : (
                        <Link href={`/data-room/${room.id}`} className="flex-1 text-sm truncate">
                            {room.name}
                        </Link>
                    )}

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 cursor-pointer"
                            onClick={() => {
                                setEditingId(room.id);
                                setEditName(room.name);
                            }}
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="cursor-pointer h-6 w-6 text-red-500 hover:text-red-600">
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
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
                </div>
            ))}
            {dataRooms.length === 0 && (
                <p className="text-gray-500 text-sm px-3">No Data Rooms yet — create one above.</p>
            )}
        </div>
    );
}

export default DataRoomList;