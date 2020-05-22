// DOM nodes
let items = document.getElementById('items');

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

    if(isNew) {
        this.storage.push(item);
        this.save();
    }
}

// add items when app loads
this.storage.forEach(item => {
    this.addItem(item, false);
});