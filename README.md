# 🏛️ LokNiti AI - Constituency Decision Intelligence OS

> **An Explainable AI-driven "Digital Twin" for Lok Sabha Members of Parliament (MPs) and District Administrators to optimize budget allocations, audit citizen grievances, and visualize micro-GIS asset telemetry in West Bengal.**

---

## 🌟 Pitch & Value Proposition

LokNiti AI bridges the gap between citizens, elected representatives, and executive officers. Built for hackathon judges, LokNiti AI provides a premium, responsive glassmorphic interface that simulates real-time data-driven governance. 

By utilizing **explainable priority ranking (XAI)**, LokNiti AI ranks municipal clusters based on citizen demand, distance, and local development indices. It lets decision-makers run "what-if" budget simulations, verify localized infrastructure gaps, and instantly sanction funds with a centralized **undo ledger**.

---

## 🚀 Key Features

### 1. 🗺️ Interactive GIS Constituency Twin & Zoom-to-Ward
* **4 Bengal Profiles**: Instantly switch between **Kolkata Uttar** (Urban Metro), **Purulia** (Rural Dryland), **Darjeeling** (Hilly Terrain), and **Sundarbans** (Coastal Mangrove Delta).
* **Dynamic Contours**: The map automatically draws the Hooghly river path, Ayodhya hill peaks, snowcapped Himalayan contours, or interlocking tidal channels.
* **Micro-GIS Zoom**: Zoom from the constituency segment overview directly into a street-level ward layout.
* **Asset Telemetry**: View local infrastructure nodes (🏫 Schools, 🏥 Clinics, 🚰 Water Filtration, 📍 Roads) and identify critical gaps (marked in glowing red).

### 2. 💰 MPLADS Master Budget Planner
* **Dynamic Allocations**: Input total constituency funding in Crores.
* **AI Need-Based Share**: Auto-distribute funds across assembly segments based on the developmental deficit (AI weight) or population density.
* **What-If Twin Simulator**: Adjust local development sector weights (Roads, Water, Education, Health) to see forecast changes in the constituency development score.

### 3. ↩️ Central Action Ledger & Undo System
* **Audit Trail**: Every action (sanctioning a budget, changing tender status, or updating parameters) is logged in a central ledger.
* **Mistake Reversal**: A click on the red **Undo** button instantly rolls back database states, restores the budget, and refunds the cost.

### 4. 🗣️ Multilingual Citizen Portal
* **Voice Transcription**: Live audio translation simulating citizen voice submissions (e.g., Bengali, Hindi, Kannada).
* **OCR Damage Parser**: Upload photos (e.g., collapsed bridge or flooded road) to automatically extract damage severity and category.
* **WhatsApp Chatbot Simulator**: Interactive console demonstrating how citizens log grievances in their native tongue.

---

## 🛠️ Technology Stack

* **Frontend**: React 18, TypeScript, Vite
* **Styling**: Vanilla CSS (Premium Dark Theme, Glassmorphism, HSL custom color system, micro-animations)
* **Icons**: Lucide React
* **State Management**: React state with mock database syncing triggers

---

## 🎮 Interactive Judge Demo Guide (Quick Walkthrough)

To explore the application's core features in under 3 minutes:

1. **Change Constituency**: Switch the **Active WB Constituency** dropdown in the top-right header to **Sundarbans** or **Purulia** and observe the SVG map update to match the local delta or hill geography.
2. **Zoom to Local Wards**: Under **MP Dashboard**, select **Kashipur-Belgachhia** on the map, then click **Zoom to Kashipur-Belgachhia**. Click on **Ward 1** to inspect the local asset audit panel.
3. **Distribute Budget**: Change the total budget input, then switch between **By Need (AI)** and **By Population** to watch the segment funding reallocate automatically.
4. **Sanction & Undo**: Click **Approve & Sanction** on the highest recommended proposal. Scroll to the **Constituency Action Ledger** and click **Undo** to watch the budget automatically refund.
5. **Simulate Citizen Voice**: Switch to **Citizen Portal**, click the **Bimal Sen (Bengali)** voice sample, watch it translate, and submit the proposal to the consensus feed.

---

## ⚙️ Getting Started

To run the application locally on your machine:

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SubhrodipPal/LokNiti-AI.git
   cd LokNiti-AI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
* **Using Launcher (Windows)**:
  Simply double-click the [start_app.bat](file:///d:/LokNiti%20AI/start_app.bat) file in the project folder to start the development server and open the browser automatically.
* **Using CLI**:
  ```bash
  npm run dev
  ```
  Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

### Building for Production
To build a optimized bundle:
```bash
npm run build
```
The compiled files will be located in the `dist/` directory.

---

## 👥 Contributors

* **Subhrodip Pal** (Lead Developer)
