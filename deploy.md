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

---

## 6. 自动化数据更新 (可选)

如果项目需要定期运行脚本更新数据（如 `fetch-feeds`），可以配置 Crontab。

```bash
crontab -e
```

添加以下行（例如每小时运行一次）：
```bash
0 * * * * cd /var/www/peacock && /home/your-user/.nvm/versions/node/v20.x.x/bin/node scripts/fetch-feeds.js >> /var/www/peacock/fetch.log 2>&1
```

---

## 7. 配置 HTTPS (推荐)

使用 Certbot 免费获取 SSL 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 8. 维护与更新

当代码有更新时：

```bash
cd /var/www/peacock
git pull
npm install
npm run build
# Nginx 会自动服务最新的 dist 目录，无需重启
```
