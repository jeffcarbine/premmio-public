/**
 * Returns the currency code for a given country code.
 *
 * @param {string} code - The country code (ISO 3166-1 alpha-2).
 * @returns {string} The currency code for the given country.
 */
export const countryToCurrency = (code) => {
  const currencyList = {
    AD: "EUR", // Andorra
    AE: "AED", // United Arab Emirates
    AF: "AFN", // Afghanistan
    AG: "XCD", // Antigua and Barbuda
    AI: "XCD", // Anguilla
    AL: "ALL", // Albania
    AM: "AMD", // Armenia
    AO: "AOA", // Angola
    AR: "ARS", // Argentina
    AS: "USD", // American Samoa
    AT: "EUR", // Austria
    AU: "AUD", // Australia
    AW: "AWG", // Aruba
    AX: "EUR", // Åland Islands
    AZ: "AZN", // Azerbaijan
    BA: "BAM", // Bosnia and Herzegovina
    BB: "BBD", // Barbados
    BD: "BDT", // Bangladesh
    BE: "EUR", // Belgium
    BF: "XOF", // Burkina Faso
    BG: "BGN", // Bulgaria
    BH: "BHD", // Bahrain
    BI: "BIF", // Burundi
    BJ: "XOF", // Benin
    BL: "EUR", // Saint Barthélemy
    BM: "BMD", // Bermuda
    BN: "BND", // Brunei
    BO: "BOB", // Bolivia
    BQ: "USD", // Bonaire
    BR: "BRL", // Brazil
    BS: "BSD", // Bahamas
    BT: "Btn", // Bhutan
    BV: "NOK", // Bouvet Island
    BW: "BWP", // Botswana
    BY: "BYN", // Belarus
    BZ: "BZD", // Belize
    CA: "CAD", // Canada
    CC: "AUD", // Cocos (Keeling) Islands
    CD: "CDF", // Congo (Democratic Republic)
    CF: "XAF", // Central African Republic
    CG: "XAF", // Congo
    CH: "CHF", // Switzerland
    CI: "XOF", // Côte d'Ivoire
    CK: "NZD", // Cook Islands
    CL: "CLP", // Chile
    CM: "XAF", // Cameroon
    CN: "CNY", // China
    CO: "COP", // Colombia
    CR: "CRC", // Costa Rica
    CU: "CUP", // Cuba
    CV: "CVE", // Cape Verde
    CW: "ANG", // Curaçao
    CX: "AUD", // Christmas Island
    CY: "EUR", // Cyprus
    CZ: "CZK", // Czech Republic
    DE: "EUR", // Germany
    DJ: "DJF", // Djibouti
    DK: "DKK", // Denmark
    DM: "XCD", // Dominica
    DO: "DOP", // Dominican Republic
    DZ: "DZD", // Algeria
    EC: "USD", // Ecuador
    EE: "EUR", // Estonia
    EG: "EGP", // Egypt
    EH: "MAD", // Western Sahara
    ER: "ERN", // Eritrea
    ES: "EUR", // Spain
    ET: "ETB", // Ethiopia
    FI: "EUR", // Finland
    FJ: "FJD", // Fiji
    FK: "FKP", // Falkland Islands
    FM: "USD", // Micronesia
    FO: "DKK", // Faroe Islands
    FR: "EUR", // France
    GA: "XAF", // Gabon
    GB: "GBP", // United Kingdom
    GD: "XCD", // Grenada
    GE: "GEL", // Georgia
    GF: "EUR", // French Guiana
    GG: "GBP", // Guernsey
    GH: "GHS", // Ghana
    GI: "GIP", // Gibraltar
    GL: "DKK", // Greenland
    GM: "GMD", // Gambia
    GN: "GNF", // Guinea
    GP: "EUR", // Guadeloupe
    GQ: "XAF", // Equatorial Guinea
    GR: "EUR", // Greece
    GS: "GBP", // South Georgia and the South Sandwich Islands
    GT: "GTQ", // Guatemala
    GU: "USD", // Guam
    GW: "XOF", // Guinea-Bissau
    GY: "GYD", // Guyana
    HK: "HKD", // Hong Kong
    HM: "AUD", // Heard Island and McDonald Islands
    HN: "HNL", // Honduras
    HR: "HRK", // Croatia
    HT: "HTG", // Haiti
    HU: "HUF", // Hungary
    ID: "IDR", // Indonesia
    IE: "EUR", // Ireland
    IL: "ILS", // Israel
    IM: "GBP", // Isle of Man
    IN: "INR", // India
    IO: "USD", // British Indian Ocean Territory
    IQ: "IQD", // Iraq
    IR: "IRR", // Iran
    IS: "ISK", // Iceland
    IT: "EUR", // Italy
    JE: "GBP", // Jersey
    JM: "JMD", // Jamaica
    JO: "JOD", // Jordan
    JP: "JPY", // Japan
    KE: "KES", // Kenya
    KG: "KGS", // Kyrgyzstan
    KH: "KHR", // Cambodia
    KI: "AUD", // Kiribati
    KM: "KMF", // Comoros
    KN: "XCD", // Saint Kitts and Nevis
    KP: "KPW", // North Korea
    KR: "KRW", // South Korea
    KW: "KWD", // Kuwait
    KY: "KYD", // Cayman Islands
    KZ: "KZT", // Kazakhstan
    LA: "LAK", // Laos
    LB: "LBP", // Lebanon
    LC: "XCD", // Saint Lucia
    Li: "CHF", // Liechtenstein
    LK: "LKR", // Sri Lanka
    LR: "LRD", // Liberia
    LS: "LSL", // Lesotho
    LT: "EUR", // Lithuania
    LU: "EUR", // Luxembourg
    LV: "EUR", // Latvia
    LY: "LYD", // Libya
    MA: "MAD", // Morocco
    MC: "EUR", // Monaco
    MD: "MDL", // Moldova
    ME: "EUR", // Montenegro
    MF: "EUR", // Saint Martin (French part)
    MG: "MGA", // Madagascar
    MH: "USD", // Marshall Islands
    MK: "MKD", // North Macedonia
    ML: "XOF", // Mali
    MM: "MMK", // Myanmar
    MN: "MNT", // Mongolia
    MO: "MOP", // Macao
    MP: "USD", // Northern Mariana Islands
    MQ: "EUR", // Martinique
    MR: "MRU", // Mauritania
    MS: "XCD", // Montserrat
    MT: "EUR", // Malta
    MU: "MUR", // Mauritius
    MV: "MVR", // Maldives
    MW: "MWK", // Malawi
    MX: "MXN", // Mexico
    MY: "MYR", // Malaysia
    MZ: "MZN", // Mozambique
    NA: "NAD", // Namibia
    NC: "XPF", // New Caledonia
    NE: "XOF", // Niger
    NF: "AUD", // Norfolk Island
    NG: "NGN", // Nigeria
    NI: "NIO", // Nicaragua
    NL: "EUR", // Netherlands
    NO: "NOK", // Norway
    NP: "NPR", // Nepal
    NR: "AUD", // Nauru
    NU: "NZD", // Niue
    NZ: "NZD", // New Zealand
    OM: "OMR", // Oman
    PA: "PAB", // Panama
    PE: "PEN", // Peru
    PF: "XPF", // French Polynesia
    PG: "PGK", // Papua New Guinea
    PH: "PHP", // Philippines
    PK: "PKR", // Pakistan
    PL: "PLN", // Poland
    PM: "EUR", // Saint Pierre and Miquelon
    PN: "NZD", // Pitcairn
    PR: "USD", // Puerto Rico
    PS: "ILS", // Palestine, State of
    PT: "EUR", // Portugal
    PW: "USD", // Palau
    PY: "PYG", // Paraguay
    QA: "QAR", // Qatar
    RE: "EUR", // Réunion
    RO: "RON", // Romania
    RS: "RSD", // Serbia
    RU: "RUB", // Russia
    RW: "RWF", // Rwanda
    SA: "SAR", // Saudi Arabia
    SB: "SBD", // Solomon Islands
    SC: "SCR", // Seychelles
    SD: "SDG", // Sudan
    SE: "SEK", // Sweden
    SG: "SGD", // Singapore
    SH: "SHP", // Saint Helena, Ascension and Tristan da Cunha
    SI: "EUR", // Slovenia
    SJ: "NOK", // Svalbard and Jan Mayen
    SK: "EUR", // Slovakia
    SL: "SLL", // Sierra Leone
    SM: "EUR", // San Marino
    SN: "XOF", // Senegal
    SO: "SOS", // Somalia
    SR: "SRD", // Suriname
    SS: "SSP", // South Sudan
    ST: "STN", // Sao Tome and Principe
    SV: "USD", // El Salvador
    SX: "ANG", // Sint Maarten (Dutch part)
    SY: "SYP", // Syrian Arab Republic
    SZ: "SZL", // Eswatini
    TC: "USD", // Turks and Caicos Islands
    TD: "XAF", // Chad
    TF: "EUR", // French Southern Territories
    TG: "XOF", // Togo
    TH: "THB", // Thailand
    TJ: "TJS", // Tajikistan
    TK: "NZD", // Tokelau
    TL: "USD", // Timor-Leste
    TM: "TMT", // Turkmenistan
    TN: "TND", // Tunisia
    TO: "TOP", // Tonga
    TR: "TRY", // Turkey
    TT: "TTD", // Trinidad and Tobago
    TV: "AUD", // Tuvalu
    TW: "TWD", // Taiwan, Province of China
    TZ: "TZS", // Tanzania, United Republic of
    UA: "UAH", // Ukraine
    UG: "UGX", // Uganda
    UM: "USD", // United States Minor Outlying Islands
    US: "USD", // United States
    UY: "UYU", // Uruguay
    UZ: "UZS", // Uzbekistan
    VA: "EUR", // Holy See
    VC: "XCD", // Saint Vincent and the Grenadines
    VE: "VES", // Venezuela, Bolivarian Republic of
    VG: "USD", // Virgin Islands, British
    VI: "USD", // Virgin Islands, U.S.
    VN: "VND", // Vietnam
    VU: "VUV", // Vanuatu
    WF: "XPF", // Wallis and Futuna
    WS: "WST", // Samoa
    YE: "YER", // Yemen
    YT: "EUR", // Mayotte
    ZA: "ZAR", // South Africa
    ZM: "ZMW", // Zambia
    ZW: "ZWL", // Zimbabwe
  };

  return currencyList[code];
};
