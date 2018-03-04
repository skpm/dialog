/* eslint-disable no-not-accumulator-reassign/no-not-accumulator-reassign */
var RunDelegate = require('./run-delegate')

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
    options.filters.forEach(function setFilter(filter) {
      filter.extensions.forEach(function setExtension(ext) {
        exts.push(ext)
      })
    })

    dialog.allowedFileTypes = exts
  }

  if (options.properties && options.properties.length) {
    options.properties.forEach(function setProperty(p) {
      if (p === 'openFile') {
        dialog.canChooseFiles = true
      } else if (p === 'openDirectory') {
        dialog.canChooseDirectories = true
      } else if (p === 'multiSelections') {
        dialog.allowsMultipleSelection = true
      } else if (p === 'showHiddenFiles') {
        dialog.showsHiddenFiles = true
      } else if (p === 'createDirectory') {
        dialog.createDirectory = true
      } else if (p === 'noResolveAliases') {
        dialog.resolvesAliases = false
      } else if (p === 'treatPackageAsDirectory') {
        dialog.treatsFilePackagesAsDirectories = true
      }
    })
  }

  if (options.message) {
    dialog.message = options.message
  }

  var buttonClicked

  function getURLs() {
    var result = []
    var urls = dialog.URLs()
    for (var k = 0; k < urls.length; k += 1) {
      result.push(String(urls[k].path()))
    }

    return result
  }

  if (!document) {
    buttonClicked = dialog.runModal()
    if (buttonClicked == NSOKButton) {
      if (callback) {
        callback(getURLs())
        return undefined
      }
      return getURLs()
    }

    return []
  }

  var nsButtonClass = NSButton.class()

  function findButtonWithTitleInView(title, view) {
    if (!view || !view.subviews || !view.subviews()) {
      return undefined
    }
    var subviews = view.subviews()
    for (var i = 0; i < subviews.length; i += 1) {
      var subview = subviews[i]
      if (
        subview.isKindOfClass(nsButtonClass) &&
        String(subview.title()) == title
      ) {
        return subview
      }
      var foundButton = findButtonWithTitleInView(title, subview)
      if (foundButton) {
        return foundButton
      }
    }
    return undefined
  }

  var cancelButton = findButtonWithTitleInView('Cancel', dialog.contentView())
  var okButton = findButtonWithTitleInView(
    options.buttonLabel || 'Open',
    dialog.contentView()
  )

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
        callback(returnCode == 0 ? getURLs() : undefined)
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
      return getURLs()
    }
    return undefined
  }

  return undefined
}
