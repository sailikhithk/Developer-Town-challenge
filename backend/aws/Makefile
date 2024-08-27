# Makefile for Flask application setup and Lambda deployment

# Flask Configuration
VENV_NAME := venv
PYTHON := python
PIP := $(VENV_NAME)\Scripts\pip
ACTIVATE := $(VENV_NAME)\Scripts\activate

# Lambda Configuration
AWS_ACCOUNT_ID := 872378549974
FUNCTION_NAME := star-wars-api
LAMBDA_HANDLER := lambda.lambda_handler
RUNTIME := python3.9
REGION := us-east-1
TABLE_NAME := StarWarsStarships
LAMBDA_EXECUTION_ROLE := StarwarsBFF

# Paths
SRC_DIR := .
BUILD_DIR := .\build
PACKAGE_FILE := $(BUILD_DIR)\lambda_package.zip

# AWS CLI command
AWS := aws

.PHONY: all setup activate install run tree_windows clean deps package deploy create-function update-function-configuration set-environment-variables

# Flask setup targets
setup:
	$(PYTHON) -m venv $(VENV_NAME)

activate:
	@echo Activate the virtual environment by running: $(ACTIVATE)

install:
	$(ACTIVATE) && $(PIP) install -r requirements.txt

run:
	$(ACTIVATE) && $(PYTHON) app.py

# Lambda deployment targets
clean:
	if exist $(BUILD_DIR) rmdir /s /q $(BUILD_DIR)
	mkdir $(BUILD_DIR)
	mkdir $(BUILD_DIR)\python

deps:
	$(PIP) install -r requirements.txt -t $(BUILD_DIR)\python

package: deps
	copy $(SRC_DIR)\lambda.py $(BUILD_DIR)
	cd $(BUILD_DIR) && powershell Compress-Archive -Path lambda.py, python\* -DestinationPath $(PACKAGE_FILE) -Force

deploy: package
	$(AWS) lambda update-function-code --function-name $(FUNCTION_NAME) --zip-file fileb://$(PACKAGE_FILE) --region $(REGION)

create-function: package
	$(AWS) lambda create-function --function-name $(FUNCTION_NAME) --runtime $(RUNTIME) --role arn:aws:iam::$(AWS_ACCOUNT_ID):role/$(LAMBDA_EXECUTION_ROLE) --handler $(LAMBDA_HANDLER) --zip-file fileb://$(PACKAGE_FILE) --region $(REGION)

update-function-configuration:
	$(AWS) lambda update-function-configuration --function-name $(FUNCTION_NAME) --runtime $(RUNTIME) --handler $(LAMBDA_HANDLER) --region $(REGION)

set-environment-variables:
	$(AWS) lambda update-function-configuration --function-name $(FUNCTION_NAME) --environment Variables={TABLE_NAME=$(TABLE_NAME)} --region $(REGION)

# Utility targets
tree_windows:
	powershell "Get-ChildItem -Recurse | Where-Object { $$_.FullName -notmatch '\\venv\\' -and $$_.Name -notmatch '\.pyc$$|\.DS_Store$$|__pycache__' } | Select-Object FullName | ForEach-Object { $$_.FullName.Substring($$(Get-Location).Path.Length + 1) } | Out-File -FilePath backend_directory_tree.txt"

# Combined targets
all_flask: setup install run

all_lambda: clean deps package deploy