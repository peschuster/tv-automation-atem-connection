"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractCommand_1 = require("../AbstractCommand");
const __1 = require("../..");
class DownstreamKeyPropertiesCommand extends AbstractCommand_1.default {
    constructor() {
        super(...arguments);
        this.rawName = 'DskP';
    }
    deserialize(rawCommand) {
        this.downstreamKeyerId = rawCommand[0];
        this.properties = {
            tie: rawCommand[1] === 1,
            rate: __1.Util.parseNumberBetween(rawCommand[2], 0, 300),
            preMultiply: rawCommand[3] === 1,
            clip: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
            gain: __1.Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
            invert: rawCommand[8] === 1,
            mask: {
                enabled: rawCommand[9] === 1,
                top: __1.Util.parseNumberBetween(rawCommand.readInt16BE(10), -9000, 9000),
                bottom: __1.Util.parseNumberBetween(rawCommand.readInt16BE(12), -9000, 9000),
                left: __1.Util.parseNumberBetween(rawCommand.readInt16BE(14), -16000, 16000),
                right: __1.Util.parseNumberBetween(rawCommand.readInt16BE(16), -16000, 16000)
            }
        };
    }
    applyToState(state) {
        state.video.getDownstreamKeyer(this.downstreamKeyerId).properties = this.properties;
    }
}
exports.DownstreamKeyPropertiesCommand = DownstreamKeyPropertiesCommand;
//# sourceMappingURL=DownstreamKeyPropertiesCommand.js.map