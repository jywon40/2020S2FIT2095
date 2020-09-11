let mongoose = require('mongoose');

let Author = require('./models/author');
let Book = require('./models/book');

// Express Config------------------------------
let express= require('express');

let app=express();
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static('images')); //static assets inside this folder
app.use(express.static('css'));
app.use(express.static('public'));
app.use(express.static('files'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.listen(8080);


//-------------------------------------------------------
let db_url = 'mongodb://localhost:27017/week6db';

let print = console.log;
mongoose.connect(db_url, function(err){
    if(err) print(err);
    else{
        print('Connect to DB successfully');
    }
});

//Endpoints --------------------------

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/views/index.html")
});

//Books Endpoints (Usually in another file)
app.get('/addbook', (req,res)=>{
    res.sendFile(__dirname+"/views/newbook.html")
});

app.get('/getbooks',(req,res)=>{
    Book.find({}).populate('author').exec(function(err,books){
        res.render('books.html', {ar:books});
    });
});

app.get('/deletebook', (req,res)=>{
    res.sendFile(__dirname + '/views/deletebook.html');

})


app.post('/newbookpost', (req,res) =>{
    let bookDetail = req.body;
    let book = new Book({
        _id: new mongoose.Types.ObjectId(),
        title:bookDetail.title,
        author:bookDetail.authorId, //should match the name in html
        ISBN: bookDetail.bookISBN,
        dateofPub:bookDetail.dateofPub,
        summary:bookDetail.summary
    });
    book.save(function (err){
        if(err) {
            print(err),
            res.redirect('/addbook');
    }
        else {
            print('Book added');
            res.redirect('/getbooks');
        }
    });
});

app.post('/deletebookpost', (req,res) =>{
    let updateDetails = req.body;
    Book.deleteOne({
        ISBN:updateDetails.bookISBN
    },
        function(err,result){
            if (err) 
                print(err),
                res.redirect('/deletebook');
            else{
                res.redirect('/getbooks');
            }
    });
});


//Authors Endpoints
app.get('/addauthor', (req,res)=>{
    res.sendFile(__dirname+"/views/newauthor.html")
});

app.get('/getauthors',(req,res)=>{
    Author.find({},function(err,authors){
        res.render('authors.html',{ar:authors});

    })
});

app.get('/updateauthor', (req,res)=>{
    res.sendFile(__dirname + '/views/updateauthor.html');

})

app.post('/newauthorpost', (req,res) =>{
    let authorDetail = req.body;
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name:{
            firstName: authorDetail.firstname,
            lastName: authorDetail.lastname
        },
        dob: authorDetail.dob,
        address:{
            state: authorDetail.state,
            suburb: authorDetail.suburb,
            street: authorDetail.street,
            unit: authorDetail.unit
        },
        numBooks: authorDetail.numBooks
    });
    author.save(function (err){
        if(err) {
            print(err),
            res.redirect('/addauthor');
        }
        else {
            print('Author added');
        res.redirect('/getauthors');
        }
    });
});

app.post('/updateauthorpost', (req,res) =>{
    let updateDetails = req.body;
    Author.findByIdAndUpdate({
        _id:updateDetails.id
    },
        {
            numofBooks:updateDetails.numBooks
        }, function(err,result){
            if (err) {
                print(err),
                res.redirect('/updateauthor');
            }
            else{
                res.redirect('/getauthors');
            }
    });
});