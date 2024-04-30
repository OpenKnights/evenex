#!/usr/bin/env zx

import { $ } from 'zx'
import { io } from 'fsxx'

// 删除 dist 文件
await $`if((Test-Path 'dist') -eq "True"){ remove-Item -Recurse -Force 'dist' }`
// 执行 prettier, lint, build 命令
await $`pnpm build`

// 获取 package.json 配置
const { data: pkg } = await io.json<{
  name: string
  version: string
}>`package.json`

// 打印发布版本信息
console.log(`> publish ${pkg.name} v` + pkg.version)
// 根据 version beta 字符判断发布 beta 版本还是正常版本
if (pkg.version.indexOf('beta') != -1) {
  await $`npm publish --tag beta`
} else {
  await $`npm publish`
}
