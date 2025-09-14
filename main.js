import L from 'leaflet';
import Papa from 'papaparse';
import chroma from 'chroma-js';
import { cityCoordinates } from './coords.js';

// Define bounds for continental US
const usBounds = [
    [20.0, -130.0], // Southwest corner
    [50.0, -65.0]   // Northeast corner
];

// Initialize the map with proper bounds and zoom controls
const map = L.map('map', {
    center: [39.8283, -98.5795],
    zoom: 4,
    minZoom: 3,            // Minimum zoom level (continental US view)
    maxZoom: 10,           // Maximum zoom level
    zoomDelta: 1,          // Standard zoom increments
    zoomSnap: 0.5,         // Snap to half zoom levels
    wheelPxPerZoomLevel: 60, // Normal mouse wheel sensitivity
    maxBounds: usBounds,   // Restrict panning to US bounds
    maxBoundsViscosity: 1.0 // Strong boundary enforcement
});

// Define map styles
const mapStyles = {
    light: {
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19
    },
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19
    }
};

// Initialize with light mode
let currentTileLayer = L.tileLayer(mapStyles.light.url, {
    attribution: mapStyles.light.attribution,
    maxZoom: mapStyles.light.maxZoom
}).addTo(map);

// Define quartile colors
const quartileColors = {
    'Most Polite': '#13D0B4',    // Teal
    'Polite': '#5DD2EF',         // Light Blue  
    'Rude': '#F59A66',           // Orange
    'Rudest': '#ED5F80'          // Pink
};

const quartileLabels = ['Most Polite', 'Polite', 'Rude', 'Rudest'];

// Function to create Font Awesome marker
function createFontAwesomeMarker(color, size = 20) {
    return L.divIcon({
        html: `<i class="fas fa-location-dot" style="color: ${color}; font-size: ${size}px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);"></i>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size],
        popupAnchor: [0, -size],
        className: 'font-awesome-marker'
    });
}

// Function to get quartile and color based on score
function getQuartileInfo(score, quartiles) {
    if (score <= quartiles[0]) {
        return { quartile: 'Most Polite', color: quartileColors['Most Polite'] };
    } else if (score <= quartiles[1]) {
        return { quartile: 'Polite', color: quartileColors['Polite'] };
    } else if (score <= quartiles[2]) {
        return { quartile: 'Rude', color: quartileColors['Rude'] };
    } else {
        return { quartile: 'Rudest', color: quartileColors['Rudest'] };
    }
}

// Function to calculate quartiles
function calculateQuartiles(scores) {
    const sorted = [...scores].sort((a, b) => a - b);
    const n = sorted.length;
    
    return [
        sorted[Math.floor(n * 0.25)],  // 25th percentile
        sorted[Math.floor(n * 0.5)],   // 50th percentile (median)
        sorted[Math.floor(n * 0.75)]   // 75th percentile
    ];
}

// Load and parse CSV data
// Use path relative to the current page location
const csvPath = new URL('preply-rudest-cities-2024.csv', window.location.href).href;

Papa.parse(csvPath, {
    download: true,
    header: true,
    complete: function(results) {
        console.log('CSV data loaded:', results);
        
        // Filter out empty rows and get valid data
        const validData = results.data.filter(row => 
            row.rank && row.city_state && row.score && 
            row.rank !== '' && row.city_state !== '' && row.score !== ''
        );
        
        console.log('Valid data:', validData);
        
        if (validData.length === 0) {
            console.error('No valid data found');
            return;
        }
        
        // Calculate scores and quartiles
        const scores = validData.map(row => parseFloat(row.score));
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        const quartiles = calculateQuartiles(scores);
        
        console.log(`Score range: ${minScore} to ${maxScore}`);
        console.log(`Quartiles: ${quartiles}`);
        
        // Track quartile counts for legend
        const quartileCounts = {
            'Most Polite': 0,
            'Polite': 0, 
            'Rude': 0,
            'Rudest': 0
        };
        
        // Create markers for each city
        validData.forEach(row => {
            const cityName = row.city_state.replace(/"/g, ''); // Remove quotes if any
            const score = parseFloat(row.score);
            const rank = parseInt(row.rank);
            
            // Get coordinates for the city
            const coords = cityCoordinates[cityName];
            
            if (coords) {
                const quartileInfo = getQuartileInfo(score, quartiles);
                quartileCounts[quartileInfo.quartile]++;
                
                const markerSize = 25; // Standard size for all markers
                
                const marker = L.marker(coords, {
                    icon: createFontAwesomeMarker(quartileInfo.color, markerSize)
                }).addTo(map);
                
                // Create simplified popup content
                const popupContent = `
                    <div class="popup-content">
                        <div class="popup-title" style="color: ${quartileInfo.color};">#${rank} ${cityName}</div>
                        <div class="popup-score">Rudeness score: ${score}</div>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                
                // Add hover effects
                marker.on('mouseover', function(e) {
                    this.openPopup();
                });
                
                marker.on('mouseout', function(e) {
                    // Don't close popup on mouseout - let user click to close
                });
            } else {
                console.warn(`Coordinates not found for: ${cityName}`);
            }
        });
        
        // Update legend with quartile information
        updateLegend(quartiles, quartileCounts);
        
        console.log('Map initialization complete!');
    },
    error: function(error) {
        console.error('Error loading CSV:', error);
    }
});

