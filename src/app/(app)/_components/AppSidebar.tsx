"use client"

import { ChevronRight, Home, Gamepad2, AppWindow } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "~/trpc/react"
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "~/shared/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "~/shared/ui/collapsible"
import { useState } from "react";
import type { DataRoom } from "~/entities/data-room/domain";
import { X, CirclePlus } from 'lucide-react';
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
import DataRoomList from "./DataRoomList"
import FolderList from "./FolderList";
import { useParams } from "next/navigation";
import { CreateDataRoom } from "./CreateDataRoom"

export default function AppSidebar({
    initialData,
}: {
    initialData: DataRoom[];
}) {
    const params = useParams<{ id?: string }>();
    const dataRoomId = params.id;

    const { data: folders = [] } = api.folder.list.useQuery(
        { dataRoomId: dataRoomId!, parentId: null },
        {
            enabled: Boolean(dataRoomId),
        },
    );

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/">
                                        <Home />
                                        <span>Home</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <Collapsible className="group/create">
                                <SidebarMenuItem>
                                    <CreateDataRoom />
                                </SidebarMenuItem>
                            </Collapsible>

                            <Collapsible defaultOpen className="group/data-rooms">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            <AppWindow />
                                            <span>Data Rooms</span>
                                            <ChevronRight className="ml-auto transition-transform group-data-[state=open]/data-rooms:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <DataRoomList initialData={initialData} />
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}