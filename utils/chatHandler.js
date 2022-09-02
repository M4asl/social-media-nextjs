const chatHandler = (io, socket) => {
  socket.on('setup', (currentUser) => {
    socket.join(currentUser._id);
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    socket.join(room);
    // console.log(`Join room ${room}`);
    // console.log(room, typeof room);
  });

  socket.on('new message', (newMessage) => {
    // console.log(newMessage);
    socket
      .in(newMessage.chat._id)
      .emit('message received', newMessage);

    // socket.broadcast.emit('message received', newMessage);
    // socket
    //   .in(newMessage.chat._id.toString())
    //   .broadcast.emit('message received', newMessage);
    // console.log(
    //   newMessage.chat._id,
    //   typeof newMessage.chat._id,
    //   'second console'
    // );
  });

  socket.on('update chats', (data) => {
    // console.log(data);
    const { chat } = data;
    if (!chat.users) return console.log('Chat.users not defined');

    chat.users.forEach((user) => {
      socket.in(user._id).emit('latest message', data);
    });
  });

  socket.on('close room', (room) => {
    // console.log('close room####', room);
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    // socket.leave(socket);
    console.log('Client disconnected.');
  });
};

export default chatHandler;
