import * as vscode from 'vscode';
import { EasyLogicStudioProvider } from './EasyLogicStudio';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(EasyLogicStudioProvider.register(context));
}
