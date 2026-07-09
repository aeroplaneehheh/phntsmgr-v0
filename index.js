$("#warning").hide();
let trackName = $(".track_name");
let artist = $(".artist");
let playPauseBtn = $(".play_pause_btn");
let currTime = $(".current_time");
let endTime = $(".end_time");

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let currentTrack = document.createElement('audio');
let alert = false;
let count = 0;

$("#music_player").hide()
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

const IS_LOCAL = window.location.hostname === "localhost"  || window.location.hostname === "127.0.0.1";
const LIVE_WORKER_DOMAIN = "chat.unluckyluckycloverrr.workers.dev";
const LOCAL_WORKER_DOMAIN = "localhost:8787";
const BACKEND_DOMAIN = IS_LOCAL ? LOCAL_WORKER_DOMAIN : LIVE_WORKER_DOMAIN;
const WS_PROTOCOL = window.location.protocol === "https:" ? "wss://" : "ws://";
let socket;

function connectWebSocket() {
    console.log(`Connecting to server : ${WS_PROTOCOL}${BACKEND_DOMAIN}`);
    socket = new WebSocket(`${WS_PROTOCOL}${BACKEND_DOMAIN}`);

    socket.onopen = () => {
        console.log("Connected successfully.")
    }

    socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        appendMessageToUI(data.username || "Anonymous", data.text);
    }

    socket.onclose = () => {
        console.log("WebSocket disconnected D: Retrying again in 3 seconds.");
        setTimeout(connectWebSocket, 3000);
    }

    socket.onerror = (error) => {
        console.log("Error occured: ", error);
    }
}

function sendMessage(e) {
    if (e) e.preventDefault();
    const name = document.getElementById("username");
    const input = document.getElementById("input");
    if (!input || !socket || socket.readyState !== WebSocket.OPEN) {
        return;
    }
    const username = name.value.trim();
    const message = input.value.trim();

    if (!message) return;
    if (message.toLowerCase() === "/permclearchatifyouseethisnoyoudidn't") {
        const command = { action: "CLEAR_PERMANENTLY" };
        socket.send(JSON.stringify(command));
        input.value = '';
        return;
    }
    const payload = {
        username: username,
        text: message
    }
    socket.send(JSON.stringify(payload));
    input.value = '';
}

function appendMessageToUI(username, text) {
    const chat = document.getElementById("messages");
    const textBox = document.createElement("div");
    textBox.className = "textBox";
    const userElement = document.createElement("div");
    const messageElement = document.createElement("div");
    messageElement.style.backgroundColor = "rgb(179, 171, 138)";
    messageElement.style.color = "rgb(73, 58, 90)";
    userElement.textContent = username;
    messageElement.textContent = text;
    textBox.append(userElement, messageElement);
    chat.appendChild(textBox);
    chat.scrollTop = chat.scrollHeight;
}

window.addEventListener("DOMContentLoaded", () => {
    connectWebSocket();
    document.getElementById("send-btn").addEventListener("click", (e) => {
        if (document.getElementById("input").value.length > 200) {
            e.preventDefault();
            haunt();
        } else sendMessage();
    }
);
    document.getElementById("input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if (document.getElementById("input").value.length > 200) {
                e.preventDefault();
                alert = true;
                haunt();
                warning();
            } else sendMessage();
        }
    })
})

function haunt() {
    const music = new Audio('assets/please_dont_leave.wav');
    music.volume = 0.5;
    const dontBreathe = new Audio('assets/why_are_you_here.wav');
    dontBreathe.play();
    music.play();
}

function warning() {
    if (alert == true) {
        $("#warning").show();
    } else {
        $("#warning").hide();
    }
}

let clock = document.getElementById("clock");
let time = new Date();
time.getTime();
time.toLocaleString();

setInterval(() => {
    let hours = time.getHours();
    let minutes = time.getMinutes();
    if (hours < 10) {
        hours = `0${hours}`
    }
    if (minutes < 10) {
        minutes = `0${minutes}`
    }
    console.log(hours, minutes);
    clock.innerText = `${hours}:${minutes}`;
}, 1000)

function getCoords() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

async function weather() {
    try {
        const position = await getCoords();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto&forecast_days=1`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);

        return result.current.temperature_2m;
    } catch(error) {
        console.log(error.message);
        return null;
    }
}

window.onload = function() {
    weather().then(function (temp) {
        const temperature = document.getElementById("weather");
        if (temp) {
            temperature.innerText = `${temp}°C`;
        }
    })
}