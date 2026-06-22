import "./features/userAgentSpoofing.js";
import "whatwg-fetch";
import 'core-js/proposals/object-getownpropertydescriptors';

// Debug Overlay for User Agent validation
;(function() {
    const showUA = () => {
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '10px';
        div.style.left = '10px';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        div.style.color = '#00ff00';
        div.style.fontFamily = 'monospace';
        div.style.fontSize = '12px';
        div.style.padding = '10px';
        div.style.zIndex = '999999';
        div.style.borderRadius = '5px';
        div.style.border = '2px solid #00ff00';
        div.style.maxWidth = '80%';
        div.style.wordBreak = 'break-all';
        div.innerHTML = `
            <b>Active UA:</b> ${navigator.userAgent}<br><br>
            <b>Storage UA:</b> ${localStorage.getItem('userAgent')}<br><br>
            <b>h5vcc status:</b> ${!!(window.h5vcc && window.h5vcc.tizentube && window.h5vcc.tizentube.SetUserAgent)}
        `;
        document.body.appendChild(div);
    };
    if (document.body) {
        showUA();
    } else {
        document.addEventListener('DOMContentLoaded', showUA);
    }
})();

import './translations/index.js'
import "./domrect-polyfill";
import "./features/adblock.js";
import "./features/sponsorblock.js";
import "./ui/ui.js";
import "./ui/speedUI.js";
import "./ui/theme.js";
import "./ui/settings.js";
import "./ui/disableWhosWatching.js";
import "./features/moreSubtitles.js";
import "./features/updater.js";
import "./features/pictureInPicture.js";
import "./features/preferredVideoQuality.js";
import "./features/videoQueuing.js";
import "./features/enableFeatures.js";
import "./ui/customUI.js";
import "./ui/customGuideAction.js";
import "./features/autoFrameRate.js";
import "./ui/clock.js";