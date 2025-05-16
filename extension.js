const vscode = require("vscode")
const obfregex = /(?<!\/\/|\/\* |\*\/\"?)(?:field_|func_|p_)\w+/g
const obfValues = require("./mappings.json")
const commentRegex = /((?<!")\/\/)/

/**
 * @param {vscode.ExtensionContext} context
 */
const activate = (context) => {
	const disposable = vscode.commands.registerCommand("mjsc.describemappings", async () => {
		const editor = vscode.window.activeTextEditor
		if (!editor) return

		const document = editor.document

		const res = await editor.edit((builder) => {
			let inMultiLine = false

			for (let idx = 0; idx < document.lineCount; idx++) {
				let text = document.lineAt(idx)?.text
				if (!text) continue
				if (/^\/\*/.test(text)) inMultiLine = true
				if (/^\*\//.test(text)) inMultiLine = false
				if (inMultiLine) continue

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
		})

		if (!res) return vscode.window.showErrorMessage("[MJSC] Failed to add description to the obfuscated fields/methods")

		vscode.window.showInformationMessage("[MJSC] Added description to the obfuscated fields/methods")
	})

	context.subscriptions.push(disposable)
}

const deactivate = () => {}

module.exports = {
	activate,
	deactivate
}
