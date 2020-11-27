import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GetUserDetail from './Components/GetUserDetail/GetUserDetail';
import ShowUsers from './Components/ShowUsers/ShowUsers';
import GamePlay from './Components/GamePlay/GamePlay';
import { Container, ListGroup, Navbar } from 'react-bootstrap';
import socketIOClient from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';

class Game extends React.Component {

  constructor() {
    super();
    this.state = {
      // endpoint: "http://127.0.0.1:3001",
      endpoint: "https://frozen-plateau-07686.herokuapp.com",
      socket: null,
      isGameStarted: false,
      gameId: null,
      gameData: null,
      playerId: null,
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    // Made a connection with server
    const socket = socketIOClient(endpoint, { 'transports': ['websocket'], 'match origin protocol': true });

    socket.on("connected", data => {
      this.setState({
        socket: socket,
        playerId: data.id
      })
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

  alertClicked() {
    alert('You clicked the third ListGroupItem');
  }

  renderGetUserDetail() {
    return <GetUserDetail socket={this.state.socket} registrationConfirmation={this.registrationConfirmation} />
  }

  renderMenu() {
    return (
      <ListGroup>
        <ListGroup.Item action onClick={() => this.setState({showMenu: false})}>
            Start
            </ListGroup.Item>
          <ListGroup.Item action onClick={this.alertClicked}>
          How to Play
          </ListGroup.Item>
          <ListGroup.Item action onClick={this.alertClicked}>
          Developers
          </ListGroup.Item>
    </ListGroup>
    )
  }

  renderGamePlay(){
    return <GamePlay playerId={this.state.playerId} socket={this.state.socket} gameId={this.state.gameId} gameData={this.state.gameData} opponentLeft={this.opponentLeft} />
  }

  renderUsers(){
    return <ShowUsers socket={this.state.socket} gameStartConfirmation={this.gameStartConfirmation} />
  }

  renderLoading(){
    return <p>Loading</p>
  }

  renderNavBar() {
    return <Navbar>
      <Navbar.Brand href="#home" onClick={() => this.setState({showMenu: true})}>
        Menu
        </Navbar.Brand>
      <Navbar.Toggle />
      {this.state.playerId && 
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">{this.state.playerId}</a>
          </Navbar.Text>
        </Navbar.Collapse>
      }
      
    </Navbar>
  }
  render() {
    return (
      <Container>
          {this.renderNavBar()}
          {this.state.showMenu && this.renderMenu()}
          {!this.state.showMenu && !this.state.isGameStarted && !this.state.isRegistered && this.state.socket && this.renderGetUserDetail()}
          {!this.state.showMenu && !this.state.isGameStarted && !this.state.isRegistered && !this.state.socket && this.renderLoading()}
          {!this.state.showMenu && !this.state.isGameStarted && this.state.isRegistered && this.renderUsers()}
          {!this.state.showMenu && this.state.isGameStarted && this.state.isRegistered && this.renderGamePlay()}
      </Container>
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
