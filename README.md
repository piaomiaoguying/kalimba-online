# 手机拇指琴 (Kalimba Online)

一个基于浏览器的卡林巴（拇指琴）演奏应用，专为移动设备优化，支持在手机端浏览器中轻松演奏。

## ✨ 主要特性

- 🎹 **触控演奏**：支持多点触控，可以用手指在屏幕上滑动演奏
- 🎨 **高度可定制**：
  - 三种音色库（FluidR3_GM、FatBoy、Keylimba）
  - 自定义音量和基调
  - 多种标签显示方式（数字、音名、混合）
  - 主题颜色切换（支持深色/浅色模式）
- 📱 **移动优先**：
  - 专为手机竖屏设计
  - 全屏演奏模式
  - 横屏全屏时支持"左右"布局，方便左右大拇指演奏
- 🌍 **多语言支持**：支持 10 种语言（中文、英语、俄语、德语、西班牙语、法语、阿拉伯语、葡萄牙语、日语、印尼语）
- 📦 **PWA 应用**：支持离线使用，可安装到主屏幕
- 🐳 **Docker 部署**：提供完整的 Docker 部署方案，支持 NAS 部署

## 🚀 快速开始

### 本地运行

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

### Docker 部署

#### 使用 Docker Compose（推荐）

```bash
# 进入项目目录
cd /path/to/kalimba-online

# 构建并启动
docker-compose up -d --build
```

#### 使用 Docker 命令

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

部署成功后，在浏览器中访问：`http://服务器IP:9999`

详细的 Docker 部署文档请参考 [DOCKER_DEPLOY.md](DOCKER_DEPLOY.md)。

## 🎼 默认配置

应用针对移动端演奏进行了优化，默认配置如下：

- **按键数量**：9 键
- **基本音**：E4
- **音色库**：Keylimba
- **全屏布局**：左右（手机端横屏全屏时）
- **标签类型**：数字
- **音量**：75%

## 🎹 9 键音符布局

默认的 9 键音符顺序（从左到右）：

| 位置 | 音符 | 标签 |
|------|------|------|
| 1 | E4 | 5 |
| 2 | G4 | 3 |
| 3 | B4 | 1 |
| 4 | D4 | 6̣ |
| 5 | F4 | 5̣ |
| 6 | A4 | 7̣ |
| 7 | C5 | 2 |
| 8 | E5 | 4 |
| 9 | G5 | 6 |

注：带点的数字表示低八度音符（如 6̣ 表示低八度的 6）。

## 🛠️ 技术栈

- **前端框架**：纯 JavaScript (Vanilla JS) + jQuery 3.7.1
- **CSS 框架**：Pico.css 1.5.13
- **音频引擎**：Soundfont-player 0.12.0
- **PWA 支持**：Service Worker + Manifest.json
- **本地存储**：localStorage（用于保存用户设置）
- **部署**：Nginx + Docker

## 📁 项目结构

```
kalimba-online/
├── index.html                 # 主页面
├── manifest.json              # PWA 清单文件
├── service-worker.js          # Service Worker
├── Dockerfile                 # Docker 镜像构建文件
├── docker-compose.yml         # Docker Compose 配置
├── nginx.conf                 # Nginx 配置
├── css/                       # 样式文件
│   ├── kalimba.css           # 卡林巴样式
│   ├── pico-color-picker.css # 颜色选择器样式
│   └── pico-theme-switcher.css # 主题切换样式
├── js/                        # 功能脚本
│   ├── kalimba.js            # 核心卡林巴逻辑
│   ├── lang.js               # 多语言支持
│   ├── fullscreen.js         # 全屏功能
│   ├── pico-color-picker.js  # 颜色选择器
│   └── pico-theme-switcher.js # 主题切换器
├── lang/                      # 多语言文件（10种语言）
├── lib/                       # 第三方库（本地化）
├── soundfonts/                # 音色库（本地化）
└── img/                       # 图片资源
```

## 🌐 多语言支持

应用支持以下语言：

- 🇨🇳 中文（简体）
- 🇬🇧 英语
- 🇷🇺 俄语
- 🇩🇪 德语
- 🇪🇸 西班牙语
- 🇫🇷 法语
- 🇸🇦 阿拉伯语
- 🇧🇷 葡萄牙语
- 🇯🇵 日语
- 🇮🇩 印尼语

语言文件位于 `lang/` 目录，采用 JSON 格式。

## 🔧 功能说明

### 全屏模式

- **竖屏模式**：点击全屏按钮后进入沉浸式演奏模式，隐藏所有设置选项
- **横屏模式**：
  - PC 端：直接进入全屏
  - 移动端：会提示用户先旋转至竖屏再进入全屏
  - 支持两种布局：
    - **默认布局**：琴键居中
    - **左右布局**：左边 4 个键往左移，右边 5 个键往右移，方便左右大拇指演奏

### 自定义选项

- **音量控制**：0-100% 可调
- **基本音**：C3-C6 可调
- **标签类型**：
  - 数字（1, 2, 3...）
  - 音名（C, D, E...）
  - 混合（1/C, 2/D...）
- **音色库**：
  - FluidR3_GM：标准 MIDI 音色
  - FatBoy：温暖厚重的音色
  - Keylimba：清脆明亮的音色（推荐）
- **主题颜色**：支持多种预设颜色
- **深色/浅色模式**：一键切换

### PWA 安装

应用支持作为 PWA 安装到设备：

- **移动设备**：通过浏览器菜单"添加到主屏幕"
- **桌面浏览器**：地址栏会显示安装图标

安装后可离线使用，无需网络连接。

## 🔒 安全配置

Docker 部署已配置安全限制，禁止访问以下文件：

- 文档文件（.md）
- 配置文件（Dockerfile、docker-compose.yml、nginx.conf）
- 脚本文件（.sh）
- .git 目录和 .gitignore 文件

## 📝 开发说明

### 代码风格

- **JavaScript**：使用 ES6+ 语法，采用面向对象编程（OOP）方式组织代码
- **CSS**：使用 CSS 变量（Custom Properties）实现主题切换
- **命名约定**：
  - 类名使用 PascalCase（如 `Kalimba_Online`）
  - 函数名使用 camelCase（如 `updateLabels`）
  - 常量使用 UPPER_SNAKE_CASE（如 `Soundfonts`）

### 数据持久化

所有用户设置都保存在 localStorage 中：

```javascript
// 保存设置
saveToLocalStorage("volume", 75);

// 读取设置
loadFromLocalStorage("volume", 75); // 默认值 75
```

### 音频处理

- 使用 Web Audio API (`AudioContext`)
- 支持三种音色库
- 音量控制基于线性缩放（`gain * volume / 100`）

## 🤝 贡献

欢迎贡献代码！请遵循以下原则：

1. 保持代码风格与现有代码一致
2. 测试所有更改，确保不影响现有功能
3. 更新相应的语言文件（如需）
4. 提交前请确保代码能正常运行

## 📄 许可证

本项目使用开源许可证，详见 [LICENSE](LICENSE) 文件。

## 📧 联系方式

- GitHub 仓库：[https://github.com/piaomiaoguying/kalimba-online.git](https://github.com/piaomiaoguying/kalimba-online.git)
- 原作者：Artem Samsonov
- 本作者：piaomiaoguying

---

**享受演奏的乐趣！** 🎵