# Kalimba Online 项目文档

## 项目概述

Kalimba Online 是一个基于浏览器的卡林巴（拇指琴）演奏应用。它允许用户在浏览器中自由演奏卡林巴，并提供丰富的自定义选项，包括音色、颜色、键位布局、音量等。这是一个纯前端项目，使用 Progressive Web App (PWA) 技术构建，支持离线使用。

### 主要技术栈

- **前端框架**: 纯 JavaScript (Vanilla JS) + jQuery 3.7.1
- **CSS 框架**: Pico.css 1.5.13
- **音频引擎**: Soundfont-player 0.12.0
- **PWA 支持**: Service Worker + Manifest.json
- **本地存储**: localStorage（用于保存用户设置和录音）

### 项目架构

项目采用经典的单页应用（SPA）结构，所有代码都在客户端运行：

- **HTML**: `index.html` - 主页面结构
- **CSS**: `css/` 目录 - 样式文件
  - `kalimba.css` - 卡林巴组件样式
  - `pico-color-picker.css` - 颜色选择器样式
  - `pico-theme-switcher.css` - 主题切换样式
- **JavaScript**: `js/` 目录 - 功能脚本
  - `kalimba.js` - 核心卡林巴逻辑（约 850 行）
  - `lang.js` - 多语言支持
  - `fullscreen.js` - 全屏功能
  - `pico-color-picker.js` - 颜色选择器
  - `pico-theme-switcher.js` - 主题切换器
- **多语言文件**: `lang/` 目录 - 支持 10 种语言（俄语、英语、德语、西班牙语、法语、中文、阿拉伯语、葡萄牙语、日语、印尼语）
- **音频资源**: `soundfonts/` 目录 - 卡林巴音色库

## 构建和运行

### 本地开发

由于这是一个纯前端项目，不需要构建过程。你可以直接使用任何静态文件服务器运行：

```bash
# 使用 Python 3
python3 -m http.server 8000

# 使用 Node.js http-server
npx http-server -p 8000

# 使用 PHP
php -S localhost:8000
```

然后在浏览器中访问 `http://localhost:8000`。

### 生产部署

项目部署在 GitHub Pages 上。部署步骤：

1. 将代码推送到 GitHub 仓库
2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 选择主分支作为源

### PWA 安装

应用支持作为 PWA 安装到设备：
- 在移动设备上，可以通过浏览器菜单"添加到主屏幕"
- 在桌面浏览器上，地址栏会显示安装图标

## 开发约定

### 代码风格

- **JavaScript**: 使用 ES6+ 语法，采用面向对象编程（OOP）方式组织代码
- **CSS**: 使用 CSS 变量（Custom Properties）实现主题切换
- **命名约定**:
  - 类名使用 PascalCase（如 `Kalimba_Online`）
  - 函数名使用 camelCase（如 `updateLabels`）
  - 常量使用 UPPER_SNAKE_CASE（如 `Soundfonts`）

### 核心类结构

主类 `Kalimba_Online`（在 `js/kalimba.js:763`）包含：

- **属性**: 存储用户设置（音色、键数、基调、音量等）
- **方法**:
  - `loadSF()` - 加载音色库
  - `addKeys()` - 渲染卡林巴键位
  - `playSound(note, options)` - 播放声音
  - `keyShake(keyObj)` - 播放按键动画
  - `getNotes()` - 获取当前音阶

### 数据持久化

所有用户设置都保存在 localStorage 中：

```javascript
// 保存设置
saveToLocalStorage("volume", 75);

// 读取设置
loadFromLocalStorage("volume", 75); // 默认值 75
```

### 多语言支持

- 语言文件使用 JSON 格式存储在 `lang/` 目录
- 使用 `data-i18n` 属性标记需要翻译的元素
- 自动检测用户浏览器语言

### 音频处理

- 使用 Web Audio API (`AudioContext`)
- 支持三种音色库：FluidR3_GM、FatBoy、Keylimba
- 音量控制基于线性缩放（`gain * volume / 100`）

