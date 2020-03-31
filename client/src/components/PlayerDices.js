import React from "react";
import dice1 from '../images/dice-1.png';
import dice2 from '../images/dice-2.png';
import dice3 from '../images/dice-3.png';
import dice4 from '../images/dice-4.png';
import dice5 from '../images/dice-5.png';
import dice6 from '../images/dice-6.png';
import rollIcon from '../images/roll.svg';
import showIcon from '../images/show.svg';
import hideIcon from '../images/hide.svg';

function PlayerDices(state) {

  function selectDice(id) {
    const dices = state.dices.map(dice => {
        if (dice.id === id && dice.visible === true) {
          dice.selected = !dice.selected;
        }
        return dice;
      })

    state.updatePlayerDices(state.id, dices);
  }

  function checkForSix(){
    const sixArray = [];
    const dices = state.dices.map(dice => {
        if(dice.selected === false){
          if(dice.value === 6){
            sixArray.push('1');
            if (sixArray.length === 2 && state.round < 3){
              window.confirm('Ey du Pissenelke, willst du eine 6 zu einer 1 machen?') ? dice.value = 1 : dice.value = 6
            }
          }
        }
        return dice;
      })
      state.updatePlayerDices(state.id, dices);

  }

  function showDices(){
    const dices = state.dices.map(dice => {
        dice.visible = true;
        return dice;
      })

      state.updatePlayerDices(state.id, dices);

      setTimeout(function() {
        checkForSix();
    }, 500);
  }

  function hideDices(){
    const dices = state.dices.map(dice => {
        if (dice.selected !== true) {
          dice.visible = false;
        }
        return dice;
      })
      state.updatePlayerDices(state.id, dices);
  }


 function changeDices(){
  let dices = state.dices.map(dice => {
      if (dice.selected !== true) {
        dice.visible = false;
      }
      if (!dice.selected){
        dice.value = Math.floor(Math.random() * 6) + 1;
      }
      return dice;
    })

    state.updatePlayerDices(state.id, dices, true);
 }


const getDices = state.dices.map((dice, index) => {

 function getDiceImg(value) {
    switch(value) {
      case 1:
        return <img src={dice1} alt="Würfel"/>;
      case 2:
        return <img src={dice2} alt="Würfel"/>;
      case 3:
        return <img src={dice3} alt="Würfel"/>;
      case 4:
        return <img src={dice4} alt="Würfel"/>;
      case 5:
        return <img src={dice5} alt="Würfel"/>;
      case 6:
        return <img src={dice6} alt="Würfel"/>;
      default:
        return 'error';
    }
  };

  return (
      <div className={"dices__dice" + (dice.selected ? ' dices__dice--selected' : '') + (dice.visible ? ' dices__dice--visible' : ' dices__dice--hidden')} key={index} onClick={selectDice.bind(this, dice.id)}>
        {getDiceImg(dice.value)}
      </div>
  );
})


  return (
    <div className="dices">
      {getDices}
      <div className="dices__buttons">
        <button className={"button button--icon dices__button" + (state.round >= 3 ? ' disable' : '')} onClick={changeDices}>
          <img src={rollIcon} alt="Würfeln"/>
        </button>
        <button className="button button--icon dices__button" onClick={showDices}>
        <img src={showIcon} alt="Aufdecken"/>
          </button>
        <button className="button button--icon dices__button" onClick={hideDices}>
          <img src={hideIcon} alt="Verdecken"/>
        </button>
      </div>
    </div>
  )
}

export default PlayerDices;

