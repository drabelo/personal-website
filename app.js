var express = require('express');
var app = express();
var path = require('path');


app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/public/about.html'));
});

app.get('/sitemap',function(req,res){
  res.sendFile(path.join(__dirname+'/public/sitemap.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
