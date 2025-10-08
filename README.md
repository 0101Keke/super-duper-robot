# CampusLearn — Local Setup & Quickstart

This README walks you step-by-step from cloning the repo to running the server and client, connecting to MongoDB, and exercising core flows (register/login, add topics, upload resources). It is deliberately explicit about commands and tiny details so you can get a working local dev environment.

Important workspace files (quick links)
- Server
  - [server/.env](server/.env)
  - [server/package.json](server/package.json)
  - [server/server.js](server/server.js) — uses [`connectDB`](server/config/db.js)
  - [server/config/db.js](server/config/db.js) — exports [`connectDB`](server/config/db.js)
  - [server/controllers/authController.js](server/controllers/authController.js) — exports [`authController.register`](server/controllers/authController.js) and [`authController.login`](server/controllers/authController.js)
  - [server/controllers/topicsController.js](server/controllers/topicsController.js) — exports [`topicsController.getTopics`](server/controllers/topicsController.js), [`topicsController.createTopic`](server/controllers/topicsController.js), [`topicsController.subscribe`](server/controllers/topicsController.js), [`topicsController.markResolved`](server/controllers/topicsController.js)
  - [server/controllers/resourcesController.js](server/controllers/resourcesController.js) — exports [`resourcesController.uploadResource`](server/controllers/resourcesController.js) and [`resourcesController.getResources`](server/controllers/resourcesController.js)
  - [server/middleware/auth.js](server/middleware/auth.js) — exports [`authMiddleware`](server/middleware/auth.js) and [`authorizeRoles`](server/middleware/auth.js)
  - [server/middleware/errorhandler.js](server/middleware/errorhandler.js)
  - [server/models/user.js](server/models/user.js) — model [`User`](server/models/user.js)
  - [server/models/topic.js](server/models/topic.js) — model [`Topic`](server/models/topic.js)
  - [server/models/resource.js](server/models/resource.js) — model [`Resource`](server/models/resource.js)
  - [server/routes/auth.js](server/routes/auth.js)
  - [server/routes/topics.js](server/routes/topics.js)
  - [server/routes/resources.js](server/routes/resources.js)
  - [server/services/senggridService.js](server/services/senggridService.js) — exports [`sendEmail`](server/services/senggridService.js)
- Client
  - [client/package.json](client/package.json)
  - [client/src/api.js](client/src/api.js) — axios instance (baseURL: `http://localhost:5000/api/v1`)
  - [client/src/index.js](client/src/index.js)
  - [client/src/App.js](client/src/App.js)
  - [client/src/pages/Register.js](client/src/pages/Register.js)
  - [client/src/pages/Login.js](client/src/pages/Login.js)
  - [client/src/pages/Topics.js](client/src/pages/Topics.js)
  - [client/src/pages/UploadRescource.js](client/src/pages/UploadRescource.js)

Prerequisites (install these first)
1. Git
   - Windows: https://git-scm.com/download/win — run installer and accept defaults.
   - macOS: `brew install git` (if Homebrew installed) or https://git-scm.com.
   - Linux: use your distro package manager (e.g., `sudo apt install git`).
2. Node.js & npm (LTS recommended, >= 18)
   - Download & install from https://nodejs.org/en/ or use nvm:
     - macOS/Linux: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash` then `nvm install --lts`
     - Windows: use nvm-windows or Node installer.
   - Verify: `node -v` and `npm -v`
3. MongoDB (one of these options)
   - Local install (Community):
     - Windows installer: https://www.mongodb.com/try/download/community — run installer, install as a Service (or not).
     - After install, ensure `mongod` is running. On Windows start the MongoDB service or run from command line: `"C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --dbpath C:\data\db`
     - Create data directory: `mkdir C:\data\db`
   - Docker (recommended if you have Docker):
     - `docker run -d --name mongodb -p 27017:27017 -v mongo-data:/data/db mongo:6.0`
   - Atlas cloud (optional):
     - Create cluster, obtain connection string; set MONGO_URI accordingly.
4. (Optional) cURL or Postman for API testing.

Clone repository
1. Open a terminal (PowerShell/CMD on Windows, Terminal on macOS/Linux).
2. Clone:
   - git clone <your-repo-url>
   - cd super-duper-robot

