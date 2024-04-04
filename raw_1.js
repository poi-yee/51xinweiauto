// ==UserScript==
// @name         芯位教育新界面自动下一集
// @namespace    https://github.com/poi-yee/51xinweiauto
// @version      0.2.1
// @description  新版界面的芯位自动下一集脚本（其他功能还没加（菜
// @author       PoiYee,Code-dogcreatior
// @license      GPL License
// @match        *://*.51xinwei.com/*
// @icon         *://*.51xinwei.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/490485/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E6%96%B0%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/490485/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E6%96%B0%E7%95%8C%E9%9D%A2%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建控制面板
    var controlPanel = document.createElement('div');
    controlPanel.innerHTML = `
        <div style="position: fixed; bottom: 10px; right: 10px; z-index: 1000; background: white; border: 1px solid black; padding: 10px;">
            <div>
                <label><input type="checkbox" id="autoClickAndMoveSwitch"> 自动点击下一集并模拟鼠标移动</label>
            </div>
            <div>
                <label><input type="checkbox" id="autoMuteSwitch"> 自动静音视频</label>
            </div>
            <div>
                <label><input type="checkbox" id="autoAnswerSwitch"> 自动答题</label>
            </div>
        </div>
    `;
    document.body.appendChild(controlPanel);

    // 恢复开关状态
    var autoClickAndMoveEnabled = localStorage.getItem('autoClickAndMoveEnabled') === 'true';
    var autoMuteEnabled = localStorage.getItem('autoMuteEnabled') === 'true';
    var autoAnswerEnabled = localStorage.getItem('autoAnswerEnabled') === 'true';
    document.getElementById('autoClickAndMoveSwitch').checked = autoClickAndMoveEnabled;
    document.getElementById('autoMuteSwitch').checked = autoMuteEnabled;
    document.getElementById('autoAnswerSwitch').checked = autoAnswerEnabled;

    // 监听开关变化并保存状态
    document.getElementById('autoClickAndMoveSwitch').addEventListener('change', function() {
        autoClickAndMoveEnabled = this.checked;
        localStorage.setItem('autoClickAndMoveEnabled', autoClickAndMoveEnabled);
    });
    document.getElementById('autoMuteSwitch').addEventListener('change', function() {
        autoMuteEnabled = this.checked;
        localStorage.setItem('autoMuteEnabled', autoMuteEnabled);
    });
    document.getElementById('autoAnswerSwitch').addEventListener('change', function() {
        autoAnswerEnabled = this.checked;
        localStorage.setItem('autoAnswerEnabled', autoAnswerEnabled);
    });

    // 检查当前网页URL是否匹配
    if (!/^https:\/\/www\.51xinwei\.com\/student\/#\/courseInfo\//.test(window.location.href)) {
        console.log('脚本已停止，当前网页不匹配指定的URL。');
        return;
    }

    // 自动下一集并模拟鼠标移动
    function autoClickAndMove() {
        if (!autoClickAndMoveEnabled) return;
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
    setInterval(autoClickAndMove, 60000); // 60秒 * 1000 毫秒

    // 使用 MutationObserver 监听 DOM 变化，以备不时之需
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // element added to DOM
                autoClickAndMove();

                // 检查是否有视频元素
                var videoElement = document.querySelector('video');
                if (videoElement && autoMuteEnabled) {
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

    // 单选题和判断题的按钮JS路径
    var singleChoiceButtonSelectors = {
        'A': "label:nth-child(1) > span.el-radio__input > span",
        'B': "label:nth-child(2) > span.el-radio__input > span",
        'C': "label:nth-child(3) > span.el-radio__input > span",
        'D': "label:nth-child(4) > span.el-radio__input > span",
        'T': "label:nth-child(1) > span.el-radio__input > span",
        'F': "label:nth-child(2) > span.el-radio__input > span"
    };

    // 多选题的按钮JS路径
    var multipleChoiceButtonSelectors = {
        'A': "label:nth-child(1) > span.el-checkbox__input > span",
        'B': "label:nth-child(2) > span.el-checkbox__input > span",
        'C': "label:nth-child(3) > span.el-checkbox__input > span",
        'D': "label:nth-child(4) > span.el-checkbox__input > span"
    };

    // 下一题按钮的JS路径
    var nextButtonSelector = "#app > section > main > div > div > div.loading-container > div.content-area > div.content > div.toggle-box > button:nth-child(2)";

    // 延迟函数
    function delay(duration) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // 模拟点击函数
    async function simulateClick(selector) {
        await delay(1000); // 延迟1秒
        var button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log('Clicked:', selector);
        } else {
            console.log('Button not found for selector:', selector);
        }
    }

    // 自动答题主处理函数
    async function processHomework(homeworkData) {
        if (!autoAnswerEnabled) return;
        await delay(5000); // 开始答题前延迟5秒
        for (const topic of homeworkData.homeworkTopicList) {
            var buttonSelectors = topic.topicType === 'duoxuan' ? multipleChoiceButtonSelectors : singleChoiceButtonSelectors;
            var correctAnswers = topic.topicQuestionCoreDtoList.filter(q => q.isAnswer);
            for (const answer of correctAnswers) {
                var buttonSelector = buttonSelectors[answer.index];
                if (buttonSelector) {
                    await simulateClick(buttonSelector);
                }
            }
            // 点击下一题按钮
            await simulateClick(nextButtonSelector);
        }
    }

    // 监听XHR请求
    window.addEventListener('load', function() {
        console.log('Script loaded successfully.');

        var open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            console.log('XHR open event triggered.');
            this.addEventListener('load', async function() {
                console.log('XHR load event triggered.');
                if (this.responseURL && this.responseURL.includes('/api/learning-service/admin/studentLearning/getHomeworkPaperDetail/')) {
                    console.log('XHR URL matched:', this.responseURL);
                    var responseData = JSON.parse(this.responseText);
                    if (responseData && responseData.code === 200 && responseData.data) {
                        console.log('XHR 响应数据:', responseData.data);
                        await processHomework(responseData.data);
                    } else {
                        console.log('XHR response data is invalid or incomplete.');
                    }
                } else {
                    console.log('XHR URL did not match the required pattern.');
                }
            });
            open.apply(this, arguments);
        };
    });
})();

