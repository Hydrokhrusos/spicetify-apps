import { registerLocale, type LocaleData } from 'i18n-iso-countries';

import * as afLocale from 'i18n-iso-countries/langs/af.json';
import * as amLocale from 'i18n-iso-countries/langs/am.json';
import * as arLocale from 'i18n-iso-countries/langs/ar.json';
import * as azLocale from 'i18n-iso-countries/langs/az.json';
import * as bgLocale from 'i18n-iso-countries/langs/bg.json';
import * as bnLocale from 'i18n-iso-countries/langs/bn.json';
import * as bsLocale from 'i18n-iso-countries/langs/bs.json';
import * as caLocale from 'i18n-iso-countries/langs/ca.json';
import * as csLocale from 'i18n-iso-countries/langs/cs.json';
import * as daLocale from 'i18n-iso-countries/langs/da.json';
import * as deLocale from 'i18n-iso-countries/langs/de.json';
import * as elLocale from 'i18n-iso-countries/langs/el.json';
import * as enLocale from 'i18n-iso-countries/langs/en.json';
import * as esLocale from 'i18n-iso-countries/langs/es.json';
import * as etLocale from 'i18n-iso-countries/langs/et.json';
import * as euLocale from 'i18n-iso-countries/langs/eu.json';
import * as faLocale from 'i18n-iso-countries/langs/fa.json';
import * as fiLocale from 'i18n-iso-countries/langs/fi.json';
import * as frLocale from 'i18n-iso-countries/langs/fr.json';
import * as glLocale from 'i18n-iso-countries/langs/gl.json';
import * as heLocale from 'i18n-iso-countries/langs/he.json';
import * as hiLocale from 'i18n-iso-countries/langs/hi.json';
import * as hrLocale from 'i18n-iso-countries/langs/hr.json';
import * as huLocale from 'i18n-iso-countries/langs/hu.json';
import * as idLocale from 'i18n-iso-countries/langs/id.json';
import * as isLocale from 'i18n-iso-countries/langs/is.json';
import * as itLocale from 'i18n-iso-countries/langs/it.json';
import * as jaLocale from 'i18n-iso-countries/langs/ja.json';
import * as koLocale from 'i18n-iso-countries/langs/ko.json';
import * as ltLocale from 'i18n-iso-countries/langs/lt.json';
import * as lvLocale from 'i18n-iso-countries/langs/lv.json';
import * as mkLocale from 'i18n-iso-countries/langs/mk.json';
import * as mlLocale from 'i18n-iso-countries/langs/ml.json';
import * as mrLocale from 'i18n-iso-countries/langs/mr.json';
import * as msLocale from 'i18n-iso-countries/langs/ms.json';
import * as nbLocale from 'i18n-iso-countries/langs/nb.json';
import * as nlLocale from 'i18n-iso-countries/langs/nl.json';
import * as plLocale from 'i18n-iso-countries/langs/pl.json';
import * as ptLocale from 'i18n-iso-countries/langs/pt.json';
import * as roLocale from 'i18n-iso-countries/langs/ro.json';
import * as ruLocale from 'i18n-iso-countries/langs/ru.json';
import * as skLocale from 'i18n-iso-countries/langs/sk.json';
import * as slLocale from 'i18n-iso-countries/langs/sl.json';
import * as srLocale from 'i18n-iso-countries/langs/sr.json';
import * as svLocale from 'i18n-iso-countries/langs/sv.json';
import * as swLocale from 'i18n-iso-countries/langs/sw.json';
import * as taLocale from 'i18n-iso-countries/langs/ta.json';
import * as trLocale from 'i18n-iso-countries/langs/tr.json';
import * as ukLocale from 'i18n-iso-countries/langs/uk.json';
import * as urLocale from 'i18n-iso-countries/langs/ur.json';
import * as viLocale from 'i18n-iso-countries/langs/vi.json';
import * as zhLocale from 'i18n-iso-countries/langs/zh.json';

