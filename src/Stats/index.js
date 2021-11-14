// 查看信息小控件
import Stats from "stats-js";
export default class StatsWindow {
    constructor() {
        if (StatsWindow._instance) {
            return StatsWindow._instance;
        }
        else {
            let stats;
            stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.right = '0px';
            stats.domElement.style.left = "auto";
            stats.domElement.style.top = '0px';
            stats.domElement.style.zIndex = '1000';
            var root = document.getElementById("Stats-output");
            if (root != null) {
                StatsWindow._instance = this;
                this.stats = stats;
                document.getElementById("Stats-output").appendChild(stats.domElement);
            }
        }
        return this;
    }
}

