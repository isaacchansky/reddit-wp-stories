'use strict';

if (module.hot) {
  module.hot.accept();
}

import 'babel-polyfill';
import 'whatwg-fetch';
import '../styles/index.scss';


console.log('hey!');

const WP_URL = "https://www.reddit.com/r/WritingPrompts.json";

let DOM = {
    MAIN: document.querySelector('main'),
    NAVLIST: document.querySelector('.StoriesNav ul'),
    BACKTOLIST: document.querySelector('.BackToList'),
    STORY: {
        BODY: document.querySelector('.Story-body'),
        BYLINE: document.querySelector('.Story-byline'),
        TITLE: document.querySelector('.Story-title'),
        DETAILS: document.querySelector('.Story-details')
    }
};

let stories = [];

function showArticle() {
    DOM.MAIN.classList.add('showing-article');
}

function showList() {
    DOM.MAIN.classList.remove('showing-article');
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function init() {
    // on load API work
    fetch(WP_URL)
        .then( (response) => { return response.json(); })
        .then( (response) => {
            stories = response.data.children.filter( (item) => {
                    return item.data.title.indexOf('[WP]') > -1;
                })
                .map( (item) => {
                    return {
                        title: item.data.title.replace('[WP]','').trim(),
                        url: item.data.url,
                        api_url: item.data.url+'.json',
                    };
                });
        })
        .then( () => {
            console.log(stories);
            let nav_html = stories.map( (s) => { return `<li><a href="${s.url}" data-url="${s.api_url}"><span>${s.title}</span></a></li>`; } );

            DOM.NAVLIST.innerHTML = nav_html.join('');
            DOM.NAVLIST.classList.add('is-shown');
        });
}

function renderArticle(STORY_URL) {
    fetch(STORY_URL)
        .then( (response) => { return response.json(); })
        .then( (data) => {
            console.log(data);

            DOM.STORY.BODY.innerHTML = decodeHtml(data[1].data.children[1].data.body_html);
            DOM.STORY.TITLE.innerHTML = data[0].data.children[0].data.title.replace('[WP]','').trim();
            DOM.STORY.BYLINE.innerHTML = `Author: /u/${data[0].data.children[0].data.author}`;
            DOM.STORY.DETAILS.innerHTML = `<a class="RedditLink" href="Author: /u/${data[0].data.children[0].data.url}">View on /r/WritingPromps</a>`;
        });
}


// set up click stuff

// Get the element, add a click listener...
DOM.NAVLIST.addEventListener("click", function(e) {

    let link;
    if(e.target && e.target.nodeName == "A") {
        link = e.target;
    }
    if(e.target && e.target.parentElement.nodeName == "A") {
        link = e.target.parentElement;
    }
    if(link) {
        e.preventDefault();
        renderArticle(link.dataset.url);
        showArticle();
    }
});


DOM.BACKTOLIST.addEventListener("click", function(e) {
    e.preventDefault();
    showList();
});



init();









