var spawn = require('child_process').spawn;
var net = require('net');
var fs = require('fs');

var socket_file = "/tmp/mplayerserver.sock";

process.on('exit', function() {
  fs.unlinkSync(socket_file);
});

var mplayer = spawn('mplayer', ['-idle', '-slave']);

mplayer.stdout.on('data', function(data) {
    console.log(data.toString());
});

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  c.on('data', function(data) {
    console.log(data.toString());
    mplayer.stdin.write(data.toString()+"\n");
  });
});

server.listen(socket_file, function() { //'listening' listener
  console.log(socket_file+' socket open');
  fs.chmod(socket_file, "777");
});


console.log('mplayer child pid: ' + mplayer.pid);

