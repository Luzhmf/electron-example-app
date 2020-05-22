const { BrowserWindow } = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false
        }
    })

    offscreenWindow.loadURL(url);
    
    offscreenWindow.webContents.on('did-finish-load', e => {
        // get page title
        let title = offscreenWindow.getTitle();

        // get screeshot
        offscreenWindow.webContents.capturePage( image => {
            // get image
            let screenshot = image.toDataURL()

            //execute callback
            callback({ title, screenshot, url });

            // clean up
            offscreenWindow.close();
            offscreenWindow = null;
        })
    })
}

