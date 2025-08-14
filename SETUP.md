# DreamDwelling Setup Instructions

This document provides detailed step-by-step instructions for setting up and running the DreamDwelling real estate platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Deployment](#deployment)

## Prerequisites

Before starting, ensure you have the following installed on your system:

- **Python 3.9+** - For the Django backend
- **Node.js 14+** and **npm** - For the React/Next.js frontend
- **PostgreSQL 12+** with **PostGIS extension** - For the database with geospatial capabilities
- **Git** - For version control

## Backend Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd dreamdwelling
```

### 2. Create a Python Virtual Environment

#### Windows:

```bash
python -m venv venv
.\venv\Scripts\activate
```

#### macOS/Linux:

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

> **Note:** If you encounter an `AttributeError: module 'ntpath' has no attribute 'ALLOW_MISSING'` error, it's likely due to a compatibility issue between Django and Python versions. Try the following solutions:
>
> 1. Use Python 3.10+ with Django 4.2+
> 2. Or, downgrade Django: `pip install django==4.1.7`
> 3. Make sure you're using the latest pip: `python -m pip install --upgrade pip`

### 4. PostgreSQL Setup

#### Install PostgreSQL and PostGIS

- Windows: [PostgreSQL Windows Installer](https://www.postgresql.org/download/windows/)
- macOS: `brew install postgresql postgis`
- Linux: `sudo apt-get install postgresql postgresql-contrib postgis`

#### Create Database

Start the PostgreSQL shell:

```bash
psql -U postgres
```

Create the database and add the PostGIS extension:

```sql
CREATE DATABASE dreamdwelling;
\c dreamdwelling
CREATE EXTENSION postgis;
\q
```

### 5. Environment Configuration

Create a `.env` file in the `backend` directory:

```
DEBUG=True
SECRET_KEY=your-secure-secret-key-change-this
DATABASE_URL=postgres://postgres:your-postgres-password@localhost:5432/dreamdwelling
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### 6. Run Migrations

```bash
python manage.py migrate
```

### 7. Create a Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 8. Load Initial Data

If available, load fixture data:

```bash
python manage.py loaddata fixtures/property_types.json
python manage.py loaddata fixtures/features.json
```

## Frontend Setup

### 1. Navigate to the Frontend Directory

```bash
cd ../frontend
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the `frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running the Application

### 1. Start the Backend Server

From the `backend` directory:

```bash
python manage.py runserver
```

The backend will be running at http://localhost:8000/

### 2. Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The frontend will be running at http://localhost:3000/

## Testing

### Backend Tests

Run the Django test suite:

```bash
cd backend
python manage.py test
```

### Frontend Tests

Run the Next.js/React test suite:

```bash
cd frontend
npm test
```

## Troubleshooting

### Common Issues and Solutions

#### PostgreSQL Connection Issues

**Issue**: Unable to connect to PostgreSQL database.

**Solutions**:

- Ensure PostgreSQL service is running:
  - Windows: Check Services app
  - macOS/Linux: `sudo service postgresql status`
- Verify database credentials in `.env` file
- Try connecting with psql to test connection: `psql -U postgres -d dreamdwelling`

#### Module Not Found Errors

**Issue**: Python or Node.js modules not found.

**Solutions**:

- Ensure virtual environment is activated (backend)
- Check if all dependencies are installed correctly:
  - Backend: `pip install -r requirements.txt`
  - Frontend: `npm install`

#### Python/Django Version Compatibility Issues

**Issue**: Errors like `AttributeError: module 'ntpath' has no attribute 'ALLOW_MISSING'`

**Solutions**:

- Use Python 3.10+ with Django 4.2+ (recommended)
- Alternatively, downgrade Django: `pip install django==4.1.7`
- Update pip to the latest version: `python -m pip install --upgrade pip`
- On Windows, you might need to update your setuptools: `pip install --upgrade setuptools`

#### Migration Errors

**Issue**: Django migration errors.

**Solutions**:

- Make sure PostgreSQL and PostGIS are correctly installed
- Try resetting migrations:
  ```bash
  python manage.py showmigrations
  python manage.py migrate --fake-initial
  ```

#### CORS Errors

**Issue**: CORS policy blocking requests.

**Solutions**:

- Ensure `CORS_ALLOWED_ORIGINS` in the backend `.env` file includes your frontend URL
- Check that the frontend is making requests to the correct API URL

#### TypeScript Errors

**Issue**: TypeScript compilation errors.

**Solutions**:

- Check that all required types are properly defined
- Run `npm install` to ensure all type definitions are installed
- Run `npx tsc --noEmit` to check for TypeScript errors

## Deployment

### Backend Deployment

1. Update the `.env` file with production settings:

   ```
   DEBUG=False
   SECRET_KEY=your-secure-production-secret-key
   DATABASE_URL=your-production-db-url
   ALLOWED_HOSTS=your-domain.com
   CORS_ALLOWED_ORIGINS=https://your-domain.com
   ```

2. Collect static files:

   ```bash
   python manage.py collectstatic
   ```

3. Set up a production server with Gunicorn and Nginx:
   ```bash
   pip install gunicorn
   gunicorn config.wsgi:application --bind 0.0.0.0:8000
   ```

### Frontend Deployment

1. Build the Next.js application:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

For more advanced deployment options, consider using Docker, AWS, Vercel, or other cloud providers.
