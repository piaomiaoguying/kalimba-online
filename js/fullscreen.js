$(document).ready(function () {
    // 全屏切换按钮
    const fullscreenButton = $("#fullscreenButton");
    // 需要设置为全屏的块
    const mainContainer = $("#main-container")[0];

    // 点击全屏按钮的事件
    fullscreenButton.on("click", function () {
        if (document.fullscreenElement) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    // 全屏状态更改时调用的事件
    $(document).on("fullscreenchange", function () {
        // 如果全屏关闭，则退出
        if (!document.fullscreenElement) {
            $("#fullscreen-on").show();
            $("#fullscreen-off").hide();
            $("#main-container").removeClass("fullscreen");
        }
    });

    // 进入全屏的函数
    function enterFullscreen() {
        if (mainContainer.requestFullscreen) {
            mainContainer.requestFullscreen();
        } else if (mainContainer.mozRequestFullScreen) {
            mainContainer.mozRequestFullScreen();
        } else if (mainContainer.webkitRequestFullscreen) {
            mainContainer.webkitRequestFullscreen();
        } else if (mainContainer.msRequestFullscreen) {
            mainContainer.msRequestFullscreen();
        }
        $("#fullscreen-on").hide();
        $("#fullscreen-off").show();
        $("#main-container").addClass("fullscreen");
    }

    // 退出全屏的函数
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $("#fullscreen-on").show();
        $("#fullscreen-off").hide();
        $("#main-container").removeClass("fullscreen");
    }
});