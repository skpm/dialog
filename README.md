# Sketch dialogs

A Sketch module for displaying native system dialogs for opening and saving
files, alerting, etc. The API is the mimicking the [Electron dialog API](https://github.com/electron/electron/blob/master/docs/api/dialog.md).

## Installation

To use this module in your Sketch plugin you need a bundler utility like
[skpm](https://github.com/skpm/skpm) and add it as a dependency:

```bash
npm i -S @skpm/dialog
```

## Usage

An example of showing a dialog to select multiple files and directories:

```javascript
import dialog from '@skpm/dialog'
console.log(
  dialog.showOpenDialogSync({
    properties: ['openFile', 'openDirectory', 'multiSelections']
  })
)
```

## Methods

The `dialog` module has the following methods:

* `showOpenDialog`
* `showOpenDialogSync`
* `showSaveDialog`
* `showSaveDialogSync`
* `showMessageBox`
* `showMessageBoxSync`

### `dialog.showOpenDialogSync([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `title` String (optional)
  * `defaultPath` String (optional)
  * `buttonLabel` String (optional) - Custom label for the confirmation button,
    when left empty the default label will be used.
  * `filters` FileFilter\[] (optional)
  * `properties` String\[] (optional) - Contains which features the dialog should
    use. The following values are supported:
    * `openFile` - Allow files to be selected.
    * `openDirectory` - Allow directories to be selected.
    * `multiSelections` - Allow multiple paths to be selected.
    * `showHiddenFiles` - Show hidden files in dialog.
    * `createDirectory` - Allow creating new directories from dialog.
    * `noResolveAliases` - Disable the automatic alias (symlink) path
      resolution. Selected aliases will now return the alias path instead of
      their target path.
    * `treatPackageAsDirectory` - Treat packages, such as `.app` folders, as a
      directory instead of a file.
  * `message` String (optional) - Message to display above input boxes.

Returns `String[]`, an array of file paths chosen by the user, if the callback
is provided it returns an empty array.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

The `filters` specifies an array of file types that can be displayed or selected
when you want to limit the user to a specific type. For example:

```javascript
{
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] }
  ]
}
```

The `extensions` array should contain extensions without wildcards or dots (e.g.
`'png'` is good but `'.png'` and `'*.png'` are bad).

### `dialog.showOpenDialog([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `title` String (optional)
  * `defaultPath` String (optional)
  * `buttonLabel` String (optional) - Custom label for the confirmation button,
    when left empty the default label will be used.
  * `filters` FileFilter\[] (optional)
  * `properties` String\[] (optional) - Contains which features the dialog should
    use. The following values are supported:
    * `openFile` - Allow files to be selected.
    * `openDirectory` - Allow directories to be selected.
    * `multiSelections` - Allow multiple paths to be selected.
    * `showHiddenFiles` - Show hidden files in dialog.
    * `createDirectory` - Allow creating new directories from dialog.
    * `noResolveAliases` - Disable the automatic alias (symlink) path
      resolution. Selected aliases will now return the alias path instead of
      their target path.
    * `treatPackageAsDirectory` - Treat packages, such as `.app` folders, as a
      directory instead of a file.
  * `message` String (optional) - Message to display above input boxes.

Returns `Promise<Object>` - Resolve with an object containing the following:

* `canceled` Boolean - whether or not the dialog was canceled.
* `filePaths` String[] - An array of file paths chosen by the user. If the dialog is cancelled this will be an empty array.

Returns `String[]`, an array of file paths chosen by the user, if the callback
is provided it returns `undefined`.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

The `filters` specifies an array of file types that can be displayed or selected
when you want to limit the user to a specific type. For example:

```javascript
{
  filters: [
    { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
    { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
    { name: 'Custom File Type', extensions: ['as'] }
  ]
}
```

The `extensions` array should contain extensions without wildcards or dots (e.g.
`'png'` is good but `'.png'` and `'*.png'` are bad).

### `dialog.showSaveDialogSync([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `title` String (optional)
  * `defaultPath` String (optional) - Absolute directory path, absolute file
    path, or file name to use by default.
  * `buttonLabel` String (optional) - Custom label for the confirmation button,
    when left empty the default label will be used.
  * `filters` FileFilter\[] (optional)
  * `message` String (optional) - Message to display above text fields.
  * `nameFieldLabel` String (optional) - Custom label for the text displayed in
    front of the filename text field.
  * `showsTagField` Boolean (optional) - Show the tags input box, defaults to
    `true`.

Returns `String`, the path of the file chosen by the user, if a callback is
provided it returns `undefined`.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

The `filters` specifies an array of file types that can be displayed, see
`dialog.showOpenDialog` for an example.

### `dialog.showSaveDialog([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `title` String (optional)
  * `defaultPath` String (optional) - Absolute directory path, absolute file
    path, or file name to use by default.
  * `buttonLabel` String (optional) - Custom label for the confirmation button,
    when left empty the default label will be used.
  * `filters` FileFilter\[] (optional)
  * `message` String (optional) - Message to display above text fields.
  * `nameFieldLabel` String (optional) - Custom label for the text displayed in
    front of the filename text field.
  * `showsTagField` Boolean (optional) - Show the tags input box, defaults to
    `true`.

Returns `Promise<Object>` - Resolve with an object containing the following:

* `canceled` Boolean - whether or not the dialog was canceled.
* `filePath` String (optional) - If the dialog is canceled, this will be undefined.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

The `filters` specifies an array of file types that can be displayed, see
`dialog.showOpenDialog` for an example.

_Note_: Using the asynchronous version is recommended to avoid issues when expanding and collapsing the dialog.

### `dialog.showMessageBox([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `type` String (optional) - Can be `"none"`, `"info"`, `"error"`,
    `"question"` or `"warning"`. Both `"warning"` and `"error"` display the same
    warning icon.
  * `buttons` String\[] (optional) - Array of texts for buttons.
  * `defaultId` Integer (optional) - Index of the button in the buttons array
    which will be selected by default when the message box opens.
  * `title` String (optional) - Title of the message box, some platforms will
    not show it.
  * `message` String - Content of the message box.
  * `detail` String (optional) - Extra information of the message.
  * `checkboxLabel` String (optional) - If provided, the message box will
    include a checkbox with the given label.
  * `checkboxChecked` Boolean (optional) - Initial checked state of the
    checkbox. `false` by default.
  * `icon` String (optional) - path to the image (if you use `skpm`, you can
    just `require('./path/to/my/icon.png')`)

Returns `Integer` - the index of the clicked button.

Shows a message box, it will block the process until the message box is closed.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

### `dialog.showMessageBoxSync([document, ]options)`

* `document` Document (optional)
* `options` Object
  * `type` String (optional) - Can be `"none"`, `"info"`, `"error"`,
    `"question"` or `"warning"`. Both `"warning"` and `"error"` display the same
    warning icon.
  * `buttons` String\[] (optional) - Array of texts for buttons.
  * `defaultId` Integer (optional) - Index of the button in the buttons array
    which will be selected by default when the message box opens.
  * `title` String (optional) - Title of the message box, some platforms will
    not show it.
  * `message` String - Content of the message box.
  * `detail` String (optional) - Extra information of the message.
  * `checkboxLabel` String (optional) - If provided, the message box will
    include a checkbox with the given label.
  * `checkboxChecked` Boolean (optional) - Initial checked state of the
    checkbox. `false` by default.
  * `icon` String (optional) - path to the image (if you use `skpm`, you can
    just `require('./path/to/my/icon.png')`)

Returns `Promise<Object>` - resolves with a promise containing the following properties:

* `response` Number - The index of the clicked button.
* `checkboxChecked` Boolean - The checked state of the checkbox if checkboxLabel was set. Otherwise false.

Shows a message box, it will block the process until the message box is closed.

The `document` argument allows the dialog to attach itself to a Sketch document
window, making it a sheet.

## Sheets

Dialogs are presented as sheets attached to a window if you provide a `document`
reference in the `document` parameter, or modals if no document is provided.
