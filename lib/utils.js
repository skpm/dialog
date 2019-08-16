module.exports.getURL = function getURL(path) {
  return NSURL.URLWithString(
    String(
      NSString.stringWithString(path).stringByExpandingTildeInPath()
    ).replace(/ /g, '%20')
  )
}

module.exports.runDialog = function runDialog(dialog, getResult, document) {
  if (!document) {
    var returnCode = dialog.runModal()
    return Promise.resolve(getResult(dialog, returnCode))
  }

  var fiber = coscript.createFiber()

  var window = (document.sketchObject || document).documentWindow()

  return new Promise(function p(resolve, reject) {
    dialog.beginSheetModalForWindow_completionHandler(
      window,
      __mocha__.createBlock_function('v16@?0q8', function onCompletion(
        _returnCode
      ) {
        try {
          resolve(getResult(dialog, _returnCode))
        } catch (err) {
          reject(err)
        }
        NSApp.endSheet(dialog)
        if (fiber) {
          fiber.cleanup()
        } else {
          coscript.shouldKeepAround = false
        }
      })
    )
  })
}

module.exports.runDialogSync = function runDialog(dialog, getResult, document) {
  var returnCode

  if (!document) {
    returnCode = dialog.runModal()
    return getResult(dialog, returnCode)
  }

  var window = (document.sketchObject || document).documentWindow()

  dialog.beginSheetModalForWindow_completionHandler(
    window,
    __mocha__.createBlock_function('v16@?0q8', function onCompletion(
      _returnCode
    ) {
      NSApp.stopModalWithCode(_returnCode)
    })
  )

  returnCode = NSApp.runModalForWindow(window)
  NSApp.endSheet(dialog)
  return getResult(dialog, returnCode)
}
