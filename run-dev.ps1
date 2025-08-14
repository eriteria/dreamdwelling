# DreamDwelling Development Server Runner
# This script runs both frontend and backend in parallel with colored output
# Character encoding: UTF-8

param(
    [switch]$Help,
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

if ($Help) {
    Write-Host @"
DreamDwelling Development Server Runner

Usage:
  .\run-dev.ps1           # Run both frontend and backend
  .\run-dev.ps1 -BackendOnly   # Run only Django backend
  .\run-dev.ps1 -FrontendOnly  # Run only Next.js frontend
  .\run-dev.ps1 -Help          # Show this help

Description:
  This script starts the Django backend server and Next.js frontend server
  in parallel, displaying output from both with color-coded prefixes.

Requirements:
  - Virtual environment should be set up in ./venv/
  - Django project should be in ./backend/
  - Next.js project should be in ./frontend/
"@
    exit 0
}

# Configuration
$ProjectRoot = $PSScriptRoot
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"
$VenvPath = Join-Path $ProjectRoot "venv"
$VenvActivate = Join-Path $VenvPath "Scripts\Activate.ps1"

# Colors for output
$BackendColor = "Green"
$FrontendColor = "Blue"
$ErrorColor = "Red"
$InfoColor = "Yellow"

# Function to write colored output with prefix
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Prefix,
        [ConsoleColor]$Color
    )
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
    Write-Host "[$Prefix] " -NoNewline -ForegroundColor $Color
    Write-Host $Message
}

# Function to check if a process is running on a port
function Test-Port {
    param([int]$Port)
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet
        return $connection
    } catch {
        return $false
    }
}

# Function to stop existing servers
function Stop-ExistingServers {
    Write-ColorOutput "Checking for existing servers..." "INFO" $InfoColor
    
    # Check Django (port 8000)
    if (Test-Port 8000) {
        Write-ColorOutput "Stopping existing Django server on port 8000..." "INFO" $InfoColor
        Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
            $_.CommandLine -like "*manage.py*runserver*"
        } | Stop-Process -Force
    }
    
    # Check Next.js (port 3000)
    if (Test-Port 3000) {
        Write-ColorOutput "Stopping existing Next.js server on port 3000..." "INFO" $InfoColor
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
            $_.CommandLine -like "*next*dev*"
        } | Stop-Process -Force
    }
    
    Start-Sleep 2
}

# Function to run backend
function Start-Backend {
    Write-ColorOutput "Starting Django backend server..." "BACKEND" $BackendColor
    
    try {
        Set-Location $BackendPath
        
        # Activate virtual environment and run Django
        $process = Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command", 
            "& '$VenvActivate'; python manage.py runserver 2>&1 | ForEach-Object { Write-Host `"[`$(Get-Date -Format 'HH:mm:ss')] [BACKEND] `$_`" -ForegroundColor Green }"
        ) -PassThru
        
        Write-ColorOutput "Django server starting... (PID: $($process.Id))" "BACKEND" $BackendColor
        return $process
    }
    catch {
        Write-ColorOutput "Failed to start backend: $($_.Exception.Message)" "ERROR" $ErrorColor
        return $null
    }
    finally {
        Set-Location $ProjectRoot
    }
}

# Function to run frontend
function Start-Frontend {
    Write-ColorOutput "Starting Next.js frontend server..." "FRONTEND" $FrontendColor
    
    try {
        Set-Location $FrontendPath
        
        # Run Next.js dev server
        $process = Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command", 
            "npm run dev 2>&1 | ForEach-Object { Write-Host `"[`$(Get-Date -Format 'HH:mm:ss')] [FRONTEND] `$_`" -ForegroundColor Blue }"
        ) -PassThru
        
        Write-ColorOutput "Next.js server starting... (PID: $($process.Id))" "FRONTEND" $FrontendColor
        return $process
    }
    catch {
        Write-ColorOutput "Failed to start frontend: $($_.Exception.Message)" "ERROR" $ErrorColor
        return $null
    }
    finally {
        Set-Location $ProjectRoot
    }
}

