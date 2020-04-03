import React, { useState, useEffect } from "react";
import AddPlayer from "./components/AddPlayer";
import Players from "./components/Players";
import Information from "./components/Information";
import Settings from "./components/Settings";
import Footer from "./components/Footer";
import bg from "./images/board.jpg";
import infoIcon from "./images/info.svg";
import settingsIcon from "./images/settings.svg";
import axios from "axios";

import "./App.css";
// const socket = require('socket.io-client/dist/socket.io')("localhost:8080");
const socket = require('socket.io-client/dist/socket.io')("env-0915955.hidora.com:8080",{transports: ['websocket'], upgrade: false});

function App() {

  const [settingsModal, setSettingsModal] = useState(false)
  const [infoModal, setInfoModal] = useState(false)
  const [game, setGame] = useState({})
  const [players, setPlayers] = useState([])

  socket.on('connect', function(data) {
      console.log("Connected...");
  });

  useEffect(() => {
      socket.on("update", data => {
        console.log("updated");
        setPlayers(data.players);
        setGame(data.game);
      });
  },[]);


   function updateAll(players, game){
     socket.emit("update", {players, game});
   }

   function toggleInfoModal(){
    setInfoModal(!infoModal);
  }

  function toggleSettingsModal(){
    setSettingsModal(!settingsModal);
  }

   function updatePlayerDices(id, dices, addRound){
     const updatedPlayers = players.map(player => {
         if (player.id === id) {
           player.dices = dices;
           if(addRound){
             player.round =  player.round + 1;
            }
          }
          return player;
        })

      updateAll(updatedPlayers, game);
  }

  function deletePlayer(id) {
    const updatedPlayers = [...players.filter(player => player.id !== id)];
    // socket.emit("update", {players});
    updateAll(updatedPlayers, game);
  }

  function addPlayer(name) {
    const updatedPlayers = ([...players, {id: game.playerId, name, round: 0, batch: 0, donation: 0, loses: 0, dices: [
      {id: 1, value: 1, selected: false, visible: true},
      {id: 2, value: 2, selected: false, visible: true},
      {id: 3, value: 3, selected: false, visible: true},
    ]}]);
    const updatedGame = {...game, playerId: players.length + 1};
    updateAll(updatedPlayers, updatedGame);
  }

  function addBatch(id){
    let updatedGame = game;
    const updatedPlayers = players.map(player => {
        if (player.id === id && game.batches > 0) {
          player.batch =  player.batch + 1;
          if (player.batch === 13){
            updatedGame = {...game, isHalfDone: true, batches: game.batches - 1};
          } else{
            updatedGame = {...game, isHalfDone: false, batches: game.batches - 1};
          }
        }
        return player;
      })
      updateAll(updatedPlayers, updatedGame);
  }

  function removeBatch(id){
    let updatedGame = game;
    const updatedPlayers = players.map(player => {
        if (player.id === id && player.batch >= 1) {
          player.batch = player.batch - 1;
          updatedGame = {...game, batches: game.batches + 1};
        }
        return player;
      })

    updateAll(updatedPlayers, updatedGame);
  }

  function changeDonationRate(direction){
    let updatedGame;
    if (direction === 'plus'){
      updatedGame = {...game, donationRate: game.donationRate + 1};
    } else {
      updatedGame = {...game, donationRate: game.donationRate - 1};
    }

    updateAll(players, updatedGame);
  }


  function resetRound(resetPlayerBatches, resetLoser){
    const updatedPlayers = players.map(player => {
        player.round = 1;
        player.dices = [
          {id: 1, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
          {id: 2, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
          {id: 3, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
        ];
        if (resetPlayerBatches === true){
          player.batch = 0;
        }
        if (resetLoser === true){
          player.loses = 0;
        }
        return player;
      })
      updateAll(updatedPlayers, game);
  }

  function resetHalf(){
    let updatedGame = game
    let updatedPlayers = players
      updatedPlayers = players.map(player => {
        if (player.batch === 13 && player.loses === 0){
          player.loses =  player.loses + 1;
          resetRound(true, false);
          updatedGame = {...game, isHalfDone: false, batches: 13, half: game.half + 1};
        } else if (player.batch === 13 && player.loses === 1){
          if (game.half === 2){
            window.confirm('Da hat wohl ein Noob direkt 2x verloren! Ihr beginnt direkt ein neues Spiel!')
          }
          updatedGame = {...game, isHalfDone: false, batches: 13, half: 1};
          player.donation = player.donation + game.donationRate;
          resetRound(true, true);
        }
        return player;
      })
    // updatedGame = {...game, setIsHalfDone: false, batches: 13, half: 1};
    updateAll(updatedPlayers, updatedGame);
  }

  function resetGame(){
    if (window.confirm('Bist du sicher, dass du alle Daten zurück setzen willst? Alle Spieler werden rausgeworfen, alle Daten auf 0 gesetzt.')){
      axios.get('/game-data/game-data-default.json')
      .then(res => {
        console.log('Game Reset');
        const updatedGame = res.data.game;
        const updatedPlayers = res.data.players;
        setSettingsModal(false);
        updateAll(updatedPlayers, updatedGame);
      })
    }
  }



  return (
    <div className="App">
      <header className="header">
          <h1>Schocoronia <img className="header__info" src={infoIcon} alt="Wichtige Hinweise" onClick={e => toggleInfoModal()}/> <img className="header__info" src={settingsIcon} alt="settings" onClick={e => toggleSettingsModal()}/></h1>
          <AddPlayer addPlayer={addPlayer}/>
          <p><small><strong>Hälfte: { game.half !== 3 ? game.half : 'Loser-Round' } / Verbleibende Batches: {game.batches} / Spendenrate: {game.donationRate}€</strong></small></p>
      </header>
      <main className="board" style={{backgroundImage:  `url(${bg})`}}>
        <Players players={players} batches={game.batches} updatePlayerDices={updatePlayerDices} deletePlayer={deletePlayer} addBatch={addBatch} removeBatch={removeBatch} />
        <div className="board__buttons">
          <button className={"button" + (game.batches !== 0 ? '' : ' disable')} onClick={resetRound}>Runde neu Starten</button>
          <button className={"button" + (game.isHalfDone ? '' : ' disable')} onClick={resetHalf}>
            {game.half === 1 ? '2. Hälfte Starten' : ''}
            {game.half === 2 ? 'Verlierer ausspielen' : ''}
            {game.half === 3 ? 'Neues Spiel' : ''}
          </button>

          {/* <button className="button" onClick={resetGame}>Alles Zurücksetzen</button> */}
        </div>
      </main>
      <Footer modalIsOpen={infoModal} toggleInfoModal={toggleInfoModal}/>
      <Information modalIsOpen={infoModal} toggleInfoModal={toggleInfoModal}/>
      <Settings modalIsOpen={settingsModal} toggleSettingsModal={toggleSettingsModal} resetGame={resetGame} donationRate={game.donationRate} changeDonationRate={changeDonationRate}/>
    </div>
  );
}

export default App;
