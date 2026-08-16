import { DataRoomList } from "./_components/DataRoomList"
import { api } from "~/trpc/server";

export const runtime = "nodejs"

export default async function Home() {

  const dataRooms = await api.dataRoom.list();

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Files</h1>
        </div>
        <DataRoomList initialData={dataRooms} />
      </div>
    </div>
  );
}

