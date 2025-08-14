# DreamDwelling Real Estate Platform

## Project Overview

DreamDwelling is a modern real estate platform that combines the best features of popular websites like Airbnb, Zillow, and Redfin. The platform allows users to search for properties for sale or rent, save favorites, explore neighborhoods, and contact agents.

## Technology Stack

### Backend

- **Framework**: Django 4.2.10 with Django REST Framework
- **Database**: PostgreSQL with PostGIS for geospatial features
- **Authentication**: JWT-based authentication with Djoser

### Frontend

- **Framework**: Next.js (React) with TypeScript
- **State Management**: Redux with Redux Toolkit
- **Styling**: Tailwind CSS
- **Mapping**: Integration with Mapbox (planned)

## Key Features

### User Features

- User registration and authentication
- Property search with advanced filters
- Property listings with detailed information
- Favoriting properties
- Property maps and location data
- Contact agents for properties

### Property Features

- Multiple property types (houses, apartments, condos, etc.)
- Detailed property information (price, bedrooms, bathrooms, etc.)
- Property images gallery
- Location details
- Amenities and features
- Agent information

## Project Structure

### Backend Structure

- `config/`: Main Django configuration
- `users/`: User authentication and management
- `properties/`: Property listings and details
- `favorites/`: User favorites functionality
- `search/`: Search functionality
- `neighborhoods/`: Neighborhood data and analytics
- `analytics/`: Analytics and reporting

### Frontend Structure

- `src/pages/`: Next.js pages for routing
- `src/components/`: Reusable React components
- `src/features/`: Redux slices and feature components
- `src/app/`: Application configuration and store setup
- `src/styles/`: Global styles

## Redux State Management

The frontend uses Redux Toolkit for state management, with the following slices:

- `authSlice`: Handles user authentication and profile
- `propertiesSlice`: Manages property listings and details
- `favoritesSlice`: Manages user's favorited properties
- `searchSlice`: Handles search filters and location search

## Components

Key components that have been implemented include:

- `Layout`: Main layout component with header and footer
- `Header`: Navigation header with authentication state
- `Footer`: Site footer with links
- `PropertyCard`: Card component for displaying properties
- `SearchFilter`: Advanced search filter component

## Pages

The following pages have been implemented:

- Homepage: Landing page with search and featured properties
- Properties: List of properties with filters
- Property Detail: Detailed property information
- Login: User login page
- Register: User registration page
- Favorites: User's saved properties

## Getting Started

Please refer to the `SETUP.md` file for detailed instructions on setting up and running the project.

## Next Steps

Future enhancements planned for the platform:

- Integration with mapping services (Google Maps or Mapbox)
- Real-time notifications for price changes and new listings
- Advanced analytics for market trends
- Virtual tours and 3D property views
- Mobile app development
- Admin dashboard for property management
