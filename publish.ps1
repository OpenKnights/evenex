#!/usr/bin/env pwsh

# npm publish 发布之前记得配置.npmrc文件
<# 
  registry=https://registry.npmjs.org/
  //registry.npmjs.org/:always-auth=true
  //registry.npmjs.org/:_authToken=npm_you_token
#>

# 删除 dist 文件
function remove-filer($FOLDER_PATH) {
  $TRUE_FALSE=(Test-Path $FOLDER_PATH)
  if($TRUE_FALSE -eq "True"){
    remove-Item -Recurse -Force $FOLDER_PATH
  }
}
remove-filer("dist")
remove-filer("index.d.ts")

# 执行 build 命令
pnpm build


# 获取 package.json 配置
$Path = "package.json"  #文件名称
$pkg = Get-Content  -Raw -Path $Path | ConvertFrom-Json

# 打印发布版本信息
Write-Host "> publish $($pkg.name) v$($pkg.version)"

# 根据 version 是否包含 beta 字符来判断发布 beta 版本还是正常版本
if ($pkg.version -like "*beta*") {
  npm publish --tag beta
} else {
  npm publish
}

