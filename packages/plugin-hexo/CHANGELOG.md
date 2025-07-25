# @mark-magic/plugin-hexo

## 0.22.0

### Minor Changes

- update @liuli-util/markdown-util, support math expression

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.22.0
  - @mark-magic/plugin-local@0.22.0

## 0.19.0

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.19.0

## 0.18.0

### Minor Changes

- feat: support hash link

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.18.0

## 0.14.0

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.14.0

## 0.12.4

### Patch Changes

- fix: 修复 hexo 输出的分类有问题，需要处理 meta 部分，对 path 做一些转换

## 0.12.3

### Patch Changes

- feat: 更新 markdown ast 的选择器为标准的 css 选择器

## 0.12.0

### Minor Changes

- chore: update npm publish files config

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.12.0
  - @mark-magic/plugin-local@0.12.0

## 0.11.12

### Patch Changes

- fix: 默认删除 h1 标题，因为已经添加到 yaml meta 中了

## 0.11.2

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.2
  - @mark-magic/plugin-local@0.11.2

## 0.11.0

### Minor Changes

- feat(core): 支持错误时抛出错误到上层并且允许手动中断
- feat(plugin-local): 将 rootContentPath/rootResourcePath 缩减为一个 path 配置与输入匹配

### Patch Changes

- Updated dependencies
  - @mark-magic/core@0.11.0
  - @mark-magic/plugin-local@0.11.0

## 0.10.0

### Minor Changes

- feat: 修改 tags 字段为字符串数组而不在额外包一层

### Patch Changes

- fix: 添加选项支持在导出 hexo 时清理掉 h1
- fix: 修复导出的 hexo 内容中可能包含了重复的标题
- Updated dependencies
  - @mark-magic/plugin-local@0.10.0
  - @mark-magic/core@0.10.0

## 0.9.4

### Patch Changes

- @mark-magic/core@0.9.4
- @mark-magic/plugin-local@0.9.4

## 0.9.3

### Patch Changes

- @mark-magic/core@0.9.3
- @mark-magic/plugin-local@0.9.3

## 0.9.2

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.9.2
  - @mark-magic/core@0.9.2

## 0.9.1

### Patch Changes

- Updated dependencies
  - @mark-magic/plugin-local@0.9.1
  - @mark-magic/core@0.9.1

## 0.9.0

### Minor Changes

- feat: 实现 hexo 插件

### Patch Changes

- @mark-magic/core@0.9.0
- @mark-magic/plugin-local@0.9.0
