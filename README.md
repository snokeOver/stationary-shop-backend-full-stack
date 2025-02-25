## 🛒 Snoke Stationery Shop Backend

This project is a **TypeScript-based Express.js** application designed to manage a **Stationery Shop's inventory, user authentication, role-based access, orders, and payment processing**. It integrates **MongoDB** using **Mongoose** for database operations and ensures data integrity through **schema validation** and **JWT authentication**. The application also includes **Stripe** for secure payment processing.

---

## 🚀 Features

### 1. **Stationery Product Management**

- **Admin-Only Access**: Create, retrieve, update, and delete products.
- **Advanced Querying**: Search products by name, brand, or category.
- **Real-Time Inventory Updates**: Automatically update stock levels when orders are placed.

### 2. **Order Management**

- **Place Orders**: Customers can place orders for available products.
- **Inventory Checks**: Prevent orders when stock is insufficient.
- **Revenue Tracking**: Calculate total revenue from all orders.

### 3. **Payment Processing**

- **Stripe Integration**: Secure payment processing for orders.
- **Payment Confirmation**: Automatically confirm payments and update order status.

### 4. **User Authentication & Role-Based Access**

- **JWT Authentication**: Secure user authentication with JSON Web Tokens.
- **Role-Based Access Control**: Differentiate between admin and customer roles.
- **Refresh Tokens**: Implemented for secure token refreshing.
- **User Registration & Login**: Secure user registration and login flow.

### 5. **User Management**

- **Admin Controls**: Block or unblock users.
- **User Profile Management**: Users can update their profiles.

### 6. **Data Validation**

- **Mongoose Schema Validation**: Ensure data integrity at the database level.
- **Input Validation**: Validate user inputs before processing.

### 7. **Error Handling**

- **Generic Error Responses**: Clear and consistent error messages.
- **Custom Error Middleware**: Centralized error handling for all routes.

---

## 🛠️ Technologies Used

- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ORM**: [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **Payment Processing**: [Stripe](https://stripe.com/)
- **Environment Management**: [dotenv](https://www.npmjs.com/package/dotenv)
- **API Testing**: [Postman](https://www.postman.com/)

---

## 📂 Project Structure

plaintext

Copy

stationary-shop/
├── src/
│ ├── app.ts # Express application setup
│ ├── server.ts # Server initialization
│ ├── config/ # Configuration files (e.g., database, environment)
│ ├── controllers/ # Route controllers
│ ├── interfaces/ # TypeScript interfaces
│ ├── middleware/ # Custom middleware (e.g., authentication, error handling)
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ ├── utils/ # Utility functions (e.g., token generation)
├── .env.example # Environment variables template
├── .gitignore # Files and directories to ignore in Git
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── README.md # Project documentation

---

## 🧩 Models Overview

### **Stationery Product Model**

| Field         | Type      | Description                              |
| ------------- | --------- | ---------------------------------------- |
| `name`        | `string`  | Name of the product.                     |
| `brand`       | `string`  | Brand of the product.                    |
| `price`       | `number`  | Price of the product.                    |
| `category`    | `enum`    | Category: Writing, Office Supplies, etc. |
| `description` | `string`  | Brief description of the product.        |
| `quantity`    | `number`  | Available quantity.                      |
| `inStock`     | `boolean` | Whether the product is in stock.         |

### **Order Model**

| Field        | Type       | Description                                |
| ------------ | ---------- | ------------------------------------------ |
| `email`      | `string`   | Customer's email address.                  |
| `product`    | `ObjectId` | The product ordered (referencing Product). |
| `quantity`   | `number`   | Quantity of the product ordered.           |
| `totalPrice` | `number`   | Total price of the order.                  |
| `status`     | `string`   | Order status (e.g., pending, completed).   |

### **User Model**

| Field       | Type      | Description                           |
| ----------- | --------- | ------------------------------------- |
| `name`      | `string`  | User's full name.                     |
| `email`     | `string`  | User's email address.                 |
| `password`  | `string`  | Hashed password.                      |
| `role`      | `enum`    | User role: `admin` or `customer`.     |
| `isBlocked` | `boolean` | Whether the user is blocked by admin. |

---

## 📋 API Endpoints

### **Stationery Products**

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| POST   | `/api/products`            | Create a new product.        |
| GET    | `/api/products`            | Retrieve all products.       |
| GET    | `/api/products/:productId` | Retrieve a specific product. |
| PUT    | `/api/products/:productId` | Update a product.            |
| DELETE | `/api/products/:productId` | Delete a product.            |

### **Orders**

| Method | Endpoint              | Description                          |
| ------ | --------------------- | ------------------------------------ |
| POST   | `/api/orders`         | Place a new order.                   |
| GET    | `/api/orders/revenue` | Calculate total revenue from orders. |

### **Payments**

| Method | Endpoint        | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/api/payments` | Process payment via Stripe. |

### **Users**

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | `/api/users/register` | Register a new user.                  |
| POST   | `/api/users/login`    | Log in a user.                        |
| GET    | `/api/users`          | Retrieve all users (admin-only).      |
| PUT    | `/api/users/:userId`  | Update user details (admin-only).     |
| DELETE | `/api/users/:userId`  | Block or unblock a user (admin-only). |

---

## 🛡️ Error Handling

- **Validation Errors**: Detailed messages for invalid inputs.
- **Resource Not Found**: 404 errors for missing products or orders.
- **Insufficient Stock**: Prevents orders exceeding available inventory.
- **Payment Failures**: Handle Stripe payment errors gracefully.

Example Error Response:

json

Copy

{
"message": "Payment failed",
"success": false,
"error": {
"code": "card_declined",
"message": "Your card was declined."
},
"stack": "Error trace..."
}

---

## 🛑 Prerequisites

- **Node.js** (v16+)
- **MongoDB** (Atlas or Local)
- **npm** (or yarn)
- **Stripe Account**: For payment processing.

---

## 🔧 Setup

1. **Clone the repository**:

   bash

   Copy

   git clone https://github.com/snokeOver/stationary-shop-backend-full-stack
   cd stationary-shop

2. **Install dependencies**:

   bash

   Copy

   npm install

3. **Set up environment variables**:

   Create a `.env` file with the following values:

   plaintext

   Copy

   SERVER_PORT=3500
   MONGODB_URL=your_mongodb_connection_string
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_ACCESS_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=your_stripe_secret_key
   SALT_ROUND=Round_of_your_salt
   DEFAULT_PASS=default_password

4. **Start the application**:

   bash

   Copy

   npm run dev

5. **Test the API** using tools like [Postman](https://www.postman.com/) or `cURL`.

---

## 🖥️ Deployment

- **Deployed Link**: [Live Demo](https://snoke-stationary.vercel.app/)
- **GitHub Repository**: [Stationery Shop](https://github.com/snokeOver/stationary-shop-backend-full-stack)

---

## 🎥 Video Walkthrough

Watch the API walkthrough: [Video Explanation](https://drive.google.com/file/d/1bPaPIERabhza6jswb9MH-cmbQB2Nj2sW/view?usp=drive_link)

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the **Issues** page or submit a pull request.

---

## 👨‍💻 Author

**Shubhankar Halder**

###### MERN, TypeScript, Next.js, Node.js, MongoDB | Crafting user-friendly, secure, scalable Web Apps | Passionate about Software Engineering

- **GitHub**: [@snokeOver](https://github.com/snokeOver)
- **LinkedIn**: [Shubhankar Halder](https://www.linkedin.com/in/shubhankar-halder/)

---

### Key Additions:

1. **Stripe Integration**:

   - Added details about **Stripe payment processing** in the **Features** and **API Endpoints** sections.

2. **User Management**:

   - Added details about **user registration, login, and admin controls** (block/unblock users).

3. **Order Management**:

   - Added **order status** to the **Order Model**.

4. **Error Handling**:

   - Added an example error response for **payment failures**.

5. **Environment Variables**:

   - Added `STRIPE_SECRET_KEY` to the `.env` setup.
