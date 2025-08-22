
# WebRTC video chat P2P
WebRTC Video Chat P2P is a personal learning project to understand WebRTC, real-time communication, and Socket.IO. The application enables one-on-one video calls between users in shared rooms. This is a foundational implementation that I plan to expand with additional features.

This project is part of my journey to understand real-time communication technologies. I'm building this to solidify my understanding of WebRTC, sockets, and peer-to-peer connections.






## File Structure

```bash
WebRTC-Video-Chat/
├── public/
│   ├── index.html          # Main HTML file for the client
│   ├── styles.css          # CSS styles for the application
│   └── script.js           # Client-side JavaScript with WebRTC logic
├── server.js               # Socket.IO server implementation
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation (this file)

```
## Current Features

- Real-time video and audio communication
- Simple user interface for connection management
- Status indicators for connection state
- STUN/TURN server support for NAT traversal


## Usage

- Enter your username and a room ID
- Click "Join Room" to create or join a room
- Allow camera and microphone access when prompted
- Click "Call Button" to initiate a connection
- Wait for the remote user to join and connect
- Use "End Call" to terminate the connection

## ICE Server
This application uses:

- Google's public STUN servers
- TURN servers (for NAT traversal)
## Browser Compatibility

This application works in modern browsers that support:

- WebRTC
- MediaDevices API (getUserMedia)
- ES6+ JavaScript features
## Limitation
- Currently supports 1:1 calls only
- No text chat or screen sharing
## Future Enhancements

As this is a personal learning project, I plan to add the following features:

**Screen Sharing:** Ability to share entire screen or application windows

**Real-time Messaging:** Text chat alongside video communication

**Multiple Participants:** Support for more than two participants in a room

**Recording:** Option to record video calls

**User Authentication:** Simple login system

## Tech Stack

**Client:** Vanilla JavaScript, HTML, CSS

**Server:** Node, Express

**Real-time Communication:** Socket.IO

**Video/Audio:** WebRTC


## Learning Objectives
Through this project, I aim to understand:

- WebRTC protocol and implementation
- Socket.IO for real-time communication
- Peer-to-peer connection establishment
- Real-time application architecture
- Media stream handling
## Contributing

As this is a personal learning project, I'm not accepting contributions at this time. However, suggestions and feedback are welcome!


## License
This project is for personal educational purposes. Feel free to use the code as inspiration for your own learning projects.

