// ==UserScript==
// @name         芯位教育新界面自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  新版界面的芯位自动下一集脚本（其他功能还没加（菜
// @author       PoiYee,Code-dogcreatior
// @match        *://*.51xinwei.com/*
// @icon         *://*.51xinwei.com/*
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

    // 点击下一章节按钮并模拟鼠标移动
    function autoClickAndMove() {
        var nextChapterButton = document.querySelector('.button-box > .left');
        if (nextChapterButton) {
            nextChapterButton.click();
            console.log('Next chapter button clicked.');
        }
       // 模拟鼠标移动
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        window.scrollTo(x, y);
        console.log('Mouse simulated at position (' + x + ', ' + y + ').');
    }

    // 每分钟执行一次点击和模拟鼠标移动
   // setInterval(autoClickAndMove, 60000); // 60秒 * 1000 毫秒

    // 使用 MutationObserver 监听 DOM 变化，以备不时之需
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // element added to DOM
                autoClickAndMove();

                // 检查是否有视频元素
                var videoElement = document.querySelector('video');
                if (videoElement) {
                    // 检查静音按钮的标题是否为 "静音"
                    var muteButton = document.querySelector('.vjs-mute-control');
                    if (muteButton && muteButton.getAttribute('title') === '静音') {
                        // 如果静音按钮的标题为 "静音"，则点击它
                        muteButton.click();
                        console.log('Video muted.');
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
