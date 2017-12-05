var ObjCClass = require('cocoascript-class').default

module.exports = new ObjCClass({
  options: null,

  'alertDidEnd:returnCode:contextInfo:': function alertDidEnd(
    alert,
    returnCode,
    contextInfo
  ) {
    this.options.callback()
    this.options.alert.release()
    this.release()

    if (this.options.callEndModal) {
      NSApp.stopModal()
    }
  },
})
