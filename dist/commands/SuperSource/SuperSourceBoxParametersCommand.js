"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const __1 = require("../..");
class SuperSourceBoxParametersCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'SSBP';
    }
    updateProps(newProps) {
        this._updateProps(newProps);
    }
    deserialize(rawCommand) {
        this.boxId = rawCommand[0];
        this.properties = {
            enabled: rawCommand[1] === 1,
            source: rawCommand.readUInt16BE(2),
            x: __1.Util.parseNumberBetween(rawCommand.readInt16BE(4), -4800, 4800),
            y: __1.Util.parseNumberBetween(rawCommand.readInt16BE(6), -3400, 3400),
            size: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(8), 70, 1000),
            cropped: rawCommand[10] === 1,
            cropTop: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(12), 0, 18000),
            cropBottom: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(14), 0, 18000),
            cropLeft: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(16), 0, 32000),
            cropRight: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(18), 0, 3200)
        };
    }
    serialize() {
        const buffer = Buffer.alloc(24);
        buffer.writeUInt16BE(this.flag, 0);
        buffer.writeUInt8(this.boxId, 2);
        buffer.writeUInt8(this.properties.enabled ? 1 : 0, 3);
        buffer.writeUInt16BE(this.properties.source, 4);
        buffer.writeInt16BE(this.properties.x, 6);
        buffer.writeInt16BE(this.properties.y, 8);
        buffer.writeUInt16BE(this.properties.size, 10);
        buffer.writeUInt8(this.properties.cropped ? 1 : 0, 12);
        buffer.writeUInt16BE(this.properties.cropTop, 14);
        buffer.writeUInt16BE(this.properties.cropBottom, 16);
        buffer.writeUInt16BE(this.properties.cropLeft, 18);
        buffer.writeUInt16BE(this.properties.cropRight, 20);
        return Buffer.concat([Buffer.from('CSBP', 'ascii'), buffer]);
    }
    applyToState(state) {
        state.video.superSourceBoxes[this.boxId] = Object.assign({}, this.properties);
    }
}
SuperSourceBoxParametersCommand.MaskFlags = {
    enabled: 1 << 0,
    source: 1 << 1,
    x: 1 << 2,
    y: 1 << 3,
    size: 1 << 4,
    cropped: 1 << 5,
    cropTop: 1 << 6,
    cropBottom: 1 << 7,
    cropLeft: 1 << 8,
    cropRight: 1 << 9
};
exports.SuperSourceBoxParametersCommand = SuperSourceBoxParametersCommand;
//# sourceMappingURL=SuperSourceBoxParametersCommand.js.map