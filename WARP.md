# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an interactive data visualization project called "America's Rudest Cities 2024" that displays rudeness scores for 46 major US cities using an interactive Leaflet map. The project is built with vanilla JavaScript and uses Vite for development and building.

## Development Commands

### Setup and Development
```bash
yarn install          # Install dependencies (preferred package manager)
yarn dev              # Start development server on http://localhost:5173
yarn build             # Build for production (outputs to dist/ with base path /rude-cities/)
yarn preview           # Preview production build locally
```

### No testing framework is configured - tests would need to be added if required.

## Architecture Overview

### Core Structure
- **Single-page application** with vanilla JavaScript modules
- **Vite-based build system** for development and production
- **Static data visualization** using CSV data source
- **Leaflet.js integration** for interactive mapping
- **Responsive design** with light/dark theme toggle

### Key Files and Responsibilities

**main.js** - Primary application logic
- Map initialization and configuration with US bounds restriction
- CSV data loading and parsing using Papa Parse
- Quartile calculation and color assignment for 4 rudeness categories
- Dynamic marker creation with Font Awesome location dots
- Theme switching (light/dark mode with persistent localStorage)
- Legend generation based on actual data quartiles

**coords.js** - Geographic data module
- Exports `cityCoordinates` object mapping city names to [lat, lng] coordinates
- Covers all 46 cities from the dataset
- Uses exact city name matching from CSV data

**index.html** - Application structure
- CDN imports for Leaflet CSS and Font Awesome icons
- Header with title and theme toggle button
- Grid layout: map section (2fr) + analysis section (1fr)
- Static insights section with hardcoded top cities and patterns

**style.css** - Comprehensive styling
- CSS Grid-based responsive layout
- Complete dark/light theme implementation
- Custom Leaflet popup styling
- Responsive breakpoints at 968px and 768px
- Font Awesome marker styling with custom CSS injection

### Data Flow
1. CSV loaded from different paths based on environment (localhost vs production)
2. Data filtered for valid entries (non-empty rank, city_state, score)
3. Quartiles calculated dynamically from score distribution
4. Cities mapped to coordinates using exact string matching
5. Markers created with quartile-based colors and Font Awesome icons
6. Legend populated with actual quartile ranges and city counts

### Color System
Fixed color palette for quartiles:
- Most Polite: `#13D0B4` (Teal)
- Polite: `#5DD2EF` (Light Blue)
- Rude: `#F59A66` (Orange)
- Rudest: `#ED5F80` (Pink)

### Theme System
- Light mode: CartoDB Positron tiles
- Dark mode: CartoDB Dark Matter tiles
- Theme state persisted in localStorage
- All UI components have dark mode variants

## Common Development Patterns

### Adding New Cities
1. Add coordinates to `cityCoordinates` object in coords.js
2. Ensure city name exactly matches CSV format (with state abbreviation)
3. Map will automatically include new cities if present in CSV data

### Modifying Visual Elements
- **Marker colors**: Update `quartileColors` object in main.js
- **Marker icons**: Modify `createFontAwesomeMarker()` function
- **Map bounds**: Adjust `usBounds` array for different geographic focus
- **Popup content**: Edit template in marker creation loop

### Data Source Changes
- CSV path logic handles localhost vs production environments
- File must maintain rank, city_state, score columns
- Quartiles and colors are calculated dynamically from new data

## Important Notes

- **Base path configuration**: Production build uses `/rude-cities/` base path for GitHub Pages deployment
- **Coordinate matching**: City names must exactly match between CSV and coords.js (case sensitive)
- **No backend**: Entirely static application suitable for GitHub Pages hosting
- **Dependencies**: Core libraries are Leaflet (mapping), Papa Parse (CSV), and Chroma.js (color utilities)