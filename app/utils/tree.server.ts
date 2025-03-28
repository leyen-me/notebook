export interface TreeNode<T> {
  id: string;
  parentId: string | null;
  children: TreeNode<T>[];
  meta: T;
}

export function buildTree<T>(items: TreeNode<T>[]): TreeNode<T>[] {
  // 创建一个映射来存储所有节点
  const itemMap = new Map();
  // 初始化结果数组，用于存储根节点
  const roots: TreeNode<T>[] = [];
  // 第一步：将所有项目转换为节点并存储在 Map 中
  items.forEach((item) => {
    itemMap.set(item.id, {
      ...item,
      children: [],
    });
  });
  // 第二步：构建树结构
  items.forEach((item) => {
    const node = itemMap.get(item.id);
    if (item.parentId === null) {
      // 如果没有 parentId，则为根节点
      roots.push(node);
    } else {
      // 将节点添加到父节点的 children 数组中
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });
  return roots;
}
