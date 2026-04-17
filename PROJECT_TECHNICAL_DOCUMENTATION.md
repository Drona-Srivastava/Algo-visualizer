# Algo Engine - Complete Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Design](#architecture--design)
3. [Technology Stack](#technology-stack)
4. [Application Flow](#application-flow)
5. [Routing System](#routing-system)
6. [Component Interaction](#component-interaction)
7. [Data Flow & Management](#data-flow--management)
8. [Simulation Engine](#simulation-engine)
9. [Styling Architecture](#styling-architecture)
10. [Development Setup](#development-setup)

---

## Project Overview

**Algo Engine** is an interactive React-based platform for learning algorithms through visual simulation, step-by-step execution, and explanation-driven workflows. The application enables users to understand complex algorithms by watching them execute in real-time with highlighted states, visual feedback, and detailed explanations at each step.

### Key Features

- **Interactive Visualizations**: Real-time visual representation of algorithm execution
- **Step-by-Step Execution**: Play, pause, next, previous controls for manual stepping
- **Multiple Algorithm Categories**: 8+ algorithm categories with 50+ algorithms
- **Custom Input Support**: Users can provide custom input for testing
- **State Visualization**: Bars for numeric data, graphs for graph algorithms, tables for dynamic programming
- **Responsive Design**: Mobile-friendly UI with smooth animations
- **Performance Optimized**: Efficient rendering with Framer Motion

---

## Architecture & Design

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│  ┌──────────┬──────────────┬──────────────┬──────────────┐  │
│  │  Home    │ CategoryPage │ AlgorithmSim │ SortingView  │  │
│  └──────────┴──────────────┴──────────────┴──────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│               Router & Component Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Router DOM - Dynamic URL-based Navigation    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Data Layer                                  │
│  ┌──────────────┬──────────────────┬──────────────────┐    │
│  │ algorithms.js│ categoryAlgos.js  │ sortingAlgos.js  │    │
│  └──────────────┴──────────────────┴──────────────────┘    │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              Simulation Engine Layer                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │ algorithmSimulations.js - Universal Engine        │    │
│  │ sortingSimulations.js - Sorting-specific Engine   │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### Project Structure

```
Algo-Engine/
├── public/                          # Static assets
├── src/
│   ├── assets/                      # Images, icons
│   ├── components/
│   │   ├── AlgoCard.jsx            # Category card component
│   │   └── Footer.jsx              # Footer component
│   ├── data/
│   │   ├── algorithms.js           # Home page categories
│   │   ├── categoryAlgorithms.js   # Algorithm catalog
│   │   └── sortingAlgorithms.js    # Sorting-specific data
│   ├── pages/
│   │   ├── Home.jsx                # Landing page
│   │   ├── CategoryPage.jsx        # Category view
│   │   ├── AlgorithmSimulation.jsx # Main simulator (universal)
│   │   ├── Sorting.jsx             # Legacy sorting page
│   │   └── SortingSimulation.jsx   # Legacy sorting simulator
│   ├── styles/
│   │   ├── sorting.css             # Category & simulation styles
│   │   └── index.css               # Global styles
│   ├── utils/
│   │   ├── algorithmSimulations.js # Universal simulation engine
│   │   └── sortingSimulations.js   # Sorting algorithms implementation
│   ├── App.jsx                     # Root router component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── docs/
│   └── simulation-inputs.md        # Algorithm specifications
├── package.json                    # Dependencies
├── vite.config.js                 # Vite configuration
├── eslint.config.js               # ESLint rules
└── index.html                     # HTML entry point
```

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.4 | UI framework |
| React Router DOM | 7.13.2 | Client-side routing |
| Framer Motion | 12.38.0 | Animations & motion |
| Lucide React | 1.0.1 | UI icons |
| Vite | 8.0.1 | Build tool |
| ESLint | 9.39.4 | Code linting |

### Build & Development

- **Build Tool**: Vite - Fast module federation with HMR (Hot Module Replacement)
- **Package Manager**: npm (specified in package.json)
- **Development Server**: Vite dev server with React plugin
- **Linting**: ESLint with React hooks rules

### Package.json Configuration

```json
{
  "name": "client",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.0.1",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.2"
  }
}
```

---

## Application Flow

### User Journey Flow

```
┌────────────────────────────────────────────────────────────┐
│                      START (index.html)                    │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│         main.jsx - Entry Point                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ createRoot(document.getElementById('root'))        │   │
│  │ .render(<App />)                                   │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────┐
│         App.jsx - Root Router Setup                        │
│  ┌────────────────────────────────────────────────────┐   │
│  │ <BrowserRouter>                                    │   │
│  │   <Routes>                                         │   │
│  │     Route / → <Home />                             │   │
│  │     Route /:categoryId → <CategoryPage />          │   │
│  │     Route /:categoryId/:algorithmId →              │   │
│  │       <AlgorithmSimulation />                      │   │
│  │   </Routes>                                        │   │
│  │   <Footer />                                       │   │
│  │ </BrowserRouter>                                   │   │
│  └────────────────────────────────────────────────────┘   │
└────────────────┬─────────────────────────────────────────┘
                 │
    ┌────────────┴─────────────┬─────────────────────┐
    ▼                          ▼                     ▼
┌────────────────┐  ┌──────────────────┐  ┌─────────────────────┐
│  Home.jsx      │  │ CategoryPage.jsx │  │AlgorithmSimulation  │
│ (Route: /)     │  │(Route: /:id)     │  │.jsx (Route: /:id/:) │
└────────────────┘  └──────────────────┘  └─────────────────────┘
```

### Detailed Flow: User Interaction

**Step 1: Home Page Load**
- User visits `/`
- `Home.jsx` loads algorithms data from `algorithms.js`
- Each algorithm category displayed as an `AlgoCard` component
- Cards are animated with Framer Motion

**Step 2: Category Selection**
- User clicks on a category card (e.g., "Sorting & Searching")
- Navigation triggers route change to `/:categoryId` (e.g., `/sorting`)
- `CategoryPage.jsx` receives `categoryId` from URL params
- Component fetches category details from `categoryAlgorithms.js`

**Step 3: Algorithm Selection**
- User clicks on specific algorithm (e.g., "Bubble Sort")
- Route changes to `/:categoryId/:algorithmId` (e.g., `/sorting/bubble`)
- `AlgorithmSimulation.jsx` initializes

**Step 4: Simulation Initialization**
- Algorithm details loaded from catalog
- Default input values set based on category type
- Simulation engine (`algorithmSimulations.js`) generates all steps
- Current step displayed with highlight indices

**Step 5: Playback Controls**
- User can step forward/backward or play automatically
- Each step shows: array state, highlights, explanatory note
- Auto-play advances step every 950ms
- When complete, auto-play stops

---

## Routing System

### Route Structure

The application uses React Router DOM v7 for client-side routing:

```jsx
// App.jsx - Root Routing Configuration
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          {/* Route 1: Home/Landing Page */}
          <Route path="/" element={<Home />} />
          
          {/* Route 2: Category Page (Algorithms by Category) */}
          <Route path="/:categoryId" element={<CategoryPage />} />
          
          {/* Route 3: Algorithm Simulation Page */}
          <Route 
            path="/:categoryId/:algorithmId" 
            element={<AlgorithmSimulation />} 
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### Route Examples

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `Home.jsx` | Landing page with all categories |
| `/sorting` | `CategoryPage.jsx` | All sorting algorithms |
| `/sorting/bubble` | `AlgorithmSimulation.jsx` | Bubble sort simulator |
| `/graphs` | `CategoryPage.jsx` | All graph algorithms |
| `/graphs/dijkstra` | `AlgorithmSimulation.jsx` | Dijkstra's algorithm |
| `/dp` | `CategoryPage.jsx` | All dynamic programming algorithms |
| `/dp/knapsack` | `AlgorithmSimulation.jsx` | 0/1 Knapsack simulator |

### URL Parameter Extraction

```jsx
// CategoryPage.jsx - Extract categoryId from URL
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { categoryId } = useParams();  // Gets categoryId from URL
  const category = categoryCatalog[categoryId];
  
  // ... render category content
};
```

### Navigation with useNavigate Hook

```jsx
// AlgoCard.jsx - Navigate on click
import { useNavigate } from "react-router-dom";

const AlgoCard = ({ title, path }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);  // e.g., navigate("/sorting")
  };
  
  return (
    <div onClick={handleClick}>
      {/* Card content */}
    </div>
  );
};
```

---

## Component Interaction

### Component Hierarchy

```
App (Router Setup)
├── Home
│   ├── Motion.section (Animated Container)
│   └── AlgoCard (Multiple)
│       ├── Title
│       ├── Algorithm Count
│       └── CTA Button
├── CategoryPage
│   ├── Motion.header (Back Link + Title)
│   ├── Motion.section
│   └── Link > Algorithm Cards
├── AlgorithmSimulation
│   ├── Header (Breadcrumb + Title)
│   ├── sim-controls (Input Section)
│   ├── Simulation Visualization
│   │   ├── Bar Chart (for numeric arrays)
│   │   ├── Graph Renderer (for graphs)
│   │   └── Table View (for DP)
│   ├── Step Display
│   │   ├── Current Step Description
│   │   └── Step Counter
│   └── Playback Controls
│       ├── Previous Button
│       ├── Play/Pause Button
│       └── Next Button
└── Footer
```

### Component: Home.jsx

**Purpose**: Display all algorithm categories as interactive cards

**Key Features**:
- Uses `Motion.section` for staggered animation of cards
- Maps through `algorithms.js` data
- Each card is an `AlgoCard` component

**Code Snippet**:
```jsx
import AlgoCard from "../components/AlgoCard";
import { algorithms } from "../data/algorithms";
import { motion as Motion, useReducedMotion } from "framer-motion";

const Home = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="home">
      <Motion.section
        className="grid"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {algorithms.map((algo, index) => (
          <Motion.div key={algo.path ?? index} variants={itemVariants}>
            <AlgoCard {...algo} />
          </Motion.div>
        ))}
      </Motion.section>
    </main>
  );
};

export default Home;
```

**Data Format** (`algorithms.js`):
```javascript
export const algorithms = [
  {
    title: "Sorting & Searching Algorithms",
    includes: ["Bubble Sort", "Selection Sort", ...],
    path: "/sorting",
  },
  // ... more categories
];
```

### Component: AlgoCard.jsx

**Purpose**: Reusable card component for displaying algorithm categories

**Features**:
- Framer Motion animations (hover, tap)
- Keyboard accessible (Enter/Space to navigate)
- Uses `useNavigate` hook for routing

**Code Snippet**:
```jsx
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const AlgoCard = ({ title, includes = [], path }) => {
  const navigate = useNavigate();
  const countLabel = `${includes.length} algorithm${includes.length === 1 ? "" : "s"}`;

  return (
    <Motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="card"
      onClick={() => navigate(path)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          navigate(path);
        }
      }}
    >
      <p className="card-kicker">Category</p>
      <h2>{title}</h2>
      <p className="card-count">{countLabel}</p>
      <span className="card-cta">
        Explore <ArrowUpRight size={18} />
      </span>
    </Motion.div>
  );
};

export default AlgoCard;
```

### Component: CategoryPage.jsx

**Purpose**: Display all algorithms in a selected category

**Features**:
- Dynamic category loading based on URL
- Error handling for invalid categories
- Back navigation breadcrumb
- Staggered animation for algorithm cards

**Code Snippet**:
```jsx
import { Link, useParams } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { categoryCatalog } from "../data/categoryAlgorithms";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categoryCatalog[categoryId];

  if (!category) {
    return (
      <main className="sorting-page">
        <h1>Category not found</h1>
        <Link to="/">Back to categories</Link>
      </main>
    );
  }

  return (
    <main className="sorting-page">
      <Motion.header className="sorting-hero">
        <Link to="/" className="sorting-back">Back to categories</Link>
        <h1>{category.title}</h1>
        <p>{category.subtitle}</p>
      </Motion.header>

      <Motion.section
        className="sorting-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {category.algorithms.map((algorithm) => (
          <Link
            key={algorithm.id}
            to={`/${categoryId}/${algorithm.id}`}
            className="sorting-card"
          >
            <h2>{algorithm.name}</h2>
            <p>{algorithm.detail}</p>
          </Link>
        ))}
      </Motion.section>
    </main>
  );
};