### 触摸事件处理

项目支持多点触控，可以在移动设备上同时演奏多个音符。相关逻辑在 `js/kalimba.js` 的 `touchstart` 和 `touchmove` 事件处理器中。

### 录音和回放功能

- 录音功能：记录按键和间隔时间
- 回放功能：按照录音序列自动播放
- 录音数据保存在 localStorage 中

## 关键功能实现

### 键位排列算法

卡林巴的键位采用特殊的交替排列方式（从外到内）：

```javascript
function sortArrayKalimba(notesArr) {
    let sortedArr = []
    // 从右到左排列奇数索引的键
    for (let i = notesArr.length - notesArr.length % 2 - 1; i > 0; i -= 2) {
        sortedArr.push(notesArr[i]);
    }
    // 从左到右排列偶数索引的键
    for (let i = 0; i < notesArr.length; i += 2) {
        sortedArr.push(notesArray[i]);
    }
    return sortedArr;
}
```

### 音阶计算

使用大调音阶间隔（全音-全音-半音-全音-全音-全音-半音）：

```javascript
const majorIntervals = [2, 2, 1, 2, 2, 2, 1];
```

### 键盘控制

支持三种键盘映射方案：
1. B V N C M X < F H D J S K A U R I E O P W（21 键）
2. A S D F G H J K L（9 键）
3. 1 2 3 4 5 6 7 8 9 0 - =（12 键）

按住空格键可以升高一个八度。

## 测试

项目目前没有自动化测试。建议进行以下手动测试：

1. **功能测试**:
   - 播放各个键位，检查声音是否正常
   - 测试触摸和鼠标事件
   - 测试键盘控制
   - 测试录音和回放功能

2. **兼容性测试**:
   - 桌面浏览器（Chrome、Firefox、Safari、Edge）
   - 移动浏览器（iOS Safari、Chrome Mobile）
   - PWA 安装和离线功能

3. **本地化测试**:
   - 测试所有 10 种语言
   - 验证语言切换功能

## 已知问题

根据 README.md 中的 TODO 列表，已知的问题包括：

- 多点触控后滑动演奏的 Bug
- 两个相同音符配置时会改变数字和大小
- 需要清理 CSS 代码
- 缺少安装 PWA 的通知/按钮

## 文件说明

### 必需文件

- `index.html` - 主页面
- `js/kalimba.js` - 核心逻辑
- `css/kalimba.css` - 主样式表
- `service-worker.js` - PWA 缓存配置

### 配置文件

- `manifest.json` - PWA 清单文件
- `CNAME` - 自定义域名配置
- `.gitignore` - Git 忽略文件配置

## 离线支持

Service Worker 在 `service-worker.js` 中实现了缓存策略：

```javascript
// 缓存优先，网络回退
e.respondWith(
    tryNetwork(e.request, CACHE_TIMEOUT)
    .catch(() => getFromCache(e.request))
);
```

超时时间设置为 400ms，以确保快速响应。

## 贡献指南

如需贡献代码，请遵循以下原则：

1. 保持代码风格与现有代码一致
2. 为新功能添加适当的注释（使用俄语，与项目原始语言一致）
3. 测试所有更改，确保不影响现有功能
4. 更新相应的语言文件（如需）
5. 更新 README.md 中的 TODO 列表

## 许可证

项目使用开源许可证，详见 `LICENSE` 文件。

## 联系方式

- GitHub 仓库: https://github.com/piaomiaoguying/kalimba-online.git
- 作者: Artem Samsonov

---

## Docker 部署指南

### 概述

本项目已配置为支持 Docker 部署，可以轻松部署到 NAS 或任何支持 Docker 的服务器上。项目已完全本地化，所有资源（包括第三方库和音色库）都已下载到本地，无需网络连接即可运行。

### 部署文件

项目包含以下 Docker 相关文件：

