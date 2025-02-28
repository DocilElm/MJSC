const vscode = require("vscode")
const obfregex = /(?<!\/\/|\/\* |\*\/)(?:field_|func_|p_)\w+/g
const obfValues = require("./mappings.json")
const commentRegex = /((?<!")\/\/)/

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

					// Fix adding comments inside of quotes
					const jdx = text[match.index - 1] === "\"" ? match.index - 1 : match.index
					// I'm lazy so hopefully this fixes it all
					const comment = text.match(commentRegex)?.index
					if (comment !== null && comment < jdx) return

					let line = new vscode.Position(idx, jdx)

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
