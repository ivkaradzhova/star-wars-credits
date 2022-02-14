class AnimationConfig {
    static ANIMATION_TYPE_TEXT = "text";
    static ANIMATION_TYPE_WEBPAGE = "webPage";

    type;
    source;
    height;
    text;
    textColor;
    style;
    speed;
    backgroundColor;
    musicType;
    musicUrl;
    musicPath;
}

class MediaControls {
    playBtn;
    muteBtn;
}

class AnimationPlayer {
    static PLAY_STATE_PROP = "animation-play-state";
    static PLAY_STATE_PAUSED = "paused";
    static PLAY_STATE_RUNNING = "running";
    static CLASS_HIDDEN = "hidden";

    /**
     * 
     * @param {HTMLElement} animationContainer 
     * @param {string} musicSource
     * @param {MediaControls} mediaControls
     */
    constructor(animationContainer, musicSource, mediaControls) {
        this._animationContainer = animationContainer;
        this._musicSource = musicSource;
        this._audio = new Audio(musicSource);
        this._playBtn = mediaControls.playBtn;
        this._muteBtn = mediaControls.muteBtn;
    }

    play() {
        this._animationContainer.style[AnimationPlayer.PLAY_STATE_PROP] = AnimationPlayer.PLAY_STATE_RUNNING;
        this._audio.play();
        this._playBtn.querySelector("#playBtnPlay").classList.add(AnimationPlayer.CLASS_HIDDEN);
        this._playBtn.querySelector("#playBtnPause").classList.remove(AnimationPlayer.CLASS_HIDDEN);
    }

    pause() {
        this._animationContainer.style[AnimationPlayer.PLAY_STATE_PROP] = AnimationPlayer.PLAY_STATE_PAUSED;
        this._audio.pause();
        this._playBtn.querySelector("#playBtnPlay").classList.remove(AnimationPlayer.CLASS_HIDDEN);
        this._playBtn.querySelector("#playBtnPause").classList.add(AnimationPlayer.CLASS_HIDDEN);
    }

    mute() {
        this._audio.muted = true;
        this._muteBtn.querySelector("#muteBtnMute").classList.add(AnimationPlayer.CLASS_HIDDEN);
        this._muteBtn.querySelector("#muteBtnUnmute").classList.remove(AnimationPlayer.CLASS_HIDDEN);
    }

    unmute() {
        this._audio.muted = false;
        this._muteBtn.querySelector("#muteBtnMute").classList.remove(AnimationPlayer.CLASS_HIDDEN);
        this._muteBtn.querySelector("#muteBtnUnmute").classList.add(AnimationPlayer.CLASS_HIDDEN);
    }

    stop() {
        this.pause();
    }

    get isPlaying() {
        const style = window.getComputedStyle(this._animationContainer);
        const currentState = style.getPropertyValue(AnimationPlayer.PLAY_STATE_PROP);
        return currentState === AnimationPlayer.PLAY_STATE_RUNNING;
    }

    get isMuted() {
        return this._muteBtn.querySelector("#muteBtnMute").classList.contains(AnimationPlayer.CLASS_HIDDEN);
    }
}


class AnimationController {
    _animationContainer;
    _player;
    _animationConfig;

    /**
     * @param {HTMLElement} animationContainer
     * @param {AnimationPlayer} player
     * @param {AnimationConfig} animationConfig
     */
    constructor(animationContainer, animationConfig, mediaControls) {
        this._animationContainer = animationContainer;
        this._animationConfig = animationConfig;
        this._mediaControls = mediaControls;
        this._configMediaControls(mediaControls);
        this._loadAnimation();
    }

    togglePlayback() {
        this._player.isPlaying ? this._player.pause() : this._player.play();
    }

    toggleMusic() {
        this._player.isMuted ? this._player.unmute() : this._player.mute();
    }

    /**
     * @param {AnimationConfig} config
     */
    set animationConfig(config) {
        this._animationConfig = config;
        if (this._player) {
            this._player.stop();
        }
        this._loadAnimation();
    }

    get animationConfig() {
        return this._animationConfig;
    }

    _loadAnimation() {
        if (!this._animationConfig) {
            return;
        }
        let node = this._animationContainer;
        node = AnimationController._clearElement(node);
        node = AnimationController._setBackground(node, this._animationConfig);
        node = AnimationController._setStyle(node, this._animationConfig);
        node = AnimationController._loadContent(node, this._animationConfig);
        node = AnimationController._setSpeed(node, this._animationConfig);

        const musicSource = this._getMusicSource(this._animationConfig);
        this._player = new AnimationPlayer(node, musicSource, this._mediaControls);
        this._player.pause();
        this._player.unmute();
    }

