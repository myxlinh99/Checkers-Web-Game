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
                    if ((loc % 2 === 0) && (row > 4)) {
                        squares[row][col] = 'w';
                    } else if ((loc % 2 === 0) && (row < 3)) {
                        squares[row][col] = 'b';
                    }
                }
            }
            this.state = {
                squares,
                whiteIsCurrent: true,
                pieceIsMoving: false,
                lastSelectedRow: null,
                lastSelectedCol: null,
            };

        }

        renderSquare(row, col) {
            return ( <
                Square className = {
                    (row + col) % 2 === 0 ? 'black square' : 'white square'
                }
                value = { this.state.squares[row][col] }
                onClick = {
                    () => this.handleClick(row, col)
                }

                />
            );

        }

        move(row, col, squares) {
            //change the piece's location and update the board
            const tmp = this.state.squares[this.state.lastSelectedRow][this.state.lastSelectedCol];
            squares[this.state.lastSelectedRow][this.state.lastSelectedCol] = null;
            squares[row][col] = tmp;
            this.setState({ whiteIsCurrent: !this.state.whiteIsCurrent });
        }

        handleClick(row, col) {
            //copy the state of the squares
            const squares = this.state.squares.slice();
            //if a piece is moving and the square clicked is empty:
            if (this.state.pieceIsMoving && !this.state.squares[row][col]) {
                //if the piece is brown and it isn't white's turn:
                if (this.state.squares[this.state.lastSelectedRow][this.state.lastSelectedCol] === 'b' && !this.state.whiteIsCurrent) {
                    if (row === (this.state.lastSelectedRow + 1)) {
                        if ((col === (this.state.lastSelectedCol + 1)) || (col === (this.state.lastSelectedCol - 1))) {
                            this.move(row, col, squares);
                        }
                    } else if (row === (this.state.lastSelectedRow + 2)) {
                        if (this.state.squares[this.state.lastSelectedRow + 1][this.state.lastSelectedCol - 1] === 'w' || this.state.squares[this.state.lastSelectedRow + 1][this.state.lastSelectedCol - 1] === 'w') {
                            if ((col === (this.state.lastSelectedCol + 2)) ||
                                (col === (this.state.lastSelectedCol - 2))) {
                                this.move(row, col, squares);
                            }
                        }
                    }

                } else if (this.state.squares[this.state.lastSelectedRow][this.state.lastSelectedCol] === 'w' && this.state.whiteIsCurrent) {
                    console.log("Hello");
                    if (row === (this.state.lastSelectedRow - 1)) {
                        console.log("Hello");
                        if ((col === (this.state.lastSelectedCol + 1)) || (col === (this.state.lastSelectedCol - 1))) {
                            this.move(row, col, squares);

                        }
                    } else if (row === (this.state.lastSelectedRow - 2)) {
                        if (this.state.squares[this.state.lastSelectedRow - 1][this.state.lastSelectedCol - 1] === 'b' ||
                            this.state.squares[this.state.lastSelectedRow - 1][this.state.lastSelectedCol - 1] === 'w') {
                            if ((col === (this.state.lastSelectedCol + 2)) ||
                                (col === (this.state.lastSelectedCol - 2))) {
                                this.move(row, col, squares);
                            }
                        }
                    }
                }

                this.setState({
                    squares,
                    lastSelectedRow: row,
                    lastSelectedCol: col,
                    pieceIsMoving: !this.state.pieceIsMoving,
                });

            }
        }

        render() {
            let status = this.state.pieceIsMoving ? 'A piece is moving' : this.state.whiteIsCurrent ? 'Next Turn: Player 1' : 'Next Turn: Player 2';
            const board = [];
            for (let row = 0; row < 8; row++) {
                const cols = [];
                for (let col = 0; col < 8; col++) {
                    cols.push(this.renderSquare(row, col));
                }
                board.push( < div className = "board-row" > { cols } < /div>);
                }

                return ( < div >
                    <
                    div className = "status" > { status } < /div> { board } </div >
                );

            }

        }