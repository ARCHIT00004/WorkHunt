# WorkHunt - Full-Stack Job Portal

A modern, full-stack job board application built with React and Node.js, featuring job posting, application management, and user authentication.

## 🚀 Features

- **Job Posting & Management**: Employers can post jobs and manage applications
- **Job Search & Application**: Job seekers can browse jobs and apply with resumes
- **User Authentication**: Secure login/registration system
- **Responsive Design**: Modern UI that works on all devices
- **File Upload**: Resume upload functionality for job applications
- **Real-time Updates**: Dynamic content updates without page refresh

## 🛠️ Tech Stack

### Frontend (Client)
- **React 18** with Vite
- **React Router** for navigation
- **Context API** for state management
- **CSS3** for styling

### Backend (Server)
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** enabled

## 📁 Project Structure

```
job/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Authentication context
│   │   ├── pages/         # Application pages
│   │   └── styles.css     # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Authentication middleware
│   │   └── lib/           # Database connection
│   ├── uploads/           # File uploads directory
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ARCHIT00004/workhunt.git
   cd workhunt
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/workhunt
   JWT_SECRET=your_jwt_secret_here
   PORT=4000
   ```

4. **Start the application**
   ```bash
   # Start both client and server
   npm run dev
   
   # Or start them separately
   npm run server    # Backend on port 4000
   npm run client    # Frontend on port 5173
   ```

## 📱 Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React frontend
- `npm run install:all` - Install dependencies for both client and server

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create a new job (employers only)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for a job

### Applications
- `GET /api/applications` - Get user's applications
- `GET /api/applications/employer` - Get applications for employer's jobs

### Contact
- `POST /api/contact` - Send contact message

## 🌟 Key Features

### For Job Seekers
- Browse available job listings
- Apply to jobs with cover letters and resumes
- Track application status
- User profile management

### For Employers
- Post new job opportunities
- Review and manage applications
- Dashboard for job management
- Contact potential candidates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Archit Goyal** - [GitHub Profile](https://github.com/ARCHIT00004)

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Node.js community for the robust backend runtime
- MongoDB for the flexible database solution

---

⭐ Star this repository if you find it helpful!