- `Dockerfile` - Docker 镜像构建文件
- `docker-compose.yml` - Docker Compose 配置文件
- `nginx.conf` - Nginx 配置文件
- `.dockerignore` - Docker 构建忽略文件
- `DOCKER_DEPLOY.md` - 详细的部署文档

### 本地化资源说明

所有外部资源已下载到本地：

**第三方库**（`lib/` 目录）：
- jQuery 3.7.1 - `lib/jquery.min.js` (85 KB)
- SoundFontPlayer 0.12.0 - `lib/soundfont-player.min.js` (22 KB)
- Pico.css 1.5.13 - `lib/pico.min.css` (71 KB)

**音色库**（`soundfonts/` 目录）：
- FluidR3_GM - `soundfonts/FluidR3_GM/kalimba-mp3.js` (1.6 MB)
- FatBoy - `soundfonts/FatBoy/kalimba-mp3.js` (1.6 MB)
- Keylimba - `soundfonts/keylimba/kalimba.mp3.js` (已存在)

### 快速部署

#### 方法一：使用 Docker Compose（推荐）

```bash
# 进入项目目录
cd /path/to/kalimba-online

# 构建并启动
docker-compose up -d --build
```

#### 方法二：使用 Docker 命令

```bash
# 构建镜像
docker build -t kalimba-online:latest .

# 运行容器
docker run -d \
  --name kalimba-online \
  -p 9999:80 \
  --restart unless-stopped \
  kalimba-online:latest
```

### 访问应用

部署成功后，在浏览器中访问：

```
http://服务器IP:9999
```

例如：`http://192.168.1.100:9999`

### 常见问题和解决方案

#### 问题 1: Docker Hub 连接超时

**错误信息**：
```
ERROR: failed to solve: DeadlineExceeded: nginx:alpine: failed to resolve source metadata
```

**原因**：服务器无法访问 Docker Hub 或网络连接不稳定。

**解决方案**：

1. **配置 Docker 镜像加速器**（推荐）：

```bash
# 创建 Docker 配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.1panel.live",
    "https://dockerhub.icu"
  ]
}
EOF

# 重启 Docker 服务
sudo systemctl daemon-reload
sudo systemctl restart docker
```

2. **修改 Dockerfile 使用国内镜像源**：

已在 `Dockerfile` 中配置：
```dockerfile
FROM docker.m.daocloud.io/library/nginx:alpine
```

3. **手动拉取镜像并打标签**（备用方案）：

如果上述方法仍然失败，可以手动拉取镜像：

```bash
# 先手动拉取镜像
docker pull docker.m.daocloud.io/library/nginx:alpine

# 给镜像打标签
docker tag docker.m.daocloud.io/library/nginx:alpine nginx:alpine

# 再构建
cd /vol1/1000/nvme/kalimba-online && docker-compose build
```

#### 问题 2: docker-compose.yml 中的 volumes 配置错误

**错误信息**：
```
ERROR: The Compose file './docker-compose.yml' is invalid because:
services.kalimba-online.volumes contains an invalid type, it should be an array
```

**原因**：volumes 字段不能只包含注释。

**解决方案**：将整个 volumes 块注释掉或删除（已修复）：

```yaml
# volumes:
#   # 可选：如果需要持久化配置，可以挂载配置目录
#   - ./config:/usr/share/nginx/html/config
```

#### 问题 3: 容器构建成功但无法启动

**错误信息**：
```
Error response from daemon: No such container: kalimba-online
```

**原因**：只是构建了镜像，但没有创建容器。

**解决方案**：使用 `docker-compose up -d` 创建并启动容器：

```bash
cd /path/to/kalimba-online && docker-compose up -d
```

### 部署检查清单

在部署前，请确认以下事项：

- [ ] 已上传所有项目文件到服务器
- [ ] 已配置 Docker 镜像加速器（推荐）
- [ ] 确认端口 9999 未被占用（或修改为其他端口）
- [ ] 确认 `lib/` 目录包含所有第三方库文件
- [ ] 确认 `soundfonts/` 目录包含所有音色库文件

