import $ from 'jquery';
import 'jquery-ui/ui/interactions/draggable';
$(".window-button").click(function() {
    $("#music_player").hide();
})
$(".show-button").click(function() {
    $("#music_player").toggle();
})
