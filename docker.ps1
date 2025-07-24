# Docker utility script for pay-emsula (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Docker utility script for pay-emsula" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\docker.ps1 [COMMAND]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "  build      Build the production Docker image"
    Write-Host "  dev        Start development environment with hot reload"
    Write-Host "  prod       Start production environment"
    Write-Host "  stop       Stop all containers"
    Write-Host "  clean      Remove containers and images"
    Write-Host "  logs       Show container logs"
    Write-Host "  shell      Access container shell"
    Write-Host "  help       Show this help message"
    Write-Host ""
}

function Build-Prod {
    Write-Host "Building production Docker image..." -ForegroundColor Green
    docker build -t pay-emsula:latest .
}

function Start-Dev {
    Write-Host "Starting development environment..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up --build
}

function Start-Prod {
    Write-Host "Starting production environment..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml up --build -d
    Write-Host "Application is running at http://localhost:3001" -ForegroundColor Yellow
}

function Stop-Containers {
    Write-Host "Stopping all containers..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.dev.yml down
}

function Clean-Docker {
    Write-Host "Cleaning Docker containers and images..." -ForegroundColor Green
    docker-compose -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
    docker system prune -f
}

function Show-Logs {
    Write-Host "Showing container logs..." -ForegroundColor Green
    $prodRunning = docker-compose ps | Select-String "pay-emsula"
    $devRunning = docker-compose -f docker-compose.dev.yml ps | Select-String "pay-emsula-dev"
    
    if ($prodRunning) {
        docker-compose logs -f
    }
    elseif ($devRunning) {
        docker-compose -f docker-compose.dev.yml logs -f
    }
    else {
        Write-Host "No containers are running" -ForegroundColor Red
    }
}

function Access-Shell {
    Write-Host "Accessing container shell..." -ForegroundColor Green
    $prodRunning = docker-compose ps | Select-String "pay-emsula"
    $devRunning = docker-compose -f docker-compose.dev.yml ps | Select-String "pay-emsula-dev"
    
    if ($prodRunning) {
        docker-compose exec pay-emsula sh
    }
    elseif ($devRunning) {
        docker-compose -f docker-compose.dev.yml exec pay-emsula-dev sh
    }
    else {
        Write-Host "No containers are running" -ForegroundColor Red
    }
}

switch ($Command.ToLower()) {
    "build" { Build-Prod }
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "stop" { Stop-Containers }
    "clean" { Clean-Docker }
    "logs" { Show-Logs }
    "shell" { Access-Shell }
    default { Show-Help }
}
