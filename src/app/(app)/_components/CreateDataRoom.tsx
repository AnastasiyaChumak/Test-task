"use client";

import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { api } from "~/trpc/react";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { SidebarMenuSubItem } from "~/shared/ui/sidebar";

export function CreateDataRoom() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const utils = api.useUtils();

  const createMutation = api.dataRoom.create.useMutation({
    onSuccess: () => {
      setName("");
      setOpen(false);
      void utils.dataRoom.list.invalidate();
    },
  });

  const create = () => {
    const trimmedName = name.trim();

    if (trimmedName) {
      createMutation.mutate({ name: trimmedName });
    }
  };

  return (
    <SidebarMenuSubItem>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
          >
            <CirclePlus />
            <span>Create Data Room</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Data Room</DialogTitle>
            <DialogDescription>
              Enter a name for the new Data Room.
            </DialogDescription>
          </DialogHeader>

          <Input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New Data Room name"
            onKeyDown={(event) => {
              if (event.key === "Enter") create();
            }}
          />

          <DialogFooter>
            <Button
              onClick={create}
              disabled={!name.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarMenuSubItem>
  );
}