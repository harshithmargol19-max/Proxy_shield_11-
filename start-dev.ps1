# ProxyShield-11 Development Startup Script
# Run from project root: .\start-dev.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== ProxyShield-11 Development Environment ===" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "[1/4] Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoCheck.TcpTestSucceeded) {
        Write-Host "  MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "  Warning: MongoDB not detected on port 27017" -ForegroundColor Red
        Write-Host "  The backend will start but API calls requiring DB will fail" -ForegroundColor Red
    }
} catch {
    Write-Host "  Warning: Could not check MongoDB status" -ForegroundColor Red
}

# Start Backend
Write-Host ""
Write-Host "[2/4] Starting Backend (Node.js on port 3000)..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "Backend"
$backendProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $backendPath -PassThru -WindowStyle Minimized
Write-Host "  Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

# Start AI Engine
Write-Host ""
Write-Host "[3/4] Starting AI Engine (FastAPI on port 8000)..." -ForegroundColor Yellow
$aiPath = Join-Path $PSScriptRoot "AI Engine"
$pythonPath = Join-Path $aiPath "venv\Scripts\python.exe"
if (Test-Path $pythonPath) {
    $aiProcess = Start-Process -FilePath $pythonPath -ArgumentList "-m uvicorn app.main:app --port 8000" -WorkingDirectory $aiPath -PassThru -WindowStyle Minimized
    Write-Host "  AI Engine started (PID: $($aiProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "  Warning: Python venv not found at $pythonPath" -ForegroundColor Red
    Write-Host "  Run: cd 'AI Engine' && python -m venv venv && .\venv\Scripts\activate && pip install -r requirements.txt" -ForegroundColor Red
}

# Start Frontend
Write-Host ""
Write-Host "[4/4] Starting Frontend (Vite on port 5173)..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "Frontend\dashboard"
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory $frontendPath -PassThru -WindowStyle Minimized
Write-Host "  Frontend started (PID: $($frontendProcess.Id))" -ForegroundColor Green

# Wait for services to start
Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Display service URLs
Write-Host ""
Write-Host "=== Services Ready ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend:     http://localhost:5173" -ForegroundColor White
Write-Host "  Backend API:  http://localhost:3000/api" -ForegroundColor White
Write-Host "  AI Engine:    http://localhost:8000" -ForegroundColor White
Write-Host "  API Docs:     http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop all services..." -ForegroundColor Yellow
Write-Host ""

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $aiProcess.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue
    Write-Host "All services stopped." -ForegroundColor Green
}
