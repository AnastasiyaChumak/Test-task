import { api } from "~/trpc/server";
import FileList from "../../_components/FileList";
import FolderList from "../../_components/FolderList";
import FileUpload from "./_components/FileUpload";

export const runtime = "nodejs"

export default async function DataRoomMain({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const folders = await api.folder.list({ dataRoomId: id, parentId: null });
  const files = await api.file.list({ dataRoomId: id, folderId: null });

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-6">
        <FileUpload dataRoomId={id} folderId={null} />
        <FileList dataRoomId={id} folderId={null} />
        <FolderList initialData={folders} dataRoomId={id} parentId={null} path={[]} />
      </div>
    </div>
  );
}

