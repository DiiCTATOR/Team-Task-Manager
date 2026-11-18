#!/bin/bash
# ==============================================================
# AWS EC2 Setup & Run Script for Team Task Manager
# Target OS: Ubuntu 20.04 / 22.04 / 24.04 LTS
# ==============================================================

set -e

echo "=== 1. Updating System Packages ==="
sudo apt-get update -y
sudo apt-get install -y curl git build-essential

echo "=== 2. Installing Node.js 20 LTS ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "=== 3. Installing Application Dependencies ==="
npm install

echo "=== 4. Setting up PM2 Process Manager ==="
sudo npm install -g pm2

# Stop existing instance if already running
pm2 delete team-task-manager 2>/dev/null || true

# Start with ecosystem config
pm2 start ecosystem.config.js

# Save PM2 process list to restore on server reboots
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

echo "=============================================================="
echo "✅ Application successfully started on AWS EC2!"
echo "Server listening on port 5000."
echo "Access via: http://<YOUR-EC2-PUBLIC-IP>:5000"
echo "Check logs with: pm2 logs team-task-manager"
echo "Check status with: pm2 status"
echo "=============================================================="
