"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJob = void 0;
class BaseJob {
    start() {
        this.task.start();
    }
    stop() {
        this.task.stop();
    }
}
exports.BaseJob = BaseJob;