export default CategoryPage;
```

### Component: AlgorithmSimulation.jsx

**Purpose**: Main simulation page with controls, visualization, and playback

**Features**:
- Dynamic input forms based on algorithm type
- Real-time simulation generation
- Step-by-step visualization
- Auto-play with manual controls
- Multiple visualization types (bars, graphs, tables)

**Key State Variables**:
```jsx
const [inputValue, setInputValue] = useState("9, 4, 7, 2, 6, 1, 5");
const [steps, setSteps] = useState([]);           // All simulation steps
const [stepIndex, setStepIndex] = useState(0);    // Current step
const [isPlaying, setIsPlaying] = useState(false); // Auto-play toggle
const [error, setError] = useState("");            // Error messages
```

**Core Logic - Simulation Generation**:
```jsx
const generateSimulation = () => {
  const result = buildAlgorithmSteps({
    categoryId,
    algorithmId,
    inputValue,
    // ... other parameters
  });

  if (result.error) {
    setError(result.error);
    setSteps([]);
    return;
  }

  setError("");
  setSteps(result.steps);
  setStepIndex(0);
  setIsPlaying(false);
};
```

**Auto-play Effect**:
```jsx
useEffect(() => {
  if (!isPlaying || !steps.length) return;

  if (stepIndex >= steps.length - 1) {
    setIsPlaying(false);
    return;
  }

  const timer = setTimeout(() => {
    setStepIndex((prev) => prev + 1);
  }, 950);  // 950ms per step

  return () => clearTimeout(timer);
}, [isPlaying, stepIndex, steps]);
```

### Component: Footer.jsx

**Purpose**: Display footer with author attribution

**Code**:
```jsx
const Footer = () => {
  return (
    <footer className="site-footer">
      <p className="site-footer-text">
        Made by{" "}
        <a href="https://drona-srivastava-portfolio.vercel.app/">
          Drona Srivastava
        </a>{" "}
        for students.
      </p>
    </footer>
  );
};

