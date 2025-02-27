const vscode = require("vscode")
const obfregex = /(?:field_|func_|p_)\w+/g
const obfValues = require("./mappings.json")

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
	const disposable = vscode.commands.registerCommand("mjsc.describemappings", () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) return

		const document = editor.document

		editor.edit((builder) => {
			for (let idx = 0; idx < document.lineCount; idx++) {
				let text = document.lineAt(idx)?.text
				if (!text) continue

				const matches = [...text.matchAll(obfregex)]
				if (matches.length === 0) continue

				matches.forEach((match) => {
					let name = match[0]
					if (!(name in obfValues)) return

					let line = new vscode.Position(idx, match.index)

					builder.insert(line, `/* ${obfValues[name]} */`)
				})
			}
		}).then((success) => {
			if (!success) return vscode.window.showErrorMessage("[MJSC] Failed to add description to the obfuscated fields/methods")

			vscode.window.showInformationMessage("[MJSC] Added description to the obfuscated fields/methods")
		})
	})

	context.subscriptions.push(disposable)
}

const deactivate = () => {}

module.exports = {
	activate,
	deactivate
}
