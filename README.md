# EasyLogic Studio VS Code Extension


## Features

-   Edit `.els` file in the EasyLogic Studio.
-   To create a new design, simply create an empty `*.els` file and open it.


## VS Code API

### `vscode` module

- [`window.registerCustomEditorProvider`](https://code.visualstudio.com/api/references/vscode-api#window.registerCustomEditorProvider)
- [`CustomTextEditor`](https://code.visualstudio.com/api/references/vscode-api#CustomTextEditor)
- [`CustomEditor`](https://code.visualstudio.com/api/references/vscode-api#CustomEditor)

## Running the example

- Open this example in VS Code 1.46+
- `npm install`
- `npm run watch` or `npm run compile`
- `F5` to start debugging

Open the example files from the `exampleFiles` directory.


## Update easylogic studio code 

```sh
git clone https://github.com/easylogic/editor 
cp -R ./editor/vscode/* ./media/
```