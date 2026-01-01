$(document).ready(function () {
    // 全屏切换按钮
    const fullscreenButton = $("#fullscreenButton");
    // iOS退出全屏按钮
    const iosExitButton = $("#iosExitFullscreen");
    // 需要设置为全屏的块
    const mainContainer = $("#main-container")[0];

    // 保存原始按键高度
    let originalHeights = [];
    let originalTransforms = [];

    // 点击全屏按钮的事件
    fullscreenButton.on("click", function () {
        if (document.fullscreenElement || $("#main-container").hasClass("fullscreen")) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    });

    // iOS退出全屏按钮点击事件
    iosExitButton.on("click", function () {
        exitFullscreen();
    });

    // 全屏状态更改时调用的事件
    $(document).on("fullscreenchange", function () {
        if (document.fullscreenElement) {
            // 进入全屏：立即尝试增加按键高度
            increaseKeyHeights();
        } else {
            // 退出全屏：Android也刷新页面恢复原始状态
            if (isAndroid()) {
                location.reload();
            } else {
                // iOS或其他设备：恢复原始高度
                restoreKeyHeights();
                $("#fullscreen-on").show();
                $("#fullscreen-off").hide();
                $("#main-container").removeClass("fullscreen");
            }
        }
    });

    // 保存上一次的屏幕方向
    let lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

    // 监听屏幕方向变化事件
    $(window).on("orientationchange", function() {
        handleOrientationChange();
    });

    // 监听窗口大小变化事件（作为备用方案）
    $(window).on("resize", function() {
        handleOrientationChange();
    });

    // 处理屏幕方向变化
    function handleOrientationChange() {
        // 只在全屏状态下处理
        if (!document.fullscreenElement && !$("#main-container").hasClass("fullscreen")) {
            return;
        }

        const currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

        // 如果从竖屏变为横屏，刷新页面
        if (lastOrientation === 'portrait' && currentOrientation === 'landscape') {
            console.log("检测到横屏变化，刷新页面");
            location.reload();
        }

        // 更新上一次的屏幕方向
        lastOrientation = currentOrientation;
    }

    // 检测是否是iOS设备
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    // 检测是否是Android设备
    function isAndroid() {
        return /Android/.test(navigator.userAgent);
    }

    // 进入全屏的函数
    function enterFullscreen() {
        // 保存原始高度
        saveOriginalHeights();

        // iOS不支持requestFullscreen，使用CSS模拟全屏
        // Android使用原有的requestFullscreen逻辑
        if (!isIOS()) {
            if (mainContainer.requestFullscreen) {
                mainContainer.requestFullscreen();
            } else if (mainContainer.mozRequestFullScreen) {
                mainContainer.mozRequestFullScreen();
            } else if (mainContainer.webkitRequestFullscreen) {
                mainContainer.webkitRequestFullscreen();
            } else if (mainContainer.msRequestFullscreen) {
                mainContainer.msRequestFullscreen();
            }
        }

        $("#fullscreen-on").hide();
        $("#fullscreen-off").show();
        $("#main-container").addClass("fullscreen");

        // 为iOS设备添加data-ios属性，让CSS区分iOS和Android
        if (isIOS()) {
            $("#main-container").attr("data-ios", "true");
            // 显示iOS退出全屏按钮
            $("#iosExitFullscreen").show();
        } else {
            $("#main-container").removeAttr("data-ios");
        }

        // iOS需要手动触发按键高度调整
        if (isIOS()) {
            setTimeout(increaseKeyHeights, 100);
        }
    }

    // 退出全屏的函数
    function exitFullscreen() {
        // iOS不支持exitFullscreen，直接移除全屏样式
        // Android使用原有的exitFullscreen逻辑
        if (!isIOS()) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        $("#fullscreen-on").show();
        $("#fullscreen-off").hide();
        $("#main-container").removeClass("fullscreen");

        // iOS退出全屏时刷新页面，恢复原始状态
        if (isIOS()) {
            $("#iosExitFullscreen").hide();
            $("#main-container").removeAttr("data-ios");
            // 刷新页面恢复原始状态
            location.reload();
        }
    }
    
    // 保存原始按键高度
    function saveOriginalHeights() {
        originalHeights = [];
        originalTransforms = [];
        $(".key-zone").each(function() {
            originalHeights.push(parseFloat($(this).css('height')));
            originalTransforms.push($(this).css('transform'));
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

        // iOS设备使用新的按键高度逻辑（按比例缩放）
        if (isIOS()) {
            // 检测是否是手机横屏模式
            const isMobileLandscape = window.innerWidth <= 1024 && $("#main-container").hasClass("fullscreen");

            // 根据模式选择使用视口高度还是宽度
            const viewportSize = isMobileLandscape ? window.innerWidth : window.innerHeight;

            // 计算缩放比例 - iOS微调后的缩放比例
            let scaleFactor = 1.45; // 默认放大1.45倍（再增加一点点高度）

            // 手机横屏时，放大倍数稍微增加
            if (isMobileLandscape) {
                scaleFactor = 2.3; // 横屏放大2.3倍（再增加一点点高度）
            }

            console.log("iOS模式:", isMobileLandscape ? "手机横屏" : "普通全屏", "缩放比例 =", scaleFactor);

            $(".key-zone").each(function(index) {
                const originalHeight = originalHeights[index];
                const newHeight = originalHeight * scaleFactor;
                console.log("原始高度:", originalHeight, "新高度:", newHeight);
                $(this).css('height', newHeight + 'px');
                // 使用 !important 确保生效
                this.style.setProperty('height', newHeight + 'px', 'important');
                console.log("设置后高度:", $(this).css('height'));
            });

            // 手机横屏时调整按键位置
            if (isMobileLandscape) {
                adjustKeyPositionsForMobile();
            }
        }
        // Android/桌面使用原有的按键高度逻辑（增加固定像素值）
        else {
            // 检测是否是手机横屏模式
            const isMobileLandscape = window.innerWidth <= 768 && document.fullscreenElement;

            // 根据模式选择使用视口高度还是宽度
            const viewportSize = isMobileLandscape ? window.innerWidth : window.innerHeight;
            let vhQuarter = viewportSize / 4; // 1/4 屏幕尺寸的像素值

            // 手机横屏时，最终高度要乘以2
            if (isMobileLandscape) {
                vhQuarter = vhQuarter * 3.5;
            }

            console.log("Android模式:", isMobileLandscape ? "手机横屏" : "普通全屏", "增加高度 =", vhQuarter, "px");

            $(".key-zone").each(function() {
                const currentHeight = parseFloat($(this).css('height'));
                const newHeight = currentHeight + vhQuarter;
                console.log("当前高度:", currentHeight, "新高度:", newHeight);
                $(this).css('height', newHeight + 'px');
                // 使用 !important 确保生效
                this.style.setProperty('height', newHeight + 'px', 'important');
                console.log("设置后高度:", $(this).css('height'));
            });

            // 手机横屏时调整按键位置
            if (isMobileLandscape) {
                adjustKeyPositionsForMobile();
            }
        }
    }
    
    // 手机横屏时调整按键位置：左边4个键往左移，右边5个键往右移
    function adjustKeyPositionsForMobile() {
        // 检查是否选择了左右布局
        const layout = kalimba_online.fullscreenLayout;
        if (layout !== 'left-right') {
            console.log("当前布局设置:", layout, "不调整按键位置");
            return;
        }

        const keys = $(".key-zone");
        const totalKeys = keys.length;
        const viewportWidth = window.innerWidth;

        // 计算移动距离：iOS使用10%，Android使用20%
        const moveDistance = isIOS() ? viewportWidth * 0.10 : viewportWidth * 0.2;

        console.log("调整按键位置，设备:", isIOS() ? "iOS" : "Android", "总键数:", totalKeys, "移动距离:", moveDistance, "px");

        keys.each(function(index) {
            // 前4个键往左移（使用 transform，不影响布局）
            if (index < 4) {
                $(this).css('transform', `translateX(${-moveDistance}px)`);
            }
            // 后5个键往右移
            else {
                $(this).css('transform', `translateX(${moveDistance}px)`);
            }
        });
    }
    
    // 恢复原始按键高度
    function restoreKeyHeights() {
        $(".key-zone").each(function(index) {
            if (originalHeights[index]) {
                // 恢复原始高度
                $(this).css('height', originalHeights[index] + 'px');
                // 清除内联的height样式（如果有!important）
                this.style.removeProperty('height');
            }
            if (originalTransforms[index]) {
                // 恢复原始transform
                $(this).css('transform', originalTransforms[index]);
            } else {
                // 如果没有原始transform，清除transform
                $(this).css('transform', 'none');
            }
        });
        originalHeights = [];
        originalTransforms = [];
    }
});