export default Footer;
```

---

## Data Flow & Management

### Data Layer Architecture

```
┌────────────────────────────────────────────────────────────┐
│                   User Input (UI)                          │
│         - Text input, textarea, number inputs              │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│              Component State (React Hooks)                  │
│         - useState for local component state               │
│         - useMemo for computed values                      │
│         - useEffect for side effects                       │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│        Parse/Validate Input Data                           │
│  - parseInputValues()                                      │
│  - parseGraphEdges()                                       │
│  - normalizeLines()                                        │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│      Simulation Engine (algorithmSimulations.js)           │
│  - buildAlgorithmSteps()                                   │
│  - Executes algorithm with step tracking                   │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│           Steps Array [Step1, Step2, ...]                  │
│    Each step contains: array, highlights, note, graph...   │
└────────────────────┬───────────────────────────────────────┘
                     │
┌────────────────────▼───────────────────────────────────────┐
│        Current Step Display (UI Rendering)                 │
│  - currentStep = steps[stepIndex]                          │
│  - Visualize based on step data type                       │
└────────────────────────────────────────────────────────────┘
```

### Data Structures

#### Algorithms Data (`algorithms.js`)

```javascript
export const algorithms = [
  {
    title: string,           // Category name
    includes: string[],      // List of algorithms in category
    path: string,            // URL path to category
  },
];
```

#### Category Catalog (`categoryAlgorithms.js`)

```javascript
export const categoryCatalog = {
  categoryId: {
    title: string,
    subtitle: string,
    algorithms: [
      {
        id: string,        // Algorithm identifier
        name: string,      // Display name
        detail: string,    // Short description
      },
    ],
  },
};
```

#### Sorting Algorithms Data (`sortingAlgorithms.js`)

```javascript
export const sortingAlgorithms = [
  {
    id: string,
    name: string,
    category: string,
    hasSimulation: boolean,
    detail: string,
  },
];
```

#### Simulation Step Structure

```javascript
// For numeric array algorithms:
step = {
  array: number[],          // Current array state
  highlights: number[],     // Indices to highlight
  note: string,            // Explanation text
};

