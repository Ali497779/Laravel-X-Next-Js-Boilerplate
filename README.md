🚀 Full-Stack Boilerplate (Laravel API + Next.js Frontend)

This repository contains a fully functional starter boilerplate that includes:

Laravel backend (REST API, MySQL, Bearer Token Auth)

Next.js frontend (API integration + basic structure for CRUD)

Use this template to quickly start any production-grade full-stack application.

📁 Project Structure
/backend      → Laravel API
/frontend     → Next.js Frontend

🧩 Backend Setup — Laravel API
✔ Requirements
PHP 8.1+
Composer
MySQL
Laravel 11+

▶️ 1. Install Dependencies
cd backend
composer install

▶️ 2. Environment Setup
Copy the example environment file:
cp .env.example .env
Generate the application key:
php artisan key:generate

Update the .env database section:
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_password

▶️ 3. Run Migrations
php artisan migrate

▶️ 4. Start Laravel Server
php artisan serve


API will run on:
👉 http://127.0.0.1:8000

⚛️ Frontend Setup — Next.js
✔ Requirements
Node.js 18+
NPM

▶️ 1. Install Dependencies
cd frontend
npm install

▶️ 2. Environment Setup
Copy env file:
cp .env.example .env
Add your API URL:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

▶️ 3. Start Development Server
npm run dev

Frontend will run on:
👉 http://localhost:3000

▶️ Running Full Stack
Open two terminals:

Terminal #1 — Laravel Backend
cd backend
php artisan serve

Terminal #2 — Next.js Frontend
cd frontend
npm run dev


Your full-stack app is now ready.

🛠 Tech Stack Used
Backend
Laravel 11
MySQL
Bearer Token Authentication
API Resources + Controllers
Frontend
Next.js 14+
React 18
Tailwind CSS
Axios (API Requests)

🤝 Contribution Guidelines
Pull requests and suggestions are always welcome.
For major changes, please open an issue before modifying.

📜 License
This project is open-source and available under the MIT License.