Project layout
- Root contains `client/` and `server/`.
- Server API base path in client code is `http://localhost:5000/api/v1` ([client/src/api.js](client/src/api.js)).

Environment variables
1. Copy the example .env at `server/.env`. The file in the repo already contains defaults:
   - [server/.env](server/.env)
   - Edit the file to set real values:
     - PORT (optional) — default `5000`
     - MONGO_URI — e.g., `mongodb://127.0.0.1:27017/campuslearn` (if local)
     - JWT_SECRET — choose a secure secret (replace `supersecretkey123`)
     - SENDGRID_API_KEY — set if you want email functionality (optional)
     - EMAIL_FROM — set the sender email used by SendGrid (optional)
2. Example edit (Windows Notepad or VSCode):
   - Open `server/.env` and replace placeholder values (save file).

Install dependencies
1. Server
   - Open terminal and run:
     - cd server
     - npm install
   - This installs server dependencies listed in [server/package.json](server/package.json).
2. Client
   - Open another terminal:
     - cd client
     - npm install
   - Installs dependencies from [client/package.json](client/package.json).

Start MongoDB
- If local install: ensure `mongod` is running. On Windows if installed as service it should auto-start. To run manually:
  - Open new terminal and run `mongod` (ensure `C:\data\db` exists).
- If using Docker: ensure container is running (`docker start mongodb`).

Verify MongoDB connectivity
- From terminal run:
  - `mongo --eval "db.adminCommand('ping')"`
  - Or connect via Compass to `mongodb://127.0.0.1:27017` and verify databases/collections.
- The server code uses the `MONGO_URI` in [server/config/db.js](server/config/db.js) where [`connectDB`](server/config/db.js) attempts to connect.

Start the server
1. From repo root:
   - cd server
   - For development (auto-restart): `npm run dev` (requires `nodemon`, already in devDependencies)
   - Or `npm start`
2. Confirm server prints:
   - "MongoDB connected successfully"
   - "Server running on 5000" (or the port in your `.env`)
3. Key server entry: [server/server.js](server/server.js) which registers routes:
   - Auth: `/api/v1/auth` → [server/routes/auth.js](server/routes/auth.js) → [`authController.register`](server/controllers/authController.js), [`authController.login`](server/controllers/authController.js)
   - Topics: `/api/v1/topics` → [server/routes/topics.js](server/routes/topics.js) → [`topicsController.*`](server/controllers/topicsController.js)
   - Resources: `/api/v1/resources` → [server/routes/resources.js](server/routes/resources.js) → [`resourcesController.*`](server/controllers/resourcesController.js)

Start the client
1. Open a new terminal:
   - cd client
   - npm start
2. Open browser to http://localhost:3000
   - Client UI uses components in:
     - [client/src/App.js](client/src/App.js)
     - [client/src/pages/Register.js](client/src/pages/Register.js)
     - [client/src/pages/Login.js](client/src/pages/Login.js)
     - [client/src/pages/Topics.js](client/src/pages/Topics.js)
     - [client/src/pages/UploadRescource.js](client/src/pages/UploadRescource.js)
3. The axios instance points at `http://localhost:5000/api/v1` ([client/src/api.js](client/src/api.js)).

Basic flows (UI)
1. Register a user (client UI)
   - Open the app at http://localhost:3000
   - Fill "Register" form ([client/src/pages/Register.js](client/src/pages/Register.js))
   - Submit → `POST /api/v1/auth/register` handled in [server/routes/auth.js](server/routes/auth.js) → [`authController.register`](server/controllers/authController.js)
2. Login
   - Fill "Login" form and Login → `POST /api/v1/auth/login` ([server/controllers/authController.js](server/controllers/authController.js))
   - On success the client stores JWT in localStorage under key `token` (see [client/src/api.js](client/src/api.js) interceptor).
3. Create a Topic
   - In "Topics" form ([client/src/pages/Topics.js](client/src/pages/Topics.js)) supply Title, Module code, Description and click Create Topic.
   - This sends `POST /api/v1/topics` → [server/controllers/topicsController.js](server/controllers/topicsController.js) [`createTopic`](server/controllers/topicsController.js). The route requires authentication via [`authMiddleware`](server/middleware/auth.js).
   - After creation, the topic will appear in the topics list (populated by `GET /api/v1/topics` → [`topicsController.getTopics`](server/controllers/topicsController.js)).
