# Path Visualizer - Interactive Algorithm Visualization

A beautiful and interactive web application that visualizes three fundamental pathfinding algorithms: **Dijkstra's Algorithm**, **Breadth-First Search (BFS)**, and **Depth-First Search (DFS)**.

## 🚀 Features

### **Interactive Grid System**
- **Customizable Grid Sizes**: Choose from 15x30 to 30x80 grid configurations
- **Real-time Drawing**: Click and drag to create walls, obstacles, and mazes
- **Dynamic Start/End Positioning**: Easily reposition start and end points
- **Multiple Drawing Modes**: Switch between wall drawing, start positioning, and end positioning

### **Three Pathfinding Algorithms**
1. **Dijkstra's Algorithm**: Optimal shortest path with weighted edges
2. **Breadth-First Search (BFS)**: Shortest path in unweighted graphs
3. **Depth-First Search (DFS)**: Memory-efficient exploration (may not find shortest path)

### **Visual Controls**
- **Speed Control**: Adjustable animation speed from 1x to 50x
- **Pause/Resume**: Control algorithm execution in real-time
- **Random Wall Generation**: Create new mazes with one click
- **Grid Reset**: Clear all paths and start fresh

### **Real-time Statistics**
- **Performance Metrics**: Execution time, nodes visited, path length
- **Algorithm Comparison**: See how different algorithms perform on the same maze
- **Visual Feedback**: Color-coded nodes showing algorithm progress

## 🎯 How to Use

### **Getting Started**
1. **Install Dependencies**: `npm install`
2. **Start Development Server**: `npm start`
3. **Open Browser**: Navigate to `http://localhost:3000`

### **Basic Usage**
1. **Choose Algorithm**: Select from Dijkstra, BFS, or DFS dropdown
2. **Set Speed**: Adjust the speed slider to your preference
3. **Create Maze**: Draw walls by clicking and dragging, or use "Generate Random Walls"
4. **Position Start/End**: Use the drawing mode dropdown to place start (S) and end (E) points
5. **Run Algorithm**: Click "Run Algorithm" to visualize the pathfinding
6. **Analyze Results**: View statistics and compare algorithm performance

### **Advanced Features**
- **Grid Size**: Change grid dimensions for different complexity levels
- **Custom Mazes**: Design your own challenging layouts
- **Algorithm Comparison**: Run different algorithms on the same maze to compare efficiency
- **Real-time Control**: Pause algorithms mid-execution to analyze intermediate states

## 🏗️ Technical Implementation

### **Core Algorithms**
- **Dijkstra**: Priority queue-based implementation with weighted pathfinding
- **BFS**: Queue-based level-order traversal for unweighted graphs
- **DFS**: Stack-based depth-first exploration

### **React Architecture**
- **Functional Components**: Modern React with hooks
- **State Management**: Centralized state with useCallback optimizations
- **Responsive Design**: Mobile-friendly interface with CSS Grid
- **Performance**: Optimized rendering with proper memoization

### **Key Components**
- `App.js`: Main application logic and state management
- `Grid.js`: Interactive grid display component
- `Cell.js`: Individual grid cell with state-based styling
- `Controls.js`: User interface controls and settings
- `Stats.js`: Algorithm performance statistics
- `algorithms.js`: Core pathfinding algorithm implementations

## 🎨 Visual Design

### **Color Scheme**
- **Start Node**: Green (#48bb78)
- **End Node**: Red (#f56565)
- **Walls**: Dark Gray (#2d3748)
- **Visited Nodes**: Light Blue (#90cdf4)
- **Shortest Path**: Yellow (#f6e05e)
- **Current Node**: Orange (#ed8936)

### **Responsive Layout**
- **Modern UI**: Glassmorphism design with backdrop filters
- **Mobile Optimized**: Responsive grid that adapts to screen size
- **Smooth Animations**: CSS transitions and keyframe animations
- **Intuitive Controls**: Clear visual hierarchy and user feedback

## 📊 Algorithm Performance

### **Dijkstra's Algorithm**
- **Best For**: Weighted graphs, guaranteed shortest path
- **Time Complexity**: O(V²) with simple implementation
- **Space Complexity**: O(V)
- **Use Case**: Navigation systems, network routing

### **Breadth-First Search**
- **Best For**: Unweighted graphs, shortest path guarantee
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Use Case**: Web crawling, social network analysis

### **Depth-First Search**
- **Best For**: Memory efficiency, maze exploration
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V) in worst case
- **Use Case**: Topological sorting, cycle detection

## 🚀 Getting Started

### **Prerequisites**
- Node.js (version 14 or higher)
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd path-visualizer

# Install dependencies
npm install

# Start development server
npm start
```

### **Build for Production**
```bash
npm run build
```

## 🔧 Customization

### **Adding New Algorithms**
1. Implement algorithm in `src/algorithms.js`
2. Add option to algorithm selector in `Controls.js`
3. Update algorithm execution logic in `App.js`

### **Modifying Grid Behavior**
- Adjust cell sizes in CSS
- Modify grid generation logic
- Add new cell types and states

### **Styling Changes**
- Update color scheme in `src/index.css`
- Modify component-specific styles
- Add new animations and transitions

## 🤝 Contributing

Contributions are welcome! Here are some areas for improvement:

- **New Algorithms**: A*, Greedy Best-First Search, etc.
- **Enhanced Visualizations**: 3D grids, different cell shapes
- **Performance Optimizations**: Web Workers, better state management
- **Additional Features**: Save/load mazes, algorithm comparison charts

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Pathfinding Community**: For algorithm implementations and insights
- **CSS Grid**: For the flexible layout system
- **Modern Web APIs**: For performance and user experience improvements

---

**Happy Pathfinding! 🗺️✨** 