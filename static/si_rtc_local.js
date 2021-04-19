
// High Level Connect Flow ~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//    localConnection.createOffer()
//        .then(offer => localConnection.setLocalDescription(offer))
//        .then(() => remoteConnection.setRemoteDescription(localConnection.localDescription))
//        .then(() => remoteConnection.createAnswer())
//        .then(answer => remoteConnection.setLocalDescription(answer))
//        .then(() => localConnection.setRemoteDescription(remoteConnection.localDescription))
//        .catch(e => {
//            console.error(e)
//        });
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer/urls
//Notice that only the urls property is provided;
// the STUN server doesn't require authentication, so this is all that's needed.
// TURN requires auth set on coturn
//
// let configuration = {
//     'iceServers': [
// //      {'urls': 'stun:stun.services.mozilla.com'},
//       {'urls': 'stun:stun.l.google.com:19302'},
//     ]
//   }
var configuration = {
"iceServers":[
{'urls': 'stun:vsilc.com:5349',
//'urls':'stun:stun1.l.google.com:19302'
// 'urls': 'stun:ip6-localhost:3478',
//'urls': 'stun:localhost:3478',
//'urls':'stun:888'
},
{
 'urls': 'turn:vsilc.com:5349',
   'credential': 'si_lock_Ewrt',
   'username': 'si_admin'
}
],
//"iceTransportPolicy": 'relay'
}

let pc1;

// the stream returned from getUserMedia call with webcam
let gm_stream = new MediaStream();
// main rtcpeerconnection

let pc1_video_tracks;
let pc1_audio_tracks;

const localVideo = document.getElementById('vid_loc');

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const sdButton = document.getElementById('sendData');

startButton.addEventListener('click', start);
callButton.addEventListener('click', start_session);
sdButton.addEventListener('click', sendData)


const offerOptions = {
  offerToReceiveAudio: 0,
  offerToReceiveVideo: 1,
  VoiceActivityDetection: false,
  IceRestart: false
};

