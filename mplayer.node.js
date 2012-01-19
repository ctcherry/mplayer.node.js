var spawn = require('child_process').spawn;
var net = require('net');
var fs = require('fs');

var socket_file = "/tmp/mplayer.node.sock";

if (process.argv[2]) {
  socket_file = process.argv[2];
}

var mplayer = spawn('mplayer', ['-idle', '-slave']);

mplayer.stdout.on('data', function(data) {
    console.log(data.toString());
});

process.on('exit', function() {
  console.log('- Shutting down');
  console.log('- Stopping MPlayer');
  mplayer.kill('SIGINT');
  console.log('- Cleaning up socket');
  fs.unlinkSync(socket_file);
});

process.on('SIGINT', process.exit);

var server = net.createServer(function(c) {
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  c.on('data', function(data) {
    console.log(data.toString());
    mplayer.stdin.write(data.toString()+"\n");
  });
});

server.listen(socket_file, function() {
  console.log("- Unix Socket open at: "+socket_file);
  fs.chmod(socket_file, "777");
});


console.log('- Mplayer child pid: ' + mplayer.pid);

