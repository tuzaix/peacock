# Peacock 部署教程 (Ubuntu)

本教程将指导您如何在 Ubuntu 服务器上部署 Peacock 项目。本项目是一个基于 Vite + React 的静态应用，建议使用 Nginx 进行托管。

---

## 1. 环境准备

首先更新系统软件包并安装必要的工具。

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nginx git curl
```

### 安装 Node.js (推荐使用 nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

---

## 2. 项目获取与安装

克隆代码库到服务器（建议放在 `/var/www` 目录下）。

```bash
sudo mkdir -p /var/www/peacock
sudo chown -R $USER:$USER /var/www/peacock
cd /var/www/peacock
git clone <您的仓库地址> .
```

安装依赖：

```bash
npm install
```

---

## 3. 配置文件

在根目录创建 `.env` 文件并配置环境变量（如 `VITE_FROM_SOURCE`）。

```bash
nano .env
```

添加以下内容（根据实际需求修改）：
```env
VITE_FROM_SOURCE=https://your-domain.com/
```

---

## 4. 构建项目

运行构建命令生成静态文件：

```bash
npm run build
```

构建完成后，静态文件将位于 `dist` 目录中。

---

## 5. 配置 Nginx

如果您是第一次为该域名配置 Nginx，请参考 **方案 A**。如果您已经有运行中的服务（如 Next.js、API 等），请参考 **方案 B**。

### 方案 A：独立站点配置
创建一个新的 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/peacock
```

输入以下配置内容：

```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为您的域名或 IP

    root /var/www/peacock/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存配置
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # 开启 Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/peacock /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 方案 B：多服务集成配置（推荐）
如果您已经有现成的 `server` 块（例如正在运行 Next.js 服务），可以将 Peacock 作为一个路径或主站集成进去。

编辑您现有的配置文件（例如 `/etc/nginx/sites-available/treatsyoself.com`）：

```nginx
server {
    server_name treatsyoself.com www.treatsyoself.com;

    # 1. 设置 Peacock 的静态文件根目录
    root /var/www/peacock/dist;
    index index.html;

    # 2. Peacock 主程序入口
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 3. 集成已有的其他服务 (例如 Next.js)
    location /my-mbti {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SSL 相关的配置保持不变 (由 Certbot 管理)
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/treatsyoself.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/treatsyoself.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

---

## 6. 自动化数据更新与图标缓存

项目提供了两个维护脚本，建议通过 Crontab 定期运行。

### 定期更新新闻源
```bash
0 * * * * cd /var/www/peacock && /home/your-user/.nvm/versions/node/v20.x.x/bin/node scripts/fetch-feeds.js >> /var/www/peacock/fetch.log 2>&1
```

### 缓存站点图标 (优化访问速度)
为了避免频繁请求 Google Favicon 服务，您可以预先下载并缓存所有导航站点的图标：

```bash
cd /var/www/peacock
npm run fetch-icons
```

> **提示**：如果您的服务器无法直接访问海外资源，可以在运行脚本前设置代理：
> `export http_proxy=http://127.0.0.1:7897 && export https_proxy=http://127.0.0.1:7897`

---

## 7. 配置 HTTPS (推荐)

使用 Certbot 免费获取 SSL 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 8. 维护与更新

当代码有更新时：

```bash
cd /var/www/peacock
git pull
npm install
npm run build
# Nginx 会自动服务最新的 dist 目录，无需重启
```

---

## 9. 环境变量配置参考

以下是 `.env` 文件中可用的环境变量：

```env
# 站点基础 URL，用于生成来源参数
VITE_FROM_SOURCE=https://your-domain.com/

# Google Analytics 测量 ID (可选)
VITE_GA_ID=G-XXXXXXXXXX
```

