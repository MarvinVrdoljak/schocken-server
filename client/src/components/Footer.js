import React from 'react';

function Footer(state) {
  return (
    <footer className="footer">
      <span className="link" alt="Wichtige Hinweise" onClick={() => state.toggleInfoModal()}>Informationen</span>
      &nbsp;|&nbsp;
      <a href={"https://www.spielregeln.de/schocken.html"} rel="noopener noreferrer" alt="Spenden" target="_blank">Spielregeln</a>
      &nbsp;|&nbsp;
      <a href={"https://www.betterplace.org/de/fundraising-events/34641-schocoronia-fur-die-arche-kinderstiftung"} rel="noopener noreferrer" alt="Spenden" target="_blank">Jetzt Spenden</a>
    </footer>
  );
}

export default Footer;
