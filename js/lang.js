
var langs = [
    {code: 'ru', text: 'Russian (Русский)'}, // 俄语
    {code: 'en', text: 'English (English)'}, // 英语
    {code: 'de', text: 'German (Deutsch)'}, // 德语
    {code: 'es', text: 'Spanish (Español)'}, // 西班牙语
    {code: 'fr', text: 'French (Français)'}, // 法语
    {code: 'zh-CN', text: 'Chinese (中文)'}, // 中文（简体）
    {code: 'ar', text: 'Arabic (العربية)'}, // 阿拉伯语
    {code: 'pt', text: 'Portuguese (Português)'}, // 葡萄牙语
    {code: 'ja', text: 'Japanese (日本語)'}, // 日语
    {code: 'id', text: 'Indonesian (Bahasa Indonesia)'} // 印尼语
];

// 按 text 字段对语言数组进行排序
langs.sort(function(a, b) {
    var textA = a.text.toUpperCase();
    var textB = b.text.toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});

var currentLang = window.localStorage && null !== window.localStorage.getItem("localization") ? window.localStorage.getItem("localization") : getUserLang();

// 返回用户语言代码
function getUserLang() {
    // 从 navigator.languages 获取用户首选语言
    var userLangs = navigator.languages;

    // 按优先级遍历语言
    for (var i = 0; i < userLangs.length; i++) {
        // 在 langs 数组中查找用户语言
        var userLanguage = langs.find(function(lang) {
            return lang.code === userLangs[i];
        });
        // 如果找到语言，则返回其代码
        if (userLanguage) return userLanguage.code;
    }

    // 如果没有找到任何语言，则返回英语代码
    return 'en';
}

// 加载默认语言（以防所选语言中某些键没有本地化）
var defaultLocalization;
$.getJSON('/lang/en.json', function(data) {
    defaultLocalization = data;
});

// 将整个页面翻译为指定语言
function loadLanguage(lang) {
    $.getJSON('/lang/' + lang + '.json', function(data) {
        $('html').attr('lang', lang);
        $('[data-i18n]').each(function() {
            var key = $(this).data('i18n');
            // 如果本地化中没有该键，则从默认语言中获取
            $(this).text(data[key] || defaultLocalization[key]);
        });
        $('meta[name="description"]').attr('content', data["seo.description"] || defaultLocalization["seo.description"]);
    });
}

// 用可用语言填充页面上的语言选择元素
function fillLangSelector() {
    const LangSelector = $('#localization');
    LangSelector.empty();
    langs.forEach(lang => {
        LangSelector.append(
            $('<option>', {
                value: lang.code,
                text: lang.text
            })
        );
    });
    LangSelector.val(currentLang);
}

$(document).ready(function() {
    // 用可用语言填充页面上的语言选择元素
    fillLangSelector();

    // 加载当前语言
    loadLanguage(currentLang);

    // 本地化更改时的事件
    $('#localization').change(function () {
        currentLang = $(this).val();
        window.localStorage && window.localStorage.setItem("localization", currentLang);
        loadLanguage(currentLang);
    });
});