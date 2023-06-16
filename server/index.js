var server = require('ws').Server;
const { v4: uuidv4 } = require('uuid');
const connectToDatabase = require('./db');
const User = require('./models/user-model');
const { createUser } = require('./services/user-service'); 
const { updateThreadParticipants } = require('./services/thread-service');

// Call the connectToDatabase function to establish the MongoDB connection
connectToDatabase()

var s = new server({ port: 5001 });

var connectedClients = [];
var roomClients = new Map(); // Part 3: Map to store clients in each chat room

function updateConnectedClients(roomNumber) {
    if (roomClients.has(roomNumber)) {
        var clientNames = roomClients.get(roomNumber).map(client => ({ personName: client.personName }));

        const clientsInRoom = roomClients.get(roomNumber);
        clientsInRoom.forEach(client => {
            client.send(JSON.stringify({
                connectedClients: clientNames
            }));
        });
    }
}


s.on('connection', function(ws) {
    ws.on('message', function(message) {
        message = JSON.parse(message);

        if (message.type === "name") {
            ws.personName = message.data;
            connectedClients.push(ws);
            
            // Store the personName in the database
            createUser(ws.personName);
            console.log("Joined: "+ws.personName);
            updateConnectedClients();
            return;
        }

        if (message.type === "joinRoom") {
            // Part 3: Remove the client from its current room
            roomClients.forEach((clients, roomNumber) => {
                roomClients.set(roomNumber, clients.filter(client => client !== ws));
            });

            // Part 3: Add the client to the new room
            const roomNumber = message.roomNumber;
            if (!roomClients.has(roomNumber)) {
                roomClients.set(roomNumber, []);
            }
            roomClients.get(roomNumber).push(ws);

            // Update the thread participants
            const participants = roomClients.get(roomNumber).map(client => client.personName);
            updateThreadParticipants(roomNumber, participants);

            updateConnectedClients(roomNumber);
            return;
        }

        console.log("Received: " + message.data);

        const roomNumber = message.roomNumber;
        if (roomClients.has(roomNumber)) {
            const clients = roomClients.get(roomNumber);
            clients.forEach(function(client) {
                if (client !== ws)
                    client.send(JSON.stringify({
                        name: ws.personName,
                        data: message.data
                    }));
            });
        }
    });

    ws.on('close', function() {
        connectedClients = connectedClients.filter(function(client) {
            return client !== ws;
        });

        roomClients.forEach((clients, roomNumber) => {
            roomClients.set(roomNumber, clients.filter(client => client !== ws));
            updateConnectedClients(roomNumber);

            // Update the thread participants
            const participants = roomClients.get(roomNumber).map(client => client.personName);
            updateThreadParticipants(roomNumber, participants);
        });
    });
});
