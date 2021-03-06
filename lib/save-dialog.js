/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var utils = require('./utils')

function setupOptions(document, options) {
  if (
    !document ||
    (typeof document.isKindOfClass !== 'function' && !document.sketchObject)
  ) {
    options = document
    document = undefined
  }
  if (!options) {
    options = {}
  }

  var dialog = NSSavePanel.savePanel()

  if (options.title) {
    dialog.title = options.title
  }

  if (options.defaultPath) {
    // that's a path
    dialog.setDirectoryURL(utils.getURL(options.defaultPath))

    if (
      options.defaultPath[0] === '.' ||
      options.defaultPath[0] === '~' ||
      options.defaultPath[0] === '/'
    ) {
      var parts = options.defaultPath.split('/')
      if (parts.length > 1 && parts[parts.length - 1]) {
        dialog.setNameFieldStringValue(parts[parts.length - 1])
      }
    } else {
      dialog.setNameFieldStringValue(options.defaultPath)
    }
  }

  if (options.buttonLabel) {
    dialog.prompt = options.buttonLabel
  }

  if (options.filters && options.filters.length) {
    var exts = []
    options.filters.forEach(function setFilter(filter) {
      filter.extensions.forEach(function setExtension(ext) {
        exts.push(ext)
      })
    })

    if (dialog.allowedContentTypes) {
      // Big Sur and newer.
      dialog.allowedContentTypes = exts.map((ext) => UTType.typeWithFilenameExtension(ext))
    } else {
      // Catalina and older.
      dialog.allowedFileTypes = exts
    }
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

  return {
    document: document,
    options: options,
    dialog: dialog,
  }
}

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowsavedialogbrowserwindow-options
module.exports.saveDialog = function saveDialog(document, options) {
  var setup = setupOptions(document, options)

  return utils.runDialog(
    setup.dialog,
    function getResult(_dialog, returnCode) {
      return {
        canceled: returnCode != NSOKButton,
        filePath:
          returnCode == NSOKButton ? String(_dialog.URL().path()) : undefined,
      }
    },
    setup.document
  )
}

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowsavedialogsyncbrowserwindow-options
module.exports.saveDialogSync = function saveDialogSync(document, options) {
  var setup = setupOptions(document, options)

  return utils.runDialogSync(
    setup.dialog,
    function getResult(_dialog, returnCode) {
      return returnCode == NSOKButton ? String(_dialog.URL().path()) : undefined
    },
    setup.document
  )
}