// For graph algorithms:
step = {
  array: string[],                    // Traversal order
  note: string,
  graph: {
    nodeCount: number,
    edges: Array<{from, to, weight}>,
    activeNodes: number[],
    visitedNodes: number[],
    treeEdges: Array<[number, number]>,
  },
  table?: {                          // Optional for DP algorithms
    rowLabels: string[],
    colLabels: string[],
    data: number[][],
  },
};
```

### Data Flow Example: Bubble Sort

```
User Input: "9, 4, 7, 2, 6, 1, 5"
    ↓
parseInputValues(inputValue)
    ↓
{
  rawItems: ['9', '4', '7', ...],
  numericItems: [9, 4, 7, ...],
  isNumeric: true
}
    ↓
buildAlgorithmSteps({ categoryId: "sorting", algorithmId: "bubble", ... })
    ↓
bubbleSortSteps([9, 4, 7, 2, 6, 1, 5])
    ↓
Steps Array:
[
  { array: [9, 4, 7, 2, 6, 1, 5], highlights: [], note: "Initial array" },
  { array: [9, 4, 7, 2, 6, 1, 5], highlights: [0, 1], note: "Compare 9 and 4" },
  { array: [4, 9, 7, 2, 6, 1, 5], highlights: [0, 1], note: "Swap" },
  // ... more steps
  { array: [1, 2, 4, 5, 6, 7, 9], highlights: [], note: "Sorted" }
]
    ↓
