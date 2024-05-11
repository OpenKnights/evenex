#!/usr/bin/env pwsh

# 封装删除函数
function remove-filer($FOLDER_PATH) {
  $TRUE_FALSE=(Test-Path $FOLDER_PATH)
  if($TRUE_FALSE -eq "True"){
    remove-Item -Recurse -Force $FOLDER_PATH
  }
}

# 打印删除目录
Write-Host "> remove-filer 'dist, lib, index.d.ts'"

# 删除打包文件
remove-filer("dist")
remove-filer("lib")
remove-filer("index.d.ts")
