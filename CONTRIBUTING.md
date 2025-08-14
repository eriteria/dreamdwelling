# Contributing to DreamDwelling

Thank you for your interest in contributing to DreamDwelling! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL with PostGIS extension
- Git

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/dreamdwelling.git`
3. Follow the setup instructions in the README.md
4. Create a new branch: `git checkout -b feature/your-feature-name`

## 📋 Development Guidelines

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript/TypeScript**: Use Prettier and ESLint configurations
- **Commit Messages**: Use conventional commit format
- **Documentation**: Update README.md for significant changes

### Testing
- Write tests for new features
- Ensure existing tests pass
- Frontend: Use Jest and React Testing Library
- Backend: Use Django's built-in testing framework

### Pull Request Process
1. Update documentation as needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Submit pull request with clear description

## 🏗️ Project Structure

### Backend (Django)
- `config/` - Project settings and configuration
- `users/` - User authentication and profiles
- `properties/` - Property management
- `neighborhoods/` - Geographic data
- `search/` - Search functionality
- `favorites/` - User favorites system
- `analytics/` - Usage analytics

### Frontend (Next.js)
- `src/components/` - Reusable UI components
- `src/pages/` - Next.js pages
- `src/features/` - Redux slices and API logic
- `src/app/` - App configuration and store
- `src/styles/` - Global styles

## 🎯 Areas for Contribution

### High Priority
- Property search and filtering improvements
- Map integration enhancements
- Mobile responsiveness optimizations
- Performance improvements

### Features Needed
- Advanced property comparison tools
- Real-time notifications
- Property valuation algorithms
- Integration with external APIs

### Bug Reports
When reporting bugs, please include:
- Operating system and version
- Browser and version (for frontend issues)
- Python version (for backend issues)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 🔍 Code Review Process

All contributions go through code review:
1. Automated checks (linting, tests)
2. Manual review by maintainers
3. Address feedback if needed
4. Merge when approved

## 📞 Getting Help

- Create an issue for bug reports or feature requests
- Join discussions in existing issues
- Contact maintainers for questions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to DreamDwelling! 🏠
