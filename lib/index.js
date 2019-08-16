/* let's try to match the API from Electron's Dialog
(https://github.com/electron/electron/blob/master/docs/api/dialog.md) */

module.exports = {
  showOpenDialog: require('./open-dialog').openDialog,
  showOpenDialogSync: require('./open-dialog').openDialogSync,
  showSaveDialog: require('./save-dialog').saveDialog,
  showSaveDialogSync: require('./save-dialog').saveDialogSync,
  showMessageBox: require('./message-box').messageBox,
  showMessageBoxSync: require('./message-box').messageBoxSync,
  // showErrorBox: require('./error-box'),
}
