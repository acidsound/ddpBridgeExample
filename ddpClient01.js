Presences = new Meteor.Collection("presences");

if (Meteor.isClient) {
  Meteor.startup(function() {
    Deps.autorun(function() {
      Meteor.subscribe('presences');
    });
  });

  Template.hello.helpers({
    'users': function() {
      return Meteor.users.find();
    },
    'presences': function() {
      return Presences.find();
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Meteor.users.remove({});
    Presences.remove({});
//    Accounts.createUser({emails:'spectrick@gmail.com', password:'spectrum', username: 'spectrum'});
    Meteor.onConnection(function(e) {
      var id = e.id;
      console.log('connected', e);
      e.onClose(function() {
        console.log('closed', id);
      });
    });
  });
  Meteor.publish("presences", function (user) {
    var result = [];
    if (user) {
      console.log('publish presence for', user, this.userId);
    }
    if (this.userId) {
      result = Presences.find();
    }
    return result;
  });

}

Meteor.methods({
  'loginDDP': function(param) {
    console.log('login', param);
    Presences.upsert({presence: param}, {presence: param, created_at: Date.now()});
    return 'success';
  }
});

