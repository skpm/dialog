declare module "@skpm/dialog" {
  namespace dialog {
    export type DialogType = "none" | "info" | "error" | "question" | "warning";

    // An array of file types that can be displayed or selected when you want to limit the user to a specific type.
    export interface FileFilter {
      name: string;
      /**
       * The extensions array should contain extensions without wildcards or dots (e.g. 'png' is good but '.png' and '*.png' are bad).
       */
      extensions: string[];
    }

    export type OpenDialogProperty =
      // Allow files to be selected.
      "openFile"
      // Allow directories to be selected.
      | "openDirectory"
      // Allow multiple paths to be selected.
      | "multiSelections"
      // Show hidden files in dialog.
      | "showHiddenFiles"
      // Allow creating new directories from dialog.
      | "createDirectory"
      // Disable the automatic alias (symlink) path resolution. Selected aliases will now return the alias path instead of their target path.
      | "noResolveAliases"
      // Treat packages, such as `.app` folders, as a directory instead of a file.
      | "treatPackageAsDirectory";

    // open diaglog
    export interface OpenDialogOptions {
      title?: string;
      defaultPath?: string;
      /** Custom label for the confirmation button, when left empty the default label will be used. */
      buttonLabel?: string;
      filters?: FileFilter[];
      /** Contains which features the dialog should use. */
      properties?: OpenDialogProperty[];
      /** Message to display above input boxes. */
      message?: string;
    }

    export interface SaveDialogOptions {
      title?: string;
      // Absolute directory path, absolute file path, or file name to use by default.
      defaultPath?: string;
      // Custom label for the confirmation button, when left empty the default label will be used.
      buttonLabel?: string;
      filters?: FileFilter[];
      // Message to display above text fields.
      message?: string;
      // Custom label for the text displayed in front of the filename text field.
      nameFieldLabel?: string;
      // Show the tags input box, defaults to true.
      showTagField?: boolean;
    }

    // message box
    export interface MessageBoxOptions {
      // Can be "none", "info", "error", "question" or "warning". Both "warning" and "error" display the same warning icon.
      type: DialogType;
      // Array of texts for buttons.
      buttons?: string[];
      // Index of the button in the buttons array which will be selected by default when the message box opens.
      defaultId?: number;
      // Title of the message box, some platforms will not show it.
      title?: string;
      // Content of the message box.
      message: string;
      // Extra information of the message.
      detail?: string;
      // If provided, the message box will include a checkbox with the given label.
      checkboxLabel?: string;
      // Initial checked state of the checkbox. `false` by default.
      checkboxChecked?: boolean;
      // path to the image (if you use `skpm`, you can just `require('./path/to/my/icon.png'))`
      icon: string;
    }

    export interface OpenDialogReturn {
      /** whether or not the dialog was canceled. */
      canceled: boolean;
      /** An array of file paths chosen by the user. If the dialog is cancelled this will be an empty array. */
      filePaths: string[];
    }

    export interface SaveDialogReturn {
      /** whether or not the dialog was canceled. */
      canceled: boolean;
      /** If the dialog is canceled, this will be undefined. */
      filePath: string | undefined;
    }

    /**
     * Shows a open dialog box, it will block the process until
     * the message box is closed.
     */
    export function showOpenDialogSync(
      document?: any,
      options?: OpenDialogOptions
    ): string[];

    /**
     * Shows a open dialog box
     */
    export function showOpenDialog(
      document?: any,
      options?: OpenDialogOptions
    ): Promise<OpenDialogReturn>;

    /**
     * Shows a save dialog box, it will block the process until
     * the message box is closed.
     * 
     * Return the path of the file chosen by the user.
     */
    export function showSaveDialogSync(
      document?: any,
      options?: SaveDialogOptions
    ): string;

    /**
     * Shows a save dialog box.
     */
    export function showSaveDialog(
      document?: any,
      options?: SaveDialogOptions
    ): Promise<SaveDialogReturn>;

    /**
     * Shows a message box, it will block the process until
     * the message box is closed.
     */
    export function showMessageBoxSync(
      document?: any,
      options?: MessageBoxOptions
    ): number;

    /**
     * Shows a message box
     */
    export function showMessageBox(
      document?: any,
      options?: MessageBoxOptions
    ): Promise<{
      response: number;
      checkboxChecked: boolean;
    }>;
  }

  export default dialog;
}
