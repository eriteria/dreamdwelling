@echo off
setlocal enabledelayedexpansion

:: DreamDwelling Development Server Runner (Batch Version)
:: This runs both frontend and backend with visible output

title DreamDwelling Development Server

echo.
echo ================================================
echo   DreamDwelling Development Server
echo ================================================
echo.

:: Set paths
set "PROJECT_ROOT=%~dp0"
set "BACKEND_PATH=%PROJECT_ROOT%backend"
set "FRONTEND_PATH=%PROJECT_ROOT%frontend"
set "VENV_PATH=%PROJECT_ROOT%venv"

:: Check if virtual environment exists
if not exist "%VENV_PATH%\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found at: %VENV_PATH%
    echo Please ensure the virtual environment is set up correctly.
    pause
    exit /b 1
)

:: Check if backend directory exists
if not exist "%BACKEND_PATH%" (
    echo [ERROR] Backend directory not found at: %BACKEND_PATH%
    pause
    exit /b 1
)

:: Check if frontend directory exists
if not exist "%FRONTEND_PATH%" (
    echo [ERROR] Frontend directory not found at: %FRONTEND_PATH%
    pause
    exit /b 1
)

echo [INFO] Starting development servers...
echo.

:: Start backend in a new window
echo [BACKEND] Starting Django server...
start "Django Backend" cmd /k "cd /d "%BACKEND_PATH%" && "%VENV_PATH%\Scripts\activate.bat" && python manage.py runserver"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend in a new window
echo [FRONTEND] Starting Next.js server...
start "Next.js Frontend" cmd /k "cd /d "%FRONTEND_PATH%" && npm run dev"

:: Wait for servers to start
echo [INFO] Waiting for servers to start...
timeout /t 5 /nobreak >nul

echo.
echo ================================================
echo   Development Servers Started!
echo ================================================
echo.
echo Django Backend:  http://127.0.0.1:8000/
echo Admin Panel:     http://127.0.0.1:8000/admin/
echo API Docs:        http://127.0.0.1:8000/swagger/
echo.
echo Next.js Frontend: http://localhost:3000/
echo.
echo ================================================
echo.
echo Both servers are running in separate windows.
echo Close those windows or press Ctrl+C to stop the servers.
echo.
echo Press any key to close this launcher window...
pause >nul
