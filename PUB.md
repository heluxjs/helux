
### 直接发布
1. `npm run build`

2. `pnpm publish -r`

### changeset 发布
使用 changeset 分以下几步：

1. 当代码变更后，执行 `pnpm changeset` ，会让你输入选择变更的包和输入变更日志.
>变更日志会临时保存在.changeset文件夹中，如果输入了也可以再手工修改合并

2. 发布前执行 `pnpx changeset version` ，会在每一个包下生成 CHANGELOG，并且会自动升级版本。

3. 发布时执行 `pnpx changeset publish`

发布配置见 `.changeset/config.json` 文件
