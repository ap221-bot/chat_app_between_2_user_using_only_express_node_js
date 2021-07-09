const path = require('path');
var all=[];
var a1=[];
const http = require('http');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const pg = require('pg');
const events = require('events');
var em = new events.EventEmitter();
const tools= require("./tools.js");
const ejs = require('ejs');
const url = require('url');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
//Create connection
const conn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'invoice'
});

//connect to database
conn.connect((err) => {
if (err) throw err;
console.log('Mysql Connected...');
});

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'));
em.on('msg', function (from,to) {
    //console.log('From user ' + data);
    var html=[{}];
    
    conn.query("SELECT * from chat",(err, results)=>{
        if (err) throw err;
        else{
       fn(results);}
    });
    function fn(results){
        html = results
        console.log("1");
        console.log(html); //here html has query reusutls
        console.log("2");
        $("#myTable").append($('<tr> <td>' +'User ' + ':' +'</td> <td>' + 'msg' + '</td> </tr>'));
        //console.log("executed");
        $('#123').text('123');
    }
    console.log("3"); //here html value is null(executed first)
    console.log(html);
    console.log("4");
    /*$('#myTable').html(html);
    html='<tr><td>'+'from'+'</td><td>'+'New Message is here'+'</td></tr>';
    html=$('#myTable').html();*/
    /*var x = tools.add(4,2) ;
    var y = tools.subtract(4,2);
    console.log(x);
    console.log(y);*/
});
var x = tools.add(4,2) ;
var y = tools.subtract(4,2);
console.log(x);
console.log(y);
/*
app.js

const tools= require("./tools.js")


var x = tools.add(4,2) ;

var y = tools.subtract(4,2);


console.log(x);
console.log(y);
tools.js

 const add = function(x, y){
        return x+y;
    }
 const subtract = function(x, y){
            return x-y;
    }
    
    module.exports ={
        add,subtract
    }
output

6
2
 */
app.post('/save',(req, res) =>{
    em.emit('msg', req.body.from_user, req.body.to_user);
    //console.log("hi");
    //console.log(rrr);
    /*var rrr =  0;
    let sql1 = "SELECT msg from chat WHERE from_user = "+to;
    let query1 = conn.query(sql1,(err, results)=>{
        if (err) throw err;
        //console.log("first");
        //console.log(results);
    });*/
    var now = new Date();
    var jsonDate = now.toJSON();
    var then = new Date(jsonDate);
    let data = { from_user: req.body.from_user, to_user: req.body.to_user , msg: req.body.msg ,date: then};
    let sql = "INSERT INTO chat SET ?";
    //console.log(rrr);
    let query = conn.query(sql, data, (err, results1) => {
        if (err) throw err;
        //console.log(to)
        let sql1 = "SELECT msg from chat WHERE from_user = "+req.body.to_user;
        let query1 = conn.query(sql1,(err, results)=>{
        if (err) throw err;
        //console.log("first");
        //console.log(results);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"response": results}));
        });
        
    });
});

app.post("/ds",(req,res)=>{
    let sql1 = "SELECT msg from chat WHERE from_user = "+req.body.to_user;
        let query1 = conn.query(sql1,(err, results)=>{
        if (err) throw err;
        //console.log("first");
        //console.log(results);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({"response": results}));
        });
});
var from=0;
var to = 0;
app.post('/h_save',(req, res) =>{
    //console.log("home_save");
    from = req.body.from_user;
    if(from == 1){
        to = 2;
    }
    else
    {
        to=1;
    }
    var rlt;
    let sql1 = "SELECT * from chat WHERE from_user = "+to;
        let query1 = conn.query(sql1,(err, results)=>{
        if (err) throw err;
        res.render('product_view.hbs', {
            from1: from, to1 : to, results1 : results
            
        });
    });
    
});

app.get('/', (req, res) => {
    //console.log("get");
    let sql = "SELECT * FROM chat";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('home_view.hbs', {
            results: results
            
        });
    });
});

app.get('/product_view.hbs', (req, res) => {
    //console.log("get");
    let sql = "SELECT * FROM chat";
    let query = conn.query(sql, (err, results) => {
        if (err) throw err;
        res.render('product_view.hbs', {
            results: results
            
        });
    });
});
//route for update data
//server listening
app.listen(3000, () => {
console.log('Server is running at port 3000');
});