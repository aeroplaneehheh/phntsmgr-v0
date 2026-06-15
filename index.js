let trackName = $(".track_name");
let artist = $(".artist");
let playPauseBtn = $(".play_pause_btn");
let currTime = $(".current_time");
let endTime = $(".end_time");

let trackIndex = 0;
let isPlaying = false;
let currentTrack = document.createElement('audio');

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
$( function() {
    $("#music_player").hide()
})
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
    $(trackName).text(trackList[trackIndex].name);
    $(artist).text(trackList[trackIndex].artist);

    updateTimer = setInterval(seekUpdate, 1000);
    $(currentTrack).on("ended", function() {
        nextTrack();
    });
}

function resetValues() {
    $(currTime).text("00:00");
    $(endTime).text("00:00");
}

function playPauseTrack() {
    if (! isPlaying) playTrack();
    else playPauseTrack();
}

function playTrack() {
    currentTrack.play();
    isPlaying = true;
    $(".play_pause_btn").attr("src", "assets/play.png");
}

function pauseTrack() {
    currentTrack.pause();
    isPlaying = false;
    $(".play_pause_btn").attr("src", 'assets/stop.png');
}

function nextTrack() {
    if (trackIndex < track_list.length - 1) {
        trackIndex += 1;
    }
    else trackIndex = 0;

    loadTrack(trackIndex);
    playTrack();
}

function previousTrack() {
    if (trackIndex > 0) {
        trackIndex -= 1;
    }
    else trackIndex = trackList.length

    loadTrack(trackIndex);
    playTrack();
}


// current time-- change the current time into a percentage and change
// the linear gradient with that, subtract and add continuously???

function seekTo() {
    seekto = currentTrack.duration * (currentTrack.currentTime / 100);
}

function seekUpdate() {
    if (!isNaN(currentTrack.duration)) {
        seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);
        $(".slider-color").attr("background", "linear-gradient(to right, rgb(179, 171, 138)" + seekPosition + "% , transparent" (100 - seekPosition) + "%");
    }

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
    // i guess this is all. i'll check if it works tmr :))) im so sleepy but i still need to work on 
    // my other project which is a macropad. sigh.
}