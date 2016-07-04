/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */

"use strict";

function myFunction() {
console.log("TOGGLED");
document.getElementsByClassName("topnav")[5].classList.toggle("responsive");
}

$(document).ready(function () {
    var zindex = 10;

    $(".grid-item").click(function () {
        var clickedElment = $(this);

        $(".grid-item").find("> .info").removeClass("show-info");
        $(".grid-item").find("> .info").addClass("hide-info");
        $(".grid-item").find("> .info button").css("visibility", "collapse");

        if (clickedElment.find("> .info").hasClass("hide-info")) {
            clickedElment.find("> .info").removeClass("hide-info");
            clickedElment.find("> .info").addClass("show-info");;
            clickedElment.find("> .info button").css("visibility", "visible");
        }
    });
});
