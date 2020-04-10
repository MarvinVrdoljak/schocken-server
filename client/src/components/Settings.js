import React from 'react';
import AddPlayer from "./AddPlayer";
import crossIcon from '../images/cross.svg';
import plusIcon from '../images/plus.svg';
import minusIcon from '../images/minus.svg';

function Settings(state) {
  return (
    <div className={"modal" + (state.modalIsOpen ? ' modal--open' : '')}>
        <div className="modal__wrapper">
            <span className="modal__close button button--delete" onClick={() => state.toggleSettingsModal()}><img src={crossIcon} alt="Wichtige Hinweise"/></span>
            <div className="modal__content">
                <h2>Einstellungen</h2>
                <h3>Spieler hinzufügen</h3>
                 <AddPlayer addPlayer={state.addPlayer}/>
                <h3>Spendenrate</h3>
                <p>Nach jedem Spiel wird dem Verlierer der gewählte Betrag als Spendenbetrag hinzugefügt. Wir freuen uns über jede kleine Spende.</p>
                <p className="modal__content__rate">
                  <span className={"button button--tiny" + (state.donationRate === 1 ? ' disable' : '')} onClick={state.changeDonationRate.bind(this, 'minus')}><img src={minusIcon} alt="Weniger"/></span> <span className="value">{state.donationRate}€</span> <span className="button button--tiny" onClick={state.changeDonationRate.bind(this, 'plus')}><img src={plusIcon} alt="Mehr"/></span>
                </p>
                <h3>Daten zurücksetzen</h3>
                <p><span className="link" alt="Jetzt Spenden" onClick={state.resetGame.bind(this)}>Alle Daten zurücksetzen</span></p>
                <span className="button" onClick={() => state.toggleSettingsModal()}>Ok</span>
            </div>
        </div>
    </div>
  );
}

export default Settings;
