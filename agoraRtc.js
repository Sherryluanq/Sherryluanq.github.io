let handlefail = function (err) {
    console.log(err)
}
let globalStream;
let isAudioMuted= false;
let isVidioMuted= false;

function addVideoStream(streamId) {
    console.log()
    let remoteContainer = document.getElementById("remoteStream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.height = "250px"
    remoteContainer.appendChild(streamDiv)
}

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("channelName").value;
    let Username = document.getElementById("username").value;
    let appId = "049e6f0f99574ac0a08614a8352f8f7b";


    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"
    })

    client.init(appId, () => console.log("AgoraRTC Client Connected"), handlefail
    )

    client.join(
        null,
        channelName,
        Username,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })

            localStream.init(function () {
                localStream.play("SelfStream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream)
            })
        }
    )

    client.on("stream-added", function (evt) {
        console.log("Added Stream");
        client.subscribe(evt.stream)
    })

    client.on("stream-subscribed", function (evt) {
        console.log("Subscribed Stream");
        let stream = evt.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    })
    

}

//mute audio
document.getElementById("video-mute").onclick = function(){
    if(!isVidioMuted){
        globalStream.muteVideo();
        isVidioMuted = true;
    }else{
        globalStream.unmuteVideo();
        isVidioMuted = false;
    }
}

document.getElementById("audio-mute").onclick = function(){
    if(!isAudioMuted){
        globalStream.muteAudio();
        isAudioMuted = true;
    }else{
        globalStream.unmuteAudio();
        isAudioMuted = false;
    }
}