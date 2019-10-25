//back-end
const express = require('express');
const socket = require('socket.io');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

//middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api', router);

//view engine
app.set('view engine', 'ejs');

//server setup
const server = app.listen(process.env.port || 5000, () => {
    console.log('now listening to port 5000');
})

//requests
app.get('/', (request, response) => {
    response.render('index');
})

app.get('/post', (request, response) => {
    response.render('post');
    Answer.create({ question: request.query.question, answer: request.query.answer });
})

//websockets
const io = socket(server);

io.on('connection', socket => {
    console.log('socket connection has been made', socket.id);

    socket.on('chat', data => {
        io.sockets.emit('chat', data);
    })

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    })
})

//mongo
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatbot');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const AnswerSchema = new Schema ({
    question: String,
    answer: String
})

const Answer = mongoose.model('answer', AnswerSchema);