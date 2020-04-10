import React from 'react';
import PlayerDices from './PlayerDices';
import crossIcon from '../images/cross.svg';
import plusIcon from '../images/plus.svg';
import minusIcon from '../images/minus.svg';
import loserIcon from '../images/loser.svg';

function PlayerItem(state) {
  const {id, name, round, batch, loses, donation, rolled, dices} = state.player;
  const batches = state.batches;

  return (
    <div className={"player"}>
      <h3 className="player__name">{name} ({donation}€ Spende) { loses !== 0 ? <img className="player__loser" src={loserIcon} alt="1. Hälfte verloren"/> : ''} </h3>
      <div className="player__meta">
          <span>Gewürfelt: {round}x&nbsp;//&nbsp;</span>
          <span>Batches: {batch}</span>
          <span className={"player__meta__button" + (batches === 0 ? ' disable' : '')} onClick={state.addBatch.bind(this, id)}><img src={plusIcon} alt="Aufdecken"/></span>
          <span className={"player__meta__button" + (batch === 0 ? ' disable' : '')} onClick={state.removeBatch.bind(this, id)}><img src={minusIcon} alt="Aufdecken"/></span>

      </div>
      <PlayerDices id={id} dices={dices} round={round} rolled={rolled} updatePlayerDices={state.updatePlayerDices} />
        <span className={"button button--delete"} href="#/" onClick={state.deletePlayer.bind(this, id)}>
          <img src={crossIcon} alt="Löschen" />
        </span>
    </div>
  )
}

export default PlayerItem;

