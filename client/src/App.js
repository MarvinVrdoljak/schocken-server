import React, { useState, useEffect } from "react";
import AddPlayer from "./components/AddPlayer";
import Players from "./components/Players";
import Information from "./components/Information";
import Footer from "./components/Footer";
import bg from "./images/board.jpg";
import infoIcon from "./images/info.svg";
import axios from 'axios';

import "./App.css";
//const socket = require('socket.io-client/dist/socket.io')("localhost:8080");
const socket = require('socket.io-client/dist/socket.io')("env-0915955.hidora.com:8080");

function App() {

  const [game, setGame] = useState({})
  const [players, setPlayers] = useState([])

/*  useEffect(() =>{
    axios.get('/game-data/game-data.json')
    .then(res => {
      console.log('Data recieved');
      setGame(res.data.game);
      setPlayers(res.data.players);
    })
  },[])*/

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

   function updateModalStatus(){
    setGame({...game, modalIsOpen: !game.modalIsOpen});
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
    const updatedPlayers = ([...players, {id: game.playerId, name, round: 0, batch: 0, loser: false, dices: [
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
          player.loser = false;
        }
        return player;
      })
      updateAll(updatedPlayers, game);
  }

  function resetHalf(){
    let updatedGame = game
    if (game.half === 1 || game.half === 2){
      players.map(player => {
        if (player.batch === 13 && player.loser === false){
          player.loser = true;
          resetRound(true, false);
          updatedGame = {...game, setIsHalfDone: false, batches: 13, half: game.half + 1};
        } else if (player.batch === 13 && player.loser === true){
          window.confirm('Da hat wohl ein Noob direkt 2x verloren! Ihr beginnt direkt ein neues Spiel!')
          updatedGame = {...game, setIsHalfDone: false, batches: 13, half: 1};
          resetRound(true, true);
        }
        return player;
      })

    } else{
      resetRound(true, true);
      updatedGame = {...game, setIsHalfDone: false, batches: 13, half: 1};
    }
    updateAll(players, updatedGame);
  }

  return (
    <div className="App">
      <header className="header">
          <h1>Schocoronia <img className="header__info" src={infoIcon} alt="Wichtige Hinweise" onClick={e => updateModalStatus()}/></h1>
          <AddPlayer addPlayer={addPlayer}/>
          <p><small><strong>Hälfte: { game.half !== 3 ? game.half : 'Loser-Round' } / Verbleibende Batches: {game.batches}</strong></small></p>
      </header>
      <main className="board" style={{backgroundImage:  `url(${bg})`}}>
        <Players players={players} batches={game.batches} updatePlayerDices={updatePlayerDices} deletePlayer={deletePlayer} addBatch={addBatch} removeBatch={removeBatch} />
        <div className="board__buttons">
          <button className="button" onClick={resetRound}>Runde neu Starten</button>
          <button className={"button" + (game.isHalfDone ? '' : ' disable')} onClick={resetHalf}>
            {game.half === 1 ? '2. Hälfte Starten' : ''}
            {game.half === 2 ? 'Verlierer ausspielen' : ''}
            {game.half === 3 ? 'Neues Spiel' : ''}
          </button>
        </div>
      </main>
      <Footer modalIsOpen={game.modalIsOpen} updateModalStatus={updateModalStatus}/>
      <Information modalIsOpen={game.modalIsOpen} updateModalStatus={updateModalStatus}/>
    </div>
  );
}

export default App;
