
// saveToLocalStorage 将 value 值保存到 localStorage 的 key 键下
function saveToLocalStorage(key, value) {
    window.localStorage && window.localStorage.setItem(key, value);
}

// loadFromLocalStorage 从 localStorage 返回键 key 的值，如果不存在则返回 default_value
function loadFromLocalStorage(key, default_value) {
    return window.localStorage && null !== window.localStorage.getItem(key) ? window.localStorage.getItem(key) : default_value;
}

// saveJSONToLocalStorage 将对象 value 以 JSON 格式写入 localStorage 的 key 键下
function saveJSONToLocalStorage(key, value) {
    if (window.localStorage) {
        try {
            const serializedValue = JSON.stringify(value);
            window.localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }
}

// loadJSONFromLocalStorage 从 localStorage 返回键 key 的 JSON 格式值，如果不存在则返回 default_value
function loadJSONFromLocalStorage(key, default_value) {
    if (window.localStorage) {
        const serializedValue = window.localStorage.getItem(key);
        if (serializedValue !== null) {
            try {
                return JSON.parse(serializedValue);
            } catch (error) {
                console.error("Error loading from localStorage:", error);
                return default_value;
            }
        }
    }
    return default_value;
}

// // // // // //
//  常量  //
// // // // // //

const Soundfonts = {
    'FluidR3_GM': {
        url: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/kalimba-mp3.js',
        sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
        gain: 6,
    },
    'FatBoy': {
        url: 'https://gleitz.github.io/midi-js-soundfonts/FatBoy/kalimba-mp3.js',
        sourceUrl: 'https://gleitz.github.io/midi-js-soundfonts/',
        gain: 6,
    },
    'Keylimba': {
        url: '/soundfonts/keylimba/kalimba.mp3.js',
        sourceUrl: 'https://keylimba.carrd.co/',
        gain: 1,
    },
};

// 对输入的键数组进行排序，并按 Kalimba 顺序输出
function sortArrayKalimba(notesArr) {
    let sortedArr = []
    for (let i = notesArr.length - notesArr.length % 2 - 1; i > 0; i -= 2) {
        sortedArr.push(notesArr[i]);
    }
    for (let i = 0; i < notesArr.length; i += 2) {
        sortedArr.push(notesArr[i]);
    }
    return sortedArr;
}

const allNotesSharp = [                                       "A0", "A#0", "B0",
    "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", 
    "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", 
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", 
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", 
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", 
    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", 
    "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", 
    "C8"
];

// 键盘按键对象，其中键是 keycode，值是按键名称

const keyboardKeys = {

    192: "`", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 48: "0", 189: "-", 187: "=", 8: "←",

    9: "Tab", 81: "Q", 87: "W", 69: "E", 82: "R", 84: "T", 89: "Y", 85: "U", 73: "I", 79: "O", 80: "P", 219: "[", 221: "]", 220: "\\",

    20: "Caps", 65: "A", 83: "S", 68: "D", 70: "F", 71: "G", 72: "H", 74: "J", 75: "K", 76: "L", 186: ";", 222: "'", 13: "Enter",

    16: "Shift", 90: "Z", 88: "X", 67: "C", 86: "V", 66: "B", 78: "N", 77: "M", 188: ",", 190: ".", 191: "/",

    17: "Ctrl", 18: "Alt", 32: "Space", 0: " "

};

// 普通 QWERTY 布局的键盘按键数组，包含按钮的位置和长度信息
const keyboardKeyInfo = [
    // 第 1 行
    [
        { code: 192, length: 1 }, { code: 49, length: 1 }, { code: 50, length: 1 }, { code: 51, length: 1 },
        { code: 52, length: 1 }, { code: 53, length: 1 }, { code: 54, length: 1 }, { code: 55, length: 1 },
        { code: 56, length: 1 }, { code: 57, length: 1 }, { code: 48, length: 1 }, { code: 189, length: 1 },
        { code: 187, length: 1 }, { code: 8, length: 2.5 }
    ],
    // 第 2 行
    [
        { code: 9, length: 1.5 }, { code: 81, length: 1 }, { code: 87, length: 1 }, { code: 69, length: 1 },
        { code: 82, length: 1 }, { code: 84, length: 1 }, { code: 89, length: 1 }, { code: 85, length: 1 },
        { code: 73, length: 1 }, { code: 79, length: 1 }, { code: 80, length: 1 }, { code: 219, length: 1 },
        { code: 221, length: 1 }, { code: 220, length: 2 }
    ],
    // 第 3 行
    [
        { code: 20, length: 2 }, { code: 65, length: 1 }, { code: 83, length: 1 }, { code: 68, length: 1 },
        { code: 70, length: 1 }, { code: 71, length: 1 }, { code: 72, length: 1 }, { code: 74, length: 1 },
        { code: 75, length: 1 }, { code: 76, length: 1 }, { code: 186, length: 1 }, { code: 222, length: 1.05 },
        { code: 13, length: 2.5 }
    ],
    // 第 4 行
    [
        { code: 16, length: 2.5 }, { code: 90, length: 1 }, { code: 88, length: 1 }, { code: 67, length: 1 },
        { code: 86, length: 1 }, { code: 66, length: 1 }, { code: 78, length: 1 }, { code: 77, length: 1 },
        { code: 188, length: 1 }, { code: 190, length: 1 }, { code: 191, length: 1 }, { code: 16, length: 3.1 }
    ],
    // 第 5 行
    [
        { code: 17, length: 1.5 }, { code: 0, length: 1 }, { code: 18, length: 1.5 }, { code: 32, length: 6.3 },
        { code: 18, length: 1.5 }, { code: 0, length: 1 }, { code: 0, length: 1 }, { code: 17, length: 2 }
    ]
];

// 键盘控制方案，每个数组是一个独立的方案，存储按键的 keycode，按音符频率升序排列
const keyboardSchemes = [
    // B V N C M X < F H D J S K A U R I E O P W
    [66, 86, 78, 67, 77, 88, 188, 70, 72, 68, 74, 83, 75, 65, 85, 82, 73, 69, 79, 80, 87],

    // A S D F G H J K L
    [71, 70, 72, 68, 74, 83, 75, 65, 76],

    // 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =
    [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187],
];

// 标记，是否按下鼠标左键
var isMouseDown = false;

// 标记，是否按下空格键（用于在键盘演奏时提高八度）
var isSpacePressed = false;

// 标记，是否正在录制
var isRecording = false;

// 标记，是否正在播放录制
var isPlaying = false;

// 用于保存录制的变量
var sequence = [];

// 用于存储最后一次按键时间的变量
var prevTime;

// 当释放鼠标左键时关闭 isMouseDown 标记
$(document).on('mouseup', (event) => {
    // 检查是否释放了鼠标左键（代码 0）
    if (event.button === 0) {
        isMouseDown = false;
    }
});

// 当按下鼠标左键时打开 isMouseDown 标记
$(document).on('mousedown', (event) => {
    // 检查是否按下了鼠标左键（代码 0）
    if (event.button === 0) {
        isMouseDown = true;
    }
});

// 当按下空格键时打开 isSpacePressed 标记
$(document).on('keydown', function (event) {
    if (event.keyCode == 32) {
        isSpacePressed = true;
        event.preventDefault(); // 取消按下空格键时的滚动
    }
});

// 当释放空格键时关闭 isSpacePressed 标记
$(document).on('keyup', function (event) {
    if (event.keyCode == 32) {
        isSpacePressed = false;
    }
});


// 更新按键上的标签
function updateLabels() {
    switch (kalimba_online.labelType) {
        case "Number":
            $('.note-letter').hide();
            $('.note-number').show();
            break;
        case "Letter":
            $('.note-letter').show();
            $('.note-number').hide();
            break;
        case "Letter_number":
            $('.note-letter').show();
            $('.note-number').show();
            break;
        default:
            break;
    }
}


// // // // // // //
//  主类  //
// // // // // // //

class Kalimba_Online {
    _kalimba = {};

    get soundfont() { return loadFromLocalStorage("soundfont", "Keylimba"); }
    get currentSoundfont () { return Soundfonts[this.soundfont]; }
    get arrangement() { return loadFromLocalStorage("arrangement", "Alternating"); }
    get keysCount() { return loadFromLocalStorage("keysCount", 17); }
    get labelType() { return loadFromLocalStorage("labelType", "Number"); }
    get kalimba () { return this._kalimba; }
    get baseNote() { return parseInt(loadFromLocalStorage("baseNote", allNotesSharp.indexOf("C4"))); }
    get tunes() { return loadFromLocalStorage("tunes", Array(21).fill(0).join(',')).split(",").map(Number); }
    // get tunes() { return loadJSONFromLocalStorage("tunes", Array(21).fill(0)); } // При переходе на формат json не читаются старые настройки
    get keyboardScheme () { return loadFromLocalStorage("keyboardScheme", 0); }
    get currentKeyboardScheme () { return keyboardSchemes[this.keyboardScheme]; }
    get volume() { return loadFromLocalStorage("volume", 75); }
    get recordedNotes() { return loadJSONFromLocalStorage("recordedNotes", Array(0)); }

    set soundfont(value) { saveToLocalStorage("soundfont", value); }
    set arrangement(value) { saveToLocalStorage("arrangement", value); }
    set keysCount(value) { saveToLocalStorage("keysCount", value); }
    set labelType(value) { saveToLocalStorage("labelType", value); }
    set kalimba(value) { this._kalimba = value; }
    set baseNote(value) { saveToLocalStorage("baseNote", value); }
    set tunes(value) { saveToLocalStorage("tunes", value); }
    // set tunes(value) { saveJSONToLocalStorage("tunes", value); }
    set keyboardScheme(value) { saveToLocalStorage("keyboardScheme", value); }
    set volume(value) { saveToLocalStorage("volume", value); }
    set recordedNotes(value) { saveJSONToLocalStorage("recordedNotes", value); }


    constructor() {
        this.loadSF();
    }

    // 标记，确定是否为触摸屏
    ifTouchscreen = false;

    // 缓冲变量，存储最后一次触摸板按下的按键
    lastTouchKeysPressed=[];

    // 加载 Kalimba 音频
    _audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 加载音频
    loadSF() {
        var KalimbaSF = Soundfont.instrument(this._audioContext, this.currentSoundfont.url);

        // 清除之前的按键
        $('.kalimba-container').empty();
        // 显示加载轮
        $('.kalimba-container').attr("aria-busy", true);

        // 更新事件
        KalimbaSF.then((k) => {
            // 获取新乐器
            this.kalimba = k;
            // 在屏幕上添加按键
            this.addKeys();
            // 隐藏加载轮
            $('.kalimba-container').removeAttr("aria-busy");
        });
    }

    // 返回带有当前设置的音符数组
    getNotes() {
        const majorIntervals = [2, 2, 1, 2, 2, 2, 1]; // 全音-全音-半音-全音-全音-全音-半音
        const minorIntervals = [2, 1, 2, 2, 1, 2, 2]; // 全音-半音-全音-全音-半音-全音-全音

        // 定义一个空数组用于填充
        const notes = [];
        // 获取起始（基准）音符，从它开始计数
        var currentIndex = this.baseNote;
        // 循环按键数量
        for (let i = 0; i < this.keysCount; i++) {
            // 将当前索引的按键添加到数组，并加上调音
            notes.push(allNotesSharp[currentIndex + this.tunes[i]]);
            // 根据选定的音阶向索引添加全音/半音
            currentIndex += majorIntervals[i%7];
        }
        // 返回最终数组
        return notes;
    }

    
    // 在表单上添加按键
    addKeys() {
        // 清除之前的按键
        $('.kalimba-container').empty();

        // 获取带有当前设置的音符数组
        let notesArray = this.getNotes();

        // 对音符进行排序
        let sortedNotes = notesArray;

        switch (this.arrangement) {
            case "Ascending":
                sortedNotes = notesArray;
                break;
            case "Alternating":
                sortedNotes = sortArrayKalimba(notesArray);
                break;
            case "Descending":
                sortedNotes = notesArray.slice().reverse();
                break;
            default:
                sortedNotes = notesArray;
                break;
        }

        // 遍历需要添加到字段的按键数组
        sortedNotes.forEach((note) => {
            // 获取按键编号，其中 C4 - 0, D4 - 1 等
            let num = notesArray.indexOf(note);
            // 将编号 8 9 10 ... 转换为 1 2 3 ...
            let labelNum = num % 7 + 1;

            // 确定需要在数字上方绘制多少个点
            let dots = "";
            for (let i = 0; i < Math.floor(num / 7); i++) dots += ".";
            if (dots === "..") dots = ":";

            // 获取按键的最终标签
            let label = dots + "\n" + labelNum;

            let keys = notesArray.length;
            let x = notesArray.indexOf(note);

            // 计算按键高度
            // let keyHeight = 165 + 5*(keys - x); // 直线型
            // let keyHeight = 315 - 5*(21-keys) - 30*Math.sqrt(x); // 幂函数型
            // let keyHeight = 280 - 4*(21-keys) - 25*Math.sqrt(x); // 幂函数型
            let keyHeight = 260 - 3*(21-keys) - 20*Math.sqrt(x); // 幂函数型

            let letter = note.replace(/#/g, '♯');

            // 根据编号获取键盘按键的标签
            let keyboardKey = this.currentKeyboardScheme[num];

            // 创建按键
            const keyZone = $('<div>')
                .addClass('key-zone')
                .attr('note', note)
                .attr('notenumber', notesArray.indexOf(note))
                .css('height', keyHeight + 'px')
                .append(
                    $('<div>').addClass('key').append(
                        $('<div>').addClass('note-text').append(
                            $('<span>').addClass('note-keyboard-key').text(keyboardKeys[keyboardKey])
                        ).append(
                            $('<span>').addClass('note-number').text(label)
                        ).append(
                            $('<span>').addClass('note-letter').text(letter.slice(0, -1)).append(
                                $('<sub>').text(letter.slice(-1))
                            )
                        )
                    )
                );

            /* 在 keyZone 中生成以下结构：
                <div class="key-zone" note="{note}" style="height: {keyHeight + 'px'};">
                    <div class="key">
                        <div class="note-text">
                            <span class="note-keyboard-key">{keyboardKeys[keyboardKey]}</span>
                            <span class="note-number">{label}</span>
                            <span class="note-letter">{letter.slice(0, -1)}<sub>{letter.slice(-1)}</sub></span>
                        </div>
                    </div>
                </div>
            */

            // 事件：鼠标单击按键
            keyZone.on('mousedown', () => {
                // 如果用户使用触摸屏，声音在其他事件中播放
                if (!this.ifTouchscreen) {
                    this.playSound(note);
                }
            });

            // 事件：按住鼠标并在按键上移动
            keyZone.on('mouseover', (event) => {
                // 如果按下鼠标且光标在按键内部（没有第二次检查，事件会被额外调用）
                if (isMouseDown && !$(event.relatedTarget).closest(keyZone).length) {
                    this.playSound(note);
                }
            });

            // 事件：手指单击按键
            keyZone.on('touchstart', (event) => {
                // 如果触发此事件，说明用户使用触摸屏
                this.ifTouchscreen = true;

                // let note = $(this).attr('note');
                this.playSound(note);
                // keyShake($('.key', this));

                // 查看最后一次触摸屏幕的位置
                let key = $(event.touches[event.touches.length - 1].target);
                // 查找父元素，直到它有 note 属性
                let i = 0;
                while (key.attr('note') === undefined && i<2) {
                    key = key.parent();
                    i++;
                }
                // 从属性获取音符并记录
                this.lastTouchKeysPressed[event.touches.length - 1] = key.attr('note');

            });

            // 事件：按住手指并在按键上移动
            keyZone.on('touchmove', (event) => {
                for (let j = 0; j < event.touches.length; j++) {
                    var touch = event.touches[j]; // 获取第一根手指的信息
                    var key = $(document.elementFromPoint(touch.clientX, touch.clientY));

                    let i = 0;
                    while (key.attr('note') === undefined && i<2) {
                        key = key.parent();
                        i++;
                        // if (i>2) console.log(i);
                    }
                    let note = key.attr('note');

                    if (note !== undefined && !this.lastTouchKeysPressed.includes(note)) {
                        this.lastTouchKeysPressed[j]=note;
                        this.playSound(note);
                    }
                }
            });

            // 将创建的按键添加到字段
            $('.kalimba-container').append(keyZone);
        });

        // 更新标签
        updateLabels();
    }

    // 播放声音
    playSound(note, options = { play: true, animate: true, record: true }) {

        // 如果 play 标志为 true，则播放声音
        if (options.play) {
            // 按对数刻度计算音量（感觉上不如普通刻度）：
            // let currentVolume = this.currentSoundfont.gain * Math.log10(1 + 9 * this.volume / 100);
            // 按普通刻度计算音量：
            let currentVolume = this.currentSoundfont.gain * this.volume / 100;
            // 以当前音量播放声音
            this._kalimba.play(note, 0, { gain: currentVolume });
        }

        // 如果 animate 标志为 true，则启动动画
        if (options.animate) {
            this.keyShake($(`.key-zone[note='${note}'] .key`));
        }
        console.log('Pressed \'' + note + '\' (' + allNotesSharp.indexOf(note) + ')');

        // 如果 record 和 isRecording 标志都为 true，则记录按下的音符
        if (options.record && isRecording) {
            // 如果是第一个按下的音符，则记录按下时间
            if (sequence.length == 0) prevTime = Date.now();
            // 记录当前时间
            var currentTime = Date.now();
            // 计算自上次按下音符以来经过的时间
            var timeElapsed = currentTime - prevTime;
            // 将音符添加到音符数组
            sequence.push({ soundId: note, time: timeElapsed });
            console.log('[REC] Recorded \'' + note + '\' with a duration of ' + timeElapsed + 'ms');
            // 将最后一次按键时间更新为当前时间
            prevTime = currentTime;
        }
    }
    
    // 播放按键抖动动画
    keyShake(keyObj) {
        keyObj.removeClass('key-click');
        setTimeout(() => {
            keyObj.addClass('key-click');
        }, 1);
    }
}

const kalimba_online = new Kalimba_Online();


// // // // // // // //
//  函数和方法  //
// // // // // // // //

// updateKeyboardSchemes 更新 Kalimba 按键上的键盘按键标签
function updateKeyboardSchemes() {
    $(".key-zone").each(function(){
        var notenumberValue = $(this).attr("notenumber");
        // 根据编号获取键盘按键的标签
        let keyboardKey = kalimba_online.currentKeyboardScheme[notenumberValue];

        if (keyboardKey !== undefined) {
            $(this).find(".note-keyboard-key").text(keyboardKeys[keyboardKey]);
        } else {
            $(this).find(".note-keyboard-key").empty();
        }
    });
}

// updateTunes 更新配置按键的控件（按键调音）
function updateTunes() {
    // 清空字段
    $('.tune-field').empty();

    // 获取带有当前设置的按键数组
    let notesArray = kalimba_online.getNotes();
    // 遍历按键
    notesArray.forEach((note, index) => {
        let letter = note.replace(/#/g, '♯');
        $('<label>', {
            'class': 'tune-label',
            'for': 'range-tune-'+index
        }).append(
            $('<input>', {
                'type': 'range',
                'min': '-1',
                'max': '1',
                'value': kalimba_online.tunes[index],
                'id': 'range-tune-' + index,
                'notenumber': index,
                'orient': 'vertical'
            }),
            $('<span>', {
                'id': 'range-tune-value-' + index,
            }).append(
                $('<small>').text(letter.slice(0, -1)).append(
                    $('<sub>').text(letter.slice(-1))
                )
            )
        ).appendTo('.tune-field');
    });

    // 按键设置滑块更改时的事件
    $('input', '.tune-label').on('input', function () {
        // 获取更改的按键的序号和新值
        let notenumber = parseInt($(this).attr('notenumber'));
        let tune = parseInt($(this).val());

        // 获取当前设置数组，更改并保存回去
        let tunes = kalimba_online.tunes;
        tunes[notenumber] = tune;
        kalimba_online.tunes = tunes;

        // 重新创建按键
        kalimba_online.addKeys();

        // 获取当前音符列表
        let notesArray = kalimba_online.getNotes();
        // 根据编号在数组中找到音符并将 # 替换为 ♯
        let letter = notesArray[notenumber].replace(/#/g, '♯');

        // 在按键设置中替换按键名称
        $('#range-tune-value-' + notenumber).empty().append(
            $('<small>').text(letter.slice(0, -1)).append(
                $('<sub>').text(letter.slice(-1))
            )
        );
        // 播放更改的按键的声音
        kalimba_online.playSound(notesArray[notenumber], { play: true, animate: true, record: false });
    });
}

// showKeyboardScheme 在键盘上高亮显示所选方案的按键
function showKeyboardScheme(keyMapScheme) {
    // 遍历键盘上的所有按键
    $('.kb_key', '.kb_container').each(function (index, key) {
        let keycode = $(key).data('keycode');
        // 如果按键在指定方案中，则添加类，否则移除
        if (keyMapScheme.includes(keycode)) {
            $(key).addClass('used');
        } else {
            $(key).removeClass('used');
        }
    });
}

// // // // // // // // // // //
//  页面渲染完成后  //
// // // // // // // // // // //

$(document).ready(function () {
    
    // 录制按钮点击事件
    $('#recordButton').click(function() {
        if (isRecording) {
            // 如果正在录制 - 停止
            isRecording = false;

            // 更改按钮上的图标
            $("#icon-record").show();
            $("#icon-spin").hide();

            // 如果至少录制了一个音符
            if (sequence.length > 0) {
                // 在最后一次按键和停止录制之间添加一个带间隔的空音符
                var timeElapsed = Date.now() - prevTime;
                sequence.push({ soundId: null, time: timeElapsed });

                // 激活播放按钮
                $("#playButton").attr("disabled", null);

                // 计算整个录制持续多少秒
                let duration = 0;
                for (let i = 0; i < sequence.length; i++) {
                    duration += sequence[i].time;
                }
                duration = duration/1000;
                // 为圆形进度条设置动画时间
                $("#playButton .loader").css('--anim-load-duration', duration+"s");

                // 将录制保存到 localStorage
                kalimba_online.recordedNotes = sequence;

                // 在日志中通知录制结束
                console.log('[REC] Recording stopped. Total duration: ' + duration + 's');
                console.log('[REC] Recorded sequence:', sequence);
            }
        } else {
            // 如果没有在录制 - 开始录制
            isRecording = true;

            // 在日志中通知开始录制
            console.log('[REC] Recording started');

            // 为录制的序列创建一个空数组
            sequence = [];

            // 更改按钮上的图标
            $("#icon-record").hide();
            $("#icon-spin").show();

            // 使播放按钮不活动
            $("#playButton").attr("disabled", "");
        }
    });

    // 播放按钮点击事件
    $('#playButton').click(function() {
        if (isPlaying) {
            // 如果正在播放 - 停止
            isPlaying = false;

            // 更改按钮上的图标
            $("#icon-play").show();
            $("#icon-pause").hide();
            $("#icon-load").hide();

            // 激活录制按钮
            $("#recordButton").attr("disabled", null);
        } else {
            // 如果没有在播放 - 开始播放
            isPlaying = true;
            let index = 0;

            // 声明一个递归函数，它播放当前音符并在暂停 sequence[index].time 后用下一个音符启动自己
            function playNextNote() {
                // 如果标志关闭，则结束播放
                if (!isPlaying) return;
                // 播放当前音符，参数为：无动画和无录制
                if (sequence[index].soundId != null) kalimba_online.playSound(sequence[index].soundId, { play: true, animate: false, record: false });
                // 增加索引（并循环）
                index = (index + 1) % sequence.length;
                // 在暂停后启动下一个音符
                setTimeout(playNextNote, sequence[index].time);
            }
            // 启动递归函数
            playNextNote();

            // 更改按钮上的图标
            $("#icon-play").hide();
            $("#icon-pause").show();
            $("#icon-load").show();

            // 使录制按钮不活动
            $("#recordButton").attr("disabled", "");
        }
    });

    // 检查 localStorage 中是否有录制
    if (kalimba_online.recordedNotes.length > 0) {
        // 从 localStorage 获取录制
        sequence = kalimba_online.recordedNotes;

        // 激活播放按钮
        $("#playButton").attr("disabled", null);

        // 计算整个录制持续多少秒
        let duration = 0;
        for (let i = 0; i < sequence.length; i++) {
            duration += sequence[i].time;
        }
        duration = duration/1000;
        // 为圆形进度条设置动画时间
        $("#playButton .loader").css('--anim-load-duration', duration+"s");
    }

    // 在页面上显示音量设置（从 localStorage）

        $('#range-volume').val(kalimba_online.volume);

        $('#range-volume-value').text(kalimba_online.volume);

        // 音量更改时的事件

        $('#range-volume').on('input', function () {

            kalimba_online.volume = $('#range-volume').val();

            $('#range-volume-value').text(kalimba_online.volume);

            kalimba_online.addKeys();

            updateTunes();

        });

    

        // 在页面上显示按键数量 keysCount（从 localStorage）

        $('#range-keys').val(kalimba_online.keysCount);

        $('#range-keys-value').text(kalimba_online.keysCount);

        // 按键数量更改时的事件

        $('#range-keys').on('input', function () {

            kalimba_online.keysCount = $('#range-keys').val();

            $('#range-keys-value').text(kalimba_online.keysCount);

            kalimba_online.addKeys();

            updateTunes();

        });

    

        updateTunes();

    

        // 在页面上显示基准按键 baseNote（从 localStorage）

        $('#range-baseNote').val(kalimba_online.baseNote);

        // $('#range-baseNote-value').text(allNotesSharp[kalimba_online.baseNote]);

        let letter = allNotesSharp[kalimba_online.baseNote].replace(/#/g, '♯');

        $('#range-baseNote-value').empty().append(

            $('<span>').text(letter.slice(0, -1)).append(

                $('<sub>').text(letter.slice(-1))

            )

        );

    

        // 基准音符更改时的事件

        $('#range-baseNote').on('input', function () {

            kalimba_online.baseNote = $('#range-baseNote').val();

            // $('#range-baseNote-value').text(allNotesSharp[kalimba_online.baseNote]);

    

            let letter = allNotesSharp[kalimba_online.baseNote].replace(/#/g, '♯');

            $('#range-baseNote-value').empty().append(

                $('<span>').text(letter.slice(0, -1)).append(

                    $('<sub>').text(letter.slice(-1))

                )

            );

            kalimba_online.addKeys();

    

            kalimba_online.playSound(allNotesSharp[kalimba_online.baseNote], { play: true, animate: false, record: false });

            updateTunes();

        });

    

        // 在页面上显示按键顺序 Arrangement（从 localStorage）

        $("input#"+kalimba_online.arrangement).prop('checked', true);

        // Arrangement 更改时的事件

        $('input', '#arrangement-radio-list').on("click", function () {

            kalimba_online.arrangement = $('input:checked', '#arrangement-radio-list').attr("id");

            kalimba_online.addKeys();

        });

    

        // 在页面上显示标签类型 Labeltype（从 localStorage）

        $("input#" + kalimba_online.labelType).prop('checked', true);

        // Labeltype 更改时的事件

        $('input', '#labeltype-radio-list').on("click", function () {

            kalimba_online.labelType = $('input:checked', '#labeltype-radio-list').attr("id");

            updateLabels();

        });

    

    

        // 在页面上显示音源集 Soundfont（从 localStorage）

        $('#soundfonts').val(kalimba_online.soundfont);

        $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);

        // Soundfont 更改时的事件

        $('#soundfonts').change(function () {

            kalimba_online.soundfont = $(this).val();

            kalimba_online.loadSF();

            $("#soundfonts_source").attr("href", kalimba_online.currentSoundfont.sourceUrl);

        });

    

        // keydown 事件处理器

        $(document).on('keydown', function (event) {

    

            // 检查按下的按键是否有音符

            if (kalimba_online.currentKeyboardScheme.includes(event.keyCode)) {

                // 获取按下按键的编号和音符数组

                let keyNum = kalimba_online.currentKeyboardScheme.indexOf(event.keyCode);

                let notesArray = kalimba_online.getNotes();

                // 如果按下空格，提高八度

                if (isSpacePressed) keyNum +=7;

                // 播放声音

                if (notesArray.hasOwnProperty(keyNum)) kalimba_online.playSound(notesArray[keyNum]);

            }

        });

    

    

        // 在页面上添加键盘

        // 遍历键盘行

        keyboardKeyInfo.forEach(row => {

            const rowElement = $('<div class="kb_row"></div>');

            // 遍历行中的按键

            row.forEach(key => {

                // 创建按键标签并将其添加到页面

                $('<div class="kb_key"></div>')

                    .text(keyboardKeys[key.code])

                    .css('flex-grow', key.length)

                    .attr("data-keycode", key.code)

                    .appendTo(rowElement);

            });

            // 将创建的行添加到页面上的键盘容器

            $('#keyboard_container').append(rowElement);

        });

    

        // 显示存储在 keyboardSchemes 数组中的键盘控制方案

        keyboardSchemes.forEach(function(_key, index) {

            $('<label style="padding-right: 1.4em;">')

                .appendTo($('#keyboard_schemes'))

                .append(

                    $('<input type="radio" name="kb_scheme">')

                        .attr('data-schemeid', index)

                        .prop('checked', index == kalimba_online.keyboardScheme)

                )

                .append(' ')

                .append($('<span>').text(index + 1));

        });

        // 在键盘上显示当前方案

        showKeyboardScheme(kalimba_online.currentKeyboardScheme);

        // 标记当前选中的方案

        $("input#"+kalimba_online.currentKeyboardScheme).prop('checked', true);

        // 创建方案更改事件

        $('input', '#keyboard_control').on("click", function () {

            kalimba_online.keyboardScheme = $('input:checked', '#keyboard_control').data("schemeid");

            showKeyboardScheme(kalimba_online.currentKeyboardScheme);

            updateKeyboardSchemes();

        });

    });