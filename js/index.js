"use strict";

class AnimationConfig {
    static ANIMATION_TYPE_TEXT = "text";
    static ANIMATION_TYPE_WEBPAGE = "webPage";

    type;
    source;
    height;
    text;
    style;
    speed;
    backgroundColor;
    musicSource;
}

class AnimationPlayer {
    static PLAY_STATE_PROP = "animation-play-state";
    static PLAY_STATE_PAUSED = "paused";
    static PLAY_STATE_RUNNING = "running";

    isMuted = false;

    constructor(animationContainer) {
        this.animationContainer = animationContainer;
    }

    play() {
        this.animationContainer.style[AnimationPlayer.PLAY_STATE_PROP] = AnimationPlayer.PLAY_STATE_RUNNING;
    }

    pause() {
        this.animationContainer.style[AnimationPlayer.PLAY_STATE_PROP] = AnimationPlayer.PLAY_STATE_PAUSED;
    }

    reset() {
        // TODO
    }

    mute() {
        // TODO
    }

    unmute() {
        // TODO
    }

    get isPlaying() {
        const style = window.getComputedStyle(this.animationContainer);
        const currentState = style.getPropertyValue(AnimationPlayer.PLAY_STATE_PROP);
        return currentState === AnimationPlayer.PLAY_STATE_RUNNING;
    }

    get isMuted() {
        return this.isMuted;
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
    constructor(animationContainer, animationConfig) {
        this._animationContainer = animationContainer;
        this._animationConfig = animationConfig;
        this._restartAnimation();
    }

    togglePlayback() {
        this._player.isPlaying ? this._player.pause() : this._player.play();
    }

    /**
     * @param {AnimationConfig} config
     */
    set animationConfig(config) {
        this._animationConfig = config;
        this._restartAnimation();
    }

    _restartAnimation() {
        let node = this._animationContainer;
        node = AnimationController._clearElement(node);
        node = AnimationController._setBackgroundColor(node, this._animationConfig);
        node = AnimationController._loadContent(node, this._animationConfig);
        node = AnimationController._setStyle(node, this._animationConfig);
        node = AnimationController._setSpeed(node, this._animationConfig);
        node = AnimationController._loadPlaybackMusic(node, this._animationConfig);
        this._player = new AnimationPlayer(node);
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setBackgroundColor(node, config) {
        const next = document.createElement("div");
        next.style["background-color"] = config.backgroundColor;
        next.style["height"] = "100%";
        next.style["width"] = "100%";
        next.style["display"] = "flex";
        next.style["justify-content"] = "center";
        next.style["perspective"] = "450px";
        next.style["flex-direction"] = "row";
        node.appendChild(next);
        const topGradient = document.createElement("div");
        topGradient.style["background"] = `linear-gradient(${config.backgroundColor}, transparent)`;
        topGradient.style["height"] = "30%";
        topGradient.style["width"] = "100%";
        topGradient.style["position"] = "absolute";
        topGradient.style["top"] = "0";
        topGradient.style["left"] = "0";
        topGradient.style["z-index"] = "10";
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
        console.log("not implemented");
        return node;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _loadWebPageContent(node, config) {
        const iFrame = document.createElement("iframe");
        iFrame.setAttribute("src", config.source);
        iFrame.style["width"] = "100%";
        iFrame.style["height"] = config.height;
        // iFrame.style["transform"] = "rotateX(45deg)";
        // iFrame.style["transform-style"] = "preserve-3d";
        iFrame.style["animation"] = "scroll 12s linear forwards";
        iFrame.style["border"] = "0";
        node.appendChild(iFrame);
        return iFrame;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setStyle(node, config) {
        return node;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _setSpeed(node, config) {
        return node;
    }

    /**
     * @param {HTMLElement} node
     * @param {AnimationConfig} config
     */
    static _loadPlaybackMusic(node, config) {
        return node;
    }
}

function readAnimationConfigInputs() {
    const configForm = document.getElementById("animationConfig");
    const result = new AnimationConfig();
    Object.keys(result).forEach(key => {
        result[key] = configForm[key].value;
    });
    return result;
}


const DEFAULT_ANIMATION_CONFIG = {
    type: "webPage",
    source: "http://example.com",
    backgroundColor: "var(--secondary-color)",
    speed: 1,
    style: "starWars",
    musicSource: "unknown",
    height: "2000px",
};

const animationContainer = document.getElementById("animationContainer");
const animationController = new AnimationController(animationContainer, DEFAULT_ANIMATION_CONFIG);

const playPauseBtn = document.getElementById("playPauseBtn");
playPauseBtn.onclick = () => {
    toggleButton(playPauseBtn);
    animationController.togglePlayback();
};

const animateBtn = document.getElementById("animateBtn");
animateBtn.onclick = () => {
    const config = readAnimationConfigInputs();
    console.log("animation config:", config);
    animationController.animationConfig = config;
};

const resetBtn = document.getElementById("resetBtn");
resetBtn.onclick = () => {
    animationController.animationConfig = DEFAULT_ANIMATION_CONFIG;
}

function toggleButton(element) { 
    const buttons = Array.from(element.children);
    buttons.forEach(button => button.classList.toggle('hidden'))
};

const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => toggleButton(muteBtn));