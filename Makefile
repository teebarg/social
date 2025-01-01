# Phony targets
.PHONY: help dev build start lint test prettier docker-dev docker-build docker-up docker-down

.EXPORT_ALL_VARIABLES:

PROJECT_SLUG := "social"
APP_NAME := $(PROJECT_SLUG)-backend
DOCKER_HUB := beafdocker

# Help target
help:
	@echo "Available commands:"
	@echo "  make dev         - Run the development server"
	@echo "  make build       - Build the production application"
	@echo "  make start       - Start the production server"
	@echo "  make lint        - Run linter"
	@echo "  make test        - Run e2e tests"
	@echo "  make prettier    - Run prettier"
	@echo "  make docker-dev  - Run the development server in Docker"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-up   - Start Docker containers"
	@echo "  make docker-down - Stop Docker containers"

# ANSI color codes
GREEN=$(shell tput -Txterm setaf 2)
YELLOW=$(shell tput -Txterm setaf 3)
RED=$(shell tput -Txterm setaf 1)
BLUE=$(shell tput -Txterm setaf 6)
RESET=$(shell tput -Txterm sgr0)

## Docker
startTest:
	@echo "$(YELLOW)Starting docker environment...$(RESET)"
	docker compose -p $(PROJECT_SLUG) up --build

updateTest:
	docker compose -p $(PROJECT_SLUG) up --build -d

stopTest:
	@COMPOSE_PROJECT_NAME=$(PROJECT_SLUG) docker compose down


# Utilities
lint-backend: ## Format backend code
	@echo "$(YELLOW)Running linters for backend...$(RESET)"
	@cd backend && make format

lint-frontend: ## Format frontend code
	@echo "$(YELLOW)Running linters for frontend...$(RESET)"
	@cd frontend && npm run lint

lint: ## Format project
	@$(MAKE) -s lint-backend
	@$(MAKE) -s lint-frontend

test-frontend: ## Run frontend tests
	@echo "$(YELLOW)Running frontend tests...$(RESET)"
	@cd frontend && npm run test:unit

test-backend: ## Run backend tests
	@echo "$(YELLOW)Running backend tests...$(RESET)"
	docker exec social-backend ./test.sh

test: ## Run project tests
	@$(MAKE) -s test-frontend
	@$(MAKE) -s test-backend

prep: ## Prepare postges database
	@echo "$(YELLOW)Preparing database...$(RESET)"
	@cd backend && scripts/prestart.sh

prep-docker: ## Prepare postges database
	@echo "$(YELLOW)Preparing docker database...$(RESET)"
	docker exec social-backend ./scripts/prestart.sh

serve-backend: ## Serve the backend in terminal
	@cd backend; fastapi dev app/main.py

serve-frontend: ## Serve the frontend in terminal
	@cd frontend; npm run dev

dev: ## Serve the project in terminal
	@echo "$(YELLOW)Running development in terminal...$(RESET)"
	make -j 2 serve-backend serve-frontend


# Backend Deployment
deploy:
	@echo "$(YELLOW)Deploying backend to Vercel...$(RESET)"
	vercel deploy --prod


# Helpers
scaffold: ## Scaffold a resource
	@cd scripts && python scaffold.py run -n $(name)

pre-commit:
	npx concurrently --kill-others-on-fail --prefix "[{name}]" --names "frontend:lint,frontend:build,backend:lint,backend:test" \
	--prefix-colors "bgRed.bold.white,bgGreen.bold.white,bgBlue.bold.white,bgMagenta.bold.white" \
    "cd frontend && npm run lint" \
    "cd frontend && npm run build" \
	"cd backend && ruff check --fix ." \
	"cd backend && black ."

pre-commit-docker:
	npx concurrently --kill-others-on-fail --prefix "[{name}]" --names "frontend:lint,frontend:test,frontend:build,backend:lint,backend:test" \
	--prefix-colors "bgRed.bold.white,bgGreen.bold.white,bgBlue.bold.white,bgMagenta.bold.white" \
    "docker exec social-frontend-1 npm run lint:check" \
    "docker exec social-frontend-1 npm run test:unit" \
    "docker exec social-frontend-1 npm run build" \
	"docker exec social-backend-1 make format" \
	"docker exec social-backend-1 make test"
