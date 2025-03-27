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

// This is sample data.
const data = {
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Sidebar {...props}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Files</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.tree.map((item, index) => (
                    <Tree key={index} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenuTrigger>
    </ContextMenu>
  );
}

function Tree({ item }: { item: string | any[] }) {
  const [name, ...items] = Array.isArray(item) ? item : [item];

  if (!items.length) {
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
      <Collapsible
        // className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "components" || name === "ui"}
      >
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
            <ContextMenuItem>文件夹1</ContextMenuItem>
            <ContextMenuItem>文件夹2</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        {/* <CollapsibleTrigger asChild>
          <ContextMenu>
            <ContextMenuTrigger
              onContextMenu={(e) => {
                e.stopPropagation();
              }}
            >
              <SidebarMenuButton>
                <ChevronRight className="transition-transform" />
                <Folder />
                {name}
              </SidebarMenuButton>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>文件夹1</ContextMenuItem>
              <ContextMenuItem>文件夹2</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </CollapsibleTrigger> */}
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
