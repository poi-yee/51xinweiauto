// ==UserScript==
// @name         芯位教育新界面自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新版界面的芯位自动下一集脚本（其他功能还没加（菜
// @author       PoiYee
// @match        *://*.51xinwei.com/*
// @icon         *://*.51xinwei.com/*
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // element added to DOM
                var hasNewNodes = Array.from(mutation.addedNodes).some(node => node.nodeType === 1);
                if (hasNewNodes) {
                    // check if a new node has the specific class and data attribute
                    var element = document.querySelector('.left');
                    if (element) {
                        element.click();
                        console.log('Element clicked.');
                    }
                }
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(document.body, config);
})();