# Function to wait for servers to be ready
function Wait-ForServers {
    Write-ColorOutput "Waiting for servers to start..." "INFO" $InfoColor
    
    $maxAttempts = 30
    $attempt = 0
    
    while ($attempt -lt $maxAttempts) {
        $backendReady = Test-Port 8000
        $frontendReady = Test-Port 3000
        
        if ((-not $BackendOnly -and -not $FrontendOnly -and $backendReady -and $frontendReady) -or
            ($BackendOnly -and $backendReady) -or
            ($FrontendOnly -and $frontendReady)) {
            break
        }
        
        Start-Sleep 1
        $attempt++
    }
    
    if (-not $BackendOnly) {
        if (Test-Port 8000) {
            Write-ColorOutput "[OK] Django backend ready at http://127.0.0.1:8000/" "BACKEND" $BackendColor
            Write-ColorOutput "   Admin panel: http://127.0.0.1:8000/admin/" "BACKEND" $BackendColor
            Write-ColorOutput "   API docs: http://127.0.0.1:8000/swagger/" "BACKEND" $BackendColor
        } else {
            Write-ColorOutput "[FAIL] Django backend failed to start" "ERROR" $ErrorColor
        }
    }
    
    if (-not $FrontendOnly) {
        if (Test-Port 3000) {
            Write-ColorOutput "[OK] Next.js frontend ready at http://localhost:3000/" "FRONTEND" $FrontendColor
        } else {
            Write-ColorOutput "[FAIL] Next.js frontend failed to start" "ERROR" $ErrorColor
        }
    }
}

# Main execution
Write-Host "DreamDwelling Development Server" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta

# Validate paths
if (-not (Test-Path $VenvActivate)) {
    Write-ColorOutput "Virtual environment not found at: $VenvActivate" "ERROR" $ErrorColor
    Write-ColorOutput "Please ensure the virtual environment is set up correctly." "ERROR" $ErrorColor
    exit 1
}

if (-not (Test-Path $BackendPath)) {
    Write-ColorOutput "Backend directory not found at: $BackendPath" "ERROR" $ErrorColor
    exit 1
}

if (-not (Test-Path $FrontendPath)) {
    Write-ColorOutput "Frontend directory not found at: $FrontendPath" "ERROR" $ErrorColor
    exit 1
}

# Stop existing servers
Stop-ExistingServers

# Store original location
$OriginalLocation = Get-Location

# Start servers
$backendProcess = $null
$frontendProcess = $null

try {
    if (-not $FrontendOnly) {
        $backendProcess = Start-Backend
        Start-Sleep 3
    }
    
    if (-not $BackendOnly) {
        $frontendProcess = Start-Frontend
        Start-Sleep 3
    }
    
    # Wait for servers to be ready
    Wait-ForServers
    
    # Keep script running and show instructions
    Write-Host ""
    Write-ColorOutput "Development servers are running!" "INFO" $InfoColor
    Write-ColorOutput "Press Ctrl+C to stop all servers" "INFO" $InfoColor
    Write-Host ""
    
    # Wait for user to stop
    try {
        while ($true) {
            Start-Sleep 1
        }
    }
    catch [System.Management.Automation.PipelineStoppedException] {
        # User pressed Ctrl+C
    }
}
finally {
    # Cleanup
    Write-ColorOutput "Stopping development servers..." "INFO" $InfoColor
    
    if ($backendProcess -and -not $backendProcess.HasExited) {
        Write-ColorOutput "Stopping Django backend..." "BACKEND" $BackendColor
        Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    if ($frontendProcess -and -not $frontendProcess.HasExited) {
        Write-ColorOutput "Stopping Next.js frontend..." "FRONTEND" $FrontendColor
        Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
    }
    
    # Return to original location
    Set-Location $OriginalLocation
    
    Write-ColorOutput "Development servers stopped." "INFO" $InfoColor
}
