# DreamDwelling Development Scripts

This directory contains several scripts to run the DreamDwelling development servers. Choose the one that best fits your preference and environment.

## Available Scripts

### 1. PowerShell Script (Recommended for Windows)

**File:** `run-dev.ps1`

**Features:**

- Runs both servers in separate PowerShell windows
- Color-coded output for easy identification
- Automatic cleanup when stopped
- Health checks and server status
- Most robust option

**Usage:**

```powershell
# Run both frontend and backend
.\run-dev.ps1

# Run only backend
.\run-dev.ps1 -BackendOnly

# Run only frontend
.\run-dev.ps1 -FrontendOnly

# Show help
.\run-dev.ps1 -Help
```

### 2. Unified PowerShell Script

**File:** `run-dev-unified.ps1`

**Features:**

- Shows both server outputs in a single terminal
- Color-coded prefixes (Backend in Green, Frontend in Blue)
- Real-time output streaming
- Ctrl+C to stop both servers

**Usage:**

```powershell
.\run-dev-unified.ps1
```

### 3. Batch File (Simple)

**File:** `run-dev.bat`

**Features:**

- Simple double-click to run
- Opens separate command windows for each server
- No additional dependencies
- Good for users who prefer batch files

**Usage:**

```batch
# Double-click the file or run from command line
.\run-dev.bat
```

### 4. Node.js Script (Cross-platform)

**File:** `run-dev.js`

**Features:**

- Cross-platform (Windows, Mac, Linux)
- Single terminal with colored output
- Real-time streaming
- Graceful shutdown handling

**Usage:**

```bash
node run-dev.js
```

## Server Information

When the scripts run successfully, you'll have access to:

### Django Backend (Port 8000)

- **Main API:** http://127.0.0.1:8000/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **API Documentation:** http://127.0.0.1:8000/swagger/
- **API Schema:** http://127.0.0.1:8000/redoc/

### Next.js Frontend (Port 3000)

- **Main Application:** http://localhost:3000/

## Requirements

Before running any script, ensure you have:

1. **Virtual Environment:** Set up at `./venv/`
2. **Dependencies Installed:**
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`
3. **Database Migrations:** `python manage.py migrate`
4. **Environment Variables:** Copy `.env.example` to `.env` and configure

## Troubleshooting

### Common Issues

1. **"Virtual environment not found"**

   - Ensure you've created a virtual environment: `python -m venv venv`
   - Activate it and install dependencies: `pip install -r requirements.txt`

2. **"Port already in use"**

   - The scripts will attempt to kill existing processes
   - Manually kill processes using Task Manager if needed
   - Or use different ports in the configuration

3. **"Module not found" errors**

   - Make sure virtual environment is activated
   - Install missing dependencies: `pip install -r requirements.txt`

4. **Frontend won't start**
   - Ensure Node.js and npm are installed
   - Run `npm install` in the frontend directory
   - Check for port conflicts

### Script-Specific Issues

**PowerShell Scripts:**

- If execution policy prevents running: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**Node.js Script:**

- Ensure Node.js is installed and in PATH
- May need to adjust paths for non-Windows systems

## Development Workflow

1. **First Time Setup:**

   ```bash
   # Install dependencies
   pip install -r requirements.txt
   cd frontend && npm install && cd ..

   # Run migrations
   cd backend && python manage.py migrate && cd ..

   # Create superuser (optional)
   cd backend && python manage.py createsuperuser && cd ..
   ```

2. **Daily Development:**

   ```bash
   # Start development servers
   .\run-dev.ps1

   # Or use the unified version
   .\run-dev-unified.ps1
   ```

3. **Stopping Servers:**
   - Press `Ctrl+C` in the script terminal
   - Close the terminal windows
   - Scripts will automatically clean up processes

## Tips

- **Use the PowerShell version** (`run-dev.ps1`) for the best experience on Windows
- **Monitor both outputs** to catch errors early
- **Check the admin panel** at http://127.0.0.1:8000/admin/ for data management
- **Use the API docs** at http://127.0.0.1:8000/swagger/ for API testing
- **Frontend hot reload** will automatically refresh when you make changes
- **Backend auto-reload** will restart when you modify Python files
