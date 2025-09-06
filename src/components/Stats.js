import React from 'react';

/**
 * Renders the statistics of the last algorithm run.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.stats - An object containing the statistics.
 * @param {number} props.stats.visitedNodes - The number of nodes visited.
 * @param {number} props.stats.pathLength - The length of the shortest path.
 * @param {number} props.stats.executionTime - The time taken for the algorithm to run.
 * @param {string} props.stats.algorithm - The name of the algorithm used.
 * @param {boolean} props.isDarkMode - A boolean indicating if dark mode is enabled.
 * @returns {React.Component} The statistics component.
 */
const Stats = ({ stats, isDarkMode }) => {
  const { visitedNodes, pathLength, executionTime, algorithm } = stats;

  return (
    <div className="stats">
      <h2>Algorithm Statistics</h2>
      
      {algorithm ? (
        <>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Algorithm Used</div>
              <div className="stat-value">{algorithm}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label">Nodes Visited</div>
              <div className="stat-value">{visitedNodes.toLocaleString()}</div>
            </div>
            
            {pathLength > 0 ? (
              <>
                <div className="stat-item">
                  <div className="stat-label">Path Length</div>
                  <div className="stat-value">{pathLength.toLocaleString()}</div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-label">Execution Time</div>
                  <div className="stat-value">{executionTime}ms</div>
                </div>
              </>
            ) : (
              <div className="stat-item" style={{ gridColumn: 'span 2' }}>
                <div className="stat-label">Path Status</div>
                <div className="stat-value" style={{ color: '#e53e3e' }}>
                  ❌ Unable to reach target node
                </div>
              </div>
            )}
          </div>
          
          {pathLength === 0 && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              backgroundColor: isDarkMode ? '#742a2a' : '#fed7d7', 
              border: `1px solid ${isDarkMode ? '#c53030' : '#feb2b2'}`,
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: isDarkMode ? '#feb2b2' : '#c53030', 
                margin: '0', 
                fontWeight: '500',
                fontSize: '0.95rem'
              }}>
                🚫 <strong>No Path Found:</strong> The algorithm was unable to find a valid path from start to target. 
                This may be due to walls blocking all possible routes or the target being completely isolated.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
          <p>Run an algorithm to see statistics here</p>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ color: '#4a5568', marginBottom: '15px' }}>Algorithm Information</h3>
        
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Dijkstra */}
          <div
            style={{
              background: isDarkMode ? '#2d3748' : '#f7fafc',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #48bb78',
            }}
          >
            <h4 style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748', marginBottom: '10px' }}>Dijkstra's Algorithm</h4>
            <p style={{ color: isDarkMode ? '#cbd5e0' : '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}>
              Finds the shortest path in a weighted graph. Guarantees optimality but may explore
              more nodes than BFS. Best for finding shortest paths when edge weights matter.
            </p>
            <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#a0aec0' : '#718096' }}>
              <strong>Time Complexity:</strong> O(V²) with array, O((V + E) log V) with binary heap<br/>
              <strong>Space Complexity:</strong> O(V)
            </div>
          </div>

          {/* BFS */}
          <div
            style={{
              background: isDarkMode ? '#2d3748' : '#f7fafc',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #90cdf4',
            }}
          >
            <h4 style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748', marginBottom: '10px' }}>Breadth-First Search (BFS)</h4>
            <p style={{ color: isDarkMode ? '#cbd5e0' : '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}>
              Explores all nodes at the current depth before moving to the next level. Guarantees
              shortest path in unweighted graphs. Very efficient for finding shortest paths.
            </p>
            <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#a0aec0' : '#718096' }}>
              <strong>Time Complexity:</strong> O(V + E)<br/>
              <strong>Space Complexity:</strong> O(V)
            </div>
          </div>

          {/* DFS */}
          <div
            style={{
              background: isDarkMode ? '#2d3748' : '#f7fafc',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #f6e05e',
            }}
          >
            <h4 style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748', marginBottom: '10px' }}>Depth-First Search (DFS)</h4>
            <p style={{ color: isDarkMode ? '#cbd5e0' : '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}>
              Explores as far as possible along each branch before backtracking. May not find the
              shortest path but uses less memory. Good for exploring mazes.
            </p>
            <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#a0aec0' : '#718096' }}>
              <strong>Time Complexity:</strong> O(V + E)<br/>
              <strong>Space Complexity:</strong> O(V) worst case, O(log V) average
            </div>
          </div>

          {/* A* */}
          <div
            style={{
              background: isDarkMode ? '#2d3748' : '#f7fafc',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #ed8936',
            }}
          >
            <h4 style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748', marginBottom: '10px' }}>A* Algorithm</h4>
            <p style={{ color: isDarkMode ? '#cbd5e0' : '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}>
              Informed search algorithm that uses heuristic functions to find optimal paths.
              More efficient than Dijkstra's when good heuristics are available.
            </p>
            <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#a0aec0' : '#718096' }}>
              <strong>Time Complexity:</strong> O(b^d) where b is branching factor, d is depth<br/>
              <strong>Space Complexity:</strong> O(b^d)
            </div>
          </div>

          {/* Greedy */}
          <div
            style={{
              background: isDarkMode ? '#2d3748' : '#f7fafc',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #9f7aea',
            }}
          >
            <h4 style={{ color: isDarkMode ? '#e2e8f0' : '#2d3748', marginBottom: '10px' }}>Greedy Best-First Search</h4>
            <p style={{ color: isDarkMode ? '#cbd5e0' : '#4a5568', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '10px' }}>
              Always chooses the node that appears closest to the goal. Fast but doesn't guarantee
              optimality. Good for quick approximate solutions.
            </p>
            <div style={{ fontSize: '0.8rem', color: isDarkMode ? '#a0aec0' : '#718096' }}>
              <strong>Time Complexity:</strong> O(V + E) in worst case<br/>
              <strong>Space Complexity:</strong> O(V)
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Stats;
