# TaskMate - JWT Authentication Task Management App

A full-stack task management application with JWT authentication, built with React.js frontend and Node.js backend.

## Features

- 🔐 **JWT Authentication**: Secure login/logout with token-based authentication
- 📝 **Task Management**: Create, read, update, and delete tasks
- 👤 **User-specific Tasks**: Each user can only see and manage their own tasks
- 🔍 **Search & Filter**: Search tasks by title/description and filter by status
- 📊 **Dashboard Statistics**: Real-time task counts and status overview
- 🎨 **Modern UI**: Clean, responsive design with intuitive user interface
- 🔒 **Protected Routes**: Secure access to authenticated users only

## User-Specific Task Management

### How It Works

1. **User Authentication**: When a user logs in, a JWT token is generated and stored in the database
2. **Token Verification**: All API requests include the JWT token in the Authorization header
3. **User Isolation**: The backend verifies the token and only returns tasks belonging to that specific user
4. **Personalized UI**: The frontend displays the user's name and shows personalized messages

### Security Features

- **Token-based Authentication**: JWT tokens with 24-hour expiration
- **Database Token Storage**: Tokens stored in database with active/inactive status
- **User Ownership Verification**: All task operations verify user ownership
- **Automatic Logout**: Expired tokens automatically redirect to login

### User Experience

- **Personalized Welcome**: Dashboard shows "Welcome back, [User Name]!"
- **User-specific Tasks**: Only the logged-in user's tasks are displayed
- **Navbar User Display**: Shows "Welcome, [User Name]" in the navigation bar
- **Task Ownership**: Users can only edit/delete their own tasks

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React.js** with hooks
- **React Router** for navigation
- **Axios** for HTTP requests
- **React Icons** for UI icons
- **Local Storage** for token persistence

## Database Schema

### Users Table
- `id` (Primary Key)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `created_at` (TIMESTAMP)

### Tokens Table
- `id` (Primary Key)
- `user_id` (Foreign Key to users.id)
- `token` (TEXT, JWT token)
- `created_at` (TIMESTAMP)
- `expires_at` (TIMESTAMP)
- `is_active` (BOOLEAN)

### Tasks Table
- `id` (Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: 'To Do', 'In Progress', 'Done')
- `priority` (ENUM: 'Low', 'Medium', 'High')
- `due_date` (DATE)
- `user_id` (Foreign Key to users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Database Setup

1. Start your MySQL server
2. Run the database setup script:
   ```bash
   mysql -u root -p < backend/database_setup.sql
   ```
   Or copy and paste the contents of `backend/database_setup.sql` into your MySQL client.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update database configuration in `db.js`:
   ```javascript
   const db = mysql.createConnection({
     host: 'localhost',
     user: 'your_mysql_username',
     password: 'your_mysql_password',
     database: 'taskmate'
   });
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`

## Usage

### Registration
1. Navigate to `/register`
2. Enter your full name, email, and password
3. Click "Sign Up"

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be automatically redirected to the dashboard

### Task Management
- **Create Task**: Click "New Task" button
- **Edit Task**: Click the edit icon on any task card
- **Delete Task**: Click the delete icon on any task card
- **Search**: Use the search bar to find specific tasks
- **Filter**: Use the status dropdown to filter tasks

### Logout
Click the "Logout" button in the navigation bar to securely log out.

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout (requires token)
- `GET /profile` - Get user profile (requires token)

### Tasks (All require authentication)
- `GET /tasks` - Get all tasks for the authenticated user
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: Tokens are stored in the database with expiration
- **User Isolation**: Users can only access their own tasks
- **Token Validation**: Server-side token verification on all protected routes
- **Automatic Logout**: Expired tokens automatically redirect to login

## Environment Variables

For production, consider setting these environment variables:

```bash
JWT_SECRET=your-super-secret-jwt-key
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=taskmate
```

## Testing

The database setup includes a test user:
- **Email**: test@example.com
- **Password**: password123

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `db.js`
   - Verify the `taskmate` database exists

2. **JWT Token Errors**
   - Clear browser localStorage
   - Check if the token has expired
   - Verify the JWT_SECRET is consistent

3. **CORS Errors**
   - Ensure the backend is running on port 5000
   - Check that CORS is properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 