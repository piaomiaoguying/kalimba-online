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