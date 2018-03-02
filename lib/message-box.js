/* globals NSAlert, NSImage, NSOnState, NSOffState, NSApp, NSSelectorFromString, NSDictionary */
var RunDelegate = require('./run-delegate')

// https://github.com/electron/electron/blob/master/docs/api/dialog.md#dialogshowmessageboxbrowserwindow-options-callback
var typeMap = {
  none: 0,
  info: 1,
  error: 2,
  question: 1,
  warning: 2,
}
module.exports = function messageBox(document, options, callback) {
  if (
    !document ||
    (typeof document.class !== 'function' && !document.sketchObject)
  ) {
    callback = options
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
    options.buttons.forEach(function(button) {
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
  }

  if (!document) {
    var response = dialog.runModal()
    if (callback) {
      var checkboxChecked = false
      if (options.checkboxLabel) {
        checkboxChecked = dialog.suppressionButton().state() == NSOnState
      }
      callback({
        response: response,
        checkboxChecked: checkboxChecked,
      })
      return undefined
    }
    return response
  }

  var checkboxChecked

  var delegate = RunDelegate.new()
  delegate.options = NSDictionary.dictionaryWithDictionary({
    alert: dialog,
    callback() {
      checkboxChecked = dialog.suppressionButton().state() == NSOnState
    },
    callEndModal: true,
  })

  var window = document.documentWindow()
  dialog.beginSheetModalForWindow_modalDelegate_didEndSelector_contextInfo(
    window,
    delegate,
    NSSelectorFromString('alertDidEnd:returnCode:contextInfo:'),
    null
  )

  var response = Number(NSApp.runModalForWindow(window)) - 1000

  if (callback) {
    if (!options.checkboxLabel) {
      checkboxChecked = false
    }
    callback({
      response: response,
      checkboxChecked: checkboxChecked,
    })
    return undefined
  }
  return response
}
