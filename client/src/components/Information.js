import React from 'react';
import crossIcon from '../images/cross.svg';

function Information(state) {
  return (
    <div className={"modal" + (state.modalIsOpen ? ' modal--open' : '')}>
        <div className="modal__wrapper">
            <a href="#/" className="modal__close button button--delete"><img src={crossIcon} alt="Wichtige Hinweise" onClick={() => state.updateModalStatus()}/></a>
            <div className="modal__content">
                <h2>Informationen</h2>
                <p><strong>Willkommen bei Schoronia - <a href="https://www.spielregeln.de/schocken.html" target="_blank" alt="Regeln">Schocken</a> für die Quarantäne Zeit!</strong></p>
                <p>Damit ihr derzeit alle brav Zuhause bleibt, aber dennoch zu eurem Wochenend-Bierchen kommt, haben in den letzten Wochen ein virtuelles Schocken-Spiel programmiert.</p>
                <p>Falls ihr das Spiel feiert, würden wir uns sehr über eine kleine Spende an <a href="https://www.kinderprojekt-arche.de/" target="_blank" alt="Kinderprojekt Arche"><strong>"DIE ARCHE"</strong></a> freuen. Da ihr ja nun eh Zuhause sitzt und den ein oder anderen Euro gespart habt, den ihr sonst in der Kneipe ausgegeben hättet, sollte dies ja kein Problem sein. Ihr würdet damit das Projekt <a href="https://www.betterplace.org/de/fundraising-events/34641-schocoronia-fur-die-arche-kinderstiftung" target="_blank" alt="Spenden"><strong>"Lebensmittelpakete für die Arche-Kinder und ihre Familien #Corona"</strong></a> unterstützen.</p>
                <p>Freuen würden wir uns auch über ein kurzes Feedback oder Verbesserungsvorschläge. Schreibe uns <a href="mailto:schocoronia@gmail.com" target="_blank" alt="Mail">hier</a>.</p>
                <p>Wir wünschen viel Spass beim würfeln & trinken.<br/>Marvin & Simon</p>
                <a href="https://www.betterplace.org/de/donate/platform/fundraising-events/34641" target="_blank" className="button" alt="Jetzt Spenden">Jetzt Spenden</a>
            </div>
        </div>
    </div>
  );
}

export default Information;
