let trackName = $(".song_name");
let artist = $(".artist");
let playPauseBtn = $(".play_pause_btn");
let currentTime = $(".current_time");
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
})
