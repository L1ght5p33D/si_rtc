
// Examples
//    var configuration = {
//          "iceServers": [{ "url": "turn://127.0.0.1:3478" ,
//           "username":"random user",
//             "credential":" random pass"
//          }]
//       };

// let configuration = {
//     'iceServers': [
// //      {'urls': 'stun:stun.services.mozilla.com'},
//       // {'urls': 'stun:stun.l.google.com:19302'},
//     ]
//   }

// var configuration = {
// "iceServers":[
// {
//  'urls': 'stun:127.0.0.1:3478',
// //'urls':'stun:stun1.l.google.com'
// // 'urls': 'stun:ip6-localhost:3478',
// //'urls': 'stun:localhost:3478',
// },
// {
//  'urls': 'turn:127.0.0.1:3478',
//  'credential': 'si_lock_5738219',
//  'username': 'si_admin'
// },
// ],
// //"iceTransportPolicy": 'relay'
// }

var configuration = {
"iceServers":[
{'urls': 'stun:vsilc.com:3478',
//'urls':'stun:stun1.l.google.com:19302'
},
{
'urls': 'turn:vsilc.com:5349',
   'credential': 'si_lock_Ewrt',
   'username': 'si_admin'
}
],
//"iceTransportPolicy": 'relay'
}

//var pc_constraint = {
////    remoteVideo : localVideoElement,
////    mediaConstraints : videoParams,
////    onicecandidate : onLocalIceCandidate,
//    configuration: {
//        iceServers: iceServers,
//        iceTransportPolicy: 'relay'
//    }
//}

let pc2;

const startButton = document.getElementById('startButton');
const twbutton = document.getElementById('test_webcam');
const getMediaStreamButton = document.getElementById('gmButton');
var remoteVideo = document.getElementById("remoteVideo");


twbutton.addEventListener('click', test_webcam)
getMediaStreamButton.addEventListener('click', gmRec)
startButton.addEventListener('click', connect);

const offerOptions = {
  offerToReceiveAudio: 0,
  offerToReceiveVideo: 1
};

console.log("VC2  4 16 2020 Answerer socket init ~ ")

var wst = new WebSocket("ws://localhost:3008/ws_ice/devtestroom/")
//var wst = new WebSocket("ws://[2600:8802:4100:650:4c1f:4af7:c4ee:eca1]:3008/ws_turn/devtestroom/")

pc2 = new RTCPeerConnection(configuration);

console.log("pre remote set get recievers ")
//    var recs = pc2.getReceivers()
//    console.log("pc2 recieviers ~~ ", recs)

async function onRecieveLocalOffer(sdp_offer_desc){
    console.log("On recieve local offer called with offer sdp ~ ")
  if (sdp_offer_desc === undefined){
    console.log("WS OFFER Null wait for next offer ... "); return;}
  else{
  console.log("set ws offer with sdp ~ " + JSON.stringify(sdp_offer_desc))
  console.log("[ pc2 Ice Signal ] set remote description ~ ts : " +   window.performance.now().toString())
  console.log("[SI ice signal ] pre set remote pc2 signaling state ~~~ ", pc2.signalingState)
   await pc2.setRemoteDescription(sdp_offer_desc).then(function(res){
            console.log("LOOK FOR SET LOCAL DESC RES ~~ ", res)

   })
    // have remote
     console.log("[SI ice signal ] post set remote pc2 signaling state ~~~ ", pc2.signalingState)
    console.log("[ pc2 Ice Signal ] create Answer ~ ts : " +   window.performance.now().toString())

    const answer_sdp = await pc2.createAnswer(offerOptions);
    console.log("pc2 create answer complete")
      console.log("[ pc2 Ice Signal ] set local description ~ ts : " +   window.performance.now().toString())

    pc2.setLocalDescription(answer_sdp).then(function(res){
        console.log("pc2 set desc callback fire ~~~ ")
          console.log("[ pc1 Ice Signal ] send local description ~ ts : " +   window.performance.now().toString())

            wst.send(JSON.stringify({"type":"answer", "desc":pc2.localDescription}))
    })
}}

//messages sent with form ~~~   wst.send(JSON.stringify({ "type":"offer", "desc":desc}));
  wst.onmessage = function(event) {
//       console.log(`Data received from RTC PEER : ${event.data}`);
//              var dec_offer = JSON.parse(event.data)
      var dec_offer= JSON.parse(event.data)["payload"]
      console.log("wst on message payload ~~ " , JSON.stringify(dec_offer))
      if (dec_offer["type"] == "offer"){
        console.log("found wst offer ")

        //sets remote description, creates answer, sets local, and sends answer
         onRecieveLocalOffer(dec_offer["desc"])
      }else{
    // answer meant for local gets sent here too
        console.log("not offer wst ~ ", dec_offer)
      }
            };
            wst.onclose = function(event) {
              if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
              } else {
                console.log('[close] Connection died');
              }
            };
            wst.onerror = function(error) {
              console.log(`[error] ${error.message}`);
            }


