# America's Rudest Cities 2024 - Interactive Map

An interactive data visualization exploring rudeness scores across major US cities, based on Preply's 2024 study.

![Interactive Map Preview](https://via.placeholder.com/800x400/13D0B4/FFFFFF?text=Interactive+Rudeness+Map)

## 🗺️ Live Demo

[View the Interactive Map](#) <!-- Update with your deployed URL -->

## 📊 Features

- **Interactive Leaflet Map** with color-coded markers for 46 major US cities
- **Quartile-based Classification** using intuitive color progression
- **Light/Dark Theme Toggle** with persistent user preferences
- **Responsive Design** optimized for desktop and mobile
- **Hover Tooltips** showing city rank and rudeness score
- **Data Analysis Section** with key insights and patterns

## 🎨 Design

### Color Palette
- **Most Polite**: `#13D0B4` (Teal)
- **Polite**: `#5DD2EF` (Light Blue)
- **Rude**: `#F59A66` (Orange)  
- **Rudest**: `#ED5F80` (Pink)

### Technology Stack
- **Leaflet.js** - Interactive mapping
- **Papa Parse** - CSV data processing
- **Chroma.js** - Color manipulation
- **Font Awesome** - Location markers
- **Vite** - Build tool and dev server

## 📈 Key Insights

- **Top 3 Rudest Cities**: Miami FL (9.88), Philadelphia PA (9.12), Tampa FL (8.88)
- **Score Range**: 6.24 (Omaha, NE) to 9.88 (Miami, FL)
- **Average Score**: 7.64
- **Regional Patterns**: Florida dominates top rankings, Midwest cities tend to be more polite

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/[your-username]/rude-cities.git
cd rude-cities
```

2. Install dependencies
```bash
yarn install
```

3. Start the development server
```bash
yarn dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
yarn build
```

## 📁 Project Structure

```
rude-cities/
├── index.html              # Main HTML file
├── style.css               # Styles and themes
├── main.js                 # Interactive map logic
├── coords.js               # City coordinate data
├── preply-rudest-cities-2024.csv  # Source data
├── package.json            # Dependencies
└── README.md               # This file
```

## 📊 Data Source

This visualization is based on [Preply's 2024 study of America's rudest cities](https://preply.com/en/blog/rudest-cities-2024/). The study analyzed factors including road rage, customer service interactions, and general civility to generate rudeness scores for major US metropolitan areas.

## 🛠️ Customization

### Adding New Cities
1. Add coordinates to `coords.js`
2. Update the CSV file with new data
3. The map will automatically include new cities

### Changing Colors
Update the `quartileColors` object in `main.js`:
```javascript
const quartileColors = {
    'Most Polite': '#your-color',
    'Polite': '#your-color',
    'Rude': '#your-color',
    'Rudest': '#your-color'
};
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 📄 License

MIT License - feel free to use this project as inspiration for your own data visualizations!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📧 Contact

Nicole Mark - [@nicolemark](https://github.com/nicolelily)

Project Link: [https://nicolelily.github.io/rude-cities/(https://nicolelily.github.io/rude-cities/)

---

*Built with ❤️ and data visualization best practices*
