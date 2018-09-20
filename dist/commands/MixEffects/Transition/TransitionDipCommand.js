"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class TransitionDipCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'TDpP';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.properties = {
            rate: __1.Util.parseNumberBetween(rawCommand[1], 0, 250),
            input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
        };
    }
    serialize() {
        const rawCommand = 'CTDp';
        return new Buffer([
            ...Buffer.from(rawCommand),
            this.flag,
            this.mixEffect,
            this.properties.rate,
            0x00,
            this.properties.input >> 8,
            this.properties.input & 0xFF,
            0x00,
            0x00
        ]);
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        mixEffect.transitionSettings.dip = Object.assign({}, this.properties);
    }
}
TransitionDipCommand.MaskFlags = {
    rate: 1 << 0,
    input: 1 << 1
};
exports.TransitionDipCommand = TransitionDipCommand;
//# sourceMappingURL=TransitionDipCommand.js.map