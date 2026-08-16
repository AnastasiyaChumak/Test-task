import { api } from "~/trpc/server";
import FileList from "../../../_components/FileList";
import FolderList from "../../../_components/FolderList";
import Breadcrumbs from "../_components/Breadcrumbs";

export const runtime = "nodejs";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string; path: string[] }>;
}) {
  const { id, path } = await params;
  const currentFolderId = path[path.length - 1]!;

  const folders = await api.folder.list({ dataRoomId: id, parentId: currentFolderId });
  const files = await api.file.list({ dataRoomId: id, folderId: currentFolderId });
  const breadcrumbFolders = await api.folder.getByIds({ ids: path });

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto max-w-2xl px-4 py-12 flex flex-col gap-6">
        <Breadcrumbs initialData={breadcrumbFolders} dataRoomId={id} path={path}/>
        <FileList initialData={files} dataRoomId={id} />
        <FolderList initialData={folders} dataRoomId={id} parentId={currentFolderId} path={path} />
      </div>
    </div>
  );
}