UI Renders:
- Current step displayed
- Bar chart showing array with highlights
- Explanation note
- Step counter: "Step 5 / 27"
```

### Input Parsing

**parseInputValues** function:
```javascript
export const parseInputValues = (value) => {
  const rawItems = value
    .split(/[\n,]+|\s+/)  // Split by newline, comma, or whitespace
    .map((item) => item.trim())
    .filter(Boolean);

  const numericItems = rawItems.map(Number);
  const allNumeric = rawItems.length > 0 && 
                     numericItems.every(Number.isFinite);

  return {
    rawItems,
    numericItems: allNumeric ? numericItems : [],
    isNumeric: allNumeric,
  };
};

// Example:
parseInputValues("9, 4, 7\n2, 6")
// Returns:
// {
//   rawItems: ['9', '4', '7', '2', '6'],
//   numericItems: [9, 4, 7, 2, 6],
//   isNumeric: true
// }
```

**parseGraphEdges** function:
```javascript
const parseGraphEdges = (edgeInput, nodeCount, weighted = false) => {
  const lines = normalizeLines(edgeInput);
  const edges = [];

  for (const line of lines) {
    const tokens = line.replace(/[-,:]/g, " ").split(/\s+/).filter(Boolean);

    if (tokens.length < 2) {
      return { error: `Invalid edge format: ${line}`, edges: [] };
    }

    const from = Number(tokens[0]);
    const to = Number(tokens[1]);
    const weight = weighted ? Number(tokens[2]) : 1;

    // Validation checks...
    
    edges.push({ from, to, weight });
  }

  return { error: "", edges };
};

// Example input for unweighted graph:
// 0 1
// 0 2
// 1 3
// Returns: { error: "", edges: [{from:0,to:1,weight:1}, ...] }

