# 使用轻量级的 Nginx 镜像作为基础（使用国内镜像源）
FROM docker.m.daocloud.io/library/nginx:alpine

# 设置维护者信息
LABEL maintainer="your-email@example.com"

# 删除默认的 nginx 配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/

# 复制项目文件到 nginx 的静态文件目录
COPY . /usr/share/nginx/html

# 设置正确的文件权限
RUN chmod -R 755 /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]