# DreamDwelling Real Estate Platform

A modern real estate platform built with Django and React, combining the best features from leading real estate websites like Airbnb, Zillow, Redfin, and Trulia.

## Features

- **Interactive Map Interface**: Intuitive property search with map-based UI
- **Advanced Search Filters**: Find properties matching specific criteria in real-time
- **Property Listings**: Detailed information with high-quality image galleries
- **User Profiles**: Save favorite properties and searches
- **Property Comparison**: Side-by-side comparisons of multiple properties
- **Virtual Tours**: 3D walkthrough capabilities
- **Neighborhood Insights**: School ratings, crime data, and local amenities
- **Mortgage Calculator**: Estimate monthly payments based on price and terms

## Tech Stack

### Backend

- Django
- Django REST Framework
- PostgreSQL with PostGIS
- Django Tests

### Frontend

- React
- NextJS
- Mapbox/Google Maps
- Tailwind CSS
- Jest & React Testing Library

## Getting Started

### Backend Setup

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Apply migrations
cd backend
python manage.py migrate

# Run the server
python manage.py runserver
```

### Frontend Setup

```bash
# Install dependencies
cd frontend
npm install

# Run development server
npm run dev
```

## Project Structure

```text
dreamdwelling/
├── backend/                # Django project
│   ├── config/             # Django settings
│   ├── users/              # User management
│   ├── properties/         # Property listings
│   ├── search/             # Search functionality
│   ├── favorites/          # Saved properties
│   ├── analytics/          # Market insights
│   ├── neighborhoods/      # Neighborhood data
│   └── media/              # User uploaded content
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
│
└── docs/                   # Documentation
```

## License

MIT
