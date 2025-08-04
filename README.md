# TaskManager - Full Stack Task Management Application

A modern, responsive task management application built with React.js frontend and Node.js/Express.js backend with MySQL database.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 📝 **Task Management** - Create, read, update, and delete tasks
- 👤 **User-Specific Tasks** - Each user sees only their own tasks
- 🎨 **Modern UI** - Beautiful, responsive design with professional styling
- 🔍 **Search & Filter** - Find tasks quickly with search and status filtering
- 📊 **Dashboard Analytics** - View task statistics and progress
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Axios for API calls
- React Icons
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MySQL database
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Project Structure

```
taskname/
├── backend/
│   ├── server.js          # Main server file
│   ├── routes/
│   │   └── taskRoutes.js  # Task API routes
│   ├── package.json       # Backend dependencies
│   └── db.js             # Database connection
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json       # Frontend dependencies
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MySQL database:
   - Create a database named `taskmate`
   - Run the SQL commands from `database_setup.sql`

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Deployment on Vercel

### Prerequisites
- Vercel account
- MySQL database (you can use PlanetScale, Railway, or any cloud MySQL provider)

### Step 1: Database Setup
1. Set up a MySQL database on your preferred cloud provider
2. Note down the connection details (host, user, password, database name)

### Step 2: Environment Variables
In your Vercel project settings, add these environment variables:
- `JWT_SECRET` - Your JWT secret key
- `DB_HOST` - Your MySQL host
- `DB_USER` - Your MySQL username
- `DB_PASSWORD` - Your MySQL password
- `DB_NAME` - Your database name

### Step 3: Deploy
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the configuration and deploy

### Step 4: Database Migration
After deployment, you'll need to create the database tables. You can do this by:
1. Connecting to your MySQL database
2. Running the SQL commands from `database_setup.sql`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Environment Variables

### Development
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-secret-key-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=taskmate
```

### Production (Vercel)
Set these in your Vercel project settings:
- `JWT_SECRET`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 