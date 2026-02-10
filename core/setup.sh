#!/usr/bin/env bash

set -e 

echo "GreenPrompt Core - Development Setup"
echo "===================================="

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is required but not installed."
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
REQUIRED_VERSION="3.11"

if [[ "$PYTHON_VERSION" < "$REQUIRED_VERSION" ]]; then
    echo "Error: Python $REQUIRED_VERSION+ is required. Found: $PYTHON_VERSION"
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -e ".[dev]"

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit .env with your configuration!"
fi

# Initialize database
echo "Initializing database..."
python -m app.init_db init

echo ""
echo "===================================="
echo "Setup complete!"
echo ""
echo "To activate the virtual environment:"
echo "  source venv/bin/activate"
echo ""
echo "To run the development server:"
echo "  uvicorn app.main:app --reload --port 8000"
echo ""
echo "To view API documentation:"
echo "  Open http://localhost:8000/docs"
echo "===================================="
