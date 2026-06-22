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

    if (!hasSetUserAgent) {
        // h5vcc not available — script is running but can't spoof UA
        return;
    }

    let ua = localStorage.getItem('userAgent');

    // Clear stale Android-based UAs from older versions
    if (ua && (ua.indexOf('Android') > -1 || ua.indexOf('Samsung') === -1)) {
        localStorage.removeItem('userAgent');
        ua = null;
    }

    if (ua) {
        // UA already stored — check if it's been applied to the running context
        if (window.navigator.userAgent === ua) {
            // Already spoofed, nothing to do
            return;
        }
        // Apply and reload so YouTube sees the spoofed UA from the start
        window.h5vcc.tizentube.SetUserAgent(ua);
        location.reload();
        return;
    }

    // No stored UA — generate and save a new one
    const randomProfile = deviceProfiles[Math.floor(Math.random() * deviceProfiles.length)];
    const spoofedUserAgent = generateUserAgent(randomProfile);
    localStorage.setItem('userAgent', spoofedUserAgent);
    window.h5vcc.tizentube.SetUserAgent(spoofedUserAgent);
    location.reload();
})();