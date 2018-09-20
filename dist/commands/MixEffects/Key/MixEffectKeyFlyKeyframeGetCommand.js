"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../../AbstractCommand");
const __1 = require("../../..");
class MixEffectKeyFlyKeyframeGetCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'KKFP';
    }
    deserialize(rawCommand) {
        this.mixEffect = __1.Util.parseNumberBetween(rawCommand[0], 0, 3);
        this.upstreamKeyerId = __1.Util.parseNumberBetween(rawCommand[1], 0, 3);
        this.properties = {
            keyFrameId: __1.Util.parseNumberBetween(rawCommand[2], 1, 2),
            sizeX: __1.Util.parseNumberBetween(rawCommand.readUInt32BE(4), 0, 99990),
            sizeY: __1.Util.parseNumberBetween(rawCommand.readUInt32BE(8), 0, 99990),
            positionX: __1.Util.parseNumberBetween(rawCommand.readInt32BE(12), -1000 * 1000, 1000 * 1000),
            positionY: __1.Util.parseNumberBetween(rawCommand.readInt32BE(16), -1000 * 1000, 1000 * 1000),
            rotation: __1.Util.parseNumberBetween(rawCommand.readInt32BE(20), -332230, 332230),
            borderOuterWidth: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(24), 0, 1600),
            borderInnerWidth: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(26), 0, 1600),
            borderOuterSoftness: __1.Util.parseNumberBetween(rawCommand.readInt8(28), 0, 100),
            borderInnerSoftness: __1.Util.parseNumberBetween(rawCommand.readInt8(29), 0, 100),
            borderBevelSoftness: __1.Util.parseNumberBetween(rawCommand.readInt8(30), 0, 100),
            borderBevelPosition: __1.Util.parseNumberBetween(rawCommand.readInt8(31), 0, 100),
            borderOpacity: __1.Util.parseNumberBetween(rawCommand.readInt8(32), 0, 100),
            borderHue: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(34), 0, 1000),
            borderSaturation: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(36), 0, 1000),
            borderLuma: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(38), 0, 1000),
            lightSourceDirection: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(40), 0, 3599),
            lightSourceAltitude: __1.Util.parseNumberBetween(rawCommand.readUInt8(42), 0, 100),
            maskEnabled: rawCommand[43] === 1,
            maskTop: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(44), 0, 38000),
            maskBottom: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(46), 0, 38000),
            maskLeft: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(48), 0, 52000),
            maskRight: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(50), 0, 52000)
        };
    }
    applyToState(state) {
        const mixEffect = state.video.getMe(this.mixEffect);
        const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId);
        upstreamKeyer.flyKeyframes[this.properties.keyFrameId] = Object.assign({}, this.properties);
    }
}
exports.MixEffectKeyFlyKeyframeGetCommand = MixEffectKeyFlyKeyframeGetCommand;
//# sourceMappingURL=MixEffectKeyFlyKeyframeGetCommand.js.map