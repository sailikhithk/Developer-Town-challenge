.PHONY: setup activate install create_db run tree_windows all

# Step 1: Create a virtual environment
setup:
	python -m venv venv

# Step 2: Activate the virtual environment
activate:
	.venv\Scripts\activate

# Step 3: Install the required packages
install:
	venv\Scripts\activate && pip install -r requirements.txt

# Step 4: Create the database tables
create_db:
	venv\Scripts\activate && python create_db.py

# Step 5: Run the FastAPI application
run:
	venv\Scripts\activate && uvicorn app.main:app --reload

# Combine all steps
all: setup install create_db run

# Generate directory tree for Windows, ignoring venv and other unnecessary files
tree_windows:
	tree /F /A | findstr /V /C:"venv\\" | findstr /V /C:"venv\Scripts" | findstr /V /C:"venv\Lib" | findstr /V /C:"venv\Include" | findstr /V /C:"venv\Lib\site-packages" | findstr /V /C:".pyc" | findstr /V /C:".DS_Store" | findstr /V /C:"__pycache__" > backend_directory_tree.txt