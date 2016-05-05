var fs = require('fs');

function User(name, email) {
  this.name = name;
  this.email = email;
}

User.prototype.save = function(callback) {
  var user = this.name + ',' + this.email + ';';
  fs.exists('.list', function(ext) {
    if(ext) {
      fs.readFile('.list', 'utf-8', function(err, data) {
        if(err) callback(err);
        else saveList(data + user, callback);
      });
    } else {
      saveList(user, callback);
    }
  });
};

User.list = function(callback) {
  var list = [];
  fs.exists('.list', function(ext) {
    if(ext) {
      fs.readFile('.list', 'utf-8', function(err, data) {
        if(err) {
          callback(list);
        } else {
          var preList = data.split(';');
          preList.forEach(function(item) {
            var arr = item.split(',');
            if(arr.length == 2) {
              list.push({
                name: arr[0],
                email: arr[1]
              });
            }
          });
          callback(list);
        }
      });
    } else {
      callback(list);
    }
  })
};

function saveList(list, callback) {
  fs.writeFile('.list', list, function(err) {
    callback(err);
  });
}

module.exports = User;