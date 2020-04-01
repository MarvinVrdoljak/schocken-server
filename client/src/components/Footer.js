import React from 'react';
import crossIcon from '../images/cross.svg';

function Footer(state) {
  return (
    <footer className="footer">
      <a href={"#/"} alt="Wichtige Hinweise" onClick={() => state.updateModalStatus()}>Informationen</a>
      &nbsp;|&nbsp;
      <a href={"https://www.spielregeln.de/schocken.html"} alt="Spenden" target="_blank">Spielregeln</a>
      &nbsp;|&nbsp;
      <a href={"https://www.betterplace.org/de/fundraising-events/34641-schocoronia-fur-die-arche-kinderstiftung"} alt="Spenden" target="_blank">Jetzt Spenden</a>
    </footer>
  );
}

export default Footer;
