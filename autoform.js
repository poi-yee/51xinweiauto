(function() {
    'use strict';
        // 检查当前网页URL是否匹配
    if (!/^https:\/\/www\.51xinwei\.com\/student\/#\/courseInfo\//.test(window.location.href)) {
        console.log('脚本已停止，当前网页不匹配指定的URL。');
        return;
    }

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

    // 主处理函数
    async function processHomework(homeworkData) {
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
