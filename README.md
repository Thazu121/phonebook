# 📞 Phonebook Application (Local API)

This is a simple Phonebook Application built using HTML, CSS, JavaScript, and a Local API created with json-server.  
It supports CRUD operations and avoids duplicate contacts.

---

## 🚀 Features

- Add new contacts  
- View all contacts  
- Edit existing contacts  
- Delete contacts  
- Prevent duplicate phone numbers  
- Uses Local API (json-server)  
- Uses Fetch API with async/await  

---

## 🛠 Technologies Used

- HTML  
- CSS  
- JavaScript  
- Node.js  
- json-server  

---

## 📁 Project Structure

phonebook/
├── index.html  
├── style.css  
├── script.js  
├── db.json  
└── README.md  

---

## ⚙️ How to Run the Project

### 1️⃣ Install Node.js
Download and install from:
https://nodejs.org

---

### 2️⃣ Install json-server (One Time)

npm install -g json-server

Check installation:
json-server --version

---

### 3️⃣ Create Database File (db.json)

{
  "contacts": []
}

---

### 4️⃣ Start Local API Server

Open terminal in project folder and run:

json-server --watch db.json

---

### 5️⃣ Open API in Browser

http://localhost:3000/contacts

---

### 6️⃣ Run the Application

Open index.html in your browser.

---

## 🔁 CRUD Operations

Create  → POST    → /contacts  
Update  → PUT     → /contacts/id  
Delete  → DELETE  → /contacts/id  

---

## 🚫 Avoiding Duplication

- Existing contacts are fetched before saving
- Phone number is checked
- Duplicate contacts are not allowed

---


## 🧠 Why Local API?

- No internet required  
- Easy testing  
- No backend server needed  

---

## ✍️ Conclusion

This project demonstrates how to use a Local API with Fetch API to build a CRUD-based phonebook application.

---
  
