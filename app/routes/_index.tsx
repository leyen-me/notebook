import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { AppSidebar } from "~/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { API_ROUTES, DIALOG_OPEN_TYPE, DialogOpenType } from "~/constants";
import { useFetcher } from "~/hooks/useFetcher";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { NbkFile, NbkFileType } from "@prisma/client";
import { useToast } from "~/hooks/use-toast";
import { useTranslation } from "~/hooks/useTranslation";
import { TreeNode } from "~/utils/tree.server";

interface CreateOrUpdateDialogState {
  isOpen: boolean;
  type: DialogOpenType;

  id: string | null;
  pid: string | null;
  fileType: NbkFileType;
  name?: string;
}

type CreateOrUpdateFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  openType: DialogOpenType;

  id: string | null;
  pid: string | null;
  fileType: NbkFileType;
  name?: string;
};

export function CreateOrUpdateFileDialog({
  open,
  onOpenChange,
  onSuccess,
  openType,

  id,
  pid,
  fileType,
  name = "",
}: CreateOrUpdateFileDialogProps) {
  const { t } = useTranslation();

  const { fetcher, action } = useFetcher<string>({
    action:
      openType === DIALOG_OPEN_TYPE.CREATE
        ? API_ROUTES.API_NBK_FILE_CREATE
        : API_ROUTES.API_NBK_FILE_UPDATE,
    success: () => {
      onOpenChange(false);
      onSuccess?.();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {openType === DIALOG_OPEN_TYPE.CREATE
              ? t("nbk.file.create")
              : t("nbk.file.update")}
          </DialogTitle>
          <DialogDescription>
            {openType === DIALOG_OPEN_TYPE.CREATE
              ? t("nbk.file.create_description")
              : t("nbk.file.update_description")}
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" action={action}>
          {id && <Input type="hidden" name="id" value={id} />}
          {pid && <Input type="hidden" name="pid" value={pid} />}
          <Input type="hidden" name="type" value={fileType} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("nbk.file.name")}
              </Label>
              <Input name="name" className="col-span-3" defaultValue={name} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{t("common.submit")}</Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (id: string) => void;
  id: string;
};

interface DeleteFileDialogState {
  isOpen: boolean;
  id: string;
}

export function DeleteFileDialog({
  open,
  onOpenChange,
  onSuccess,
  id,
}: DeleteFileDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("common.delete_confirm_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onSuccess?.(id);
            }}
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Index() {
  const [fileTree, setFileTree] = useState<TreeNode<NbkFile>[]>([]);
  const [activeFile, setActiveFile] = useState<string>("");
  const { toast } = useToast();
  const { t } = useTranslation();
  const { submit: loadFileTreeSubmit } = useFetcher<TreeNode<NbkFile>[]>({
    action: API_ROUTES.API_NBK_FILE_TREE,
    success: (data) => {
      setFileTree(data);
    },
  });

  const [createOrUpdateDialogState, setCreateOrUpdateDialogState] =
    useState<CreateOrUpdateDialogState>({
      isOpen: false,
      type: DIALOG_OPEN_TYPE.CREATE as DialogOpenType,
      id: null,
      pid: null,
      fileType: "FILE",
      name: "",
    });
  const [deleteDialogState, setDeleteDialogState] =
    useState<DeleteFileDialogState>({
      isOpen: false,
      id: "",
    });

  const { submit: deleteFileSubmit } = useFetcher({
    action: API_ROUTES.API_NBK_FILE_DELETE,
    success: () => {
      toast({
        variant: "success",
        title: t("common.success"),
        description: t("common.delete_success"),
      });
      loadFileTreeSubmit();
    },
  });

  const { submit: moveFileSubmit } = useFetcher({
    action: API_ROUTES.API_NBK_FILE_MOVE,
    success: () => {
      loadFileTreeSubmit();
      toast({
        variant: "success",
        title: t("common.success"),
        description: t("common.move_success"),
      });
    },
    fail: (e:string) => {
      toast({
        variant: "destructive",
        title: t("common.fail"),
        description: t(e),
      });
    },
  });

  const handleClick = ({ id }: { id: string }) => {
    setActiveFile(id);
  };

  const handleNewFolder = ({ pid }: { pid: string | null }) => {
    setCreateOrUpdateDialogState({
      isOpen: true,
      type: DIALOG_OPEN_TYPE.CREATE as DialogOpenType,
      id: null,
      pid,
      fileType: "FOLDER",
    });
  };

  const handleNewFile = ({ pid }: { pid: string | null }) => {
    setCreateOrUpdateDialogState({
      isOpen: true,
      type: DIALOG_OPEN_TYPE.CREATE as DialogOpenType,
      id: null,
      pid,
      fileType: "FILE",
    });
  };

  const handleDelete = ({ id }: { id: string }) => {
    setDeleteDialogState({
      isOpen: true,
      id,
    });
  };

  const handleDeleteConfirm = (id: string) => {
    const formData = new FormData();
    formData.append("id", id);
    deleteFileSubmit(formData);
  };

  const handleRename = ({
    id,
    name,
    fileType,
  }: {
    id: string;
    name: string;
    fileType: NbkFileType;
  }) => {
    setCreateOrUpdateDialogState({
      isOpen: true,
      type: DIALOG_OPEN_TYPE.UPDATE as DialogOpenType,
      id,
      pid: null,
      fileType,
      name,
    });
  };

  const handleCopy = ({
    id,
    fileType,
  }: {
    id: string;
    fileType: NbkFileType;
  }) => {
    console.log(id, fileType);
  };

  const handleMove = async (activeId: string, targetId: string): Promise<void> => {
    const formData = new FormData();
    console.log(activeId, targetId);
    
    formData.append('activeId', activeId);
    formData.append('targetId', targetId);
    moveFileSubmit(formData);
  };

  useEffect(() => {
    loadFileTreeSubmit();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar
        fileTree={fileTree}
        activeFile={activeFile}
        onNewFolder={handleNewFolder}
        onNewFile={handleNewFile}
        onDelete={handleDelete}
        onRename={handleRename}
        onClick={(e) => handleClick(e as { id: string })}
        onCopy={(e) => handleCopy(e as { id: string; fileType: NbkFileType })}
        onMove={handleMove}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">ui</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>button.tsx</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>

      <CreateOrUpdateFileDialog
        open={createOrUpdateDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setCreateOrUpdateDialogState((prev) => ({ ...prev, isOpen }))
        }
        onSuccess={() => {
          toast({
            variant: "success",
            title: "Success",
            description: "File created/updated successfully",
          });
          loadFileTreeSubmit();
        }}
        openType={createOrUpdateDialogState.type}
        id={createOrUpdateDialogState.id}
        pid={createOrUpdateDialogState.pid}
        fileType={createOrUpdateDialogState.fileType}
        name={createOrUpdateDialogState.name}
      />

      <DeleteFileDialog
        id={deleteDialogState.id}
        open={deleteDialogState.isOpen}
        onOpenChange={(isOpen) =>
          setDeleteDialogState((prev) => ({ ...prev, isOpen }))
        }
        onSuccess={handleDeleteConfirm}
      />
    </SidebarProvider>
  );
}
