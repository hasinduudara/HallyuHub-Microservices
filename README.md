# 🎬 HallyuHub – K-Drama & Movie Tracker (Microservices)

A cloud-native, microservices-based K-Drama and Movie tracking web application built with modern technologies and deployed on **Azure Container Apps**.

🌐 **Live Site:** [HallyuHub on Azure](https://frontend-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/)

---

## 📌 Overview

HallyuHub allows users to:
- 📋 **Browse** a catalog of popular K-Dramas and movies
- ➕ **Add** titles to a personal watchlist with a rating
- ❌ **Remove** titles from the watchlist
- 🤖 **Get AI-style recommendations** based on genres from the user's watchlist

---

## 🏗️ Architecture

The application follows a **microservices architecture** with four independent services, each containerized with Docker and deployed to Azure Container Apps.

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│         Vite + TypeScript + Tailwind CSS         │
└──────────────┬──────────────────────────────────┘
               │  REST API Calls
  ┌────────────┼────────────────────┐
  ▼            ▼                    ▼
┌──────────┐ ┌──────────────┐ ┌───────────────────┐
│ Catalog  │ │  Watchlist   │ │   Recommender     │
│ Service  │ │   Service    │ │     Service       │
│  (Java / │ │ (Node.js /   │ │  (Python / Flask) │
│  Spring) │ │  Express.js) │ │                   │
└──────────┘ └──────────────┘ └───────────────────┘
```

---

## 🧩 Services

### 1. 🗂️ Catalog Service — `Java / Spring Boot`
- Provides a list of K-Dramas and movies with metadata (title, genre, release year, rating)
- **Endpoint:** `GET /api/catalog`
- Deployed at: `https://catalog-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io`

### 2. 📝 Watchlist Service — `Node.js / Express.js / TypeScript`
- Manages a user's watchlist using an in-memory store
- **Endpoints:**
  - `GET /api/watchlist/:userId` – Get user's watchlist
  - `POST /api/watchlist` – Add a title to the watchlist
  - `DELETE /api/watchlist/:userId/:catalogId` – Remove a title from the watchlist
- Deployed at: `https://watchlist-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io`

### 3. 🤖 Recommender Service — `Python / Flask`
- Fetches the user's watchlist and catalog, then recommends unwatched titles based on matching genres
- **Endpoint:** `GET /api/recommendations/:userId`
- Deployed at: `https://recommender-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io`

### 4. 🖥️ Frontend — `React / Vite / TypeScript / Tailwind CSS`
- Single-page application (SPA) that consumes all three backend services
- Deployed at: `https://frontend-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io`

---

## 🛠️ Tech Stack

### 🖥️ Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### ⚙️ Backend Services
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)

### 🐳 DevOps & Cloud
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Docker Hub](https://img.shields.io/badge/Docker_Hub-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_Container_Apps-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

---

## 🚀 Running Locally

### Prerequisites
- Docker Desktop installed and running

### Clone the repository
```bash
git clone https://github.com/hasinduudara/HallyuHub-Microservices.git
cd HallyuHub-Microservices
```

### Run each service individually

**Catalog Service (Java / Spring Boot)**
```bash
cd catalog-service
./mvnw spring-boot:run
```

**Watchlist Service (Node.js / TypeScript)**
```bash
cd watchlist-service
npm install
npm run dev
```

**Recommender Service (Python / Flask)**
```bash
cd recommender-service
pip install -r requirements.txt
python app.py
```

**Frontend (React / Vite)**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
HallyuHub-Microservices/
├── .github/
│   └── workflows/
│       └── docker-publish.yml  # CI/CD – Build & Push to Docker Hub
├── catalog-service/        # Spring Boot – Catalog API
├── watchlist-service/      # Node.js/Express – Watchlist API
├── recommender-service/    # Python/Flask – Recommender API
└── frontend/               # React/Vite – Web UI
```

---

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** to automate the build and deployment pipeline.

### Workflow: `.github/workflows/docker-publish.yml`

**Trigger:** Every push to the `main` or `master` branch automatically:

1. ✅ Checks out the source code
2. 🔐 Logs in to **Docker Hub** using GitHub Secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`)
3. 🏗️ Builds Docker images for all four services
4. 🚀 Pushes images to Docker Hub with the `latest` tag

| Service             | Docker Hub Image                              |
|---------------------|-----------------------------------------------|
| Catalog Service     | `<DOCKER_USERNAME>/catalog-service:latest`    |
| Watchlist Service   | `<DOCKER_USERNAME>/watchlist-service:latest`  |
| Recommender Service | `<DOCKER_USERNAME>/recommender-service:latest`|
| Frontend            | `<DOCKER_USERNAME>/frontend:latest`           |

### Required GitHub Secrets

| Secret            | Description                   |
|-------------------|-------------------------------|
| `DOCKER_USERNAME` | Your Docker Hub username      |
| `DOCKER_PASSWORD` | Your Docker Hub access token  |

---

## 📬 Contact

| Platform  | Link                                                                                       |
|-----------|--------------------------------------------------------------------------------------------|
| 📧 Email  | [hasiduudara@gmail.com](mailto:hasiduudara@gmail.com)                                      |
| 💼 LinkedIn | [linkedin.com/in/hasindu-udara](https://www.linkedin.com/in/hasindu-udara/)                |
| 🐙 GitHub | [github.com/hasinduudara](https://github.com/hasinduudara)                                 |
| 🌐 Portfolio | [portfolio](https://hasinduudara.vercel.app/) |

---

> Built with ❤️ by [Hasindu Udara](https://www.linkedin.com/in/hasindu-udara/)
