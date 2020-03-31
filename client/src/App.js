import React, { useState } from "react";
import AddPlayer from "./components/AddPlayer";
import Players from "./components/Players";
import Information from "./components/Information";
import Footer from "./components/Footer";
import bg from "./images/board.jpg";
import infoIcon from "./images/info.svg";

import "./App.css";
const socket = require('socket.io-client/dist/socket.io')("http://env-0915955.hidora.com:4001");

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [half, setHalf] = useState(1);
  const [isHalfDone, setIsHalfDone] = useState(false);
  const [batches, setBatches] = useState(13);
  const [players, setPlayers] = useState([
    { id: 1,
      name: "Marvin", round: 0, batch: 0, loser: false, dices: [
        {id: 1, value: 1, selected: false, visible: true},
        {id: 2, value: 2, selected: false, visible: true},
        {id: 3, value: 3, selected: false, visible: true},
      ]
    },
    { id: 2,
      name: "Simon", round: 0, batch: 0, loser: false, dices: [
        {id: 1, value: 1, selected: false, visible: true},
        {id: 2, value: 2, selected: false, visible: true},
        {id: 3, value: 3, selected: false, visible: true},
      ]
    },
  ]);

  const [playerId, setPlayerId] = useState(players.length + 1);

    socket.on('connect', function(data) {
        console.log("Connected...");
        socket.emit("roll", players);
    });

   socket.on("roll", data => {
     console.log(data);
   });


   function updateModalStatus(){
    // setModalIsOpen(!modalIsOpen)
    setModalIsOpen(!modalIsOpen);
  }


   function updatePlayerDices(id, dices, addRound){
     setPlayers(
       players.map(player => {
         if (player.id === id) {
           player.dices = dices;
           if(addRound){
             player.round =  player.round + 1;
            }
          }
          return player;
        })
        )
    socket.emit("roll", players);
  }


  function deletePlayer(id) {
    setPlayers([...players.filter(player => player.id !== id)]);
  }

  function addPlayer(name) {
    setPlayers([...players, {id: playerId, name, round: 0, batch: 0, loser: false, dices: [
      {id: 1, value: 1, selected: false, visible: true},
      {id: 2, value: 2, selected: false, visible: true},
      {id: 3, value: 3, selected: false, visible: true},
    ]}]);
    setPlayerId(playerId + 1);
  }

  function addBatch(id){
    setPlayers(
      players.map(player => {
        if (player.id === id && batches > 0) {
          player.batch =  player.batch + 1;
          setBatches(batches - 1);
          if (player.batch === 13){
            setIsHalfDone(true);
          } else{
            setIsHalfDone(false);
          }
        }
        return player;
      })
    )
  }

  function removeBatch(id){
    setPlayers(
      players.map(player => {
        if (player.id === id && player.batch >= 1) {
          player.batch = player.batch - 1;
          setBatches(batches + 1);
        }
        return player;
      })
    )
  }


  function resetRound(resetPlayerBatches, resetLoser){
    setPlayers(
      players.map(player => {
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
    )
  }

  function resetHalf(){
    if (half === 1 || half === 2){
      players.map(player => {
        if (player.batch === 13 && player.loser === false){
          player.loser = true;
          setHalf(half + 1);
          resetRound(true, false);
        } else if (player.batch === 13 && player.loser === true){
          window.confirm('Da hat wohl ein Noob direkt 2x verloren! Ihr beginnt direkt ein neues Spiel!')
          setHalf(1);
          resetRound(true, true);
        }
        return player;
      })

    } else{
      setHalf(1);
      resetRound(true, true);
    }
    setBatches(13);
    setIsHalfDone(false);
  }

  return (
    <div className="App">
      <header className="header">
          <h1>Schocoronia <img className="header__info" src={infoIcon} alt="Wichtige Hinweise" onClick={e => updateModalStatus()}/></h1>
          <AddPlayer addPlayer={addPlayer}/>
          <p><small><strong>Hälfte: { half !== 3 ? half : 'Loser-Round' } // Verbleibende Batches: {batches}</strong></small></p>
      </header>
      <main className="board" style={{backgroundImage:  `url(${bg})`}}>
        <Players players={players} batches={batches} updatePlayerDices={updatePlayerDices} deletePlayer={deletePlayer} addBatch={addBatch} removeBatch={removeBatch} />
        <div className="board__buttons">
          <button className="button" onClick={resetRound}>Runde neu Starten</button>
          <button className={"button" + (isHalfDone ? '' : ' disable')} onClick={resetHalf}>
            {half === 1 ? '2. Hälfte Starten' : ''}
            {half === 2 ? 'Verlierer ausspielen' : ''}
            {half === 3 ? 'Neues Spiel' : ''}
          </button>
        </div>
      </main>
      <Footer modalIsOpen={modalIsOpen} updateModalStatus={updateModalStatus}/>
      <Information modalIsOpen={modalIsOpen} updateModalStatus={updateModalStatus}/>
    </div>
  );
}

export default App;