// Example input for weighted graph:
// 0 1 5
// 0 2 3
// Returns: { error: "", edges: [{from:0,to:1,weight:5}, ...] }
```

---

## Simulation Engine

### Universal Simulation Engine (`algorithmSimulations.js`)

The core simulation engine is built to handle all algorithm types with a unified approach.

### Main Entry Point: buildAlgorithmSteps

```javascript
export const buildAlgorithmSteps = ({
  categoryId,
  algorithmId,
  inputValue,
  searchTargetInput,
  nodeCount,
  edgeInput,
  startNode,
  targetNode,
  weightsInput,
  valuesInput,
  capacityInput,
  firstString,
  secondString,
}) => {
  // Route to appropriate algorithm builder
  
  if (categoryId === "sorting") {
    const numbers = parseInputValues(inputValue).numericItems;
    return { steps: buildSortingSteps(algorithmId, numbers) };
  }
  
  if (categoryId === "graphs") {
    const { edges, error } = parseGraphEdges(
      edgeInput,
      Number(nodeCount),
      getSimulationInputSpec(categoryId, algorithmId).weighted
    );
    
    if (error) return { error, steps: [] };
    
    // Route to specific graph algorithm...
    if (algorithmId === "bfs") {
      return { steps: bfsSteps({ nodeCount, edges, startNode }) };
    }
    // ... more graph algorithms
  }
  
  // ... handle other categories
  
  return { steps: [] };
};
```

### Sorting Algorithms (`sortingSimulations.js`)

**Bubble Sort Example**:
```javascript
const bubbleSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  for (let i = 0; i < arr.length - 1; i += 1) {
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      // Record comparison
      steps.push(cloneStep(arr, [j, j + 1], `Compare index ${j} and ${j + 1}`));
      
      // Perform swap if needed
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(cloneStep(arr, [j, j + 1], "Swap"));
      }
    }
  }

  steps.push(cloneStep(arr, [], "Sorted"));
  return steps;
};

