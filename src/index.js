import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WhiteCheckersPiece from './images/white-checkers-piece.png'
import BrownCheckersPiece from './images/brown-checkers-piece.png'

function Square(props) {
  return (<button 
            className={props.className}
            onClick={props.onClick}>
            <img src={props.value === 'w' && WhiteCheckersPiece 
                   || props.value === 'b' && BrownCheckersPiece
                   || ''}
                   />
        </button>)
  }
    
  
  class Board extends React.Component {
    constructor(props) {
      super(props);
      let squares = [];
      
      // initialize the board with pieces
      for (let row = 0; row < 8; row++) {
        squares.push([]);
        for (let col = 0; col < 8; col++) {
          squares[row].push(null);
          let loc = row + col;
          if ((loc % 2 == 0) && (row > 4)) {
            squares[row][col] = 'w';  
          } else if ((loc % 2 == 0) && (row < 3)) {
            squares[row][col] = 'b';
          }
        }
      }
      console.log(squares);
      this.state = {
        squares: squares,
        xIsNext: true,
        pieceIsMoving: false,
        lastSelectedX: null,
        lastSelectedY: null
      }
    }
    renderSquare(row, col) {
      return <Square 
      className={(row + col) % 2 == 0 ?  "black square": "white square" }
      value={this.state.squares[row][col]}
      onClick={() => this.handleClick(row, col)}
      >

      </Square>
      
    }

    handleClick(row, col) {
      const squares =  this.state.squares.slice();

      if (this.state.pieceIsMoving && !this.state.squares[row][col]) {
        let tmp = this.state.squares[this.state.lastSelectedX][this.state.lastSelectedY];
        squares[this.state.lastSelectedX][this.state.lastSelectedY] = null;
        squares[row][col] = tmp; 
      } 
      this.setState({
        squares: squares, 
        lastSelectedX: row, 
        lastSelectedY: col, 
        pieceIsMoving: !this.state.pieceIsMoving})
    }
  
    render() {
      let status = 'Next player: X';
      status += this.state.pieceIsMoving ? "A piece is moving" : "";
      const board = [];

      for (let row = 0; row < 8; row++) {
          let cols = []
          for (let col = 0; col < 8; col++) {
            cols.push(this.renderSquare(row, col))
          }
          board.push(<div className="board-row">{cols}</div>)
      }

      return (
        <div>
          <div className="status">{status}</div>
            {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  