console.log("Sender socket init WS  3008 devtestroom ~ ")
var wst = new WebSocket("ws://localhost:3008/ws_ice/devtestroom/")
//var wst = new WebSocket("ws://[2600:8802:4100:650:4c1f:4af7:c4ee:eca1]:3008/ws_turn/devtestroom/")

  wst.onmessage = function(event) {
  // whole sdp dump
//       console.log(`[wst message] Data received from RTC PEER : ${event.data}`);
      var dec_msg = JSON.parse(event.data)["payload"]
      if (dec_msg["type"] == "answer"){
              console.log("ws onmessage received answer, call onReceiveAnswerSuccess ~ ")
	      //      setRemRes = dec_msg["desc"]
	      onReceiveAnswerSuccess(dec_msg["desc"])
      } };

    wst.onclose = function(event) {
    console.log("[ws close] event ~ ", event)
      if (event.wasClean) {
        console.log(`[wst close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        //  server process killed or network down ~ event.code is usually 1006 in this case
        console.log('[wst close] Connection died');
      }
    };

    wst.onerror = function(error) {
      console.log(`[error] ${error.message}`);
    }


localVideo.addEventListener('loadedmetadata', function() {
  console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});


async function start() {
  console.log('start called... requesting local webcam vid stream');
  try {
  // returns mediaStream from webcam
    gm_stream = await navigator.mediaDevices.getUserMedia(
    {audio: false, video: true});
        console.log("setting with local webcam stream ~~ ", gm_stream)
    localVideo.srcObject = gm_stream;
    console.log('local video srcObject set to gm_stream');
  } catch (e) {
    alert(`getUserMedia error: ${e.name}`);
  }
}

async function start_session() {
  console.log('Starting call');
//  returns list of MediaStreamTrack
      pc1_video_tracks = gm_stream.getVideoTracks();
      pc1_audio_tracks = gm_stream.getAudioTracks();
  if (pc1_video_tracks.length > 0) {
    console.log(`Using video device: ${pc1_video_tracks[0].label}`);
    console.log("video track object type ~ " + typeof(pc1_video_tracks[0]))
    console.log("video track str ~ " ,pc1_video_tracks[0])
  }
  if (pc1_audio_tracks.length > 0) {
    console.log(`Using audio device: ${pc1_audio_tracks[0].label}`);
  }
    var pcConstraint = null;

    pc1 =
      new RTCPeerConnection(configuration, pcConstraint);

       // CALLBACKS ALREADY DEFINED HERE
      /////    https://stackoverflow.com/questions/23392111/console-log-async-or-sync

      console.log("pc1 atts wo cb ~~ " , pc1)

      console.log("Adding gm_stream track to pc1 before connection ", gm_stream)

      // ontrack not called for pc1, but is for pc2
       pc1.addTrack(pc1_video_tracks[0],gm_stream)

      // not called on pc1 but is for pc2
        function oicsc(e){
        console.log("on ice connection state change fire ~~ ",e)
        }


// Deprecated error handler still fires ... look for alternative ???
//6_vc_c1.js:149 [Deprecation]
//oice @ 6_vc_c1.js:149
//6_vc_c1.js:149 on ice candidate error callback fired
//~~  RTCPeerConnectionIceErrorEvent {isTrusted: true, address: "10.0.1.x", port: 57633, hostCandidate: "10.0.1.x:57633", url: "stun://127.0.0.1:3478", …}
        function oice(e){

        console.log("on ice candidate error callback fired ~~ ", e)
                console.log("OICE Error ts ~ " + window.performance.now().toString() )

        }

        function oissc(e){
        console.log("ice state signal change fire event ~~ ", e) ;   console.log("pc1 atts ~~ " , pc1)
        }
        function oinn(ne){
        console.log("on ICE negotiation needed callback fired ~~ ", ne)
        }
        function oigsc(oe){
        console.log("on ICE negotiation callback fired ~~ ", oe)
        }


          pc1.oniceconnectionstatechange = oicsc;

          pc1.onicecandidateerror = oice;
          pc1.onsignalingstatechange = oissc;
          pc1.onnegotiationneeded = oinn;
          pc1.onicegatheringstatechange = oigsc;
          pc1.onicecandidate = onIceCandidateLoc;

  console.log('Added callbacks to pc1');
        console.log("pc1 atts ~~ " , pc1)

  try {
    console.log('pc1 createOffer start');
        console.log("[SI ice signal state ] pre create offer pc1 signaling state ~~~ ", pc1.signalingState)

    const offer = await pc1.createOffer(offerOptions);
    console.log("pc1 local offer created... ")

    //sets local description
    await onCreateOfferSuccess(offer);
    console.log("[SI ice signal state ] post create offer pc1 signaling state ~~~ ", pc1.signalingState)

  } catch (e) {
console.log("Failed to create session")  }
}

async function onCreateOfferSuccess(desc) {
// whole sdp dump here
//  console.log(`Offer from pc1\n${desc.sdp}`);
  console.log('pc1 setLocalDescription start');
  try {
  console.log("[ si Ice Offer Signal  ]set description ~ ts : " +   window.performance.now().toString())
        console.log("[ si Ice Offer Signal  ] pre set local pc1 signaling state ~~~ ", pc1.signalingState)

    await pc1.setLocalDescription(desc);
        console.log("[ si Ice Offer Signal  ] post set local pc1 signaling state ts ~ " +
        window.performance.now().toString() + " Signaling State ~ " + pc1.signalingState)
    // have-local
    console.log("[ si Ice Offer Signal  ] post set local pc1 signaling state ~~~ ", pc1.signalingState)
    console.log("set session description success")
  } catch (e) {
     console.log(`Failed to set session description: ${e.toString()}`);
  }

  // send offer to client remote
  try {
  // offer turn signal json depends on definition of websocket onmessage on server
  console.log("sending offer sdp")
  wst.send(JSON.stringify({ "type":"offer", "desc":desc}));
console.log("offer sent to ws continue wait for answer ... ")
  } catch (e) {
    console.log(`Failed to set session description: ${e.toString()}`);
  }
}


async function onReceiveAnswerSuccess(desc) {
// whole sdp dump
  console.log(`ORAS Answer from pc2:\n${desc.sdp}`);
 
  console.log("[ si Ice Offer Signal  ] set description ~ ts : " +   window.performance.now().toString())
  console.log("[ si Ice Offer Signal  ] pre set remote pc1 signaling state ~~~ ", pc1.signalingState)
   if (pc1.signalingState == "have-local-offer"){
    console.log("PC1 HAVE LOCAL OFFER... setting remote desc")
  try{
	  await pc1.setRemoteDescription(desc).then(function(){
            console.log("SET REMOTE PROMISE Complete .... ")
            console.log("[ si Ice Offer Signal  ] post set remote pc1 signaling state ~~~ ", pc1.signalingState)
            })
  }catch(e){
  console.log("could not set remote.. catch err ~ " + e.toString())
  }

            console.log("SET REM did not err out continuing ... ")

    }


}

async function onIceCandidateLoc(event) {
    console.log("onIce candidate local ~ ", event)
      console.log("OICE Candidate ts ~ " + window.performance.now().toString() )
    if (!event.candidate){
    console.log("non candidate event RTC CONNECTION COMPLETE ~ ", event)
//    return
}
else{
//https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate#properties
        // some properties candidate, type, usernameFragment, protocol, sdpMid,
        console.log("local ice candidate callback ~ event candidate candi ~" + event.candidate.candidate)
          if (event.candidate) {
            pc1.addIceCandidate(
              event.candidate
            ).then(
              await onAddIceCandidateSuccess,
              function(error){  console.log("Add Ice candidate local callback add Error ~ ", error)}
            );
            console.log('Local ICE candidate: \n' + event.candidate.candidate);
          }
}}

async function onAddIceCandidateSuccess(){
 console.log("Ice Candidate success pc1 signaling state ~ " + pc1.signalingState );

    if (pc1.signalingState == "stable"){
        console.log("PC1 Signal state stable ~ ")
        console.log("pc1 video track type ~ " + typeof(pc1_video_tracks[0]))
    }
    console.log("onAddIceCandidateSuccess ~~ ")
}


function onIceStateChange(pc, event) {
console.log("ice state change event ~", event)
  if (pc) {
    console.log(` ICE state change: ${pc.iceConnectionState}`);
  }
}

function hangup() {
  console.log('Ending call');
  pc1.close();
  pc2.close();
}