// Helper function
const cloneStep = (array, highlights = [], note = "") => ({
  array: [...array],
  highlights,
  note,
});
```

**Merge Sort Example**:
```javascript
const mergeSortSteps = (input) => {
  const arr = [...input];
  const steps = [cloneStep(arr, [], "Initial array")];

  const merge = (left, mid, right) => {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftPart.length && j < rightPart.length) {
      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i += 1;
      } else {
        arr[k] = rightPart[j];
        j += 1;
      }
      steps.push(cloneStep(arr, [k], `Merge range ${left}-${right}`));
      k += 1;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      i += 1;
      steps.push(cloneStep(arr, [k], `Copy leftover`));
      k += 1;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      j += 1;
      steps.push(cloneStep(arr, [k], `Copy leftover`));
      k += 1;
    }
  };

  // Recursive merge sort with step tracking...
  return steps;
};
```

### Graph Algorithms

**BFS (Breadth-First Search)**:
```javascript
const bfsSteps = ({ nodeCount, edges, startNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges);
  const visited = Array(nodeCount).fill(false);
  const queue = [startNode];
  const order = [];
  const treeEdges = [];
  const steps = [];

  visited[startNode] = true;
  steps.push(
    graphStep({
      array: order.map(String),
      note: `Start BFS from node ${startNode}`,
      nodeCount,
      edges,
      activeNodes: [startNode],
      visitedNodes: [startNode],
      treeEdges,
    }),
  );

  while (queue.length > 0) {
    const current = queue.shift();
    order.push(current);

    steps.push(
      graphStep({
        array: order.map(String),
        note: `Visit node ${current}`,
        nodeCount,
        edges,
        activeNodes: [current],
        visitedNodes: order,
        treeEdges,
      }),
    );

    for (const neighbor of adjacency[current]) {
      if (!visited[neighbor.to]) {
        visited[neighbor.to] = true;
        treeEdges.push([current, neighbor.to]);
        queue.push(neighbor.to);

        steps.push(
          graphStep({
            array: order.map(String),
            note: `Discover ${neighbor.to} from ${current}`,
            nodeCount,
            edges,
            activeNodes: [current, neighbor.to],
            visitedNodes: order,
            treeEdges,
          }),
        );
      }
    }
  }

  return steps;
};
```

**Dijkstra's Algorithm**:
```javascript
const dijkstraSteps = ({ nodeCount, edges, startNode, targetNode }) => {
  const adjacency = buildAdjacency(nodeCount, edges, true);
  const dist = Array(nodeCount).fill(Number.POSITIVE_INFINITY);
  const used = Array(nodeCount).fill(false);
  const parent = Array(nodeCount).fill(-1);
  const steps = [];

  dist[startNode] = 0;

  for (let iter = 0; iter < nodeCount; iter += 1) {
    let node = -1;
    for (let i = 0; i < nodeCount; i += 1) {
      if (!used[i] && (node === -1 || dist[i] < dist[node])) {
        node = i;
      }
    }

    if (node === -1 || !Number.isFinite(dist[node])) break;

    used[node] = true;

    steps.push(
      graphStep({
        array: dist.map((value) => 
          Number.isFinite(value) ? value : 0
        ),
        highlights: [node],
        note: `Pick node ${node} with min distance ${dist[node]}`,
        nodeCount,
        edges,
        activeNodes: [node],
        visitedNodes: used
          .map((v, idx) => (v ? idx : -1))
          .filter((v) => v >= 0),
        treeEdges: parent
          .map((p, child) => (p >= 0 ? [p, child] : null))
          .filter(Boolean),
        table: {
          rowLabels: ["dist"],
          colLabels: Array.from(
            { length: nodeCount },
            (_, idx) => String(idx)
          ),
          data: [dist.map((d) => Number.isFinite(d) ? d : 0)],
        },
      }),
    );

    // Relaxation step...
  }

  return steps;
};
```

### Helper Functions

**buildAdjacency** - Convert edges to adjacency list:
```javascript
const buildAdjacency = (nodeCount, edges, directed = false) => {
  const adjacency = Array.from({ length: nodeCount }, () => []);

  edges.forEach((edge) => {
    adjacency[edge.from].push({ to: edge.to, weight: edge.weight });
    if (!directed) {
      adjacency[edge.to].push({ to: edge.from, weight: edge.weight });
    }
  });

  adjacency.forEach((neighbors) => {
    neighbors.sort((a, b) => a.to - b.to);
  });

  return adjacency;
};
```

**graphStep** - Create graph step structure:
```javascript
const graphStep = ({
  array,
  note,
  highlights = [],
  nodeCount,
  edges,
  activeNodes = [],
  visitedNodes = [],
  treeEdges = [],
  table,
}) => ({
  array,
  note,
  highlights,
  graph: {
    nodeCount,
    edges,
    activeNodes,
    visitedNodes,
    treeEdges,
  },
  table,
});
```

### getSimulationInputSpec

Defines input requirements for each algorithm:

```javascript
export const getSimulationInputSpec = (categoryId, algorithmId) => {
  // Define input type and validation rules
  
  if (categoryId === "sorting") {
    return { type: "array" };
  }
  
  if (categoryId === "graphs") {
    if (algorithmId === "bfs" || algorithmId === "dfs") {
      return {
        type: "graph",
        needsStart: true,
        needsTarget: false,
        weighted: false,
        directed: false,
      };
    }
    
    if (algorithmId === "dijkstra") {
      return {
        type: "graph",
        needsStart: true,
        needsTarget: true,
        weighted: true,
        directed: true,
      };
    }
  }
  
  if (categoryId === "dp" && algorithmId === "knapsack") {
    return { type: "knapsack" };
  }
  
  if (categoryId === "dp" && algorithmId === "lcs") {
    return { type: "lcs" };
  }
  
  return { type: "generic" };
};
```

---

## Styling Architecture

### Global Styles (`index.css`)

Provides base styles for the entire application:

```css
:root {
  --color-primary: #0b1f24;
  --color-secondary: #1a3a42;
  --color-accent: #3fbf8e;
  --color-text: #ffffff;
  --color-text-secondary: #a8b8c1;
  /* ... more variables */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
  color: var(--color-text);
  background-color: var(--color-primary);
  margin: 0;
  padding: 0;
}

/* Global layout */
main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Category & Simulation Styles (`sorting.css`)

Handles styles for category pages and simulations:

