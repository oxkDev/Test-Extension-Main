
class YoutubeShort {
    constructor(shortsData, force = true) {
        this.status = false;
        this.active = false;
        this.interval = shortsData.interval;

        this.shortSkip = this.shortSkip.bind(this);
        
        this.shortSelectors = ["#shorts-player > div.html5-video-container > video"];
        
        this.update(shortsData, force);
    }

    update(data, force = this.status) {
        const statusOld = this.status;
        
        if (data) {
            this.interval = data.interval;
            this.status = data.status && force;
        }
        
        if (!this.status || !window.location.pathname.startsWith("/shorts")){
            this.active = false;
            removeEventListener("keydown", this.shortSkip);
        } else if (!this.active) {
            this.active = true;
            addEventListener("keydown", this.shortSkip);
        }

        console.log("ytshorts update (old, new, force, active, dat): ", statusOld, this.status, force, this.active, data);
    }
    
    shortSkip(e) {
        let i = 0;
        let shortVid;
        
        while (!shortVid && i < this.shortSelectors.length) {
            shortVid = document.querySelector(this.shortSelectors[i]);
            i += 1;
        }
        
        let events = {"ArrowLeft": -1, "ArrowRight": 1};

        if (shortVid && e.key in events) {
            let interval = this.interval;
            if (e.shiftKey) {
                shortVid.pause();
                interval = 1/30;
            }
            
            let newTime = (shortVid.currentTime + events[e.key] * interval);

            if (e.key == "ArrowRight" && newTime > shortVid.duration) newTime = 0;
            // console.log(shortVid.currentTime, shortVid.duration)
            shortVid.currentTime = (shortVid.duration + newTime) % shortVid.duration;
        
        }
    }
}

class YoutubeAdSkip {
    constructor(adSkipData, force = true) {
        this.status = false;
        this.active = false;
        this.autoSkip = false;
        this.adSelectors = ["div.ad-created.ad-showing video.video-stream.html5-main-video"];
        
        this.keydown = this.keydown.bind(this);
        this.skipAd = this.skipAd.bind(this);

        this.adSkipInterval = false;

        this.update(adSkipData, force);
    }


    update(data, force = this.status) {
        const statusOld = this.status;
        
        if (data) {
            this.status = data.status && force;
            this.autoSkip = data.auto;
        }
        
        if (this.status && window.location.pathname.startsWith("/watch")) {
            if (!this.active){
                this.active = true;
                addEventListener("keydown", this.keydown);
            }

            if (this.autoSkip) {
                console.log("autoskip enabled");
                if (!this.adSkipInterval) this.adSkipInterval = setInterval(this.skipAd, 250);
            } else {
                clearInterval(this.adSkipInterval);
                this.adSkipInterval = false;
            }
        } else {
            removeEventListener("keydown", this.keydown);
            clearInterval(this.adSkipInterval);
            this.active = false;
            this.adSkipInterval = false;
        }

        console.log("ytAds update (old, new, force, active, dat): ", statusOld, this.status, force, this.active, data);
    }
    
    keydown(e) {
        if (e.key == "ArrowRight" && !e.shiftKey && !e.ctrlKey) this.skipAd();
    }

    skipAd() {
        let i = 0;
        let adVid;
        
        while (!adVid && i < this.adSelectors.length) {
            adVid = document.querySelector(this.adSelectors[i]);
            i += 1;
        }

        if (adVid) {
            console.log("ad skipping")
            
            let skipButton = document.querySelector(".ytp-ad-skip-button.ytp-button");
            if (skipButton) skipButton.click();
            else {
                try{
                    adVid.currentTime = adVid.duration;
                }
                catch(e) {
                    console.log(adVid, adVid.duration, e);
                }
                adVid.addEventListener("ended", () => setTimeout(() => {console.log("repeat"); this.skipAd()}, 50), {once: true});
            }
        }
        // else console.log("no ad detected")
    }
}

class YoutubeAddons {
    constructor(ytData) {
        this.status = ytData.status;
        this.Short = new YoutubeShort(ytData.short, this.status);
        this.AdSkip = new YoutubeAdSkip(ytData.adSkip, this.status);

        this.sortsSelectors = ["#shorts-player > div.html5-video-container > video"];

        addEventListener("load", () => this.update());

        console.log("init yt addons: ", this.status, this.Short, this.AdSkip);
    }

    update(ytData = {status: this.status, short: false, adSkip: false}) {
        this.status = ytData.status;
        
        this.Short.update(ytData.short, this.status);
        this.AdSkip.update(ytData.adSkip, this.status);
    }
}
