import React from 'react';
import Square from '../Square/Square'

const opponent = {
    'b': 'w',
    'w': 'b'
}
const pieceTurn = {
    'b': false,
    'w': true
}
export default class Board extends React.Component {
        constructor(props) {
            super(props);
            const squares = [];
            var highlightedPieces = []; //keep track of the highlighted pieces
            var highlighted = false;

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
                highlightedPieces,
                lastSelectedRow: null,
                lastSelectedCol: null,
                possibleMoves: null
            };

        }

        renderSquare(row, col) {
            return ( < Square className = {
                    this.isHighlighted(row, col) ? 'gray square' :
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
            return squares;
        }

        capture(row, col, squares) {
            squares[row][col] = null;
            return squares;

        }

        isHighlighted(row, col) {
            return this.indexOfLocInArray(row, col, this.state.highlightedPieces) >= 0;
        }

        // Return an array of possible moves for the current piece
        // based on the current location, current turn, and the piece's color
        getPossibleMoves(squares, row, col) {
            console.log("Getting possible moves");
            var possibleMoves = {
                'normalMoves': [],
                'jumpMoves': [],
                // the piece that will be captured if the corresponding 
                // jump move in the same index is chosen
                'captures': []
            };
            const piece = squares[row][col];
            let frontRow = -1;
            let jumpRow = -1;

            if (piece === 'w') {
                // index of the row in front of a white piece is currentRow - 1
                frontRow = row - 1;
                jumpRow = row - 2;
            } else if (piece == 'b') {
                // index of the row in front of a black piece is currentRow + 1
                frontRow = row + 1;
                jumpRow = row + 2;
            }
            let rightCol = col + 1;
            let leftCol = col - 1;
            let doubleRightCol = col + 2;
            let doubleLeftCol = col - 2;
            // handle moves to positions in the front row that are empty
            if (frontRow >= 0 && frontRow < 8) {
                if ((rightCol < 8) && !squares[frontRow][rightCol])
                    possibleMoves['normalMoves'].push([frontRow, rightCol]);
                if ((leftCol >= 0) && !squares[frontRow][leftCol])
                    possibleMoves['normalMoves'].push([frontRow, leftCol]);
            }

            // handle jump moves
            if (jumpRow >= 0 && frontRow < 8) {
                if ((doubleRightCol < 8) &&
                    squares[frontRow][rightCol] == opponent[piece] &&
                    !squares[jumpRow][doubleRightCol]) {
                    possibleMoves['captures'].push([frontRow, rightCol]);
                    possibleMoves['jumpMoves'].push([jumpRow, doubleRightCol])
                }
                if ((doubleLeftCol >= 0) &&
                    squares[frontRow][leftCol] == opponent[piece] &&
                    !squares[jumpRow][doubleLeftCol]) {
                    possibleMoves['captures'].push([frontRow, leftCol]);
                    possibleMoves['jumpMoves'].push([jumpRow, doubleLeftCol]);
                }
            }
            return possibleMoves;
        }

        indexOfLocInArray(row, col, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][0] == row && array[i][1] == col) {
                    return i;
                }
            }
            return -1;
        };

        handleClick(row, col) {
            var squares = this.state.squares.slice();
            var possibleMoves = {...this.state.possibleMoves };
            var highlightedPieces = this.state.highlightedPieces.slice();

            console.log(squares);
            console.log("Row: " + this.state.lastSelectedRow);
            console.log("Col: " + this.state.lastSelectedCol);
            console.log("-------------Possible moves----------");

            let shouldMovingStateChange = false;
            // if a piece is not moving, get possible moves when piece is clicked
            if (!this.state.pieceIsMoving) {
                let piece = squares[row][col];
                if ((piece == 'w' && this.state.whiteIsCurrent) ||
                    (piece == 'b' && !this.state.whiteIsCurrent)) {
                    possibleMoves = this.getPossibleMoves(squares, row, col);
                    console.log(possibleMoves);
                    this.setState({
                        possibleMoves: possibleMoves,
                        highlightedPieces: possibleMoves['normalMoves'].concat(possibleMoves['jumpMoves'])
                    });
                };
                shouldMovingStateChange = true;
            }
            // else, if the piece is moving, check if [row, col] are in possibleMoves
            else if (this.state.pieceIsMoving) {
                let jumpMoveIndex = 0;
                if (this.indexOfLocInArray(row, col, possibleMoves['normalMoves']) >= 0) {
                    this.move(row, col, squares);
                } else if ((jumpMoveIndex = this.indexOfLocInArray(row, col, possibleMoves['jumpMoves'])) >= 0) {
                    this.move(row, col, squares);
                    let capturedRow = possibleMoves['captures'][jumpMoveIndex][0];
                    let capturedCol = possibleMoves['captures'][jumpMoveIndex][1];
                    console.log("Captured row");
                    console.log(capturedRow);
                    this.capture(capturedRow, capturedCol, squares);
                }

                if (row != this.lastSelectedRow && col != this.lastSelectedCol) {
                    shouldMovingStateChange = false;
                }
                shouldMovingStateChange = true;

            }

            shouldMovingStateChange && this.setState({ pieceIsMoving: !this.state.pieceIsMoving });
            this.setState({
                squares: squares,
                possibleMoves: possibleMoves,
                highlightedPieces: highlightedPieces,
                lastSelectedRow: row,
                lastSelectedCol: col
            });

            console.log("-------------End possible moves----------");
        }



        // //if a piece is moving and the square clicked is empty:
        // if (this.state.pieceIsMoving && !this.state.squares[row][col]) {
        //     //if the piece is brown and it isn't white's turn:
        //     if (squares[this.state.lastSelectedRow][this.state.lastSelectedCol] === 'b' && !this.state.whiteIsCurrent) {
        //         if (row === (this.state.lastSelectedRow + 1)) {
        //             if ((col === (this.state.lastSelectedCol + 1)) || (col === (this.state.lastSelectedCol - 1))) {
        //                 squares = this.move(row, col, squares);
        //                 console.log("Does it go here1?");
        //             }

        //         } else if (row === (this.state.lastSelectedRow + 2)) {
        //             if (squares[this.state.lastSelectedRow + 1][this.state.lastSelectedCol + 1] === 'w') {
        //                 if (col === this.state.lastSelectedCol + 2) {
        //                     squares = this.move(row, col, squares)
        //                     squares = this.capture(this.state.lastSelectedRow + 1, this.state.lastSelectedCol + 1, squares)
        //                     console.log("Does it go here2?");
        //                 }
        //             } else if (squares[this.lastSelectedRow + 1][this.state.lastSelectedCol - 1] === 'w') {
        //                 if (col === this.state.lastSelectedCol - 2) {
        //                     squares = this.move(row, col, squares)
        //                     squares = this.capture(this.lastSelectedRow + 1, this.state.lastSelectedCol - 1, squares)
        //                     console.log("Does it go here3?");
        //                 }
        //             }
        //         }

        //     } else if (squares[this.state.lastSelectedRow][this.state.lastSelectedCol] === 'w' && this.state.whiteIsCurrent) {
        //         if (row === (this.state.lastSelectedRow - 1)) {
        //             if ((col === (this.state.lastSelectedCol + 1)) || (col === (this.state.lastSelectedCol - 1))) {
        //                 squares = this.move(row, col, squares);
        //                 console.log("Does it go here4?");
        //             }

        //         } else if (row === (this.state.lastSelectedRow - 2)) {
        //             if (squares[this.state.lastSelectedRow - 1][this.state.lastSelectedCol + 1] === 'b') {
        //                 if (col === this.state.lastSelectedCol + 2) {
        //                     squares = this.move(row, col, squares)
        //                     squares = this.capture(this.state.lastSelectedRow - 1, this.state.lastSelectedCol + 1, squares)
        //                     console.log("Does it go here5?");
        //                 }
        //             } else if (squares[this.lastSelectedRow - 1][this.state.lastSelectedCol - 1] === 'b') {
        //                 if (col === this.state.lastSelectedCol - 2) {
        //                     squares = this.move(row, col, squares)
        //                     squares = this.capture(this.lastSelectedRow - 1, this.state.lastSelectedCol - 1, squares)
        //                     console.log("Does it go here6?");
        //                 }
        //             }
        //         }
        //     }
        // }



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