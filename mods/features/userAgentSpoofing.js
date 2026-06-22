const deviceProfiles = [
    {
        architecture: 'LINUX',
        os: 'Tizen/7.0',
        rasterizer: 'gles',
        manufacturer: 'Samsung',
        deviceType: 'TV',
        chipsetModel: 'NIKEM2',
        modelYear: 2022,
        firmwareVersion: 'T-NKM2AKUC-2111.1',
        brand: 'Samsung',
        model: 'QN55Q80AAFXZA'
    },
    {
        architecture: 'LINUX',
        os: 'Tizen/8.0',
        rasterizer: 'gles',
        manufacturer: 'Samsung',
        deviceType: 'TV',
        chipsetModel: 'KANTM',
        modelYear: 2023,
        firmwareVersion: 'T-KTMAKUC-3112.2',
        brand: 'Samsung',
        model: 'QN65QN90CAF'
    }
]

const cobaltVersion = '25.lts.30.1034958-gold';
const v8Version = 'v8/8.8.278.17-jit';
const starboardVersion = '15';
const auxField = 'com.google.android.youtube.tv/5.30.301';

function generateUserAgent(profile) {
    return `Mozilla/5.0 (${profile.architecture}; ${profile.os}) Cobalt/${cobaltVersion} (unlike Gecko) ${v8Version} ${profile.rasterizer} Starboard/${starboardVersion}, ${profile.manufacturer}_${profile.deviceType}_${profile.chipsetModel}_${profile.modelYear}/${profile.firmwareVersion} (${profile.brand}, ${profile.model}) ${auxField}`;
}

;(function() {
    // Guard: only run in the main YouTube page, not iframes
    if (window !== window.top) return;

    const hasH5vcc = !!window.h5vcc;
    const hasTizenTube = !!(window.h5vcc && window.h5vcc.tizentube);
    const hasSetUserAgent = !!(window.h5vcc && window.h5vcc.tizentube && window.h5vcc.tizentube.SetUserAgent);

    // Save state to localStorage for the debug overlay to read
    localStorage.setItem('userAgentDebug', JSON.stringify({
        hasH5vcc,
        hasTizenTube,
        hasSetUserAgent,
        currentUA: navigator.userAgent.substring(0, 120),
        timestamp: new Date().toLocaleTimeString()
    }));

    // Choose or generate the spoofed User Agent
    let ua = localStorage.getItem('userAgent');
    if (ua && (ua.indexOf('Android') > -1 || ua.indexOf('Samsung') === -1)) {
        localStorage.removeItem('userAgent');
        ua = null;
    }
    if (!ua) {
        const randomProfile = deviceProfiles[Math.floor(Math.random() * deviceProfiles.length)];
        ua = generateUserAgent(randomProfile);
        localStorage.setItem('userAgent', ua);
    }

    // 1. Force override navigator properties in JS context
    try {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () { return ua; },
            configurable: true
        });
        Object.defineProperty(navigator, 'appVersion', {
            get: function () { return ua; },
            configurable: true
        });
    } catch (e) {
        console.error("[TizenTube] Failed to override navigator properties:", e);
    }

    // 2. Force support/enable surround sound audio codecs (AC-3, EC-3, AC-4)
    try {
        const originalIsTypeSupported = window.MediaSource && window.MediaSource.isTypeSupported;
        if (originalIsTypeSupported) {
            window.MediaSource.isTypeSupported = function (mimeType) {
                if (typeof mimeType === 'string' && (
                    mimeType.includes('ec-3') || 
                    mimeType.includes('ac-3') || 
                    mimeType.includes('ac-4') || 
                    mimeType.includes('mp4a.a9')
                )) {
                    return true;
                }
                return originalIsTypeSupported.call(this, mimeType);
            };
        }

        const originalCanPlayType = window.HTMLMediaElement && window.HTMLMediaElement.prototype.canPlayType;
        if (originalCanPlayType) {
            window.HTMLMediaElement.prototype.canPlayType = function (mimeType) {
                if (typeof mimeType === 'string' && (
                    mimeType.includes('ec-3') || 
                    mimeType.includes('ac-3') || 
                    mimeType.includes('ac-4') || 
                    mimeType.includes('mp4a.a9')
                )) {
                    return 'probably';
                }
                return originalCanPlayType.call(this, mimeType);
            };
        }
    } catch (e) {
        console.error("[TizenTube] Failed to mock surround sound codecs:", e);
    }

    // 3. If native user agent setting is available, apply it
    if (hasSetUserAgent) {
        if (window.navigator.userAgent !== ua) {
            window.h5vcc.tizentube.SetUserAgent(ua);
            location.reload();
        }
    }
})();