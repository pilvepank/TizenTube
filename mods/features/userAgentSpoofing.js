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
    },
    {
        architecture: 'Linux arm64-v8a',
        os: 'Android 10',
        rasterizer: 'gles',
        manufacturer: 'Sony',
        deviceType: 'ATV',
        chipsetModel: 'sdm845',
        modelYear: 13140765,
        firmwareVersion: '52.1.C.0.268',
        brand: 'KDDI',
        model: 'SOV38'
    },
    {
        architecture: 'Linux armeabi-v7a',
        os: 'Android 14',
        rasterizer: 'gles',
        manufacturer: 'Google',
        deviceType: 'ATV',
        chipsetModel: 'sabrina',
        modelYear: 2020,
        firmwareVersion: 'UTTC.250917.004',
        brand: 'google',
        model: 'Chromecast'
    }
]

const cobaltVersion = '25.lts.30.1034958-gold';
const v8Version = 'v8/8.8.278.17-jit';
const starboardVersion = '15';
const auxField = 'com.google.android.youtube.tv/5.30.301';

function generateUserAgent(profile) {
    return `Mozilla/5.0 (${profile.architecture}; ${profile.os}) Cobalt/${cobaltVersion} (unlike Gecko) ${v8Version} ${profile.rasterizer} Starboard/${starboardVersion}, ${profile.manufacturer}_${profile.deviceType}_${profile.chipsetModel}_${profile.modelYear}/${profile.firmwareVersion} (${profile.brand}, ${profile.model}) ${auxField}`;
}

if (document.querySelector('.content-container') && window.h5vcc && window.h5vcc.tizentube && window.h5vcc.tizentube.SetUserAgent) {
    const ua = localStorage.getItem('userAgent');
    if (ua) {
        if (window.navigator.userAgent === ua) {
            // Already set, do not reload
            return;
        }
        window.h5vcc.tizentube.SetUserAgent(ua);
        location.reload();
        return;
    }

    const randomProfile = deviceProfiles[Math.floor(Math.random() * deviceProfiles.length)];
    const spoofedUserAgent = generateUserAgent(randomProfile);
    localStorage.setItem('userAgent', spoofedUserAgent);
    window.h5vcc.tizentube.SetUserAgent(spoofedUserAgent);
    location.reload();
}