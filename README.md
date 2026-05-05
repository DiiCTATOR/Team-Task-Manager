# Team Task Manager

A premium full-stack web application designed for team project and task management with role-based access control.

## 🚀 Key Features
- **Authentication:** Secure Signup/Login using JWT and bcrypt.
- **Role-Based Access Control (RBAC):** Admin and Member roles. Admins can create projects, assign tasks, edit details, and delete them. Members can view their tasks and update statuses.
- **Project & Team Management:** Group tasks under specific projects.
- **Task Tracking:** Dashboard displaying real-time statistics, with overdue task highlighting and status management.
- **Premium UI:** Glassmorphism design, responsive layouts, dynamic animations, and a modern color palette.

## 🛠️ Technology Stack
- **Frontend:** Vanilla HTML, CSS, JavaScript (Zero-build system for maximum speed)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)

## ⚙️ Local Setup
1. Open terminal and run `npm install`
2. Start the server with `npm start`
3. The server runs on `http://localhost:5000`

## 🌐 Railway Deployment Instructions
To submit the live URL for your assignment:

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Run these commands:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
     git push -u origin main
     ```

2. **Deploy on Railway**:
   - Go to [Railway.app](https://railway.app/).
   - Click **New Project** -> **Deploy from GitHub repo**.
   - Select your newly created repository.
   - Click **Add a Database** -> **MongoDB** to add the database directly to your project.
   - Go to your application's **Variables** setting on Railway, click **Add Variable**, and add `MONGO_URI`. The value will automatically map to your Railway MongoDB instance if you link them, or you can paste the provided MongoDB connection string.
   - Railway will automatically detect the `package.json` in the root folder, run `npm install` and `npm start`.
   - Your frontend and backend are unified, so Railway will expose your live web app URL instantly!

3. **Submission**:
   - **Live URL**: The provided `.up.railway.app` URL from Railway.
   - **GitHub repo**: Your repository link.
   - **README**: This file.
