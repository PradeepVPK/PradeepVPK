const dialog = document.querySelector('dialog');
if (typeof dialog.showModal === 'function') {
  const title = document.querySelector('#story-title');
  const body = document.querySelector('#story-body');
  const context = document.querySelector('#story-context');

  for (const tile of document.querySelectorAll('.tile')) {
    const trigger = tile.querySelector('summary');
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      title.textContent = trigger.querySelector('.tile-title').textContent;
      context.textContent = trigger.querySelector('.context').textContent;
      body.replaceChildren(tile.querySelector('.story').cloneNode(true));
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  }
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}
