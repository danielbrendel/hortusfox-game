import './../sass/app.scss';
require('phaser');

window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.currentPromptCallback = function(text) {};

window.ajaxRequest = function (method, url, data = {}, successfunc = function(data){}, finalfunc = function(){}, config = {})
{
    let func = window.axios.get;
    if (method == 'post') {
        func = window.axios.post;
    } else if (method == 'patch') {
        func = window.axios.patch;
    } else if (method == 'delete') {
        func = window.axios.delete;
    }

    func(url, data, config)
        .then(function(response){
            successfunc(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function(){
                finalfunc();
            }
        );
};

window.assumeMobileDevice = function() {
    const userAgentMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const userAgentDataMobile = navigator.userAgentData?.mobile || false;
    const smallScreen = window.innerWidth <= 768;

    return userAgentMobile || userAgentDataMobile || smallScreen;
};

window.publishScores = function(playername, score, onsuccess = function() {}, onerror = function() {}) {
    window.ajaxRequest('post', localStorage.getItem('service_url') + '/scores/add', { playername: playername, score: score, mobile: window.assumeMobileDevice() }, function(response) {
        if (response.code == 200) {
            onsuccess();
        } else {
            onerror(response);
        }
    });
};

window.fetchHighscore = function(target, what, device, weekly) {
    window.ajaxRequest('post', localStorage.getItem('service_url') + '/scores/list', { what: what, device: device }, function(response) {
        if (response.code == 200) {
            let elTarget = document.querySelector(target);

            elTarget.innerHTML = '';

            if (response.data.length > 0) {
                response.data.forEach(function(elem, index) {
                    const deviceIcon = (parseInt(elem.mobile)) ? '&#x1F4F1;' : '&#x1F4BB;';

                    elTarget.innerHTML += `
                        <div class="highscore-item" data-device="` + ((elem.mobile) ? 'mobile' : 'desktop') + `">
                            <div class="highscore-item-icon">
                                ` + deviceIcon + `
                            </div>

                            <div class="highscore-item-player">
                                ` + elem.playername + `
                            </div>

                            <div class="highscore-item-score">
                                ` + elem.score + `
                            </div>
                        </div>
                    `;
                });
            } else {
                elTarget.innerHTML = 'No one has entered the highscore list yet.';
            }

            let elWeekly = document.querySelector(weekly);
            if (elWeekly) {
                elWeekly.innerHTML = 'Weekly (' + response.remaining + ')';
            }
        } else {
            console.error(response.msg);
        }
    });
};

window.filterHighscoreList = function(filter) {
    const filterTypes = ['all', 'mobile', 'desktop'];

    if (!filterTypes.includes(filter)) {
        return;
    }

    let elems = document.querySelectorAll('.highscore-item');
    if (elems) {
        for (let i = 0; i < elems.length; i++) {
            if (filter === 'all') {
                if (elems[i].classList.contains('is-hidden')) {
                    elems[i].classList.remove('is-hidden');
                }
            } else {
                if (elems[i].dataset.device === filter) {
                    if (elems[i].classList.contains('is-hidden')) {
                        elems[i].classList.remove('is-hidden');
                    }
                } else {
                    if (!elems[i].classList.contains('is-hidden')) {
                        elems[i].classList.add('is-hidden');
                    }
                }
            }
        }
    }
};

window.translateDeviceToken = function(token) {
    if (token === 'all') {
        return null;
    } else if (token === 'mobile') {
        return true;
    } else if (token === 'desktop') {
        return false;
    }

    return null;
};

window.showPrompt = function(label, cb = function(text) {}, deftext = '') {
    let prompt = document.querySelector('.prompt-overlay');
    if (prompt) {
        let title = document.querySelector('.prompt-title');
        title.innerText = label;

        let eltext = document.querySelector('#txtInputValue');
        eltext.value = deftext;

        window.currentPromptCallback = cb;

        prompt.classList.remove('is-hidden');
    }
};

window.promptAction = function() {
    let prompt = document.querySelector('.prompt-overlay');
    if (prompt) {
        prompt.classList.add('is-hidden');

        let eltext = document.querySelector('#txtInputValue');

        window.currentPromptCallback(eltext.value);
    }
};

window.playSound = function(url) {
    const audio = new Audio(url);
    audio.play();
};