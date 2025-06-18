# Oxdel Platform - Deployment Guide

## Production Deployment

### Prerequisites
- VPS/Cloud server (Ubuntu 20.04+ recommended)
- Domain name
- SSL certificate (Let's Encrypt recommended)
- MySQL 8.0+
- Node.js 18+
- Nginx
- PM2 (for process management)

### 1. Server Setup

#### Update system
```bash
sudo apt update && sudo apt upgrade -y
```

#### Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

#### Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

#### Install PM2
```bash
sudo npm install -g pm2
```

### 2. Database Setup

#### Create database and user
```sql
CREATE DATABASE oxdel_production;
CREATE USER 'oxdel_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON oxdel_production.* TO 'oxdel_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Run migrations
```bash
mysql -u oxdel_user -p oxdel_production < backend/database/migrations/001_create_page_views_table.sql
mysql -u oxdel_user -p oxdel_production < backend/database/migrations/002_add_template_fields.sql
```

### 3. Application Deployment

#### Clone repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/oxdel-platform.git
sudo chown -R $USER:$USER oxdel-platform
cd oxdel-platform
```

#### Backend setup
```bash
cd backend
npm install --production
```

#### Create production environment file
```bash
cp .env.example .env.production
```

Edit `.env.production`:
```env
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_USER=oxdel_user
DB_PASSWORD=secure_password_here
DB_NAME=oxdel_production

# SMTP (Brevo/SendGrid)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_smtp_password

# JWT
JWT_SECRET=very_secure_random_string_here
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

#### Frontend setup
```bash
cd ../frontend
npm install
```

Create production environment file:
```bash
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env.production
```

Build frontend:
```bash
npm run build
```

### 4. PM2 Configuration

Create PM2 ecosystem file:
```bash
# /var/www/oxdel-platform/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'oxdel-backend',
      script: './backend/server.js',
      cwd: '/var/www/oxdel-platform',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      error_file: '/var/log/oxdel/backend-error.log',
      out_file: '/var/log/oxdel/backend-out.log',
      log_file: '/var/log/oxdel/backend-combined.log',
      time: true
    }
  ]
};
```

Create log directory:
```bash
sudo mkdir -p /var/log/oxdel
sudo chown $USER:$USER /var/log/oxdel
```

Start application:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 5. Nginx Configuration

#### Backend API configuration
```nginx
# /etc/nginx/sites-available/oxdel-api
server {
    listen 80;
    server_name api.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    # Proxy to Node.js backend
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /api/health {
        access_log off;
        proxy_pass http://localhost:5000;
    }
}
```

#### Frontend configuration
```nginx
# /etc/nginx/sites-available/oxdel-frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Document root
    root /var/www/oxdel-platform/frontend/dist;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router (SPA) support
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (fallback)
    location /api {
        proxy_pass https://api.yourdomain.com;
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/ox del-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/oxdel-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y

# Get certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Firewall Setup

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 3306  # MySQL (only if needed externally)
sudo ufw enable
```

### 8. Monitoring & Logging

#### Setup log rotation
```bash
# /etc/logrotate.d/oxdel
/var/log/oxdel/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

#### PM2 monitoring
```bash
# Install PM2 monitoring (optional)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 9. Backup Strategy

#### Database backup script
```bash
#!/bin/bash
# /home/user/scripts/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
DB_NAME="oxdel_production"
DB_USER="oxdel_user"
DB_PASS="secure_password_here"

mkdir -p $BACKUP_DIR

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/oxdel_db_$DATE.sql

# Compress
gzip $BACKUP_DIR/oxdel_db_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "oxdel_db_*.sql.gz" -mtime +30 -delete

echo "Database backup completed: oxdel_db_$DATE.sql.gz"
```

Make executable and add to cron:
```bash
chmod +x /home/user/scripts/backup-db.sh
crontab -e
# Add: 0 2 * * * /home/user/scripts/backup-db.sh
```

### 10. Performance Optimization

#### MySQL optimization
```sql
# /etc/mysql/mysql.conf.d/mysqld.cnf
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
query_cache_type = 1
query_cache_size = 64M
max_connections = 200
```

#### Node.js optimization
```bash
# In ecosystem.config.js
instances: 'max',  # Use all CPU cores
max_memory_restart: '1G',
node_args: '--max-old-space-size=1024'
```

### 11. Health Checks & Monitoring

#### Simple health check script
```bash
#!/bin/bash
# /home/user/scripts/health-check.sh

API_URL="https://api.yourdomain.com/api/health"
FRONTEND_URL="https://yourdomain.com"

# Check API
if curl -f -s $API_URL > /dev/null; then
    echo "API is healthy"
else
    echo "API is down! Restarting..."
    pm2 restart oxdel-backend
fi

# Check frontend
if curl -f -s $FRONTEND_URL > /dev/null; then
    echo "Frontend is healthy"
else
    echo "Frontend is down! Check Nginx"
    sudo systemctl restart nginx
fi
```

Add to cron (every 5 minutes):
```bash
*/5 * * * * /home/user/scripts/health-check.sh >> /var/log/health-check.log 2>&1
```

### 12. Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall (UFW)
- [ ] Setup SSL certificates
- [ ] Configure security headers
- [ ] Enable rate limiting
- [ ] Setup log monitoring
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Backup encryption
- [ ] Monitor failed login attempts

### 13. Maintenance

#### Update application
```bash
cd /var/www/oxdel-platform
git pull origin main

# Backend
cd backend
npm install --production
pm2 restart oxdel-backend

# Frontend
cd ../frontend
npm install
npm run build
```

#### Monitor logs
```bash
pm2 logs oxdel-backend
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

#### Database maintenance
```bash
# Optimize tables monthly
mysqlcheck -u oxdel_user -p --optimize oxdel_production

# Check disk usage
df -h
du -sh /var/www/oxdel-platform
```

This deployment guide ensures a production-ready, secure, and scalable deployment of the Oxdel platform.