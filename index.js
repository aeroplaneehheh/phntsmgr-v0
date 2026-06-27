let trackName = $(".track_name");
let artist = $(".artist");
let playPauseBtn = $(".play_pause_btn");
let currTime = $(".current_time");
let endTime = $(".end_time");

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let currentTrack = document.createElement('audio');

$(function() {
    $("#music_player").hide()
});
$(".hover-box").hide();

let trackList = [
    {
        name: "Looping the Rooms",
        artist: "rusino",
        path: "music/Looping the Rooms feat. Hatsune Miku.mp3"
    },
    {
        name: "NO EMERGENCY DOOR",
        artist: "natori",
        path: "music/NO EMERGENCY DOOR.mp3"
    },
    {
        name: "it's just a burning memory",
        artist: "The Caretaker",
        path: "music/It's just a burning memory.mp3"
    },
    {
        name: "Creep",
        artist: "Radiohead",
        path: "music/Creep.mp3"
    },
    {
        name: "in the pool",
        artist: "Kensuke Ushio",
        path: "music/Chainsaw Man The Movie_ Reze Arc _ OST -  09 - in the pool.mp3"
    },
    {
        name: "Minecraft",
        artist: "C418",
        path: "music/Minecraft.mp3"
    },
    {
        name: "No Surprises",
        artist: "Radiohead",
        path: "music/No Surprises.mp3"
    },
    {
        name: "Shoujo Rei",
        artist: "Mikito P",
        path: "music/Shoujo Rei.mp3"
    }
];

if (typeof jQuery.ui !== 'undefined') {
    console.log("jQuery UI is loaded");
} else {
    console.log("jQuery UI is NOT loaded");
}
$(".window>button").click(function() {
    $("#music_player").hide();
})
$(".show-button").click(function() {
    $("#music_player").toggle();
})
$(function() {
    $("#music_player").draggable();
    $("#music_player").resizable(
        {
            alsoResize: ".slider-container"
        },
        {
            minHeight: 360
        },
        {
            maxWidth: 450
        },
        {
            minWidth: 200
        }
    );
})

function loadTrack(trackIndex) {
    clearInterval(updateTimer);
    resetValues();
    currentTrack.src = trackList[trackIndex].path;
    currentTrack.load();

    updateTimer = setInterval(seekUpdate, 1000);

    $(trackName).text(trackList[trackIndex].name);
    $(artist).text(trackList[trackIndex].artist);
    $(".window > p").text((trackIndex + 1) + "/" + trackList.length);
}

function resetValues() {
    $(currTime).text("00:00");
    $(endTime).text("00:00");
}

function handlePlay() {
    loadTrack(trackIndex);

    $(".play_pause_btn").click(function() {
        if (!isPlaying) {
            isPlaying = true;
            currentTrack.play();
            $(".play_pause_btn").attr("src", "assets/pause.png");
        }
        else if (isPlaying) {
            isPlaying = false;
            currentTrack.pause();
            $(".play_pause_btn").attr("src", "assets/play.png");
        }
    });

    $(".forward").click(function() {
        // 0-6
        if (trackIndex < trackList.length - 1) {
            trackIndex += 1;
        }
        // 7
        else {
            trackIndex = 0;
        }
        loadTrack(trackIndex);
        isPlaying = true;
        currentTrack.play();
        $(".play_pause_btn").attr("src", "assets/pause.png");
    });

    $(".backward").click(function() {
        // 7-1
        if (trackIndex > 0) {
            trackIndex -= 1;
        }
        // 0
        else {
            trackIndex = trackList.length - 1
        }
        loadTrack(trackIndex);
        isPlaying = true;
        currentTrack.play();
        $(".play_pause_btn").attr("src", "assets/pause.png");
    });

    currentTrack.addEventListener("ended", function() {
        if (trackIndex < trackList.length - 1) {
            trackIndex += 1;
        }
        else {
            trackIndex = 0;
        }
        loadTrack(trackIndex);
        isPlaying = true;
        currentTrack.play();
        $(".play_pause_btn").attr("src", "assets/pause.png");
    });
}

function seekTo() {
    seekto = currentTrack.duration * (currentTrack.currentTime / 100);
}

function seekUpdate() {
    let currentMinutes = Math.floor(currentTrack.currentTime / 60);
    let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(currentTrack.duration / 60);
    let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);

    if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
    }
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    if (durationSeconds < 10) {
        durationSeconds = "0" + durationSeconds;
    }
    if (durationMinutes < 10) {
        durationMinutes = "0" + durationMinutes;
    }
    $(currTime).text(currentMinutes + ":" + currentSeconds);
    $(endTime).text(durationMinutes + ":" + durationSeconds);

    seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
    $(".slider-color").css("background", "linear-gradient(to right, rgb(179, 171, 138) " + seekPosition + "%, transparent " + seekPosition + "%)");
}

$(".web").click(function() {
    window.location.href = "https://aeroplaneehheh.github.io/aeros-website/"
})

$(".box").hover(
    function() {
        let index = $(this).index(".box")
        $(".hover-box").eq(index).show();
        console.log(index);
        $(this).css("background-color", "rgb(48, 38, 59)")
    },
    function() {
        $(".hover-box").hide();
        $(".box").css("background-color", "rgb(73, 58, 90)")
    }
)

handlePlay();

const socketProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const socket = new WebSocket(`${socketProtocol}${window.location.host}/api/chat`);

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        input.value = '';
    }
});

socket.addEventListener('message', (e) => {
    const item = document.createElement('li');
    item.textContent = e.data;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
})