// Function to update legend with quartile information
function updateLegend(quartiles, quartileCounts) {
    const legend = document.querySelector('.legend');
    legend.innerHTML = `
        <h4 style="text-align: center; margin-bottom: 8px; font-size: 0.9em; font-weight: 600;">Rudeness Categories</h4>
        <div class="quartile-legend" style="display: flex; flex-direction: row; justify-content: space-between; gap: 15px;">
            <div class="quartile-item">
                <i class="fas fa-location-dot" style="color: ${quartileColors['Most Polite']}; font-size: 12px;"></i>
                <span>Most Polite (≤${quartiles[0]}) - ${quartileCounts['Most Polite']} cities</span>
            </div>
            <div class="quartile-item">
                <i class="fas fa-location-dot" style="color: ${quartileColors['Polite']}; font-size: 12px;"></i>
                <span>Polite (${quartiles[0]}-${quartiles[1]}) - ${quartileCounts['Polite']} cities</span>
            </div>
            <div class="quartile-item">
                <i class="fas fa-location-dot" style="color: ${quartileColors['Rude']}; font-size: 12px;"></i>
                <span>Rude (${quartiles[1]}-${quartiles[2]}) - ${quartileCounts['Rude']} cities</span>
            </div>
            <div class="quartile-item">
                <i class="fas fa-location-dot" style="color: ${quartileColors['Rudest']}; font-size: 12px;"></i>
                <span>Rudest (>${quartiles[2]}) - ${quartileCounts['Rudest']} cities</span>
            </div>
        </div>
    `;
}

// Add some CSS for the Font Awesome markers
const style = document.createElement('style');
style.textContent = `
    .font-awesome-marker {
        background: none !important;
        border: none !important;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .leaflet-marker-icon.font-awesome-marker {
        background: transparent;
        border-radius: 0;
        box-shadow: none;
    }
`;
document.head.appendChild(style);

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
let isDarkMode = false;

// Function to switch map style
function switchMapStyle(isDark) {
    map.removeLayer(currentTileLayer);
    
    const style = isDark ? mapStyles.dark : mapStyles.light;
    currentTileLayer = L.tileLayer(style.url, {
        attribution: style.attribution,
        maxZoom: style.maxZoom
    }).addTo(map);
}

// Function to toggle theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Update icon
    themeIcon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    // Switch map style
    switchMapStyle(isDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    toggleTheme();
}

// Add event listener
themeToggle.addEventListener('click', toggleTheme);
