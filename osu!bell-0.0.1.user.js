// ==UserScript==
// @name         osu!bell
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  enables sound notifications on osu! website
// @author       Fujiya (t.me/fujiya_sama)
// @match        https://osu.ppy.sh/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ppy.sh
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const selector1 = "#notification-widget-icon .notification-icon__count";
    const selector2 = "#notification-widget-chat-icon .notification-icon__count";

    let lastValue1 = null;
    let lastValue2 = null;

    
    // PUT YOUR LINKS TO MP3s HERE --------------------------------------------------------------------------
    const sound1 = new Audio("https://www.myinstants.com/media/sounds/your-phone-ringing_TKtb5bz.mp3"); 
    const sound2 = new Audio("https://www.myinstants.com/media/sounds/emotional-damage-meme.mp3"); 
    // PUT YOUR LINKS TO MP3s HERE --------------------------------------------------------------------------

    
    // ADJUST VOLUME HERE -----------------------------------------------------------------------------------
    sound2.volume = 0.3; //  30%
    sound1.volume = 0.3; //  30%
    // ADJUST VOLUME HERE -----------------------------------------------------------------------------------


    function playSound(sound) {
        console.log("🔊 Playing sound...");
        sound.play().catch(e => console.error("Audio play failed:", e));
    }

    function checkNumber(selector, lastValue, sound) {
        let element = document.querySelector(selector);
        if (!element) {
            console.warn("⚠️", selector);
            return lastValue;
        }

        let currentValue = parseInt(element.textContent.trim(), 10);   

        if (!isNaN(currentValue)) {
            if (lastValue !== null && currentValue > lastValue) {
                console.log(`${selector}! Было: ${lastValue}, стало: ${currentValue}`);
                playSound(sound);
            }
            lastValue = currentValue;
        }

        return lastValue;
    }

    setInterval(() => {
        lastValue1 = checkNumber(selector1, lastValue1, sound1);
        lastValue2 = checkNumber(selector2, lastValue2, sound2);
    }, 1000); 

    function observeChanges(selector, sound) {
        let element = document.querySelector(selector);
        if (!element) {
            console.warn("⚠️", selector);
            return;
        }


        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    console.log(`🔄 ${selector}`);
                    checkNumber(selector, selector === selector1 ? lastValue1 : lastValue2, sound);
                }
            });
        });

        observer.observe(element, { childList: true, characterData: true, subtree: true });
    }

    setTimeout(() => {
        observeChanges(selector1, sound1);
        observeChanges(selector2, sound2);
    }, 2000);

})();
