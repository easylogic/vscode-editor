"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyLogicStudioProvider = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
/**
 * Provider for easylogic studio
 *
 *
 *
 * Cat easylogic studio editors are used for `.els` files, which are just json files.
 * To get started, run this extension and open an empty `.els` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
class EasyLogicStudioProvider {
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new EasyLogicStudioProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(EasyLogicStudioProvider.viewType, provider);
        return providerRegistration;
    }
    /**
     * Called when our custom editor is opened.
     *
     *
     */
    async resolveCustomTextEditor(document, webviewPanel, _token) {
        // Setup initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
        function updateWebview() {
            console.log("update");
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        }
        // Hook up event handlers so that we can synchronize the webview with the text document.
        //
        // The text document acts as our model, so we have to sync change in the document to our
        // editor and sync changes in the editor back to the document.
        // 
        // Remember that a single text document can also be shared between multiple custom
        // editors (this happens for example when you split a custom editor)
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            console.log(e.document.uri.toString(), document.uri.toString())
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview();
            }
        });
        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
        // Receive message from the webview.
        webviewPanel.webview.onDidReceiveMessage(e => {
            console.log("웹뷰에서 메세지 보내서 실행하기", e);
            // switch (e.type) {
            // 	case 'add':
            // 		this.addNewEasyLogic(document);
            // 		return;
            // 	case 'delete':
            // 		this.deleteEasyLogic(document, e.id);
            // 		return;
            // }
        });
        updateWebview();
    }
    /**
     * Get the static html used for the editor webviews.
     */
    getHtmlForWebview(webview) {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'editor.js'));
        const startScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'start.js'));
        const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'editor.css'));
        // Use a nonce to whitelist which scripts can be run
        const nonce = util_1.getNonce();
        return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource} 'self' 'unsafe-inline' 'unsafe-eval'; script-src 'nonce-${nonce}' 'self' 'unsafe-inline' 'unsafe-eval';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleMainUri}" rel="stylesheet" />

				<title>EasyLogic</title>
			</head>
			<body>
				<div id="app">
				</div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}" src="${startScriptUri}"></script>				
			</body>
			</html>`;
    }
    /**
     * Add a new scratch to the current document.
     */
    addNewEasyLogic(document) {
        const json = this.getDocumentAsJson(document);
        return this.updateTextDocument(document, json);
    }
    /**
     * Delete an existing scratch from a document.
     */
    deleteEasyLogic(document, id) {
        const json = this.getDocumentAsJson(document);
        if (!Array.isArray(json.scratches)) {
            return;
        }
        // json.scratches = json.scratches.filter((note: any) => note.id !== id);
        return this.updateTextDocument(document, json);
    }
    /**
     * Try to get a current document as json text.
     */
    getDocumentAsJson(document) {
        const text = document.getText();
        if (text.trim().length === 0) {
            return {};
        }
        try {
            return JSON.parse(text);
        }
        catch {
            throw new Error('Could not get document as json. Content is not valid json');
        }
    }
    /**
     * Write out the json to a given document.
     */
    updateTextDocument(document, json) {
        const edit = new vscode.WorkspaceEdit();
        // Just replace the entire document every time for this example extension.
        // A more complete extension should compute minimal edits instead.
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(json, null, 2));
        return vscode.workspace.applyEdit(edit);
    }
}
exports.EasyLogicStudioProvider = EasyLogicStudioProvider;
EasyLogicStudioProvider.viewType = 'easylogic.studio';
//# sourceMappingURL=EasyLogicStudio.js.map