"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class TransitionMixCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TMxP';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.properties = {
            rate: __1.Util.parseNumberBetween(rawCommand[1], 1, 250)
        };
    }
    serialize() {
        const rawCommand = 'CTMx';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.mixEffect,
            this.properties.rate,
            0x00, 0x00
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionSettings.mix = Object.assign({}, this.properties);
    }
}
exports.TransitionMixCommand = TransitionMixCommand;
//# sourceMappingURL=TransitionMixCommand.js.map