```css
/* Page container */
.sorting-page {
  flex: 1;
  padding: 40px 20px;
}

.sorting-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* Hero section */
.sorting-hero {
  margin-bottom: 60px;
}

.sorting-back {
  display: inline-flex;
  align-items: center;
  color: var(--color-accent);
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.2s;
}

.sorting-back:hover {
  color: var(--color-text);
}

/* Algorithm grid */
.sorting-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

/* Algorithm card */
.sorting-card {
  padding: 24px;
  background: linear-gradient(135deg, #1a3a42 0%, #0d2a32 100%);
  border: 1px solid rgba(63, 191, 142, 0.2);
  border-radius: 12px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
}

.sorting-card:hover {
  border-color: rgba(63, 191, 142, 0.6);
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(63, 191, 142, 0.15);
}

/* Simulation visualization */
.sim-visualization {
  background: rgba(26, 58, 66, 0.5);
  border: 1px solid rgba(63, 191, 142, 0.2);
  border-radius: 12px;
  padding: 40px 20px;
  margin: 40px 0;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Bar chart (sorting visualization) */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
  height: 250px;
  width: 100%;
}

.bar {
  flex: 1;
  background: linear-gradient(180deg, #3fbf8e 0%, #2a8a62 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  position: relative;
}

.bar.highlight {
  background: linear-gradient(180deg, #ff6b6b 0%, #d63031 100%);
  box-shadow: 0 0 12px rgba(255, 107, 107, 0.5);
}

.bar.sorted {
  background: linear-gradient(180deg, #3fbf8e 0%, #2a8a62 100%);
  opacity: 0.6;
}

/* Controls */
.sim-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin: 30px 0;
  padding: 20px;
  background: rgba(13, 42, 50, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(63, 191, 142, 0.1);
}

.sim-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.sim-form-grid > div {
  display: flex;
  flex-direction: column;
}

.sim-form-grid label {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
}

.sim-form-grid input,
.sim-form-grid textarea {
  padding: 12px;
  background: rgba(11, 31, 36, 0.8);
  border: 1px solid rgba(63, 191, 142, 0.3);
  color: var(--color-text);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s;
}

.sim-form-grid input:focus,
.sim-form-grid textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  background: rgba(11, 31, 36, 1);
}

/* Playback controls */
.playback-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
}

.btn {
  padding: 12px 24px;
  background: var(--color-accent);
  color: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(63, 191, 142, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Step info */
.step-info {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.step-description {
  font-size: 16px;
  color: var(--color-text);
  margin: 16px 0;
  padding: 16px;
  background: rgba(63, 191, 142, 0.1);
  border-left: 3px solid var(--color-accent);
  border-radius: 4px;
}

/* Graph visualization */
.graph-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 280px;
  background: rgba(26, 58, 66, 0.5);
  border-radius: 12px;
}

svg.graph-svg {
  width: 100%;
  height: 100%;
  max-width: 580px;
}

/* Responsive */
@media (max-width: 768px) {
  .sorting-grid {
    grid-template-columns: 1fr;
  }

  .sim-controls {
    padding: 16px;
  }

  .playback-controls {
    flex-wrap: wrap;
  }

  .bar {
    min-width: 8px;
  }
}
```

### Animation Framework (Framer Motion)

Used throughout for smooth, performant animations:

```jsx
// Staggered list animation
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// Card hover animation
<Motion.div
  whileHover={{ y: -6, scale: 1.01 }}
  whileTap={{ scale: 0.99 }}
  transition={{ duration: 0.22, ease: "easeOut" }}
>
  {/* Card content */}
</Motion.div>

// Reduced motion support
const shouldReduceMotion = useReducedMotion();

<Motion.header
  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
>
  {/* Content */}
</Motion.header>
```

---

## Development Setup

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd Algo-Engine
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Development Commands

```bash
# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

### Build Configuration

**Vite Config** (`vite.config.js`):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### Deployment

The project includes Vercel configuration (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "react"
}
```

To deploy:
1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push

---

## Summary

Algo Engine is a sophisticated learning platform built with:

- **React 19** for component-based UI
- **React Router DOM** for client-side navigation
- **Framer Motion** for fluid animations
- **Vite** for fast development and optimized builds
- **Universal simulation engine** supporting 50+ algorithms

The architecture follows a clear separation of concerns:
- **UI Layer**: Components with animations
- **Router Layer**: Dynamic navigation
- **Data Layer**: Algorithm specifications
- **Simulation Layer**: Core algorithm logic with step tracking
- **Styling Layer**: CSS with animation support

User interactions flow from home → category → algorithm → simulation with real-time visualization and step-by-step execution control.

