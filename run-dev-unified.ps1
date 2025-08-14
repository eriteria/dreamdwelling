# DreamDwelling Unified Development Server
# Shows both frontend and backend output in a single terminal with color coding

param(
    [switch]$Help
)

if ($Help) {
    Write-Host @"
DreamDwelling Unified Development Server

Usage:
  .\run-dev-unified.ps1       # Run both servers with unified output
  .\run-dev-unified.ps1 -Help # Show this help

Description:
  This script starts both Django and Next.js servers and displays
  their output in a single terminal with color-coded prefixes.

Controls:
  - Ctrl+C: Stop both servers
  - Close terminal: Stop both servers
"@
    exit 0
}

# Configuration
$ProjectRoot = $PSScriptRoot
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"
$VenvPath = Join-Path $ProjectRoot "venv"
$VenvActivate = Join-Path $VenvPath "Scripts\Activate.ps1"

# Validate paths
if (-not (Test-Path $VenvActivate)) {
    Write-Host "[ERROR] Virtual environment not found at: $VenvActivate" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $BackendPath)) {
    Write-Host "[ERROR] Backend directory not found at: $BackendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendPath)) {
    Write-Host "[ERROR] Frontend directory not found at: $FrontendPath" -ForegroundColor Red
    exit 1
}

# Function to kill existing processes
function Stop-ExistingServers {
    Write-Host "[INFO] Checking for existing servers..." -ForegroundColor Yellow
    
    # Kill existing Django processes
    Get-Process -Name "python" -ErrorAction SilentlyContinue | 
        Where-Object { $_.CommandLine -like "*manage.py*runserver*" } | 
        Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Kill existing Node processes
    Get-Process -Name "node" -ErrorAction SilentlyContinue | 
        Where-Object { $_.CommandLine -like "*next*dev*" } | 
        Stop-Process -Force -ErrorAction SilentlyContinue
        
    Start-Sleep 2
}

# Function to format output with timestamp and prefix
function Write-ServerOutput {
    param(
        [string]$Line,
        [string]$Prefix,
        [ConsoleColor]$Color
    )
    
    if ($Line -and $Line.Trim()) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
        Write-Host "[$Prefix] " -NoNewline -ForegroundColor $Color
        Write-Host $Line
    }
}

Write-Host "`n🏠 DreamDwelling Unified Development Server" -ForegroundColor Magenta
Write-Host "===========================================" -ForegroundColor Magenta

Stop-ExistingServers

Write-Host "`n[INFO] Starting development servers..." -ForegroundColor Yellow

# Start backend process
Write-Host "[BACKEND] Activating virtual environment and starting Django..." -ForegroundColor Green

$backendJob = Start-Job -ScriptBlock {
    param($BackendPath, $VenvActivate)
    
    Set-Location $BackendPath
    & $VenvActivate
    python manage.py runserver 2>&1
} -ArgumentList $BackendPath, $VenvActivate

# Start frontend process  
Write-Host "[FRONTEND] Starting Next.js development server..." -ForegroundColor Blue

$frontendJob = Start-Job -ScriptBlock {
    param($FrontendPath)
    
    Set-Location $FrontendPath
    npm run dev 2>&1
} -ArgumentList $FrontendPath

Write-Host "`n[INFO] Servers starting... Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host "[INFO] Backend will be available at: http://127.0.0.1:8000/" -ForegroundColor Yellow
Write-Host "[INFO] Frontend will be available at: http://localhost:3000/" -ForegroundColor Yellow
Write-Host ""

# Monitor both jobs and display output
try {
    $backendStarted = $false
    $frontendStarted = $false
    
    while ($backendJob.State -eq "Running" -or $frontendJob.State -eq "Running") {
        # Check backend output
        if ($backendJob.State -eq "Running") {
            $backendOutput = Receive-Job $backendJob -ErrorAction SilentlyContinue
            if ($backendOutput) {
                foreach ($line in $backendOutput) {
                    Write-ServerOutput $line "BACKEND" Green
                    
                    # Check if Django is ready
                    if ($line -match "Starting development server at" -and -not $backendStarted) {
                        $backendStarted = $true
                        Write-Host "`n✅ Django backend is ready!" -ForegroundColor Green
                        Write-Host "   🔗 Main site: http://127.0.0.1:8000/" -ForegroundColor Green
                        Write-Host "   🔧 Admin: http://127.0.0.1:8000/admin/" -ForegroundColor Green
                        Write-Host "   📚 API docs: http://127.0.0.1:8000/swagger/`n" -ForegroundColor Green
                    }
                }
            }
        }
        
        # Check frontend output
        if ($frontendJob.State -eq "Running") {
            $frontendOutput = Receive-Job $frontendJob -ErrorAction SilentlyContinue
            if ($frontendOutput) {
                foreach ($line in $frontendOutput) {
                    Write-ServerOutput $line "FRONTEND" Blue
                    
                    # Check if Next.js is ready
                    if ($line -match "Local:.*http://localhost:3000" -and -not $frontendStarted) {
                        $frontendStarted = $true
                        Write-Host "`n✅ Next.js frontend is ready!" -ForegroundColor Blue
                        Write-Host "   🔗 Main site: http://localhost:3000/`n" -ForegroundColor Blue
                    }
                }
            }
        }
        
        Start-Sleep -Milliseconds 100
    }
}
catch {
    Write-Host "`n[INFO] Stopping servers..." -ForegroundColor Yellow
}
finally {
    # Cleanup
    Write-Host "`n[INFO] Cleaning up..." -ForegroundColor Yellow
    
    if ($backendJob) {
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
    }
    
    if ($frontendJob) {
        Stop-Job $frontendJob -ErrorAction SilentlyContinue  
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
    }
    
    Stop-ExistingServers
    Write-Host "[INFO] Development servers stopped.`n" -ForegroundColor Yellow
}
