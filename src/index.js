import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GetUserDetail from './Components/GetUserDetail/GetUserDetail';
import ShowUsers from './Components/ShowUsers/ShowUsers';
import GamePlay from './Components/GamePlay/GamePlay';
import { Container } from 'react-bootstrap';
import socketIOClient from "socket.io-client";

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      // endpoint: "http://127.0.0.1:3000",
      endpoint: "https://frozen-plateau-07686.herokuapp.com",
      socket: null,
      isGameStarted: false,
      gameId:null,
      gameData: null,
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    console.log(endpoint);
    // Made a connection with server
    const socket = socketIOClient(endpoint, {'transports': ['websocket'], 'match origin protocol': true});
    
    socket.on("connected", data => {
      this.setState({ socket: socket })
    });
  }

  registrationConfirmation = (data) => {
    // If registration successfully redirect to player list
    this.setState({ isRegistered: data });
  };

  gameStartConfirmation = (data) => {
    // If select opponent player then start game and redirect to game play
    this.setState({ isGameStarted: data.status, gameId: data.game_id, gameData: data.game_data });
  };

  opponentLeft = (data) => {
    // If opponent left then get back from game play to player screen
    alert("Opponent Left");
    this.setState({ isGameStarted: false, gameId: null, gameData: null });
  };

  render() {
    return (
      <Container>
        {
          !this.state.isGameStarted ? !this.state.isRegistered ? <header className="App-header">
            {this.state.socket
              ? <GetUserDetail socket={this.state.socket} registrationConfirmation={this.registrationConfirmation} />
              : <p>Loading...</p>}
          </header> :
            <ShowUsers socket={this.state.socket} gameStartConfirmation={this.gameStartConfirmation} /> :
            <GamePlay socket={this.state.socket} gameId={this.state.gameId} gameData={this.state.gameData} opponentLeft={this.opponentLeft} />
        }
      </Container>
    );
    // return (
    //   <div className="game">
    //     <div className="game-board">
    //       <Board />
    //     </div>
    //     <div className="game-info">
    //     </div>
    //   </div>
    // );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
