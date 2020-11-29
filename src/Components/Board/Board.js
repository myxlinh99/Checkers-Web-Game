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
            possibleMoves: null,
            gameData: this.props.gameData,
            piece: (this.props.gameData.player1 == this.props.playerId) ? 'w' : 'b'
        };

    }

    componentDidMount() {
        this.props.socket.on('selectCellResponse', data => {
            // console.log(data);
            this.setState({
                squares: data.gameState,
                gameData: data.gameData
            });
        });
    }

    renderSquare(row, col) {
        console.log(this.currentMove, this.props)
        return (< Square className={
            this.isHighlighted(row, col) ? 'gray square' :
                (row + col) % 2 === 0 ? 'black square' : 'white square'
        }
            value={this.state.squares[row][col]}
            onClick={
                () => 
                    (this.state.gameData.whose_turn == this.props.playerId) ? this.handleClick(row, col) : undefined
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
        // emit cell move info to server
        // this.props.selectCell({ "i": row, "j": col, "gameState": squares, "playerId": this.props.gameData.playerId });
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
        // console.log("Getting possible moves");
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
        let squares = this.state.squares.slice();
        let possibleMoves = { ...this.state.possibleMoves };
        let highlightedPieces = this.state.highlightedPieces.slice();
        let pieceIsMoving = this.state.pieceIsMoving;

        // console.log(squares);
        // console.log("Row: " + this.state.lastSelectedRow);
        // console.log("Col: " + this.state.lastSelectedCol);
        // console.log("-------------Possible moves----------");

        let shouldMovingStateChange = false;
        // if a piece is not moving, get possible moves when piece is clicked
        if (!pieceIsMoving) {
            let piece = squares[row][col];
            if (this.state.piece == piece) {
                possibleMoves = this.getPossibleMoves(squares, row, col);
                highlightedPieces = possibleMoves['normalMoves'].concat(possibleMoves['jumpMoves'])
                pieceIsMoving = true;
            }
            else {
                pieceIsMoving = false;
            }
        }
        // else, if the piece is moving and landing on a location, 
        // check if [row, col] are in possibleMoves and move/jump
        // then resets highlightedPieces and possibleMoves
        else if (pieceIsMoving) {
            let jumpMoveIndex = 0;
            if (this.indexOfLocInArray(row, col, possibleMoves['normalMoves']) >= 0) {
                this.move(row, col, squares);
                this.props.selectCell({ "i": row, "j": col, "gameState": squares, "playerId": this.props.gameData.playerId });
                pieceIsMoving = false;
            } else if ((jumpMoveIndex = this.indexOfLocInArray(row, col, possibleMoves['jumpMoves'])) >= 0) {
                this.move(row, col, squares);
                let capturedRow = possibleMoves['captures'][jumpMoveIndex][0];
                let capturedCol = possibleMoves['captures'][jumpMoveIndex][1];
                // console.log("Captured row");
                // console.log(capturedRow);
                this.capture(capturedRow, capturedCol, squares);
                this.props.selectCell({ "i": row, "j": col, "gameState": squares, "playerId": this.props.gameData.playerId });
            }

            pieceIsMoving = false;
            // resets possible moves and highlighted pieces after a move is made
            possibleMoves = {};
            highlightedPieces = [];

        }

        shouldMovingStateChange && this.setState({ pieceIsMoving: !this.state.pieceIsMoving });
        this.setState({
            squares: squares,
            possibleMoves: possibleMoves,
            highlightedPieces: highlightedPieces,
            lastSelectedRow: row,
            lastSelectedCol: col,
            pieceIsMoving: pieceIsMoving
        });

        // console.log("-------------End possible moves----------");
    }

    render() {
        let status = this.state.pieceIsMoving ? 'A piece is moving' : this.state.whiteIsCurrent ? 'Next Turn: White Turn' : 'Next Turn: Black Turn';
        const board = [];
        for (let row = 0; row < 8; row++) {
            const cols = [];
            for (let col = 0; col < 8; col++) {
                cols.push(this.renderSquare(row, col));
            }
            board.push(<div className="board-row" > {cols} </div>);
        }

        return (
            <div>
                <div className="status" > {status} </div>
                { board}
            </div >
        );
    }
}