console.log("add remote vid event listener")
remoteVideo.addEventListener('loadedmetadata', function() {
  console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

async function test_webcam(){
console.log("test webcam click")
const gm_stream = await navigator.mediaDevices.getUserMedia(
      {audio: false, video: true});
     
     remoteVideo.srcObject = gm_stream;
}

        let videoStream;
        let senderTrack;

async function connect() {
         console.log('init pc2 RTCPeerConnection w configuration:', configuration);

    var pcConstraint = null;
    pc2 =
     new RTCPeerConnection(configuration, pcConstraint);

      function oicsc(e){
                console.log("on ice connection state change callback fire ~~ ", e)}

//"new"	At least one of the connection's ICE transports (RTCIceTransports or RTCDtlsTransports)
// are in the "new" state, and none of them are in one of the following states or all of the connection's transports are in the "closed" state.
//"connecting"	One or more of the ICE transports are currently in the process of establishing a connection;
//"connected"	Every ICE transport used by the connection is either in use (state "connected" or "completed")
// or is closed (state "closed"); in addition, at least one transport is either "connected" or "completed".
//"disconnected"	At least one of the ICE transports for the connection is in the "disconnected"
//state and none of the other transports are in the state "failed", "connecting", or "checking".
//"failed"	One or more of the ICE transports on the connection is in the "failed" state.
//"closed"
        // Getting called now !

      async  function rem_ot(event){
        console.log("REMOTE ON TRACK callback fired ~~~ ", event)
          videoStream = new MediaStream()
          remoteVideo.srcObject = videoStream
        //                       videoStream.addTrack(event.track)
        //                    document.getElementById('remoteVideo').srcObject = videoStream
                       //timeout works here
//                                                 setTimeout(function(){console.log("PRE wait for connecting timeout callback call")
//                                                                   }, 2000);
                    if (pc2.connectionState == "connecting"){
//                                //timeout not working from here
//                                          setTimeout(function(){console.log("wait for connecting timeout callback call")
//                                                            }, 2000);
                    console.log("pc2 connecting state ~~ set timeout")

                    }
                    if (pc2.connectionState == "connected"){
                    console.log("pc2 Remote OnTrack Connected ~~ play remote src vid")
                    event.streams[0].getTracks().forEach(track => {
                               console.log('Loop and add track to the remoteStream:', track);
                              videoStream.addTrack(track);
//senderTrack = track
                            })

//                        document.getElementById('remoteVideo').srcObject = event.streams[0]
//videoStream.addTrack(event.track)
                        }
              }

           pc2.oniceconnectionstatechange = oicsc;
           pc2.ontrack =rem_ot;

            pc2.onicecandidate = onIceCandidateRem;

     console.log("Added callbacks to pc2")
}

async function onIceCandidateRem(event) {
console.log(" onIceCandidate event called event ~~ ", event)
  try {
           console.log("on ice candidate check RTC connecting state ~ ")
          console.log(event.srcElement.connectionState) // undefined here .. 


  if (event.candidate){
    await (pc2.addIceCandidate(event.candidate));
   console.log(` addIceCandidate success`);
}else{
    console.log("non event candidate")
    if (event.srcElement){
        console.log("Ice candidate RTC connecting state ~ ")
        console.log(event.srcElement.connectionState)

// pc connecting state still connecting here ...
        if (event.srcElement.connectionState == "connecting"){
            console.log("rtc src element connection state CONNECTING, set timeout")
            console.log("pc2 attributes", pc2)
//                setTimeout(function(){
//
//                    console.log("post candidate delay call")
//                }, 2000);
        }
    }
}
  } catch (e) {
  console.log("failed to add ice error", e)
     console.log(` failed to add ICE Candidate: ${e.toString()}`);
  }
  console.log(`Ice candidate BT log ${event.candidate?"stuff":"string interpol null operator NOT WORKING ON FIREFOX"}`)
//  console.log(` ICE candidate:\n${event.candidate??"event candidate null"}`);
}

    function gmRec(){
        console.log("get media rec click call ~~ ");
	console.log("pc2 attributes", pc2)
    
	var recs = pc2.getReceivers(); 
	  console.log("pc2 receiviers ~~ ", recs)

        if (recs.length > 0){
            recs.forEach(async function(receiver){
                console.log("looping mediaReceivers receivers ~ ", receiver)
                  console.log("got receiver media track", receiver.track)
            if (receiver.track.kind == "audio"){
                    console.log("got auido media track  ~~ ")
                    let aStream = new MediaStream();
                    aStream.addTrack(receiver.track)
                    }
             if(receiver.track.kind == "video"){
             console.log("Adding video track ~~ ", receiver.track)
             
		     let addStream = new MediaStream();
		     addStream.addTrack(receiver.track)
		     remoteVideo.srcObject = addStream
                    console.log("Get media track added vid~")

                    }
            })
        }
    }

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');

}function onAddIceCandidateError(error) {
   console.log('Failed to add Ice Candidate: ' + error.toString());
 }

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

function hangup() {
  console.log('Ending call');
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
}
