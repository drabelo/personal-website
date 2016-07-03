// Include our packages in our main server file
var express = require('express');
app = express();


var port = 3000;

app.listen(port);



app.use(express.static(__dirname + '/public/'));




// // Home route. We'll end up changing this to our main front end index later.
// app.get('/', function(req, res) {
//     res.sendfile(__dirname + 'index.html');
// })
//


console.log('Your server is running on port ' + port + '.');
