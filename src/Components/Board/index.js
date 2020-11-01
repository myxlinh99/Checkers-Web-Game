import React from 'react';
import Square from '../Square'
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
                xIsNext: true,
                pieceIsMoving: false,
                lastSelectedX: null,
                lastSelectedY: null,
                highlightedPieces
            };

        }

        renderSquare(row, col) {
            return ( <
                Square className = {
                    (this.isHighlighted(row,col)) ? 'gray square' : (row + col) % 2 === 0 ? 'black square' : 'white square'
                }
                value = { this.state.squares[row][col] }
                onClick = {
                    () => this.handleClick(row, col)
                }

                />
            );

        }

        move(row, col, squares) {
            const tmp = this.state.squares[this.state.lastSelectedX][this.state.lastSelectedY];
            squares[this.state.lastSelectedX][this.state.lastSelectedY] = null;
            squares[row][col] = tmp;
            this.setState({ xIsNext: !this.state.xIsNext });
        }

        isHighlighted(row,col){
            for (var i = 0; i < this.state.highlightedPieces.length; i++){
                if (this.state.highlightedPieces[i][0] == row && this.state.highlightedPieces[i][1] == col){
                    return true;
                }
            }
            return false;
        }

        highlight(row,col){
            var availSquare = [];
            const highlight = [];
            console.log(highlight);
            if (this.state.squares[row][col] === "b") {
                if (this.state.squares[row+1][col+1] === null){
                    availSquare.push(row+1);
                    availSquare.push(col+1)
                    highlight.push(availSquare);
                    availSquare =[];
                    console.log("First possible move: ", row+1, col + 1)
                }
                if (this.state.squares[row+1][col-1] === null){
                    availSquare.push(row+1);
                    availSquare.push(col-1)
                    highlight.push(availSquare);
                    availSquare =[];
                    console.log("Second possible move: ", row+1, col - 1)
                }
            }
            else if (this.state.squares[row][col] === "w"){
                if (this.state.squares[row-1][col+1] === null){
                    availSquare.push(row-1);
                    availSquare.push(col+1)
                    highlight.push(availSquare);
                    availSquare =[];
                    console.log("First possible move: ", row-1, col + 1)
                }
                if (this.state.squares[row-1][col-1] === null){
                    availSquare.push(row-1);
                    availSquare.push(col-1)
                    highlight.push(availSquare);
                    availSquare =[];
                    console.log("Second possible move: ", row-1, col - 1)
                }
            }
            this.setState({
                highlightedPieces : highlight
            });
            console.log(this.highlightedPieces);
            
        }

        handleClick(row, col) {
            this.highlight(row,col);
            const squares = this.state.squares.slice();
            if (this.state.pieceIsMoving && !this.state.squares[row][col]) {
                if (this.state.squares[this.state.lastSelectedX][this.state.lastSelectedY] === 'b' && !this.state.xIsNext) {
                    if (row === (this.state.lastSelectedX + 1)) {
                        if ((col === (this.state.lastSelectedY + 1)) || (col === (this.state.lastSelectedY - 1))) {
                            this.move(row, col, squares);
                        }
                    }
                } 
                else if (this.state.squares[this.state.lastSelectedX][this.state.lastSelectedY] === 'w' && this.state.xIsNext) {
                    if (row === (this.state.lastSelectedX - 1)) {
                        if ((col === (this.state.lastSelectedY + 1)) || (col === (this.state.lastSelectedY - 1))) {
                            this.move(row, col, squares);

                        }
                    }
                }
            }
            this.setState({
                squares,
                lastSelectedX: row,
                lastSelectedY: col,
                pieceIsMoving: !this.state.pieceIsMoving,
            });

        }

        render() {
            //check if it's highlighted, then render
            let status = this.state.pieceIsMoving ? 'A piece is moving' : this.state.xIsNext ? 'Next Turn: Player 1' : 'Next Turn: Player 2';
            const board = [];
            for (let row = 0; row < 8; row++) {
                const cols = [];
                for (let col = 0; col < 8; col++) {
                    cols.push(this.renderSquare(row, col));
                }
                board.push( < div className = "board-row" > { cols } </div>);
                }

                return ( <div>
                    <div className = "status" > { status } </div> { board } </div>
                );

            }

        }