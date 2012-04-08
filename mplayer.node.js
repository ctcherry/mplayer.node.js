var spawn = require('child_process').spawn;
var net = require('net');
var fs = require('fs');

var socket_file = "/tmp/mplayerserver.sock";

if (process.argv[2]) {
  socket_file = process.argv[2];
}

var log_file = "/tmp/mplayerserver.log";

process.on('exit', function() {
  fs.unlinkSync(socket_file);
});

var mplayer;

var load_mplayer = function() {
  log('server', 'Spawning mplayer...');
  mplayer = spawn('mplayer', ['-idle', '-slave']);
  log('server', 'mplayer child pid: ' + mplayer.pid);
  mplayer.stdout.on('data', function(data) {
    log('mplayer', data.toString());
  });

  mplayer.on('exit', load_mplayer);
}

var logstream = fs.createWriteStream(log_file, {'flags': 'a'});

function timestamp() {
  var d = new Date();
  return ''+d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '.' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
}

function log(tag, str) {
  str = str.replace(/^\s+|\s+$/g,'');
  if (str == "") { return; }
  var messages = str.split(/(\r?\n)+/);
  var t = timestamp();
  for (i in messages) {
    var message = messages[i].replace(/^\s+|\s+$/g,'');
    var l = timestamp() +': ['+tag+'] ' + message;
    logstream.write(l+"\n");
    console.log(l);
  }
}

log('server', 'Starting');

load_mplayer();

var server = net.createServer(function(c) { //'connection' listener
  log('server', 'client connected');
  c.on('end', function() {
    log('server', 'client disconnected');
  });
  c.on('data', function(data) {
    var m = data.toString();
    log('client', m);
    log('server', "Sending command to mplayer: '"+m+"\\n'");
    mplayer.stdin.write(m+"\n");
  });
});

server.listen(socket_file, function() { //'listening' listener
  log('server', "Socket Open: " + socket_file);
  fs.chmod(socket_file, "777");
});
