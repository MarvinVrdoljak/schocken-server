import React, { useState, useEffect } from "react";
//import React, { useState } from "react";
import AddPlayer from "./components/AddPlayer";
import Players from "./components/Players";
import bg from "./images/board.jpg";
import socketIOClient from "socket.io-client";

import "./App.css";

function App() {
  const [players, setPlayers] = useState([
    { id: 1,
      name: "Marvin", round: 0, batch: 0, dices: [
        {id: 1, value: 1, selected: false, visible: true},
        {id: 2, value: 2, selected: false, visible: true},
        {id: 3, value: 3, selected: false, visible: true},
      ]
    },
    { id: 2,
      name: "Simon", round: 0, batch: 0, dices: [
        {id: 1, value: 1, selected: false, visible: true},
        {id: 2, value: 2, selected: false, visible: true},
        {id: 3, value: 3, selected: false, visible: true},
      ]
    },
  ]);

  const [playerId, setPlayerId] = useState(players.length + 1);

   const [response, setResponse] = useState(false);
   const [endpoint] = useState("localhost:4001");

   const socket = socketIOClient(endpoint);

   useEffect(() =>{
     console.log(players);
         socket.emit("roll", players);
   })

   socket.on("roll", data => {
     console.log(data);
   })


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
  }


  function deletePlayer(id) {
    setPlayers([...players.filter(player => player.id !== id)]);
  }

  function addPlayer(name) {
    setPlayers([...players, {id: playerId, name, round: 0, batch: 0, dices: [
      {id: 1, value: 1, selected: false, visible: true},
      {id: 2, value: 2, selected: false, visible: true},
      {id: 3, value: 3, selected: false, visible: true},
    ]}]);
    setPlayerId(playerId + 1);
  }

  function resetRound(){
    setPlayers(
      players.map(player => {
        player.round = 1;
        player.dices = [
          {id: 1, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
          {id: 2, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
          {id: 3, value: Math.floor(Math.random() * 6) + 1, selected: false, visible: false},
        ]
        return player;
      })
    )
  }

  function addBatch(id){
    setPlayers(
      players.map(player => {
        if (player.id === id) {
          player.batch =  player.batch + 1;
        }
        return player;
      })
    )
  }

  function removeBatch(id){
    setPlayers(
      players.map(player => {
        if (player.id === id &&  player.batch >= 1) {
          player.batch =  player.batch - 1;
        }
        return player;
      })
    )
  }

  return (
    <div className="App">
      <AddPlayer addPlayer={addPlayer}/>
      <main className="board" style={{backgroundImage:  `url(${bg})`}}>
        <Players players={players} updatePlayerDices={updatePlayerDices} deletePlayer={deletePlayer} addBatch={addBatch} removeBatch={removeBatch} />
        <div className="footer">
          <button className="button" onClick={resetRound}>Runde neu Starten</button>
        </div>
      </main>
    </div>
  );
}

export default App;
