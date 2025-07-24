#!/bin/bash

# Docker utility script for pay-emsula

set -e

show_help() {
    echo "Docker utility script for pay-emsula"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build      Build the production Docker image"
    echo "  dev        Start development environment with hot reload"
    echo "  prod       Start production environment"
    echo "  stop       Stop all containers"
    echo "  clean      Remove containers and images"
    echo "  logs       Show container logs"
    echo "  shell      Access container shell"
    echo "  help       Show this help message"
    echo ""
}

build_prod() {
    echo "Building production Docker image..."
    docker build -t pay-emsula:latest .
}

start_dev() {
    echo "Starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build
}

start_prod() {
    echo "Starting production environment..."
    docker-compose up --build -d
    echo "Application is running at http://localhost:3000"
}

stop_containers() {
    echo "Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
}

clean_docker() {
    echo "Cleaning Docker containers and images..."
    docker-compose down --rmi all --volumes --remove-orphans
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
    docker system prune -f
}

show_logs() {
    echo "Showing container logs..."
    if docker-compose ps | grep -q "pay-emsula"; then
        docker-compose logs -f
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "pay-emsula-dev"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        echo "No containers are running"
    fi
}

access_shell() {
    echo "Accessing container shell..."
    if docker-compose ps | grep -q "pay-emsula"; then
        docker-compose exec pay-emsula sh
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "pay-emsula-dev"; then
        docker-compose -f docker-compose.dev.yml exec pay-emsula-dev sh
    else
        echo "No containers are running"
    fi
}

case "${1:-help}" in
    build)
        build_prod
        ;;
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    stop)
        stop_containers
        ;;
    clean)
        clean_docker
        ;;
    logs)
        show_logs
        ;;
    shell)
        access_shell
        ;;
    help|*)
        show_help
        ;;
esac
