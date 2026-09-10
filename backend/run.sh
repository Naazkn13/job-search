#!/bin/bash
# Run the Job Search backend
# Usage: ./run.sh
set -e
cd "$(dirname "$0")"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
