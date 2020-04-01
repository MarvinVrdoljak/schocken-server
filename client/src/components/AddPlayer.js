import React, { useState } from 'react';
import addPlayerIcon from '../images/add-player.svg';

function AddPlayer(state) {
const [newPlayer, setNewPlayer] = useState('');

function onChange(e){
  setNewPlayer(e.target.value);
}

function onSubmit(e){
  e.preventDefault();
  if (newPlayer === ''){
    alert('Spielernamen eingeben');
  }
  else{
    state.addPlayer(newPlayer);
    setNewPlayer('');
  }
}

  return (
    <div className="addPlayer">
      <div className="addPlayer__form">
        <input type="text" name="title" placeholder="Spielername" value={newPlayer} onChange={onChange}/>
        <button className="button button--icon" onClick={onSubmit}>
          <img src={addPlayerIcon} alt="Spieler hinzufügen"/>
        </button>
      </div>
    </div>
    )
}

export default AddPlayer;