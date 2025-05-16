# MJSC README

MJSC is an extension that aims to introduce some readability to [ChatTriggers](https://chattriggers.com/) modules development, it adds a new command to the command palette called `Describe Mappings` which simply attempts to find obfuscated values that are inside of the mappings provided to this extension, if they are it adds a comment that has it's human readable name similar to `packet./* test */func_123()` to help with readability.

# Installing

To install this extension to your Visual Studio Code you need to download the `.vsix` file and run the `code --install-extension mjsc-1.1.4.vsix` command in a terminal.

# Building

If you are interested in building your own version of this extension you'd need to install the `vsce` package (`npm install -g @vscode/vsce`) and then run the `vsce package` command in terminal.<br>
If you simply want to test it you should be able to hit `F5`.

# Why not publish it

This is my first attempt to make an extension and i really could not be bothered to make an account simply to publish it.

# License
MJSC is licensed under the [AGPL 3.0 License](https://github.com/DocilElm/MJSC/blob/main/LICENSE)