// ==UserScript==
// @name         test
// @version      0.2.0
// @description  自动登录 DGUT 的校园网。
// @license      MIT
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @supportURL   https://github.com/g-plane/dgut-network-login
// @match        http://10.255.255.34/authentication
// @grant        none
// ==/UserScript==

(() => {
    'use strict'
    let tt = setInterval(() => {
        var random1 = Math.random() * (15 - 10) + 10;
        document.body.scrollTop += 1
    }, 1000)
})()

let tt = setInterval(() => {
    var random1 = Math.random() * (15 - 10) + 10;
    document.documentElement.scrollTop += random1
}, 1000)
