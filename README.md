
# 🍽️ Restaurant Reservation System

## 🚀 Project Overview
This is a **Full-Stack Restaurant Reservation System** built with **Node.js, Express, MongoDB, and JWT Authentication**. It allows users to **sign up, log in, and book tables at restaurants**.

---

## ✅ Features (What We Aim to Achieve)
### **1️⃣ User Authentication**
✔️ User Registration (Sign Up)  
✔️ User Login  
✔️ Token-based Authentication (JWT)  
✔️ Protect Private Routes with Middleware  

### **2️⃣ Restaurant Reservations**
⏳ Create, Update, Cancel Reservations  
⏳ Allow restaurant admins to manage tables  

### **3️⃣ Additional Features (Future Plans)**
🔹 User Role Management (Admin, Customer)  
🔹 Email Notifications for Reservations  
🔹 Payment Gateway for Bookings  

---

## 📀 Technologies Used
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT  
- **Authentication:** bcrypt.js, jsonwebtoken  
- **Validation:** express-validator  
- **Environment Variables:** dotenv  
- **API Testing:** Postman  

---

## 📚 Project Structure
```
Restaurant Reservation System/
├── config/         # Database connection
├── models/         # Mongoose models (User, Reservation)
├── routes/         # API routes (auth, reservations)
├── middleware/     # Auth middleware
├── src/            # Main app.js file
├── .env            # Environment variables (ignored in Git)
├── .gitignore      # Ignore sensitive files
├── package.json    # Dependencies
├── README.md       # Project Documentation
```

---

## 🛠️ Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/restaurant-reservation-system.git
   cd restaurant-reservation-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
    - Create a `.env` file and add:
        ```plaintext
        DB_CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/database
        JWT_SECRET=mysecretkey
        PORT=3000
        ```

4. **Start the server:**
   ```bash
   npm start
   ```

---

## 📩 API Endpoints
### **🔑 Authentication**
| Method | Endpoint           | Description         | Protected |
|--------|-------------------|---------------------|------------|
| `POST` | `/api/auth/signup` | Register new user  | ❌ No |
| `POST` | `/api/auth/login`  | User login         | ❌ No |

### **📅 Reservations (Upcoming)**
| Method | Endpoint                | Description          | Protected |
|--------|------------------------|----------------------|------------|
| `POST` | `/api/reservations`     | Create a reservation | ✅ Yes |
| `GET`  | `/api/reservations`     | View reservations    | ✅ Yes |
| `DELETE` | `/api/reservations/:id` | Cancel reservation   | ✅ Yes |

---

## 🤝 Contributing
Want to contribute? Feel free to **fork, submit pull requests, or open issues**! 😊

---

## 📈 Progress So Far
✔️ **MongoDB Connection Established**  
✔️ **User Authentication Completed**  
✔️ **Protected Routes Implemented**  
⏳ **Reservation System - In Progress**  

---

## 💬 Questions?
For any questions, feel free to reach out or open an issue! 🚀


## Contributors:
- Muneeb Hashmi
- Nikhita Peswani