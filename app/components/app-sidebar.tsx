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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { useTranslation } from "~/hooks/useTranslation";
import { NbkFile } from "@prisma/client";
import { TreeNode } from "~/utils/tree.server";

type FileItemEventProps = {
  onNewFolder?: ({ pid }: { pid: string | null }) => void;
  onNewFile?: ({ pid }: { pid: string | null }) => void;
  onDelete?: ({ id }: { id: string }) => void;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> &
  FileItemEventProps & {
    fileTree: TreeNode<NbkFile>[];
  };

export function AppSidebar({
  fileTree,
  onNewFolder,
  onNewFile,
  onDelete,
  ...props
}: AppSidebarProps) {
  const { t } = useTranslation();
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Sidebar {...props}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Files</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {fileTree.map((item, index) => (
                    <Tree
                      key={index}
                      item={item}
                      onNewFolder={onNewFolder}
                      onNewFile={onNewFile}
                      onDelete={onDelete}
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

type TreeProps = {
  item: TreeNode<NbkFile>;
} & FileItemEventProps;

function Tree({ item, onNewFolder, onNewFile, onDelete }: TreeProps) {
  const { name, type } = item.meta;
  const { t } = useTranslation();

  if (type === "FILE") {
    return (
      <ContextMenu>
        <ContextMenuTrigger
          onContextMenu={(e) => {
            e.stopPropagation();
          }}
        >
          <SidebarMenuButton
            isActive={name === "button.tsx"}
            className="data-[active=true]:bg-transparent"
          >
            <File />
            {name}
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>文件1</ContextMenuItem>
          <ContextMenuItem>文件2</ContextMenuItem>
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
              <SidebarMenuButton className="[&[data-state=open]_svg:first-child]:rotate-90">
                <ChevronRight className="transition-transform" />
                <Folder />
                {name}
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
                onDelete?.({ id: item.id });
              }}
            >
              {t("nbk.file.delete")}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                onNewFolder={onNewFolder}
                onNewFile={onNewFile}
                onDelete={onDelete}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
