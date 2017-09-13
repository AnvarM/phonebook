var express = require('express');
var basicAuth = require('basic-auth');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('phonebook', ['phonebook']);
var bodyParser = require('body-parser'); 

var auth = function (req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
    return;
  }
  if (user.name === 'admin' && user.pass === 'password') {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    res.sendStatus(401);
    return;
  }
}


app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/contactlist', function(req, res){
	console.log("I received GET request!")
	db.phonebook.find(function(err, docs){ 
		res.json(docs); 
	})
});


app.get('/phonebook', function(req,res){
	res.render('app'); 
})

app.get('/admin', auth, function(req,res){
	res.render('admin'); 
})


app.post('/contactlist', function(req, res){
	console.log(req.body);
	db.phonebook.insert(req.body, function(err, docs){
		res.json(docs);
	});
});

app.delete('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.phonebook.remove({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

app.get('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log(id);
	db.phonebook.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});


app.put('/contactlist/:id', function(req, res){
	var id = req.params.id;
	console.log(req.body.name);
	db.phonebook.findAndModify({query: {_id: mongojs.ObjectId(id)}, 
		update: {$set: {Ext: req.body.Ext, Mob: req.body.Mob, name: req.body.name, location: req.body.location, department: req.body.department}},
		new: true}, function(err, doc){
			res.json(doc);
		});
});

app.listen(3000);
console.log('Server is running on port 3000')