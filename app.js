//creating express app
var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '/')));
var myText = "";
var name = "";

//using ejs templating for pages
app.set('view engine', 'ejs');
/*
app.enable('trust proxy');

//comment out to test on localhost

app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});
*/

//tone analyzer setup
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
/*
const toneAnalyzer = new ToneAnalyzerV3({
	version: '',
	username: '',
	password: '',
	url: ''
});*/

var text_tone = {
	name: name,
	doc_tone : "",
	sentences : []
};

//cloudant setup
var curr_docs = {};
var Cloudant = require('@cloudant/cloudant');
var cloudant = Cloudant('');
//mydb = cloudant.db.use('test');

//used to populate curr docs object
/*
mydb.list({ include_docs: true }, function(err, body) {
    if (!err) {
    	curr_docs = body.rows;
    	console.log(JSON.stringify(curr_docs[0].doc));
    }
});
*/

//route for form submit
app.get('/myform', function(req, res){ 
    myText = req.query.mytext; //mytext is the name of your input box
    name = req.query.name;
    text_tone.name = name;
    const toneParams = {
    	tone_input: { 'text': myText },
    	content_type: 'application/json',
    };
    //used to extract simple tone from Tone Analyzer response object
    /*
    toneAnalyzer.tone(toneParams, function(req, res2){
        test_res_tone = res2;
        console.log(test_res_tone);
        try{
		  text_tone.doc_tone =  res2.document_tone.tones[0].tone_name;
        }
        catch(e){
            text_tone.doc_tone = 'NA';
        }
        try{
    		text_tone.sentences = res2.sentences_tone;
    		var words = [];
    		for(i =0; i< text_tone.sentences.length; ++i){
    			words.push(text_tone.sentences[i].text);
    		}
    		text_tone.sentences = words;
        }
        catch(e){
            text_tone.sentences = ["no sentences found"];
        }
		res.render('tones',{text_tone:text_tone});
		mydb.insert(text_tone);
	});
	*/

}); 

//routes for pages
app.get('/', function(req, res) {
    res.render('index', {mytext:myText});
});

app.get('/comments', function(req, res) {
    res.render('comments', {curr_docs:curr_docs});
});

app.get('/tones', function(req, res) {
    res.render('tones', {text_tone:text_tone});
});

app.listen(8080);
