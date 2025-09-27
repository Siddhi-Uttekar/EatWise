# EatWise - Food Safety Analyzer

A full-stack web application that helps users analyze food ingredients for **safety, allergens, and health risks**.
Users can upload a **food label image**, the system extracts the text using **OCR (Tesseract.js)**, and then analyzes the ingredients with **AI-powered safety evaluation** using Groq.

---

## 🚀 Features

* 📷 **OCR Extraction** – Upload a food label image and extract ingredients text
* 🤖 **AI-Powered Analysis** – Get safety scores, allergen detection, and risk levels
* ⚠️ **Risky Ingredients Detection** – Highlight harmful or allergenic items
* 💡 **Personalized Recommendations** – Safer consumption tips
* 🌐 **Full-Stack Architecture** – Node.js + Express backend, Vanilla JS + Tailwind frontend

---

## 🛠️ Tech Stack

### **Backend**

* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) – REST API
* [Multer](https://github.com/expressjs/multer) – File upload handling
* [Tesseract.js](https://tesseract.projectnaptha.com/) – OCR extraction
* [Groq](https://groq.com/) via [AI SDK](https://sdk.vercel.ai/docs) – AI ingredient analysis
* [Dotenv](https://www.npmjs.com/package/dotenv) – Environment variables
* [Cors](https://www.npmjs.com/package/cors) – Cross-origin requests

### **Frontend**

* HTML + TailwindCSS – UI
* Vanilla JavaScript – Client-side logic & API integration

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/eatwise.git
cd eatwise
```

### **2. Setup Backend**

```bash
cd server
npm install
```

Create a `.env` file:

```plaintext
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Run backend:

```bash
npm run dev
```

API will be live at:
👉 `http://localhost:5000`

### **3. Setup Frontend**

```bash
cd ../client
```

Run frontend:

```bash
# Option 1 (Python)
python -m http.server 3000

# Option 2 (Node.js serve)
npx serve -p 3000
```

Visit 👉 `http://localhost:3000`

---

## ▶️ Usage

1. Open frontend in browser
2. Upload a food label image (e.g., product ingredients)
3. Wait for OCR extraction and AI analysis
4. View:

   * **Overall safety rating**
   * **Ingredient-by-ingredient analysis**
   * **Risky ingredient alerts**
   * **Recommendations for safer choices**

---

## 📚 Key Learnings

* **Backend Best Practices**: Routes, services, and middleware separation
* **OCR + AI Integration**: Real-world text extraction and analysis pipeline
* **Error Handling**: Graceful fallbacks for user-friendly experience
* **Frontend UX**: Clean Tailwind UI with responsive design

---


---
