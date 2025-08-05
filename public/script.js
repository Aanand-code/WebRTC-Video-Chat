const socket = io();

const userInfo = document.getElementById('user-info');
const userNameInput = document.getElementById('username-input');
const roomIdInput = document.getElementById('room-input');
const joinRoomBtn = document.getElementById('join-btn');
const callBtn = document.getElementById('call-btn');
const endCallBtn = document.getElementById('end-call-btn');

const localVideoElem = document.getElementById('local-video');
const remoteVideoElem = document.getElementById('remote-video');

let userName;
let roomId;

let localStream;
let remoteStream;
let peerConnection;
// let didIOffer = false;

let peerConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add these TURN servers
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

// Get User Media (GUM)
async function getMedia() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      // audio: true,
    });

    localVideoElem.srcObject = stream;
    localStream = stream;
  } catch (error) {
    console.error(error);
  }
}

async function createPeerConnection(isOfferer) {
  peerConnection = await new RTCPeerConnection(peerConfiguration);

  //Add local Stream
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  //Handle Remote stream
  peerConnection.addEventListener('track', (event) => {
    remoteStream = new MediaStream();

    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track, remoteStream);
      console.log("Here's an exciting moment... fingers cross");
    });
    remoteVideoElem.srcObject = remoteStream;
    console.log('Remote stream received');
    endCallBtn.disabled = false;
  });

  //Handle ICE candidate
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      socket.emit('ice_candidate', { roomId, candidate: event.candidate });
    }
  });

  if (isOfferer) {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', { userName, roomId, offer });
    } catch (error) {
      console.error(`Error creating offer: ${error.message}`, 'error');
    }
  }
}

function endCall() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (remoteVideoElem.srcObject) {
    remoteVideoElem.srcObject.getTracks().forEach((track) => track.stop());
    remoteVideoElem.srcObject = null;
  }
  socket.emit('leave_room', roomId);
  endCallBtn.disabled = true;
  callBtn.disabled = false;
}

socket.on('room_created', () => {
  console.log(`Room "${roomId}" created. Waiting for participant...`);
});

socket.on('room_joined', () => {
  console.log(`Joined room "${roomId}". Waiting to start call...`);
  callBtn.disabled = false;
});

socket.on('offer', async (offer) => {
  if (!peerConnection) {
    await createPeerConnection(false);
  }

  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { roomId, answer });
});

socket.on('answer', async (answer) => {
  await peerConnection.setRemoteDescription(answer);
});

socket.on('ice_candidate', (candidate) => {
  if (peerConnection) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
});

socket.on('user_left', () => {
  endCall();
});

joinRoomBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  userName = userNameInput.value;
  roomId = roomIdInput.value;

  if (!userName || !roomId) {
    alert('If you want to create room then fill all field');
    return;
  }
  userNameInput.value = '';
  roomIdInput.value = '';
  userInfo.style.display = 'none';
  await getMedia();
  const userInformation = {
    userName,
    roomId,
  };
  socket.emit('join_room', userInformation);
});

callBtn.addEventListener('click', async () => {
  callBtn.disabled = true;
  await createPeerConnection(true);
});

endCallBtn.addEventListener('click', endCall);
