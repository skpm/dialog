/* globals NSOpenPanel, NSOKButton, NSURL */

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowopendialogbrowserwindow-options-callback
module.exports = function openDialog(document, options, callback) {
  if (!document || typeof document.class !== 'function') {
    callback = options
    options = document
    document = undefined
  }
  if (!options) {
    options = {}
  }

  var dialog = NSOpenPanel.openPanel()

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

  if (options.properties) {
    if (typeof options.properties.openFile !== 'undefined') {
      dialog.canChooseFiles = options.properties.openFile
    }
    if (typeof options.properties.openDirectory !== 'undefined') {
      dialog.canChooseDirectories = options.properties.openDirectory
    }
    if (typeof options.properties.multiSelections !== 'undefined') {
      dialog.allowsMultipleSelection = options.properties.multiSelections
    }
    if (typeof options.properties.showHiddenFiles !== 'undefined') {
      dialog.showsHiddenFiles = options.properties.showHiddenFiles
    }
    if (typeof options.properties.createDirectory !== 'undefined') {
      dialog.canCreateDirectories = options.properties.createDirectory
    }
    if (typeof options.properties.noResolveAliases !== 'undefined') {
      dialog.resolvesAliases = !options.properties.noResolveAliases
    }
    if (typeof options.properties.treatPackageAsDirectory !== 'undefined') {
      dialog.treatsFilePackagesAsDirectories =
        options.properties.treatPackageAsDirectory
    }
  }

  if (options.message) {
    dialog.message = options.message
  }

  // TODO: show as a sheet if document is present

  var buttonClicked = dialog.runModal()
  if (buttonClicked == NSOKButton) {
    var result = []
    var urls = dialog.URLs()
    for (var k = 0; k < urls.length; k += 1) {
      result.push(String(urls[k].path()))
    }

    if (callback) {
      callback(urls)
      return undefined
    }
    return urls
  }
  return []
}
