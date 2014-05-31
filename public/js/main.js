//ddp = new MeteorDdp('ws://localhost:3000/websocket');
//deployed on ddpExam01.meteor.com
ddp = new MeteorDdp('http://localhost:3000/sockjs');

$().ready(function() {
  var connect = null;

  $('#connect').click(function(e) {
    e.preventDefault();
    connect = ddp.connect();
    connect.done(function(e) {
      console.log('Connected!', e);
    }).then(function() {
      /* form submit event binding on ddp connection */
      $('form').submit(function(e) {
        e.preventDefault();
        /* login */
        var login=ddp.call('login', [{user:{username:'spectrum'}, password:'spectrum'}]);

        login.done(function(user) {
          console.log('logged', user);
          var presences=ddp.subscribe('presences', [user]);
          presences.done(function() {
            console.log('subscribed presences');
            ddp.watch('presences', function(changeDoc, message) {
              console.log('watch', message, changeDoc);
            });
          });
        });
      });
    });
  });
});

