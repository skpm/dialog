/* globals NSSaveDialog, NSOKButton */

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowsavedialogbrowserwindow-options-callback
module.exports = function saveDialog(document, options, callback) {
  if (!document || typeof document.class !== 'function') {
    callback = options
    options = document
    document = undefined
  }
  if (!options) {
    options = {}
  }

  var dialog = NSSaveDialog.saveDialog()

  if (options.title) {
    dialog.title = options.title
  }

  if (options.defaultPath) {
    dialog.directoryURL = NSURL.URLWithString(options.defaultPath)
  }

  if (options.buttonLabel) {
    dialog.prompt = options.buttonLabel
  }

  if (options.filters && options.filters.length) {
    var exts = []
    options.filters.forEach(function(filter) {
      filter.extensions.forEach(function(ext) {
        exts.push(ext)
      })
    })

    dialog.allowedFileTypes = exts
  }

  if (options.message) {
    dialog.message = options.message
  }

  if (options.nameFieldLabel) {
    dialog.nameFieldLabel = options.nameFieldLabel
  }

  if (options.showsTagField) {
    dialog.showsTagField = options.showsTagField
  }

  // TODO: show as a sheet if document is present

  var buttonClicked = dialog.runModal()
  if (buttonClicked == NSOKButton) {
    var url = dialog.URL().path()

    if (callback) {
      callback(url)
      return undefined
    }
    return url
  }
  return undefined
}
