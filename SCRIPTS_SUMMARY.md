# Development Server Scripts Summary

I've created several scripts to run both your frontend and backend servers simultaneously with visible error output:

## 🎯 Quick Start (Recommended)

**For Windows PowerShell users:**

```powershell
.\run-dev.ps1
```

**For simple setup (double-click):**

```
run-dev.bat
```

## 📋 Available Scripts

| Script                | Description                                           | Best For                           |
| --------------------- | ----------------------------------------------------- | ---------------------------------- |
| `run-dev.ps1`         | Full-featured PowerShell script with separate windows | Most users                         |
| `run-dev-unified.ps1` | Single terminal with colored output                   | Developers who prefer unified logs |
| `run-dev.bat`         | Simple batch file                                     | Quick setup, less technical users  |
| `run-dev.js`          | Node.js cross-platform script                         | Mac/Linux or Node.js fans          |

## 🔧 Features

All scripts provide:

- ✅ **Simultaneous startup** of Django (port 8000) and Next.js (port 3000)
- ✅ **Visible error output** from both servers
- ✅ **Color-coded logs** to distinguish frontend vs backend
- ✅ **Automatic cleanup** when stopped
- ✅ **Server health checks** and status reporting
- ✅ **Graceful shutdown** with Ctrl+C

## 🌐 Access Points

Once running, you'll have:

**Backend (Django):**

- Main API: http://127.0.0.1:8000/
- Admin Panel: http://127.0.0.1:8000/admin/
- API Docs: http://127.0.0.1:8000/swagger/

**Frontend (Next.js):**

- Main App: http://localhost:3000/

## 🚀 Usage Examples

```powershell
# Start both servers (recommended)
.\run-dev.ps1

# Start only Django backend
.\run-dev.ps1 -BackendOnly

# Start only Next.js frontend
.\run-dev.ps1 -FrontendOnly

# Get help
.\run-dev.ps1 -Help

# Use unified output in single terminal
.\run-dev-unified.ps1
```

## 🔍 What This Fixes

Your original issue was `properties.map is not a function` - I also fixed that by:

1. **Fixed GeoJSON handling** - Your backend returns GeoJSON format, but frontend expected regular arrays
2. **Added proper error handling** - Ensures properties is always an array
3. **Updated Redux slice** - Properly extracts properties from GeoJSON features

## 📖 Next Steps

1. **Try the scripts:** Start with `.\run-dev.ps1`
2. **Check the logs:** Both servers will show startup status and any errors
3. **Visit the sites:** Frontend at localhost:3001, backend at localhost:8000
4. **Create test data:** Use the admin panel to add properties and test the fix

The scripts will make your development workflow much smoother! 🎉