4. Upload a Resource
   - In "Upload Resource" form ([client/src/pages/UploadRescource.js](client/src/pages/UploadRescource.js)) provide:
     - Title
     - File URL (or path) — this demo expects a URL string stored in `filePath`
     - Topic ID (copy from the created topic's `_id` shown in Topics list or inspect network response)
     - Type (PDF/Video/Audio/Link/Other)
   - Submit → `POST /api/v1/resources/upload` ([server/controllers/resourcesController.js](server/controllers/resourcesController.js) [`uploadResource`](server/controllers/resourcesController.js))
   - Only users with role `tutor` are allowed to upload in this demo (checked in the controller). If you registered as a student, set role to `tutor` on registration form or create a tutor user.

API testing (curl / Postman)
- Register:
  - curl:
    - ```sh
      curl -X POST http://localhost:5000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -d '{"name":"Alice","email":"a@a.com","password":"password","role":"tutor"}'
      ```
- Login:
  - ```sh
    curl -X POST http://localhost:5000/api/v1/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"a@a.com","password":"password"}'
    ```
  - Save [token](http://_vscodecontentref_/0) from response.
- Create topic:
  - ```sh
    curl -X POST http://localhost:5000/api/v1/topics \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <TOKEN>" \
      -d '{"title":"Help with calculus","description":"Need explanation on integration","moduleCode":"MATH101"}'
    ```
- List topics:
  - ```sh
    curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/api/v1/topics
    ```
- Upload resource (tutor):
  - ```sh
    curl -X POST http://localhost:5000/api/v1/resources/upload \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <TOKEN>" \
      -d '{"title":"Integration notes","filePath":"https://example.com/notes.pdf","type":"PDF","topicId":"<TOPIC_ID>"}'
    ```

Troubleshooting & tips
- MongoDB connection error:
  - Check `MONGO_URI` in [server/.env](server/.env) and confirm `mongod` is running.
  - If using Docker, ensure container is running and port 27017 is open.
  - Check server logs printed by [`connectDB`](server/config/db.js).
- JWT / Authentication errors:
  - Ensure the client saved the token to localStorage; inspect browser DevTools Application → Local Storage → `token`.
  - Inspect `Authorization` header on outgoing requests (network tab).
- Role-based upload prevented:
  - The resources upload route checks `req.user.role` (see [`resourcesController.uploadResource`](server/controllers/resourcesController.js)). Use a tutor account to upload.
- SendGrid email:
  - If you want email notifications set SENDGRID_API_KEY and EMAIL_FROM in [server/.env](server/.env). The helper is [`sendEmail`](server/services/senggridService.js). If not configured, this will not affect core flows.

Key server behaviors & where to look in code
- DB connection: [`connectDB`](server/config/db.js) → used in [server/server.js](server/server.js)
- Auth: [`authController.register`](server/controllers/authController.js), [`authController.login`](server/controllers/authController.js)
- Topics: [`topicsController.*`](server/controllers/topicsController.js) — uses model [`Topic`](server/models/topic.js)
- Resources: [`resourcesController.*`](server/controllers/resourcesController.js) — uses model [`Resource`](server/models/resource.js)
- Auth middleware & role guard: [`authMiddleware`](server/middleware/auth.js) and [`authorizeRoles`](server/middleware/auth.js)
- Routes are registered in [server/server.js](server/server.js).

Shutting down
- Stop client: Ctrl+C in the client terminal.
- Stop server: Ctrl+C in the server terminal.
- Stop Mongo (Docker): `docker stop mongodb` or `docker rm -f mongodb` to remove.

If something still fails
- Check server terminal logs (errors are printed by [server/middleware/errorhandler.js](server/middleware/errorhandler.js)).
- Confirm Node/npm versions and that dependencies installed properly (`node -v`, `npm -v`, `npm install` inside `server` and `client`).
- Confirm the API base URL in [client/src/api.js](client/src/api.js) matches server port.

This should get you from cloning the repo to creating topics and uploading resources through the provided UI and API endpoints. If you want, I can generate a small script to seed a tutor user or to run both server and client concurrently.
