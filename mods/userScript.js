import "./features/userAgentSpoofing.js";
import "whatwg-fetch";
import 'core-js/proposals/object-getownpropertydescriptors';

// Debug Overlay for User Agent validation
// Only runs in the top-level frame, not iframes
;(function() {
    // Guard: only inject into the main page, not iframes
    if (window !== window.top) return;

    const OVERLAY_ID = 'tizentube-ua-debug-overlay';

    function buildOverlay() {
        // Remove existing to avoid duplicates
        const existing = document.getElementById(OVERLAY_ID);
        if (existing) existing.remove();

        const div = document.createElement('div');
        div.id = OVERLAY_ID;
        // Use cssText with !important to override YouTube TV styles
        div.style.cssText = [
            'position: fixed !important',
            'top: 10px !important',
            'left: 10px !important',
            'background-color: #000000 !important',
            'color: #00ff00 !important',
            'font-family: monospace !important',
            'font-size: 24px !important',
            'padding: 20px !important',
            'z-index: 2147483647 !important',
            'border: 4px solid #00ff00 !important',
            'max-width: 900px !important',
            'word-break: break-all !important',
            'display: block !important',
            'visibility: visible !important',
            'opacity: 1 !important',
            'pointer-events: none !important'
        ].join(';');

        let debugDetails = '';
        try {
            const rawDebug = localStorage.getItem('userAgentDebug');
            if (rawDebug) {
                const parsed = JSON.parse(rawDebug);
                debugDetails = 'h5vcc:' + parsed.hasH5vcc
                    + ' | tt:' + parsed.hasTizenTube
                    + ' | setUA:' + parsed.hasSetUserAgent
                    + ' | t:' + parsed.timestamp;
            } else {
                debugDetails = 'No debug data in localStorage';
            }
        } catch (e) {
            debugDetails = 'Parse err: ' + e.message;
        }

        const storedUA = localStorage.getItem('userAgent') || 'none';
        const liveUA = navigator.userAgent;
        const uaMatch = (storedUA !== 'none' && liveUA.indexOf('Cobalt') !== -1) ? 'YES-SPOOFED' : 'NO';

        div.textContent = '[TTDebug] Spoof:' + uaMatch
            + ' | UA:' + liveUA.substring(0, 80)
            + ' | ' + debugDetails;

        return div;
    }

    function injectOverlay() {
        const root = document.documentElement || document.body;
        if (!root) return;
        const div = buildOverlay();
        root.appendChild(div);
    }

    // Re-inject overlay if YouTube's SPA removes it
    function keepAlive() {
        if (!document.getElementById(OVERLAY_ID)) {
            injectOverlay();
        }
    }

    // Inject immediately once html element exists
    const bootInterval = setInterval(() => {
        if (document.documentElement) {
            clearInterval(bootInterval);
            injectOverlay();
            // Keep re-checking every 2s in case SPA blows it away
            setInterval(keepAlive, 2000);
        }
    }, 50);
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