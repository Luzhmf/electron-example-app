const { ipcRenderer } = require('electron')
const items = require('./items.js')

// toggle modal bottons
const toggleModalButtons = () => {
    // check state
    if (addItem.disabled == true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

// Dom Node
let showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    modal = document.getElementById("modal"),
    addItem = document.getElementById("add-item"),
    itemUrl = document.getElementById("url")

// Show modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

// Close modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

// handle new item
addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        ipcRenderer.send('new-item', itemUrl.value);

        // disable buttons
        toggleModalButtons();
    }
})

// list for a keu event
itemUrl.addEventListener('keyup', e => {
    if (e.key == 'Enter') {
        addItem.click()
    }
})

// listener for new item
ipcRenderer.on('new-item-success', (e, newItem) => {
    // add new item to items
    items.addItem(newItem, true);

    // enable buttons
    toggleModalButtons();

    //hide modal
    modal.style.display = 'none'
    itemUrl.value = ''
})
