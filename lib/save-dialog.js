/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var RunDelegate = require('./run-delegate')
var utils = require('./utils')

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

  var buttonClicked
  var url

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

  if (!document) {
    buttonClicked = dialog.runModal()
    if (buttonClicked == NSOKButton) {
      url = String(dialog.URL().path())

      if (callback) {
        callback(url)
        return undefined
      }
      return url
    }
    return undefined
  }

  var cancelButton = dialog.valueForKey('_cancelButton')
  var okButton = dialog.valueForKey('_okButton')

  var delegate = RunDelegate.new()

  cancelButton.setTarget(delegate)
  cancelButton.setAction(NSSelectorFromString('button1Clicked:'))
  okButton.setTarget(delegate)
  okButton.setAction(NSSelectorFromString('button0Clicked:'))

  var fiber
  if (callback) {
    if (coscript.createFiber) {
      fiber = coscript.createFiber()
    } else {
      coscript.shouldKeepAround = true
    }
  }

  delegate.options = NSDictionary.dictionaryWithDictionary({
    onClicked: function handleEnd(returnCode) {
      if (callback) {
        callback(returnCode == 0 ? String(dialog.URL().path()) : undefined)
        NSApp.endSheet(dialog)
        if (fiber) {
          fiber.cleanup()
        } else {
          coscript.shouldKeepAround = false
        }
      } else {
        NSApp.stopModalWithCode(returnCode)
      }
    },
  })

  var window = (document.sketchObject || document).documentWindow()
  dialog.beginSheetForDirectory_file_modalForWindow_modalDelegate_didEndSelector_contextInfo(
    null,
    null,
    window,
    null,
    null,
    null
  )

  if (!callback) {
    buttonClicked = NSApp.runModalForWindow(window)
    NSApp.endSheet(dialog)
    if (buttonClicked == 0) {
      return String(dialog.URL().path())
    }
    return undefined
  }

  return undefined
}
