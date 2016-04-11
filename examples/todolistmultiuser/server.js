/**/
"use strict"
const 
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    socketIo = require('socket.io'); 
    

const mimeDictionairy = {//add more as you need
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

//initial
let todoList = {           
    "0": {
        "input": "Buy eggs , milk and everything else you need"
    },
    "1": {
        "input": "Make pancakes"
    },
    "2": {
        "input": "Eat pancakes"
    }
};


const server = http.createServer(function(request, response) {

    let filePath = request.url,
        extname,
        contentType;
    if (filePath === '/') {
        filePath = './todo.html';
    } else {
        filePath = './' + filePath;
    }

    extname = path.extname(filePath);
    contentType = mimeDictionairy[extname];
    //contentType ex: 'text/html'
        
    fs.readFile(filePath, function(error, content) {
        if (error) {
            console.log(`file ${filePath} not found`);
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end("404", 'utf-8');
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

const io = socketIo(server);
io.on('connection', function (socket) {
    socket.emit("update", todoList);
    socket.on("update", function(newToDoList) {
        // put here more tests to see if newToDoList is safe to resend to all other clients
        todoList = newToDoList;
        socket.broadcast.emit("update", todoList);
    });
});

let PORT = process.env.PORT || 8080;
server.listen(PORT);
console.log('visit http://localhost:'+ PORT);