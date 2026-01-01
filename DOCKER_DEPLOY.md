# Docker 部署指南

## 快速开始

### 方法一：使用 Docker Compose（推荐）

1. **在 NAS 上创建项目目录**
   ```bash
   mkdir -p /volume1/docker/kalimba-online
   cd /volume1/docker/kalimba-online
   ```

2. **上传项目文件**
   - 将整个项目文件夹上传到 NAS 的 `/volume1/docker/kalimba-online` 目录
   - 确保包含以下文件：
     - `Dockerfile`
     - `docker-compose.yml`
     - `nginx.conf`
     - `index.html`
     - `js/` 目录
     - `css/` 目录
     - `lib/` 目录
     - `soundfonts/` 目录
     - `lang/` 目录
     - `img/` 目录

3. **构建并启动容器**
   ```bash
   docker-compose up -d
   ```

4. **访问应用**
   - 打开浏览器访问：`http://NAS_IP:8080`
   - 例如：`http://192.168.1.100:8080`

### 方法二：使用 Docker 命令

1. **构建镜像**
   ```bash
   docker build -t kalimba-online:latest .
   ```

2. **运行容器**
   ```bash
   docker run -d \
     --name kalimba-online \
     -p 8080:80 \
     --restart unless-stopped \
     kalimba-online:latest
   ```

## NAS 部署（Synology / QNAP）

### Synology NAS

1. **安装 Docker 套件**
   - 打开套件中心
   - 搜索并安装 "Docker" 或 "Container Manager"

2. **使用 Docker Compose**
   ```bash
   # SSH 登录到 NAS
   ssh your-nas-ip

   # 创建项目目录
   mkdir -p /volume1/docker/kalimba-online
   cd /volume1/docker/kalimba-online

   # 上传项目文件（使用 File Station 或 scp）
   # 然后运行
   docker-compose up -d
   ```

3. **配置反向代理（可选）**
   - 打开控制面板 → 应用程序门户
   - 创建反向代理规则
   - 源：`kalimba.yourdomain.com`
   - 目标：`http://localhost:8080`

### QNAP NAS

1. **安装 Container Station**
   - 打开 App Center
   - 搜索并安装 "Container Station"

2. **部署应用**
   - 打开 Container Station
   - 选择"创建容器"
   - 选择"从 Dockerfile 构建"
   - 或使用命令行界面执行 docker-compose 命令

## 配置说明

### 修改端口

如果 8080 端口已被占用，修改 `docker-compose.yml`：

```yaml
ports:
  - "3000:80"  # 改为其他端口
```

### 修改时区

在 `docker-compose.yml` 中修改：

```yaml
environment:
  - TZ=Asia/Shanghai  # 改为你所在的时区
```

### 启用 HTTPS（可选）

建议使用反向代理（如 Nginx Proxy Manager、Traefik）来处理 HTTPS：

```yaml
# 示例：配合 Nginx Proxy Manager
labels:
  - "com.centurylinklabs.watchtower.enable=true"
  - "traefik.enable=true"
  - "traefik.http.routers.kalimba.rule=Host(`kalimba.yourdomain.com`)"
  - "traefik.http.routers.kalimba.tls.certresolver=letsencrypt"
```

## 常用命令

### 查看日志
```bash
docker-compose logs -f kalimba-online
```

### 停止容器
```bash
docker-compose stop
```

### 启动容器
```bash
docker-compose start
```

### 重启容器
```bash
docker-compose restart
```

### 删除容器
```bash
docker-compose down
```

### 重新构建
```bash
docker-compose build --no-cache
docker-compose up -d
```

### 更新应用

1. 上传新的项目文件
2. 重新构建并启动
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

## 故障排查

### 容器无法启动
```bash
# 查看错误日志
docker-compose logs kalimba-online

# 检查端口是否被占用
netstat -tuln | grep 8080
```

### 页面无法访问
- 检查防火墙设置
- 确认容器正在运行：`docker ps`
- 检查端口映射是否正确

### 音色库无法加载
- 确认 `soundfonts/` 目录已正确上传
- 检查文件权限：`ls -la soundfonts/`
- 查看浏览器控制台错误信息

## 性能优化

### 资源限制

在 `docker-compose.yml` 中添加资源限制：

```yaml
services:
  kalimba-online:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 128M
        reservations:
          cpus: '0.25'
          memory: 64M
```

### 启用缓存

Nginx 配置已包含静态资源缓存，无需额外配置。

## 安全建议

1. **定期更新基础镜像**
   ```bash
   docker pull nginx:alpine
   docker-compose build --no-cache
   ```

2. **使用非 root 用户运行**（如需要）
   - 修改 Dockerfile 添加用户配置

3. **限制网络访问**
   - 使用 Docker 网络隔离
   - 配置防火墙规则

## 备份

### 备份项目文件
```bash
# 打包项目目录
tar -czf kalimba-online-backup.tar.gz /volume1/docker/kalimba-online

# 备份到其他位置
cp kalimba-online-backup.tar.gz /volume1/backup/
```

### 恢复
```bash
# 解压备份
tar -xzf kalimba-online-backup.tar.gz -C /volume1/docker/

# 重新构建
cd /volume1/docker/kalimba-online
docker-compose up -d
```

## 支持

如有问题，请检查：
1. Docker 日志
2. 浏览器控制台
3. Nginx 访问日志
4. NAS 系统日志