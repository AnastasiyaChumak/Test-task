"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import Link from "next/link";
import type { DataRoom } from "~/entities/data-room/domain";

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
                    <Link
                        key={room.id}
                        href={`/data-room/${room.id}`}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                        {room.name}
                    </Link>
                ))}
                {dataRooms.length === 0 && (
                    <p className="text-gray-500">No Data Rooms yet — create one above.</p>
                )}
            </div>
        </div>
    );
}

export default DataRoomList;