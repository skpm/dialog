/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var utils = require('./utils')

var typeMap = {
  none: 0,
  info: 1,
  error: 2,
  question: 1,
  warning: 2,
}

function setupOptions(document, options) {
  if (
    !document ||
    (typeof document.isKindOfClass !== 'function' && !document.sketchObject)
  ) {
    options = document
    document = undefined
  } else if (document.sketchObject) {
    document = document.sketchObject
  }
  if (!options) {
    options = {}
  }

  var dialog = NSAlert.alloc().init()

  if (options.type) {
    dialog.alertStyle = typeMap[options.type] || 0
  }

  if (options.buttons && options.buttons.length) {
    options.buttons.forEach(function addButton(button) {
      dialog.addButtonWithTitle(
        options.normalizeAccessKeys ? button.replace(/&/g, '') : button
      )
      // TODO: add keyboard shortcut if options.normalizeAccessKeys
    })
  }

  if (typeof options.defaultId !== 'undefined') {
    var buttons = dialog.buttons()
    if (options.defaultId < buttons.length) {
      // Focus the button at defaultId if the user opted to do so.
      // The first button added gets set as the default selected.
      // So remove that default, and make the requested button the default.
      buttons[0].setKeyEquivalent('')
      buttons[options.defaultId].setKeyEquivalent('\r')
    }
  }

  if (options.title) {
    // not shown on macOS
  }

  if (options.message) {
    dialog.messageText = options.message
  }

  if (options.detail) {
    dialog.informativeText = options.detail
  }

  if (options.checkboxLabel) {
    dialog.showsSuppressionButton = true
    dialog.suppressionButton().title = options.checkboxLabel

    if (typeof options.checkboxChecked !== 'undefined') {
      dialog.suppressionButton().state = options.checkboxChecked
        ? NSOnState
        : NSOffState
    }
  }

  if (options.icon) {
    if (typeof options.icon === 'string') {
      options.icon = NSImage.alloc().initWithContentsOfFile(options.icon)
    }
    dialog.icon = options.icon
  } else if (
    typeof __command !== 'undefined' &&
    __command.pluginBundle() &&
    __command.pluginBundle().icon()
  ) {
    dialog.icon = __command.pluginBundle().icon()
  } else {
    var icon = NSImage.imageNamed('plugins')
    if (icon) {
      dialog.icon = icon
    }
  }

  return {
    document: document,
    options: options,
    dialog: dialog,
  }
}

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowmessageboxbrowserwindow-options
module.exports.messageBox = function messageBox(document, options) {
  var setup = setupOptions(document, options)

  return utils.runDialog(
    setup.dialog,
    function getResult(_dialog, returnCode) {
      return {
        response:
          setup.options.buttons && setup.options.buttons.length
            ? Number(returnCode) - 1000
            : Number(returnCode),
        checkboxChecked: _dialog.suppressionButton().state() == NSOnState,
      }
    },
    setup.document
  )
}

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowmessageboxsyncbrowserwindow-options
module.exports.messageBoxSync = function messageBoxSync(document, options) {
  var setup = setupOptions(document, options)

  return utils.runDialogSync(
    setup.dialog,
    function getResult(_dialog, returnCode) {
      return setup.options.buttons && setup.options.buttons.length
        ? Number(returnCode) - 1000
        : Number(returnCode)
    },
    setup.document
  )
}
