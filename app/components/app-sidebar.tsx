import * as React from "react";
import { ChevronRight, File, Folder } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
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
  SidebarRail,
} from "~/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useTranslation } from "~/hooks/use-translation";
import { NbkFile, NbkFileType } from "@prisma/client";
import { TreeNode } from "~/utils/tree.server";
import { NBK_FILE_TYPE_ENUM } from "~/constants";

type FileItemEventProps = {
  onClick?: ({ id }: { id: string }) => void;
  onNewFolder?: ({ pid }: { pid: string | null }) => void;
  onNewFile?: ({ pid }: { pid: string | null }) => void;
  onDelete?: ({ id }: { id: string }) => void;
  onRename?: ({
    id,
    name,
    fileType,
  }: {
    id: string;
    name: string;
    fileType: NbkFileType;
  }) => void;
  onCopy?: ({ id, fileType }: { id: string; fileType: NbkFileType }) => void;
  onMove?: (activeId: string, targetId: string) => Promise<void>;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> &
  FileItemEventProps & {
    fileTree: TreeNode<NbkFile>[];
    activeFile: string;
  };

type TreeProps = {
  item: TreeNode<NbkFile>;
  activeFile?: string;
  fileTree: TreeNode<NbkFile>[];
} & FileItemEventProps;

function Tree({
  item,
  activeFile,
  fileTree,
  onClick,
  onNewFolder,
  onNewFile,
  onDelete,
  onRename,
  onCopy,
  onMove,
}: TreeProps) {
  const { name, type } = item.meta;
  const { t } = useTranslation();
  const itemRef = React.useRef<HTMLButtonElement>(null);
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleDragStart = React.useCallback(
    (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", item.id);
      e.dataTransfer.effectAllowed = "move";
    },
    [item.id]
  );

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (type === NBK_FILE_TYPE_ENUM.FOLDER) {
        e.dataTransfer.dropEffect = "move";
        setIsDraggingOver(true);
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    },
    [type]
  );

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = React.useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const draggedId = e.dataTransfer.getData("text/plain");

      // 检查是否拖拽到自身
      if (draggedId === item.id) {
        return;
      }

      // 检查是否拖拽到子文件夹
      const isChildFolder = (
        node: TreeNode<NbkFile>,
        targetId: string
      ): boolean => {
        if (node.id === targetId) return true;
        return node.children.some((child) => isChildFolder(child, targetId));
      };

      const draggedItem = findItemById(fileTree, draggedId);
      if (draggedItem && isChildFolder(draggedItem, item.id)) {
        console.error(t("nbk.file.cannot_move_to_child"));
        return;
      }

      try {
        await onMove?.(draggedId, item.id);
        console.log(t("nbk.file.move_success"));
      } catch (error) {
        console.error("Failed to move item:", error);
        console.error(t("nbk.file.move_failed"));
      }
    },
    [item.id, onMove, t, fileTree]
  );

  // 添加辅助函数来查找项目
  const findItemById = (
    tree: TreeNode<NbkFile>[],
    id: string
  ): TreeNode<NbkFile> | null => {
    for (const node of tree) {
      if (node.id === id) return node;
      const found = findItemById(node.children, id);
      if (found) return found;
    }
    return null;
  };

  if (type === NBK_FILE_TYPE_ENUM.FILE) {
    return (
      <ContextMenu>
        <ContextMenuTrigger
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
        >
          <SidebarMenuButton
            ref={itemRef}
            className={`[&>span:last-child]:truncate cursor-pointer ${
              isDraggingOver ? "bg-accent" : ""
            }`}
            isActive={activeFile === item.id}
            onClick={() => {
              onClick?.({ id: item.id });
            }}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-id={item.id}
          >
            <File />
            <Tooltip>
              <TooltipTrigger asChild>
                <span>{name}</span>
              </TooltipTrigger>
              <TooltipContent>{name}</TooltipContent>
            </Tooltip>
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => {
              onRename?.({ id: item.id, name, fileType: NBK_FILE_TYPE_ENUM.FILE });
            }}
          >
            {t("nbk.file.rename")}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              onCopy?.({ id: item.id, fileType: NBK_FILE_TYPE_ENUM.FILE });
            }}
          >
            {t("nbk.file.copy")}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              onDelete?.({ id: item.id });
            }}
          >
            {t("nbk.file.delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen={name === "components" || name === "ui"}>
        <ContextMenu>
          <ContextMenuTrigger
            onContextMenu={(e) => {
              e.stopPropagation();
            }}
          >
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                ref={itemRef}
                className={`[&[data-state=open]_svg:first-child]:rotate-90 [&>span:last-child]:truncate cursor-pointer ${
                  isDraggingOver ? "bg-accent" : ""
                }`}
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                data-id={item.id}
              >
                <ChevronRight className="transition-transform" />
                <Folder />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{name}</span>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              </SidebarMenuButton>
            </CollapsibleTrigger>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                onNewFolder?.({ pid: item.id });
              }}
            >
              {t("app.sidebar.new_folder")}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                onNewFile?.({ pid: item.id });
              }}
            >
              {t("app.sidebar.new_file")}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                onRename?.({ id: item.id, name, fileType: NBK_FILE_TYPE_ENUM.FOLDER });
              }}
            >
              {t("nbk.file.rename")}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                onCopy?.({ id: item.id, fileType: NBK_FILE_TYPE_ENUM.FOLDER });
              }}
            >
              {t("nbk.file.copy")}
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => {
                onDelete?.({ id: item.id });
              }}
            >
              {t("nbk.file.delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <CollapsibleContent className="transition-all duration-200 ease-in-out">
          <SidebarMenuSub>
            {item.children.map((child) => (
              <Tree
                key={child.id}
                item={child}
                activeFile={activeFile}
                fileTree={fileTree}
                onClick={onClick}
                onNewFolder={onNewFolder}
                onNewFile={onNewFile}
                onDelete={onDelete}
                onRename={onRename}
                onCopy={onCopy}
                onMove={onMove}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

export function AppSidebar({
  fileTree,
  activeFile,
  onClick,
  onNewFolder,
  onNewFile,
  onDelete,
  onRename,
  onCopy,
  onMove,
  ...props
}: AppSidebarProps) {
  const { t } = useTranslation();
  const [isDraggingOver, setIsDraggingOver] = React.useState(false);

  const handleRootDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  }, []);

  const handleRootDragLeave = React.useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleRootDrop = React.useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const draggedId = e.dataTransfer.getData("text/plain");
      try {
        await onMove?.(draggedId, "root");
        console.log(t("nbk.file.move_success"));
      } catch (error) {
        console.error("Failed to move item to root:", error);
        console.error(t("nbk.file.move_failed"));
      }
    },
    [onMove, t]
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Sidebar {...props}>
          <SidebarContent>
            <SidebarGroup
              className={isDraggingOver ? "bg-accent" : ""}
              onDragOver={handleRootDragOver}
              onDragLeave={handleRootDragLeave}
              onDrop={handleRootDrop}
              data-id="root"
            >
              <SidebarGroupLabel>Files</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {fileTree.map((item) => (
                    <Tree
                      key={item.id}
                      item={item}
                      activeFile={activeFile}
                      fileTree={fileTree}
                      onClick={onClick}
                      onNewFolder={onNewFolder}
                      onNewFile={onNewFile}
                      onDelete={onDelete}
                      onRename={onRename}
                      onCopy={onCopy}
                      onMove={onMove}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <ContextMenuContent className="w-44">
          <ContextMenuItem
            onClick={() => {
              onNewFolder?.({ pid: null });
            }}
          >
            {t("app.sidebar.new_folder")}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => {
              onNewFile?.({ pid: null });
            }}
          >
            {t("app.sidebar.new_file")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
}
