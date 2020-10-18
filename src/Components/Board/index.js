import React from 'react';
import Square from '../Square'
export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const squares = [];

    // initialize the board with pieces
    for (let row = 0; row < 8; row++) {
      squares.push([]);
      for (let col = 0; col < 8; col++) {
        squares[row].push(null);
        const loc = row + col;
        if ((loc % 2 == 0) && (row > 4)) {
          squares[row][col] = 'w';
        } else if ((loc % 2 == 0) && (row < 3)) {
          squares[row][col] = 'b';
        }
      }
    }
    this.state = {
      squares,
      xIsNext: true,
      pieceIsMoving: false,
      lastSelectedX: null,
      lastSelectedY: null,
    };
  }

  renderSquare(row, col) {
    return (
      <Square
        className={(row + col) % 2 == 0 ? 'black square' : 'white square'}
        value={this.state.squares[row][col]}
        onClick={() => this.handleClick(row, col)}
      />
    );
  }

  handleClick(row, col) {
    const squares = this.state.squares.slice();

    if (this.state.pieceIsMoving && !this.state.squares[row][col]) {
      const tmp = this.state.squares[this.state.lastSelectedX][this.state.lastSelectedY];
      squares[this.state.lastSelectedX][this.state.lastSelectedY] = null;
      squares[row][col] = tmp;
    }
    this.setState({
      squares,
      lastSelectedX: row,
      lastSelectedY: col,
      pieceIsMoving: !this.state.pieceIsMoving,
    });
  }

  render() {
    let status = 'Next player: X';
    status += this.state.pieceIsMoving ? 'A piece is moving' : '';
    const board = [];

    for (let row = 0; row < 8; row++) {
      const cols = [];
      for (let col = 0; col < 8; col++) {
        cols.push(this.renderSquare(row, col));
      }
      board.push(<div className="board-row">{cols}</div>);
    }

    return (
      <div>
        <div className="status">{status}</div>
        {board}
      </div>
    );
  }
}
