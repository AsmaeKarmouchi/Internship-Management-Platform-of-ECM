# 📚 Internship Management Platform of ECM

A complete web platform built to manage internships for a business school, designed with the **PERN stack** (PostgreSQL, Express.js, React, Node.js).  
This project includes three tailored user roles (**Admin**, **Professor**, and **Student**) to deliver a personalized and secure user experience.

---

## 🌟 Key Features

### 🎯 Global Features
- **User Management**: Manage accounts for administrator, professors, and students.
- **Data Security**: Passwords are encrypted using `bcryptjs` to ensure data safety.
- **Modern Interface**: Built with React for a responsive and user-friendly design.

### 🖥️ User Roles and Spaces
1. **Admin Space**:
   - Oversee and manage internships, students, and professors.
   - Access to dashboards and detailed analytics.

2. **Professor Space**:
   - Review and validate internship proposals.
   - Monitor submitted internship reports.

3. **Student Space**:
   - Submit internship proposals and follow their approval status.
   - Track the progress of their internships.

---

## 🏗️ PERN Architecture

### **How PERN Works in This Project**
1. **PostgreSQL**:  
   - Serves as the relational database to manage data for users, internships, and reports.
   - The database design follows the **Merise methodology** (MCD, MLD, MCT).

2. **Express.js**:  
   - Backend API connecting the database to the frontend.
   - Manages secure routes and CRUD operations.

3. **React.js**:  
   - Frontend framework for creating an interactive and responsive user interface.
   - Communicates with the backend to display dynamic content.

4. **Node.js**:  
   - Powers the server-side code, handling API requests and responses efficiently.

---

## 📂 Project Structure
Internship-Management-Platform ├── 
-  client (Frontend) .
-  server (Backend).
  
 ### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/AsmaeKarmouchi/Internship-Management-Platform-of-ECM.git
   cd Internship-Management-Platform-of-ECM

# **creat 2 terminals:**
2. 
### Backend
 
- cd server
- npm install
- npm audit fix --force

### Frontend
- cd client
- npm install
- npm audit fix --force


# Configure environment variables:
3. In the server folder, create a .env file with the following:
- DB_USER=<your_postgresql_username>
- DB_PASSWORD=<your_postgresql_password>
- DB_NAME=internship_management
- DB_HOST=localhost

# Run the application:
4.  Start 
 ```bash
# Start the Backend
cd server
npm start  

# Start the frontend
cd client
npm start



