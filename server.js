const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9090;

const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Listen only that hostname
server.listen(PORT, () => {
  console.log(`Server running on port no: ${PORT}`);
});

//Serve static files like Css js in public folder
app.use(express.static(path.join(__dirname, 'public')));

const rooms = {};

//IO Connection
io.on('connection', (socket) => {
  console.log('New Connection:', socket.id);

  //Join a room
  socket.on('join_room', (userInformation) => {
    const { roomId } = userInformation;

    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) socket.leave(room);
    });

    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        users: [],
        userName: [],
      };
      socket.emit('room_created');
    } else {
      socket.emit('room_joined');
    }

    // Add user to room
    rooms[roomId].users.push(socket.id);
    // rooms[roomId].usersName.push(userName);

    socket.to(roomId).emit('user_joined');

    // const users = rooms[roomId].users.filter((id) => id !== socket.id);
    // if (users.length > 0) {
    //   socket.emit('users-in-room', users.length);
    // }
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice_candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice_candidate', candidate);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    if (rooms[roomId]) {
      rooms[roomId].users = rooms[roomId].users.filter(
        (id) => id !== socket.id
      );

      if (rooms[roomId].users.length === 0) {
        delete rooms[roomId];
      } else {
        socket.to(roomId).emit('user_left');
      }
    }
  });

  socket.on('disconnect', () => {
    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId].users.includes(socket.id)) {
        rooms[roomId].users = rooms[roomId].users.filter(
          (id) => id !== socket.id
        );
        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        } else {
          io.to(roomId).emit('user_left');
        }
      }
    });
  });
});
