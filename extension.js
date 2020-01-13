var vscode = require('vscode');
var fs = require('fs');
var smilesOptions = [];
var data = require('./smilesData');
var array = data.split("\n");

function emojiFromString(emojiString) {
	outEmoji = "";

	emojiString.split(' ').forEach(function(emojiPoint) {
		outEmoji += String.fromCodePoint(parseInt(emojiPoint, 16));
	});

	return outEmoji;
}

for(i in array) {
	var emojiSplit = array[i].split('\t');
	console.log(emojiSplit);
	smilesOptions.push({
		label: emojiFromString(emojiSplit[0]),
		description: emojiSplit[1],
		unicode: emojiSplit[0]
	});
}

var pickOptions = {
	matchOnDescription: true,
	matchOnDetail: true,
	placeHolder: "Emoji"
}

function insertText(text) {
	var editor = vscode.window.activeTextEditor;
	editor.edit(function (editBuilder) {
		editBuilder.delete(editor.selection);
	}).then(function () {
		editor.edit(function (editBuilder) {
			editBuilder.insert(editor.selection.start, text);
		});
	});
}

function activate(context) {
	var insertEmoji = vscode.commands.registerTextEditorCommand('emoji.insertEmoji', function () {
		vscode.window.showQuickPick(smilesOptions, pickOptions).then(function(item) {
			insertText(item.label)
	  	});
	});

	var insertUnicode = vscode.commands.registerTextEditorCommand('emoji.insertUnicode', function () {
		vscode.window.showQuickPick(smilesOptions, pickOptions).then(function(item) {
			insertText('\\u' + item.unicode)
		});
	});

	context.subscriptions.push(insertEmoji);
	context.subscriptions.push(insertUnicode);
}

function deactivate() {
}

exports.activate = activate;
exports.deactivate = deactivate;