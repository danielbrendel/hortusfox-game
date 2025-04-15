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

window.addHighscore = function(playername, score) {
    window.ajaxRequest('post', localStorage.getItem('service_url') + '/scores/add', { playername: playername, score: score }, function(response) {
        if (response.code == 200) {

        } else {
            console.error(response.msg);
        }
    });
};

window.fetchHighscore = function(target, what) {
    window.ajaxRequest('post', localStorage.getItem('service_url') + '/scores/list', { what: what }, function(response) {
        if (response.code == 200) {
            let elTarget = document.querySelector(target);

            elTarget.innerHTML = '';

            response.data.forEach(function(elem, index) {
                elTarget.innerHTML += `
                    <div class="highscore-item">
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
            console.error(response.msg);
        }
    });
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