### 验证部署

部署完成后，使用以下命令验证：

```bash
# 查看容器状态
docker ps | grep kalimba-online

# 查看日志
docker logs kalimba-online

# 检查端口监听
netstat -tuln | grep 9999
```

### 常用管理命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f kalimba-online

# 停止容器
docker-compose stop

# 启动容器
docker-compose start

# 重启容器
docker-compose restart

# 删除容器
docker-compose down

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### NAS 部署

#### Synology NAS

1. 安装 Docker 套件
2. SSH 登录 NAS
3. 上传项目文件到 `/volume1/docker/kalimba-online`
4. 运行 `docker-compose up -d --build`
5. 可选：配置反向代理

#### QNAP NAS

1. 安装 Container Station
2. 使用 Container Station 或命令行部署
3. 访问应用

### 配置说明

#### 修改端口

编辑 `docker-compose.yml`：

```yaml
ports:
  - "3000:80"  # 修改外部端口
```

#### 修改时区

在 `docker-compose.yml` 中修改：

```yaml
environment:
  - TZ=Asia/Shanghai  # 改为你所在的时区
```

### 性能优化

Nginx 配置已包含以下优化：

- Gzip 压缩
- 静态资源缓存（1年）
- 音色库文件缓存（1年）
- HTML 文件不缓存（确保更新）
- 安全头配置

### 备份和恢复

#### 备份

```bash
# 打包项目目录
tar -czf kalimba-online-backup.tar.gz /path/to/kalimba-online

# 备份到其他位置
cp kalimba-online-backup.tar.gz /backup/
```

#### 恢复

```bash
# 解压备份
tar -xzf kalimba-online-backup.tar.gz -C /path/to/

# 重新部署
cd /path/to/kalimba-online
docker-compose up -d --build
```

### 安全建议

1. **定期更新基础镜像**
   ```bash
   docker pull docker.m.daocloud.io/library/nginx:alpine
   docker-compose build --no-cache
   ```

2. **配置防火墙规则**，限制访问端口

3. **使用反向代理**（如 Nginx Proxy Manager）处理 HTTPS

4. **定期备份**项目文件和配置

### 故障排查

#### 容器无法启动

```bash
# 查看错误日志
docker-compose logs kalimba-online

# 检查端口是否被占用
netstat -tuln | grep 9999

# 检查 Docker 服务状态
sudo systemctl status docker
```

#### 页面无法访问

- 检查防火墙设置
- 确认容器正在运行：`docker ps`
- 检查端口映射是否正确
- 查看浏览器控制台错误信息

#### 音色库无法加载

- 确认 `soundfonts/` 目录已正确上传
- 检查文件权限：`ls -la soundfonts/`
- 查看浏览器控制台错误信息
- 检查 Nginx 访问日志

### 更新应用

1. 上传新的项目文件
2. 重新构建并启动

