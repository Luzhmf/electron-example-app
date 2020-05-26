// DOM nodes
let items = document.getElementById('items');

// Modules
const fs = require('fs');

// items storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
}

exports.addItem = (item, isNew = false) => {
    //create html item
    let itemNode = document.createElement('div');
    itemNode.setAttribute('class', 'read-item');
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

    // append to item container
    items.appendChild(itemNode);

    // select item
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }

    // attach click handler
    itemNode.addEventListener('click', this.select);
    itemNode.addEventListener('dblclick', this.open);

    itemNode.setAttribute('data-url', item.url)

    if (isNew) {
        this.storage.push(item);
        this.save();
    }
}

// add items when app loads
this.storage.forEach(item => {
    this.addItem(item, false);
});

// set item as selected 
exports.select = e => {

    // Remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')

    // Add to clicked item
    e.currentTarget.classList.add('selected')
}
// change selection

exports.changeSelection = direction => {

    // Get selected item
    let currentItem = this.getSelectedItem()

    // Handle up/down
    if (direction === 'ArrowUp' && currentItem.node.previousSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.previousSibling.classList.add('selected')

    } else if (direction === 'ArrowDown' && currentItem.node.nextSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.nextSibling.classList.add('selected')
    }
}

// get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (error, data) => {
    readerJS = data.toString();
});

// opening selecte item 
exports.open = () => {

    // check if you have items
    if (!this.storage.length) return;

    // get selecte item
    let currentItem = this.getSelectedItem()
    let contentURL = currentItem.node.dataset.url;

    let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
    `)

    // Inject some JS
    readerWin.eval(readerJS.replace('{{index}}', currentItem.index));
}

// listner for done
window.addEventListener('message', e => {

    if (e.data.action === 'delete-reader-item') {
        e.source.close();
    }

    // delete some item when done
    this.delete(e.data.itemIndex);
})

// delete items
exports.delete = itemIndex => {
    // Remove item from DOM
    items.removeChild(items.childNodes[itemIndex])

    // Remove from storage
    this.storage.splice(itemIndex, 1)

    // Persist
    this.save()

    // Select previous item or new first item if first was deleted
    if (this.storage.length) {

        // Get new selected item index
        let newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

        // Set item at new index as selected
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

// Get selected item index
exports.getSelectedItem = () => {

    // Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Get item index
    let itemIndex = 0
    let child = currentItem
    while ((child = child.previousSibling) != null) itemIndex++

    // Return selected item and index
    return { node: currentItem, index: itemIndex }
}