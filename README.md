# Multi-Carousel: Interactive Travel Interface Exploration

<p align="center">
    <img src="public/favicon.png" alt="Favicon" width="150"/>
</p>

An interactive React + Zustand application designed to explore and evaluate various travel interface patterns. This project includes a comprehensive user study with all analytics, survey data and results.

---

## 🚀 Project Overview

This project investigates user interactions with different travel interface designs, focusing on:

- **Interface Types**: List, Single-directional Carousel and Multi-directional Carousel layouts
- **User Study**: Designed to assess efficiency, engagement, satisfaction and outcome quality across interfaces
- **Analytics**: Includes scripts and data analyzing user behavior, survey responses and final outcomes

---

## 🧭 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/andrysiaczek/multi-carousel.git
   cd multi-carousel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The application will run at `http://localhost:5173/`.

### 🔐 Firebase and MapTiler Integration

This project optionally integrates:

- **MapTiler** – for rendering interactive maps during the exploration tasks
- **Firebase** – for storing participant metrics and survey responses in live deployments

To enable these services, create a `.env` file in your project root with the following keys:

#### 🌍 MapTiler

(Get a free API key at https://www.maptiler.com/)

```
VITE_MAP_TILER_API_KEY=your_maptiler_key
```

### 🔥 Firebase

(Create a project in Firebase Console: https://console.firebase.google.com/ and copy your credentials)

```
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

If you only want to explore the interface locally (without saving data or using maps), you can:

- Comment out Firebase imports and calls in `src/firebase/`
- Disable or mock the map rendering logic in the `MapLibreMap` component

---

## 📁 Project Structure

```
multi-carousel/
├── public/
│   ├── images/              # Images used by the mock dataset
│   ├── study/               # Screenshots of the interfaces (used in surveys)
│   └── favicon.png          # Project favicon
├── src/
│   ├── components/          # React components
│   ├── pages/               # Application pages
│   ├── data/                # Database generation scripts
│   ├── store/               # Zustand state management
│   ├── firebase/            # Firebase integration
│   ├── hooks/               # Custom React hooks
│   ├── types/               # Types, enums and study instructions
│   ├── utils/               # Utility functions
│   └── App.js               # Main application component
├── analytics/
│   ├── data/                # Survey data and task metrics
│   ├── scripts/             # Python scripts for analysis and plots
│   └── results/             # Output plots and summary tables
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

---

## 📊 Analytics Overview

The `analytics/` directory contains:

- **data**: Raw (`finalData.json`) and processed data (metrics and survey responses, e.g. `survey_final_clean.csv`)
- **scripts**: Python scripts for statistical analysis and visualization
- **results**: Output plots, tables and CSV summaries

### Running Analytics

To run the analytics:

1. Navigate to the `analytics/scripts/` directory.
2. Run the desired analysis script (ensure the data files are in place):

   ```bash
   python 02_generate_interface_descriptive_stats.py
   ```

Make sure you have the necessary Python packages installed:

```bash
pip install pandas matplotlib seaborn scipy numpy pingouin statsmodels
```
