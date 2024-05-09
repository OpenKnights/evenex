#!/usr/bin/env pwsh

# 删除 dist 文件
function remove-filer($FOLDER_PATH) {
  $TRUE_FALSE=(Test-Path $FOLDER_PATH)
  if($TRUE_FALSE -eq "True"){
    remove-Item -Recurse -Force $FOLDER_PATH
  }
}
remove-filer("dist")
remove-filer("lib")
remove-filer("index.d.ts")
