import React from 'react';
import PlayerItem from './PlayerItem';

function Players(state) {
  return state.players.map((player, index) => (
    <div key={index}>
      <PlayerItem player={player} batches={state.batches} updatePlayerDices={state.updatePlayerDices} deletePlayer={state.deletePlayer} addBatch={state.addBatch} removeBatch={state.removeBatch} />
    </div>
  ));
}

export default Players;
