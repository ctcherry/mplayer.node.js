mplayer.node.js
===============

Runs mplayer in slave mode, which can accept text commands, and then connects its input to a Unix socket for remote control. It logs rather verbose messages and the output of the child mplayer process to STDOUT. Requires mplayer be installed. Tested under Linux and OSX.

Usage
-----

    node mplayer.node.js [socket_file]

`[socket_file]` is optional and by default is set to /tmp/mplayer.node.sock
