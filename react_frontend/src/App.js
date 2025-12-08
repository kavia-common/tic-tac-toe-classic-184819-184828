import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Utilities
 */
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.every(Boolean);
}

/**
/ PUBLIC_INTERFACE
 * Square component - a single cell button in the grid.
 */
function Square({ value, onClick, isWinning }) {
  /** This is a public component for a single Tic Tac Toe square. */
  return (
    <button
      className={`ttt-square${isWinning ? ' ttt-square-win' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
/ PUBLIC_INTERFACE
 * Board component - renders the 3x3 grid.
 */
function Board({ squares, onSquareClick, winningLine = [] }) {
  /** This is a public component for the 3x3 Tic Tac Toe board. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          isWinning={winningLine.includes(idx)}
        />
      ))}
    </div>
  );
}

/**
/ PUBLIC_INTERFACE
 * Game component - handles game state and layout/status.
 */
function Game() {
  /** This is a public component managing Tic Tac Toe game state and UI. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
  const hasWinner = !!winnerInfo;
  const draw = !hasWinner && isDraw(squares);
  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleSquareClick = (index) => {
    if (squares[index] || hasWinner || draw) return; // block move if occupied or game ended
    const next = squares.slice();
    next[index] = currentPlayer;
    setSquares(next);
    setXIsNext((prev) => !prev);
  };

  const reset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  let status;
  if (hasWinner) {
    status = `Winner: ${winnerInfo.player}`;
  } else if (draw) {
    status = 'Draw';
  } else {
    status = `Next player: ${currentPlayer}`;
  }

  return (
    <div className="ttt-container">
      <div className="ttt-card">
        <h1 className="ttt-title">Tic Tac Toe</h1>

        <div className={`ttt-status ${hasWinner ? 'ttt-status-win' : draw ? 'ttt-status-draw' : ''}`}>
          {status}
        </div>

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winnerInfo?.line ?? []}
        />

        <div className="ttt-actions">
          <button className="ttt-button" onClick={reset} aria-label="Reset game">
            Reset
          </button>
        </div>

        <footer className="ttt-footer">
          <span className="ttt-note">Light theme • Modern UI</span>
        </footer>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root application component hosting the Game. */
  return <Game />;
}

export default App;
