$(document).ready(function () {
    // 全屏切换按钮
    const fullscreenButton = $("#fullscreenButton");
    // 需要设置为全屏的块
    const mainContainer = $("#main-container")[0];
    
    // 保存原始按键高度
    let originalHeights = [];

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
        if (document.fullscreenElement) {
            // 进入全屏：立即尝试增加按键高度
            increaseKeyHeights();
        } else {
            // 退出全屏：恢复原始高度
            restoreKeyHeights();
            $("#fullscreen-on").show();
            $("#fullscreen-off").hide();
            $("#main-container").removeClass("fullscreen");
        }
    });

    // 进入全屏的函数
    function enterFullscreen() {
        // 保存原始高度
        saveOriginalHeights();
        
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
    
    // 保存原始按键高度
    function saveOriginalHeights() {
        originalHeights = [];
        $(".key-zone").each(function() {
            originalHeights.push($(this).css('height'));
        });
    }
    
    // 增加按键高度
    function increaseKeyHeights() {
        console.log("increaseKeyHeights 被调用");
        // 检查按键是否存在
        if ($(".key-zone").length === 0) {
            console.log("按键还未创建，延迟重试");
            setTimeout(increaseKeyHeights, 200);
            return;
        }
        
        const vh50 = window.innerHeight * 0.5; // 50vh 的像素值
        console.log("50vh =", vh50, "px");
        $(".key-zone").each(function() {
            const currentHeight = parseFloat($(this).css('height'));
            const newHeight = currentHeight + vh50;
            console.log("当前高度:", currentHeight, "新高度:", newHeight);
            $(this).css('height', newHeight + 'px');
            // 使用 !important 确保生效
            this.style.setProperty('height', newHeight + 'px', 'important');
            console.log("设置后高度:", $(this).css('height'));
        });
    }
    
    // 恢复原始按键高度
    function restoreKeyHeights() {
        $(".key-zone").each(function(index) {
            if (originalHeights[index]) {
                $(this).css('height', originalHeights[index]);
            }
        });
        originalHeights = [];
    }
});