    /**
     * @param {AnimationConfig} config 
     */
    _getMusicSource(config) {
        if (config.musicType === "url") {
            return config.musicUrl;
        }
        return config.musicPath;
    }

    _configMediaControls(controls) {
        controls.playBtn.addEventListener("click", () => this.togglePlayback());
        controls.muteBtn.addEventListener("click", () => this.toggleMusic());
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setBackground(node, config) {
        const next = document.createElement("div");
        next.classList.add("animation-background");
        next.style["background-color"] = config.backgroundColor;
        node.appendChild(next);
        const topGradient = document.createElement("div");
        topGradient.classList.add("animation-top-gradient");
        topGradient.style["background"] = `linear-gradient(${config.backgroundColor}, transparent)`;
        node.appendChild(topGradient);
        return next;
    }

    static _clearElement(node) {
        node.innerHTML = "";
        return node;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _loadContent(node, config) {
        switch (config.type) {
            case AnimationConfig.ANIMATION_TYPE_TEXT:
                return AnimationController._loadTextContent(node, config);
            case AnimationConfig.ANIMATION_TYPE_WEBPAGE:
                return AnimationController._loadWebPageContent(node, config);
            default:
                throw "Unknown animation type: " + config.type;
        }
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _loadTextContent(node, config) {
        const div = document.createElement("div");
        div.style["width"] = "100%";
        div.style["max-width"] = "1000px";
        div.style["color"] = config.textColor;
        div.style["font-size"] = "500%";
        const p = document.createElement("p");
        p.innerText = config.text;
        div.appendChild(p)
        node.appendChild(div);
        return div;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _loadWebPageContent(node, config) {
        const iFrame = document.createElement("iframe");
        iFrame.classList.add("animation-webpage");
        iFrame.setAttribute("src", config.source);
        iFrame.style["height"] = config.height;
        iFrame.style["animation-play-state"] = "paused";
        node.appendChild(iFrame);
        return iFrame;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setStyle(node, config) {
        const style = config.style;
        switch (style) {
            case "starWars": {
                node.style["perspective"] = "450px";
                break;
            }
            case "finalCredits": {
                node.style.removeProperty("perspective");
                break;
            }
        }

        const next = document.createElement("div");
        next.style["width"] = "100%";
        next.style["max-width"] = "1200px";
        next.style["height"] = "2000px";
        switch (style) {
            case "starWars": {
                next.style["transform"] = "rotateX(20deg)";
                break;
            }
            case "finalCredits": {
                next.style["margin"] = "0 20px";
                next.style["margin-top"] = "20%";
            }
        }
        node.appendChild(next);
        return next;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setSpeed(node, config) {
        const speed = config.speed * 50;
        const height = config.type === AnimationConfig.ANIMATION_TYPE_TEXT ? node.offsetHeight : config.height;
        const time = calculateAnimationTime(speed, height);
        node.style["animation"] = `scroll ${time}s linear forwards`;
        return node;
    }
}

function calculateAnimationTime(speed, height) {
    return height / speed;
}

function readAnimationConfigInputs(form) {
    const result = new AnimationConfig();
    Object.keys(result).forEach((key) => {
        result[key] = form[key].value;
    });
    fixAnimationConfig(result);
    return result;
}

function fixAnimationConfig(config) {
    if (config.musicType === "file") {
        const file = form["musicPath"].files[0];
        config.musicPath = URL.createObjectURL(file);
    }
}

function populateForm(config) {
    Object.keys(config).forEach((key) => {
        animationConfigForm[key].value = config[key];
    });
}

function handleAnimationTypeChanged(animationTypeSelect) {
    const animationType = animationTypeSelect.value;
    const isWebPageVisible = animationType === "webPage";
    const isTextVisible = animationType === "text";
    Array.from(document.getElementsByClassName("type-web-page", "flex"))
        .forEach((e) => setElementVisible(e, isWebPageVisible));
    Array.from(document.getElementsByClassName("type-text"))
        .forEach((e) => setElementVisible(e, isTextVisible, "flex"));
}

function handleMusicTypeChanged(musicTypeSelect) {
    const musicType = musicTypeSelect.value;
    const isUrlVisible = musicType === "url";
    const isFileVisible = musicType === "file";
    Array.from(document.getElementsByClassName("music-type-url"))
        .forEach((e) => setElementVisible(e, isUrlVisible));
    Array.from(document.getElementsByClassName("music-type-file"))
        .forEach((e) => setElementVisible(e, isFileVisible));
}

function setElementVisible(e, isVisible, display = "block") {
    e.style["display"] = isVisible ? display : "none";
}

// const DEFAULT_ANIMATION_CONFIG = {
//     type: "webPage",
//     source: "http://example.com",
//     backgroundColor: "#262626",
//     speed: 10,
//     style: "starWars",
//     musicType: "url",
//     musicUrl: "assets/star_wars.mp3",
//     height: 2000,
// };

const DEFAULT_ANIMATION_CONFIG = {
    type: "text",
    text: "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire. During the battle, Rebel spies managed to steal secret plans to the Empire’s ultimate weapon, the DEATH STAR, an armoured space station with enough power to destroy an entire planet. Pursued by the Empire’s sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy…. ",
    textColor: "#ffeb00",
    backgroundColor: "#262626",
    speed: 1,
    style: "starWars",
    musicType: "url",
    musicUrl: "assets/music/star_wars.mp3",
};
fixAnimationConfig(DEFAULT_ANIMATION_CONFIG);

const animationContainer = document.getElementById("animationContainer");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");
const animationController = new AnimationController(
    animationContainer,
    null, {
        playBtn: playBtn,
        muteBtn: muteBtn
    });

const animationConfigForm = document.getElementById("animationConfig");

if (window.location.hash) {
    const animationId = window.location.hash.substring(1);
    console.log(`loading animation for id: ${animationId}`);
    fetch(`/api/animation/${animationId}`)
        .then((response) => response.json())
        .then((animation) => {
            const configFromServer = animation[0];
            console.log("received animation config:", configFromServer);
            const animationConfig = {
                id: configFromServer.id,
                name: configFromServer.name,
                type: configFromServer.type,
                source: configFromServer.source,
                height: configFromServer.height,
                text: configFromServer.text,
                textColor: configFromServer.text_color,
                style: configFromServer.style,
                speed: configFromServer.speed,
                backgroundColor: configFromServer.background_color,
                musicType: configFromServer.music_type,
                musicUrl: configFromServer.music_url,
                musicPath: configFromServer.music_path
            };
            console.log(animationConfig);
            animationController.animationConfig = animationConfig;
            populateForm(animationConfig);
        });
} else {
    animationController.animationConfig = DEFAULT_ANIMATION_CONFIG;
    populateForm(DEFAULT_ANIMATION_CONFIG);
}

const animateBtn = document.getElementById("animateBtn");
animateBtn.addEventListener("click", () => {
    const config = readAnimationConfigInputs(animationConfigForm);
    if (animationController.animationConfig && animationController.animationConfig.id) {
        config.id = animationController.animationConfig.id;
        config.name = animationController.animationConfig.name;
    }
    console.log("animation config:", config);
    animationController.animationConfig = config;
});

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
    populateForm(DEFAULT_ANIMATION_CONFIG);
});

const animationTypeSelect = document.getElementById("animationTypeSelect");
handleAnimationTypeChanged(animationTypeSelect);
animationTypeSelect.addEventListener("change", () => handleAnimationTypeChanged(animationTypeSelect));

const musicTypeSelect = document.getElementById("musicTypeSelect");
handleMusicTypeChanged(musicTypeSelect);
musicTypeSelect.addEventListener("change", () => handleMusicTypeChanged(musicTypeSelect));

const saveFormPopup = document.getElementById("saveFormPopup");
saveFormPopup.addEventListener("click", () => {
    setElementVisible(saveFormPopup, false);
});
const saveFormWrapper = document.getElementById("saveFormWrapper");
saveFormWrapper.addEventListener("click", (e) => {
    e.stopPropagation();
})
const cancelBtn = document.getElementById("cancelBtn");
cancelBtn.addEventListener("click", () => {
    setElementVisible(saveFormPopup, false);
});
const publishFormBtn = document.getElementById("publishFormBtn");
const animationNameInput = document.getElementById("animationNameInput");
publishFormBtn.addEventListener("click", () => {
    setElementVisible(saveFormPopup, true, "flex");
    const config = animationController.animationConfig;
    console.log(config);
    if (config.name) {
        animationNameInput.value = config.name;
    }
});
const publishBtn = document.getElementById("publishBtn");
publishBtn.addEventListener("click", async () => {
    const config = animationController.animationConfig;
    config.name = animationNameInput.value;
    const requestConfig = {};
    Object.keys(config).forEach((key) => {
        if (config[key]) {
            requestConfig[key] = config[key];
        }
    });
    console.log("config:", requestConfig);
    if (config.id) {
        // Update animation
        await fetch(`api/animation/${config.id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestConfig),
        });
    } else {
        // Create new animation
        await fetch("api/animation", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(requestConfig),
        });
    }

    setElementVisible(saveFormPopup, false);
    return false;
});