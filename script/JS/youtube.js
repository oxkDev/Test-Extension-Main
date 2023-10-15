
class YoutubeShort {
    constructor(shortsData) {
        this.status, this.interval = true, 5;
        this.update(shortsData);
        
        this.shortSelectors = ["#shorts-player > div.html5-video-container > video"];
    }

    update(data = {status: true, interval: 5}) {
        this.status = data.status;
        this.interval = data.interval;
        if (this.status) document.addEventListener("keydown", (e) => this.keydown(e));
        else document.removeEventListener("keydown", (e) => this.keydown(e));
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
    constructor(adSkipData) {
        this.status, this.autoSkip = true, true;
        
        this.adSelectors = ["div.ad-created.ad-showing video.video-stream.html5-main-video"];
        
        this.oldLink = window.location.href;
        this.linkChange;

        this.update(adSkipData);
    }

    update(data) {
        this.status = data.status;
        this.autoSkip = data.auto;

        if (!this.status) {
            document.removeEventListener("load", () => this.skipAd());
            document.removeEventListener("keydown", (e) => this.keydown(e));
        } else {
            document.addEventListener("keydown", (e) => this.keydown(e));
            if (this.autoSkip) {
                console.log("autoskip enabled");
                this.skipAd();
                this.linkChange = setInterval(() => {
                    // if (this.oldLink != window.location.href && window.location.pathname == "/watch") {
                    //     console.log("video watch");
                    //     window.location.reload();
                    //     // this.skipAd();
                    // }
                    // this.oldLink = window.location.href
                    if (window.location.pathname == "/watch") this.skipAd();
                }, 500);
            } else {
                clearInterval(this.linkChange);
            }
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
                adVid.oncanplay = null;
                setTimeout(() => {
                    adVid.oncanplay = () => this.skipAd();
                }, 100);
            }
        }
        // else console.log("no ad detected")
    }
}

class YoutubeAddons {
    constructor(ytData) {
        this.status = ytData.status;
        this.Short = new YoutubeShort(ytData.short);
        this.AdSkip = new YoutubeAdSkip(ytData.adSkip);

        this.sortsSelectors = ["#shorts-player > div.html5-video-container > video"];

        if (!this.status) {
            this.Short.status = false;
            this.AdSkip.status = false;
        }

        console.log("init yt addons");
    }


    update(ytData) {
        this.status = ytData.status;
        
        this.Short.update(ytData.short);
        this.AdSkip.update(ytData.adSkip);

        if (!this.status) {
            this.Short.status = false;
            this.AdSkip.status = false;
        }

    }
}

window.onload = () => {
    if (window.location.href.indexOf("www.youtube.com") + 1) {
        let addon;
        var provider = new Provider(extensionName, () => {
            addon = new YoutubeAddons(provider.userData.youtube)
            provider.dataChange = function(e) {
                addon.update(provider.userData.youtube);
            }
        });
        
    }
}