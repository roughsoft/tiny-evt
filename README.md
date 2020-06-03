# *tiny-evt*

![CI](https://github.com/neatfx/tiny-evt/workflows/CI/badge.svg) ![Create Release](https://github.com/neatfx/tiny-evt/workflows/Create%20Release/badge.svg)

基于 [Vite](https://github.com/vitejs/vite) 实现，使用 `TypeScript`、`Vue` 开发 `Electron` 应用的项目基础代码。

依赖、配置、使用简单，编程前准备工作更少，运行、HMR、编译打包速度更快！遵循 [安全建议](https://www.electronjs.org/docs/tutorial/security)、包含自动化测试。

![screenshot](screenshot.png)

| Dependence          | Category  | Required | Version          | Information |
| :---:               |:---:      |:---:     |:---:             |:---:|
| `vue-router`        |           |          | `4.0.0-alpha.11` |
| `env-cmd`           | `dev`     |          | `10.1.0`         |
| `cypress`           | `dev`     |          | `4.7.0`          | 测试工具
| `spectron`          | `dev`     |          | `11.0.0`         | 测试工具
| `@vue/test-utils`   | `dev`     |          | `2.0.0-alpha.6`  | 测试工具
| `jest`              | `dev`     |          | `26.0.1`         | 测试工具
| `@vue/compiler-sfc` | `dev`     | `true`   | `3.0.0-beta.14`  | 版本必须匹配 `vite` 中的 `vue` 版本
| `electron`          | `dev`     | `true`   | `9.0.0`          |
| `electron-builder`  | `dev`     | `true`   | `22.6.0`         |
| `vite`              | `dev`     | `true`   | `0.20.2`         | 包含 `vue@3.0.0-beta.14`、`esbuild`

---

| 测试类型               |  测试工具  | 测试框架 | 测试目标 | 命令 |
| :---:                 | :---:             | :---:   | :---:                      | :---: |
| `Unit`        | `Vue Test Utils` | `Jest`   | `Components @ Vue App @ Renderer`  | `npm run vtu`
| `End-to-end`  | `Cypress`         |         | `Vue App @ Renderer`               | `npm run cypress`
| `Integration` | `Spectron`        | `Jest`  | `Electron App`                     | `npm run spectron`

---

> First Run

```bash
cd tiny-evt && npm install && cp configs/.env-cmdrc.json .
```

> 运行应用

```bash
# 编译脚本
# scripts/dev-runner.ts ---> esbuild.build() ---> build/dev-runner.js

# 运行脚本（ 环境变量，NODE_ENV=development ）
# node build/dev-runner.js

# 脚本执行操作 - 启动本地服务器运行 Renderer Process ( Vue APP )
# renderer/**/* ---> Vite ---> dev-server @ localhost:3000

# 脚本执行操作 - 利用 Vite 中引入的 esbuild 编译打包 Main Process ( TypeScript APP )
# main/**/* ---> esbuild.build() ---> build/main.js、build/preload.js

# 脚本执行操作 - 运行 Electron 应用
# electron ---> build/main.js

# 开发版环境下，测试版本 Electron 应用的 main-window 指向本地 Vite-dev-server
# main-window @ TinyEvt @ development ---> localhost:3000

npm run dev
```

> 应用打包

```bash
# 编译脚本
# scripts/app-builder.ts ---> esbuild.build() ---> build/app-builder.js

# 运行脚本
# node build/app-builder.js

# 脚本执行操作 - 编译打包 Renderer Process ( Vue APP )
# renderer/**/* ---> Vite.build() ---> build/renderer/

# 脚本执行操作 - 编译打包 Main Process ( TypeScript APP )
# main/**/* ---> esbuild.build() ---> build/main.js、build/preload.js

# 脚本执行操作 - 打包创建应用
# package.json ---> electron-builder ---> dist/~app.asar/package.json
# build/**/*（ dev-runner.js、app-builder.js 除外 ）---> electron-builder ---> dist/~app.asar/build/
# main/resources/**/* ---> electron-builder ---> dist/~app.asar/build/resources/
# dist/mac/**/* ---> electron-builder ---> dist/TinyEvt.dmg

# 以可分发格式打包后的 Electron 应用指向 Vue 应用打包后的本地文件
# main-window @ TinyEvt（ packaged，DMG 格式 ）---> app.asar/build/renderer/index.html

npm run dist
```

> 运行 E2E 测试

```bash
# 编译脚本
# scripts/dev-runner.ts ---> esbuild.build() ---> build/dev-runner.js

# 运行脚本（ 环境变量 NODE_ENV=development、TEST=cypress ）
# node build/dev-runner.js

# 脚本执行操作 - 启动本地服务器运行 Renderer Process ( Vue APP )
# renderer/**/* ---> Vite ---> dev-server @ localhost:3000

# 脚本执行操作 - 启动 Cypress Test Runner

npm run cypress
```

> 测试 Electron 应用

```bash
# 编译脚本
# scripts/dev-runner.ts ---> esbuild.build() ---> build/dev-runner.js

# 运行脚本（ 环境变量 NODE_ENV=development、TEST=spectron ）
# node build/dev-runner.js

# 脚本执行操作 - 启动本地服务器运行 Renderer Process ( Vue APP )
# renderer/**/* ---> Vite ---> dev-server @ localhost:3000

# 脚本执行操作 - 编译打包 Main Process ( TypeScript APP )
# main/**/* ---> esbuild.build() ---> build/main.js、build/preload.js

# 脚本执行操作 - 编译 Mocha Tests
# tests/**/*.ts ---> esbuild.build() ---> tests/**/*.js

# 脚本执行操作 - 启动 Mocha 调用 Spectron 运行 Electron App ( ---> build/main.js ) 进行测试

npm run spectron
```

> 测试 Vue 组件

```bash
# 编译脚本
# scripts/dev-runner.ts ---> esbuild.build() ---> build/dev-runner.js

# 运行脚本（ 环境变量 NODE_ENV=development、TEST=components ）
# node build/dev-runner.js

# 脚本执行操作 - 编译 Tests ( 利用既有 vite 预置编译功能，以支持 import .vue 文件以及 TypeScript 转换 )
# vue/**/*.ts ---> Vite.build() ---> vue/**/*.js

# 脚本执行操作 - 启动 Jest 运行测试用例

npm run vtu
```
