$(".window-button").click(function() {
    $("#music_player").hide();
})
$(".show-button").click(function() {
    $("#music_player").toggle();
})
if (typeof jQuery.ui !== 'undefined') {
    console.log("jQuery UI is loaded");
} else {
    console.log("jQuery UI is NOT loaded");
}
$(function() {
    $("#music_player").draggable();
})