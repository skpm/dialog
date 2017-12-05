/* let's try to match the API from Electron's Dialog
(https://github.com/electron/electron/blob/master/docs/api/dialog.md) */

module.exports = {
  showOpenDialog: require('./open-dialog'),
  showSaveDialog: require('./save-dialog'),
  showMessageBox: require('./message-box'),
  // showErrorBox: require('./error-box'),
}