```bash
cd /path/to/kalimba-online
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 更多信息

详细的部署说明、配置选项和高级用法请参考 `DOCKER_DEPLOY.md` 文件。

---

## 更新日志

### 2026-01-01 - 全屏功能优化和PC端支持

#### Toast提示框替代Alert弹窗

**问题**：横屏点击全屏按钮时使用alert弹窗提示，用户体验不佳。

**解决方案**：
1. 添加了Toast提示框组件，替代原有的alert弹窗
2. Toast提示框使用灰色不透明背景，白色文字
3. 提示框居中显示，带有淡入淡出动画效果
4. 自动6秒后消失，无需用户手动关闭

**修改文件**：
- `index.html` - 在body末尾添加 `<div id="toast" class="toast"></div>` 元素
- `css/kalimba.css` - 添加Toast样式，包括固定定位、居中、动画效果等
- `js/fullscreen.js` - 添加 `showToast()` 函数，替换原有的alert调用

**技术细节**：
- 使用 `position: fixed` 固定在屏幕中央
- 使用 `transform: translate(-50%, -50%)` 实现完美居中
- 通过 `opacity` 和 `visibility` 实现淡入淡出效果
- 背景色为 `rgb(128, 128, 128)` 不透明灰色
- 使用 `setTimeout` 定时6秒后自动隐藏

#### 横屏全屏限制和提示优化

**问题**：手机横屏时进入全屏会导致布局混乱，需要阻止并提示用户。

**解决方案**：
1. 添加横屏检测逻辑，阻止横屏时进入全屏
2. 使用Toast提示框显示友好的提示文案
3. 精简提示文案，从原来的冗长描述改为简洁版本

**修改文件**：
- `js/fullscreen.js` - 在全屏按钮点击事件中添加横屏检测逻辑

**提示文案**：
"为了更好的演奏体验，请先旋转至竖屏并锁定屏幕方向，再进入全屏。"

#### PC端全屏功能优化

**问题**：原有的横屏检测逻辑会影响到PC端，PC端不应该受到横屏限制。

**解决方案**：
1. 添加 `isPC()` 函数，通过屏幕宽度和触摸能力判断是否是PC端
2. PC端直接进入全屏，不进行横屏检测
3. 移动端才根据屏幕宽高判断是否横屏

**修改文件**：
- `js/fullscreen.js` - 添加 `isPC()` 函数和优化全屏按钮点击逻辑

**技术细节**：
- 屏幕宽度大于1280px认为是PC
- 屏幕宽度大于1024px且没有触摸能力也认为是PC
- 使用 `navigator.maxTouchPoints` 检测触摸能力
- PC端优先判断，移动端再进行横屏检测

#### PC端退出全屏刷新页面

**问题**：PC端退出全屏后页面状态没有恢复，需要刷新页面。

**解决方案**：
1. 在 `exitFullscreen()` 函数中添加PC端检测
2. PC端退出全屏时也刷新页面，恢复原始状态

**修改文件**：
- `js/fullscreen.js` - 修改 `exitFullscreen()` 函数，添加PC端刷新逻辑

**技术细节**：
- 保持了iOS和Android原有的刷新逻辑
- 新增PC端刷新逻辑，确保状态一致恢复
- 使用 `location.reload()` 刷新页面

---

### 2026-01-01 - 手机端优化和UI改进

#### 手机横屏全屏布局优化

**问题**：手机横屏全屏时，琴键居中布局，大拇指够着比较吃力。

**解决方案**：
1. 添加了全屏布局设置选项，用户可以选择"默认"或"左右"布局
2. 在"左右"布局模式下，左边4个键往左移，右边5个键往右移，方便左右大拇指演奏
3. 在手机端全屏时隐藏了全屏缩小按钮，用户可以使用手机返回手势退出全屏

**修改文件**：
- `index.html` - 添加全屏布局设置选项的HTML结构，为选项添加 `data-i18n` 属性
- `js/kalimba.js` - 添加 `fullscreenLayout` 属性（getter/setter），添加初始化和事件处理代码
- `js/fullscreen.js` - 实现 `adjustKeyPositionsForMobile()` 函数，根据设置调整按键位置，添加 `originalTransforms` 数组保存原始transform值
- `css/kalimba.css` - 在手机端全屏时隐藏按钮容器（`display: none !important`）

**技术细节**：
- 使用 `transform: translateX()` 移动按键，不影响按键之间的间距
- 移动距离为视口宽度的20%，可根据需要调整
- 设置保存在 localStorage 中，下次访问时记住用户选择
- 只有当用户选择"左右"布局时才会调整按键位置

#### UI调整

**修改内容**：
1. **页面标题**：从 "Kalimba Online" 改为 "手机拇指琴"
2. **页面描述**：改为 "您可以在手机端浏览器中轻松演奏卡林巴拇指琴"
3. **SEO描述**：meta标签的description也改为中文
4. **隐藏按键数量控制滑块**：因为用户只需要9键，隐藏不必要的选项（注释掉 `<fieldset class="option-keys">`）
5. **隐藏按钮容器**：在手机端全屏时隐藏所有按钮，腾出更多空间给琴键

**修改文件**：
- `index.html` - 修改标题和描述（包括 `<title>`、`<h1>`、`<p>` 和 `<meta name="description">`），注释掉按键数量滑块
- `lang/zh-CN.json` - 更新中文翻译
- `lang/en.json` - 更新英文翻译为 "Mobile Thumb Piano"
- `lang/ar.json` - 更新阿拉伯语翻译
- `lang/de.json` - 更新德语翻译
- `lang/es.json` - 更新西班牙语翻译
- `lang/fr.json` - 更新法语翻译
- `lang/id.json` - 更新印尼语翻译
- `lang/ja.json` - 更新日语翻译
- `lang/pt.json` - 更新葡萄牙语翻译
- `lang/ru.json` - 更新俄语翻译

#### 默认设置调整

**修改内容**：
1. **基本音默认值**：从 C4 改为 E4（`allNotesSharp.indexOf("E4")`）
2. **按键数量默认值**：从 17 改为 9

**修改文件**：
- `js/kalimba.js` - 修改 `baseNote` 和 `keysCount` 的getter中的默认值

#### 本地化完善

**问题**：新增的全屏布局设置和修改的标题描述没有走本地化系统。

**解决方案**：
1. 为全屏布局选项添加 `data-i18n` 属性（`option.fullscreenLayout`、`option.defaultLayout`、`option.leftRightLayout`）
2. 在所有语言文件中添加对应的翻译
3. 确保切换语言时，所有文案都能正确显示

**修改文件**：
- `index.html` - 为全屏布局选项的 `<legend>` 和 `<span>` 元素添加 `data-i18n` 属性
- 所有 `lang/*.json` 文件（10个） - 添加以下翻译键：
  - `option.fullscreenLayout` - "全屏布局: " / "Fullscreen Layout: " 等
  - `option.defaultLayout` - "默认" / "Default" 等
  - `option.leftRightLayout` - "左右" / "Left-Right" 等

**技术细节**：
- 使用 `data-i18n` 属性标记需要翻译的元素
- `lang.js` 会自动加载对应语言文件并替换文本
- 如果某个键在当前语言文件中不存在，会回退到英语（默认语言）
- 所有语言的title和description都已更新为各自语言的原文

#### 手机横屏按键高度调整

**问题**：手机横屏全屏时，按键高度增加不够，看起来比较短。

**解决方案**：
- 在手机横屏模式下，按键高度增加量从 1/4 屏幕高度乘以 3.5
- 这样按键会更长，更适合横屏演奏

**修改文件**：
- `js/fullscreen.js` - 调整 `increaseKeyHeights()` 函数中的高度计算逻辑：
  ```javascript
  if (isMobileLandscape) {
      vhQuarter = vhQuarter * 3.5;
  }
  ```

#### 下方点样式优化

**问题**：琴键上带点的音符（如 5̣ 6̣ 7̣），下方的点离数字有点远。

**解决方案**：
- 减小 `gap` 从 2px 到 0.5px
- 保留 `margin-top: -2px` 让点更靠近数字

**修改文件**：
- `css/kalimba.css` - 调整 `.note-number.dots-below` 和 `.note-number.dots-below::after` 的样式：
  ```css
  .note-number.dots-below {
      gap: 0.5px;
  }
  .note-number.dots-below::after {
      margin-top: -2px;
  }
  ```

#### 自定义9键标签

**问题**：用户购买的9键卡林巴琴的音符顺序是：531（不带点）- 657（带点）- 246（不带点），与默认布局不同。

**解决方案**：
- 添加了自定义9键标签映射 `customLabels` 数组
- 修复了类型比较问题（使用 `parseInt(this.keysCount) === 9` 而不是 `=== "9"`）
- 修复了双点显示问题（下方点不添加到label字符串中，只通过CSS的 `::after` 显示）

**修改文件**：
- `js/kalimba.js` - 在 `addKeys()` 方法中添加自定义标签映射：
  ```javascript
  const customLabels = [
      {num: 5, dots: "", dotsPosition: ""},           // 位置1: 5（无点）
      {num: 3, dots: "", dotsPosition: ""},           // 位置2: 3（无点）
      {num: 1, dots: "", dotsPosition: ""},           // 位置3: 1（无点）
      {num: 6, dots: "·", dotsPosition: "below"},     // 位置4: 6̣（带点，低八度）
      {num: 5, dots: "·", dotsPosition: "below"},     // 位置5: 5̣（带点，低八度）
      {num: 7, dots: "·", dotsPosition: "below"},     // 位置6: 7̣（带点，低八度）
      {num: 2, dots: "", dotsPosition: ""},           // 位置7: 2（无点）
      {num: 4, dots: "", dotsPosition: ""},           // 位置8: 4（无点）
      {num: 6, dots: "", dotsPosition: ""}            // 位置9: 6（无点）
  ];
  ```

**技术细节**：
- 自定义标签只在按键数量为9时生效
- 使用 `parseInt()` 确保类型比较正确
- 下方点通过CSS的 `::after` 伪元素显示，避免重复显示

#### 已知问题

无新增已知问题。

#### 后续优化建议

1. 可以考虑添加更多全屏布局选项（如左对齐、右对齐、自定义间距）
2. 可以考虑让用户自定义移动距离（通过滑块设置百分比）
3. 可以考虑添加更多按键数量的自定义标签（如17键、15键等）
4. 可以考虑添加触觉反馈，提升演奏体验

---

### 2026-01-01 - Docker部署安全配置

#### Nginx安全限制

**问题**：Docker部署后，敏感配置文件（README.md、IFLOW.md、Dockerfile、docker-compose.yml、update.sh等）可以通过HTTP直接访问，存在安全隐患。

**解决方案**：
1. 在Nginx配置中添加访问限制规则
2. 禁止访问所有文档文件（.md）
3. 禁止访问配置文件（Dockerfile、docker-compose.yml、nginx.conf）
4. 禁止访问脚本文件（.sh）
5. 禁止访问.gitignore、.dockerignore和.git目录
6. 只允许访问演奏页面所需的核心文件（HTML、CSS、JS、音色库、图片等）

**修改文件**：
- `nginx.conf` - 添加以下安全配置：
  ```nginx
  # 禁止访问敏感配置文件和文档
  location ~* ^/(README|IFLOW|DOCKER_DEPLOY|LICENSE|CNAME|Dockerfile|docker-compose|update)\.(md|yml|yaml|conf|sh)$ {
      deny all;
      return 404;
  }

  # 禁止访问 .gitignore 和 .dockerignore
  location ~* ^/\.(gitignore|dockerignore)$ {
      deny all;
      return 404;
  }

  # 禁止访问 .git 目录
  location ~ /\.git {
      deny all;
      return 404;
  }
  ```

**技术细节**：
- 使用正则表达式匹配敏感文件名
- 所有被禁止访问的文件返回404错误
- 不影响演奏页面和必要资源的正常访问
- 需要重新构建并部署Docker容器才能生效

**部署步骤**：
```bash
cd /path/to/kalimba-online
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**验证方法**：
部署后访问以下地址应返回404：
- `http://服务器IP:9999/README.md`
- `http://服务器IP:9999/IFLOW.md`
- `http://服务器IP:9999/docker-compose.yml`
- `http://服务器IP:9999/update.sh`

---

### 2026-01-01 - 默认设置修复

#### 全屏布局默认值修复

**问题**：在新浏览器或隐私模式下首次访问时，全屏布局默认显示"默认"选项，而不是"左右"选项。即使将 HTML 中的 `checked` 属性从 `default-layout` 移到 `left-right-layout`，进入全屏后实际上并没有应用左右布局，只有在页面上切换一下选项后才会生效。

**根本原因**：
1. JavaScript 代码中 `get fullscreenLayout()` 的默认值是 `"leftRight"`（驼峰命名）
2. HTML 中单选按钮的 `value` 属性是 `"left-right"`（连字符命名）
3. JavaScript 试图找到 `value="leftRight"` 的单选按钮，但找不到匹配项
4. 结果导致没有任何单选按钮被正确选中，且进入全屏时无法读取到正确的布局设置

**解决方案**：
1. 将 JavaScript 中的默认值从 `"leftRight"` 改为 `"left-right"`，与 HTML 保持一致
2. 确保 HTML 中 `left-right-layout` 有 `checked` 属性
3. 这样 JavaScript 就能正确找到对应的单选按钮并设置选中状态

**修改文件**：
- `index.html` - 将 `checked` 属性从 `default-layout` 移到 `left-right-layout`
- `js/kalimba.js` - 修改 `get fullscreenLayout()` 的默认值从 `"leftRight"` 改为 `"left-right"`

**技术细节**：
- 修改前：`get fullscreenLayout() { return loadFromLocalStorage("fullscreenLayout", "leftRight"); }`
- 修改后：`get fullscreenLayout() { return loadFromLocalStorage("fullscreenLayout", "left-right"); }`
- 确保命名约定一致，避免因大小写和连字符差异导致的问题
- 现在新用户首次访问时，会正确选中"左右"布局，并且进入全屏后能正确应用

#### 默认值确认

经过确认，所有选项的默认值如下：

1. **音量**：75（✓ 正确）
2. **基本音**：E4（✓ 正确）
3. **全屏布局**：left-right（✓ 已修复）
4. **标签类型**：Number（✓ 正确）
5. **按键数量**：9（✓ 正确）
6. **音色库**：Keylimba（✓ 正确）
7. **键位排列**：Alternating（✓ 正确）

---

## 附录

### 项目文件结构

```
kalimba-online/
├── index.html                 # 主页面
├── manifest.json              # PWA 清单文件
├── service-worker.js          # Service Worker
├── Dockerfile                 # Docker 镜像构建文件
├── docker-compose.yml         # Docker Compose 配置
├── nginx.conf                 # Nginx 配置
├── update.sh                  # 部署脚本
├── css/
│   ├── kalimba.css           # 卡林巴样式
│   ├── pico-color-picker.css # 颜色选择器样式
│   └── pico-theme-switcher.css # 主题切换样式
├── js/
│   ├── kalimba.js            # 核心逻辑
│   ├── lang.js               # 多语言支持
│   ├── fullscreen.js         # 全屏功能
│   ├── pico-color-picker.js  # 颜色选择器
│   └── pico-theme-switcher.js # 主题切换器
├── lang/                     # 多语言文件
│   ├── zh-CN.json            # 中文（简体）
│   ├── en.json               # 英语
│   ├── ar.json               # 阿拉伯语
│   ├── de.json               # 德语
│   ├── es.json               # 西班牙语
│   ├── fr.json               # 法语
│   ├── id.json               # 印尼语
│   ├── ja.json               # 日语
│   ├── pt.json               # 葡萄牙语
│   └── ru.json               # 俄语
├── lib/                      # 第三方库
│   ├── jquery.min.js         # jQuery 3.7.1
│   ├── soundfont-player.min.js # SoundFontPlayer 0.12.0
│   └── pico.min.css          # Pico.css 1.5.13
└── soundfonts/               # 音色库
    ├── FluidR3_GM/
    │   └── kalimba-mp3.js    # 1.6 MB
    ├── FatBoy/
    │   └── kalimba-mp3.js    # 1.6 MB
    └── keylimba/
        └── kalimba.mp3.js    # 已存在
```

### 相关文档

- `README.md` - 项目说明
- `DOCKER_DEPLOY.md` - Docker 部署详细文档
- `LICENSE` - 许可证文件

### 贡献者

- Artem Samsonov - 原始作者
- 贡献者列表详见 GitHub 仓库

### 许可证

项目使用开源许可证，详见 `LICENSE` 文件。