const spotifyLocaleToISOCountryLocale: Record<string, string> = {
    // Afrikaans
    af: 'af',
    // Amharic
    am: 'am',
    // Arabic
    ar: 'ar',
    'ar-EG': 'ar',
    'ar-MA': 'ar',
    'ar-SA': 'ar',
    // Azerbaijani
    az: 'az',
    // Bulgarian
    bg: 'bg',
    // Bengali
    bn: 'bn',
    // Bosnian
    bs: 'bs',
    // Catalan
    ca: 'ca',
    // Czech
    cs: 'cs',
    // Danish
    da: 'da',
    // German
    de: 'de',
    // Greek
    el: 'el',
    // English
    en: 'en',
    'en-GB': 'en',
    // Spanish
    es: 'es',
    'es-AR': 'es',
    'es-MX': 'es',
    'es-419': 'es',
    // Estonian
    et: 'et',
    // Basque
    eu: 'eu',
    // Persian
    fa: 'fa',
    // Finnish
    fi: 'fi',
    // French
    fr: 'fr',
    'fr-CA': 'fr',
    // Galician
    gl: 'gl',
    // Hebrew
    he: 'he',
    // Hindi
    hi: 'hi',
    // Croatian
    hr: 'hr',
    // Hungarian
    hu: 'hu',
    // Indonesian
    id: 'id',
    // Icelandic
    is: 'is',
    // Italian
    it: 'it',
    // Japanese
    ja: 'ja',
    // Korean
    ko: 'ko',
    // Lithuanian
    lt: 'lt',
    // Latvian
    lv: 'lv',
    // Macedonian
    mk: 'mk',
    // Malayalam
    ml: 'ml',
    // Marathi
    mr: 'mr',
    // Malay
    ms: 'ms',
    // Norwegian
    nb: 'nb',
    // Dutch
    nl: 'nl',
    // Polish
    pl: 'pl',
    // Portuguese
    'pt-BR': 'pt',
    'pt-PT': 'pt',
    // Romanian
    ro: 'ro',
    // Russian
    ru: 'ru',
    // Slovak
    sk: 'sk',
    // Slovene
    sl: 'sl',
    // Serbian
    sr: 'sr',
    // Swedish
    sv: 'sv',
    // Swahili
    sw: 'sw',
    // Tamil
    ta: 'ta',
    // Turkish
    tr: 'tr',
    // Ukrainian
    uk: 'uk',
    // Urdu
    ur: 'ur',
    // Vietnamese
    vi: 'vi',
    // Chinese
    'zh-CN': 'zh',
    'zh-HK': 'zh',
    'zh-TW': 'zh',
};

const locales: Record<string, LocaleData> = {
    af: afLocale,
    am: amLocale,
    ar: arLocale,
    az: azLocale,
    bg: bgLocale,
    bn: bnLocale,
    bs: bsLocale,
    ca: caLocale,
    cs: csLocale,
    da: daLocale,
    de: deLocale,
    el: elLocale,
    en: enLocale,
    es: esLocale,
    et: etLocale,
    eu: euLocale,
    fa: faLocale,
    fi: fiLocale,
    fr: frLocale,
    gl: glLocale,
    he: heLocale,
    hi: hiLocale,
    hr: hrLocale,
    hu: huLocale,
    id: idLocale,
    is: isLocale,
    it: itLocale,
    ja: jaLocale,
    ko: koLocale,
    lt: ltLocale,
    lv: lvLocale,
    mk: mkLocale,
    ml: mlLocale,
    mr: mrLocale,
    ms: msLocale,
    nb: nbLocale,
    nl: nlLocale,
    pl: plLocale,
    pt: ptLocale,
    ro: roLocale,
    ru: ruLocale,
    sk: skLocale,
    sl: slLocale,
    sr: srLocale,
    sv: svLocale,
    sw: swLocale,
    ta: taLocale,
    tr: trLocale,
    uk: ukLocale,
    ur: urLocale,
    vi: viLocale,
    zh: zhLocale,
};

/**
 * Maps Spotify locale codes to ISO countries locale codes.
 * @param spotifyLocale The Spotify locale code (e.g., 'en', 'fr', 'es-ES').
 * @returns The corresponding ISO countries locale code (e.g., 'en', 'fr'), or 'en' if not found.
 */
export const getIsoCountriesLocale = (spotifyLocale: string): string => {
    return spotifyLocaleToISOCountryLocale[spotifyLocale] ?? 'en';
};

/**
 * Registers the locale for i18n-iso-countries.
 * @param isoCountriesLocale The locale code (e.g., 'en', 'fr').
 */
export const registerMapLocale = (isoCountriesLocale: string) => {
    registerLocale(locales[isoCountriesLocale]);
};
