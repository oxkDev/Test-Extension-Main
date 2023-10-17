
class YoutubeShort {
    constructor(shortsData, force = true) {
        this.status = false;
        this.interval = shortsData.interval;

        this.keydown = this.keydown.bind(this);
        
        this.shortSelectors = ["#shorts-player > div.html5-video-container > video"];
        
        this.update(shortsData, force);
    }

    update(data, force = this.status) {
        let statusOld = this.status;
        
        if (data) {
            this.interval = data.interval;
            this.status = data.status && force;
        }
        console.log("ytshorts update: ", window.location.pathname.startsWith("/shorts"), this.status)

        if (!this.status || !force || !window.location.pathname.startsWith("/shorts")) removeEventListener("keydown", this.keydown);
        else if (statusOld != this.status || !data) addEventListener("keydown", this.keydown);   
    }
    
    keydown(e) {
        let i = 0;
        var shortVid;
        
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
            // console.log(shortVid.currentTime, shortVid.duration)    
            shortVid.currentTime = (shortVid.duration + shortVid.currentTime + events[e.key] * interval) % shortVid.duration;
        
        }
    }
}

class YoutubeAdSkip {
    constructor(adSkipData, force = true) {
        this.status = false;
        this.autoSkip = false;
        this.adSelectors = ["div.ad-created.ad-showing video.video-stream.html5-main-video"];
        
        this.keydown = this.keydown.bind(this);
        this.skipAd = this.skipAd.bind(this);

        this.adSkipInterval;

        this.update(adSkipData, force);
    }


    update(data, force = this.status) {
        let statusOld = this.status;
        
        if (data) {
            this.status = data.status && force;
            this.autoSkip = data.auto;
        }
        console.log("ytAds update: ", window.location.pathname.startsWith("/watch"), this.status);

        if (this.status && force && window.location.pathname.startsWith("/watch")) {
            if (this.status != statusOld || !data) addEventListener("keydown", this.keydown);
            
            if (this.auto) {
                console.log("autoskip enabled");
                if (!this.adSkipInterval) this.adSkipInterval = setInterval(this.skipAd, 250);
            } else {
                clearInterval(this.adSkipInterval);
                this.adSkipInterval = false;
            }
        } else {
            removeEventListener("keydown", this.keydown);
            clearInterval(this.adSkipInterval);
            this.adSkipInterval = false;
        }
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
                adVid.currentTime = adVid.duration;
                setTimeout(() => {
                    adVid.addEventListener("canplay", this.skipAd, {once: true});
                }, 100);
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
