# 🏠 DreamDwelling - Modern Real Estate Platform

A full-stack real estate application with GIS capabilities, featuring property listings, interactive maps, user authentication, and advanced search functionality.

![DreamDwelling](https://img.shields.io/badge/Real%20Estate-Platform-blue?style=for-the-badge)
![Django](https://img.shields.io/badge/Django-5.2.5-green?style=for-the-badge&logo=django)
![Next.js](https://img.shields.io/badge/Next.js-14.0.3-black?style=for-the-badge&logo=next.js)
![PostGIS](https://img.shields.io/badge/PostGIS-Enabled-orange?style=for-the-badge)

## ✨ Features

### 🔐 **Authentication & User Management**

- Modern user profile dropdown with avatar support
- JWT-based authentication with automatic token refresh
- Comprehensive user dashboard and settings
- Profile management with image upload support

### 🗺️ **GIS & Mapping**

- PostGIS spatial database integration
- Interactive property maps
- Location-based property search
- Neighborhood analytics and insights

### 🏘️ **Property Management**

- Advanced property listings with detailed information
- Image galleries and virtual tours
- Favorites system for saved properties
- Agent-specific property management tools

### 🔍 **Search & Discovery**

- Advanced search filters (price, location, type, etc.)
- Map-based property discovery
- Neighborhood exploration tools
- Real-time search suggestions

### 📱 **Modern UI/UX**

- Responsive design for all devices
- Professional interface following Apple design principles
- Smooth animations and transitions
- Accessibility-compliant components

## 🛠️ Tech Stack

### **Backend**

- **Django 5.2.5** - Python web framework
- **PostGIS** - Spatial database extension for PostgreSQL
- **Django REST Framework** - API development
- **Djoser** - Authentication endpoints
- **JWT Authentication** - Secure token-based auth
- **Swagger/OpenAPI** - API documentation

### **Frontend**

- **Next.js 14.0.3** - React framework with Pages Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **Axios** - HTTP client for API calls

### **Database & Infrastructure**

- **PostgreSQL** with **PostGIS** extension
- **Cookie-based** session management
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### **Prerequisites**

- Python 3.11+
- Node.js 18+
- PostgreSQL with PostGIS extension
- Git

### **1. Clone the Repository**

```bash
git clone https://github.com/eriteria/dreamdwelling.git
cd dreamdwelling
```

### **2. Backend Setup**

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Set up environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Run migrations
cd backend
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### **3. Frontend Setup**

```bash
# Install dependencies
cd frontend
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API URLs

# Start Next.js development server
npm run dev
```

### **4. Quick Development Start**

Use our unified development script to start both servers:

```bash
# Windows PowerShell
.\run-dev-unified.ps1

# Alternative methods
.\run-dev.ps1        # PowerShell version
.\run-dev.bat        # Batch file version
node run-dev.js      # Node.js version
```

## 📁 Project Structure

```
dreamdwelling/
├── backend/                 # Django backend
│   ├── config/             # Django project settings
│   ├── users/              # User authentication & profiles
│   ├── properties/         # Property listings management
│   ├── neighborhoods/      # Geographic data & analytics
│   ├── search/            # Search functionality
│   ├── favorites/         # User favorites system
│   ├── analytics/         # Usage analytics
│   └── requirements.txt   # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Next.js pages
│   │   ├── features/      # Redux slices & API logic
│   │   ├── app/           # App configuration & store
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
├── venv/                  # Python virtual environment
├── run-dev-unified.ps1    # Development server script
└── README.md              # Project documentation
```

## 🔧 Development Scripts

- **`run-dev-unified.ps1`** - Start both backend and frontend servers
- **`run-dev.ps1`** - PowerShell version of dev script
- **`run-dev.bat`** - Windows batch file version
- **`run-dev.js`** - Node.js version of dev script

## 🌐 API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/swagger/
- **ReDoc**: http://localhost:8000/redoc/
- **Django Admin**: http://localhost:8000/admin/

## 🏃‍♂️ Usage

1. **Start the development servers** using the unified script
2. **Frontend**: http://localhost:3000
3. **Backend API**: http://localhost:8000
4. **Create an account** or login with existing credentials
5. **Explore properties** using the map and search features
6. **Manage your profile** through the user dropdown menu

## 🎯 Key Features Implemented

### ✅ **Authentication System**

- Modern user profile dropdown with avatar
- Automatic user data loading on app startup
- Persistent authentication across page loads
- Secure JWT token management

### ✅ **User Interface**

- Professional dropdown menu with user actions
- Responsive design for desktop and mobile
- Loading states and smooth animations
- Complete user page ecosystem (Dashboard, Profile, Settings)

### ✅ **GIS Integration**

- PostGIS spatial database for location data
- Geographic property searches
- Neighborhood analytics

### ✅ **Development Experience**

- Cross-platform development scripts
- Unified server management
- Comprehensive error handling
- Git workflow with structured commits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PostGIS** for spatial database capabilities
- **Next.js** team for the excellent React framework
- **Django** community for the robust backend framework
- **Tailwind CSS** for the utility-first styling approach

## 📞 Contact

**Project Maintainer**: eriteria  
**Repository**: https://github.com/eriteria/dreamdwelling

---

_Built with ❤️ for modern real estate needs_

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev
```

## Project Structure

```text
dreamdwelling/
├── backend/                # Django project
│   ├── config/             # Django settings
│   ├── users/              # User management
│   ├── properties/         # Property listings
│   ├── search/             # Search functionality
│   ├── favorites/          # Saved properties
│   ├── analytics/          # Market insights
│   ├── neighborhoods/      # Neighborhood data
│   └── media/              # User uploaded content
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
└── docs/                   # Documentation
```

## License

MIT
