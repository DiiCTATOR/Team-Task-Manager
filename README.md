# Team Task Manager

A full-stack web application designed for team project and task management with role-based access control.

Built with **HTML/CSS/JS frontend**, **Node.js & Express backend**, and an **embedded SQLite database**. No Docker or external database services required.

---

## 🏗️ 3-Tier Architecture

- **Frontend (`frontend/`)**: Modern responsive UI (HTML5, CSS3 Glassmorphism, Vanilla JS) with task tracking, project creation, role management, and real-time dashboard stats. Served directly by Express.
- **Backend (`backend/server.js`)**: Express REST API with JWT authentication, password hashing (`bcryptjs`), and Role-Based Access Control (`/api/auth`, `/api/projects`, `/api/tasks`).
- **Database (`backend/database.sqlite`)**: Embedded **SQLite** database via **Sequelize ORM** that automatically syncs schema without any external database server setup.

---

## ☁️ AWS EC2 Deployment Guide (Step-by-Step)

Follow these steps to run the application on an AWS EC2 instance without errors.

### Step 1: Configure AWS Security Group (Crucial!)
Before opening the app in a browser, allow incoming traffic to your EC2 instance:
1. In the **AWS EC2 Console**, go to **Instances** and select your instance.
2. Under the **Security** tab, click your **Security Group**.
3. Click **Edit inbound rules** -> **Add rule**:
   - **Type**: Custom TCP
   - **Port range**: `5000` (or `80` if using Nginx reverse proxy)
   - **Source**: `Anywhere-IPv4` (`0.0.0.0/0`)
4. Click **Save rules**.

---

### Step 2: Connect to Your EC2 Instance
Connect from your local terminal via SSH:
```bash
ssh -i "your-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

---

### Step 3: Clone & Deploy

#### Option A: One-Command Automated Setup (Recommended)
```bash
git clone https://github.com/<YOUR-USERNAME>/Team-Task-Manager.git
cd Team-Task-Manager
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

#### Option B: Manual Setup Commands
```bash
# 1. Update packages & install Node.js 20
sudo apt-get update -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential git

# 2. Clone repository & install dependencies
git clone https://github.com/<YOUR-USERNAME>/Team-Task-Manager.git
cd Team-Task-Manager
npm install

# 3. Install PM2 process manager (keeps app running 24/7)
sudo npm install -g pm2

# 4. Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### Step 4: Access Your Application
Open your browser and navigate to:
```
http://<YOUR-EC2-PUBLIC-IP>:5000
```

---

## 🛠️ Managing the App on EC2

| Command | Description |
| :--- | :--- |
| `pm2 status` | View server status and uptime |
| `pm2 logs team-task-manager` | View live server output and error logs |
| `pm2 restart team-task-manager` | Restart the application |
| `pm2 stop team-task-manager` | Stop the application |

---

## 💻 Running Locally (Development)

```bash
npm install
npm start
```
App runs at: `http://localhost:5000`
