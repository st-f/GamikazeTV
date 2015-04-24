/**
 * Created with IntelliJ IDEA.
 * User: stephaneschittly
 * Date: 28/05/13
 * Time: 01:26
 * To change this template use File | Settings | File Templates.
 */
var currentLocale = 'ar_AE';

function initLocalization() {
    var language = window.navigator.userLanguage || window.navigator.language;
    //opera
    if (language == "fr") {
        language = "fr_FR";
    }
    else {
        language = "en_US";
    }
    currentLocale = language.substring(0, 2) + '_' + language.substring(3, 5).toUpperCase();
    $('#localeSelect').val(currentLocale);
    initLanguagesResources();
}

function initLanguagesResources() {
    //alert("test: " + currentLocale);
    jQuery.i18n.properties({
        name: 'resource',
        path: 'locale/' + currentLocale + '/',
        mode: 'both',
        language: currentLocale,
        callback: function () {
            $('#taglineDiv').html(tagline);
        }
    });
}

function changeLocale(newLocale) {
    currentLocale = newLocale;
    initLanguagesResources();
}