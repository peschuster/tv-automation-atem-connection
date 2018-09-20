"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const child_process_1 = require("child_process");
const events_1 = require("events");
const path = require("path");
const atemCommandParser_1 = require("./atemCommandParser");
const enums_1 = require("../enums");
const exitHook = require("exit-hook");
const atemUtil_1 = require("./atemUtil");
class AtemSocket extends events_1.EventEmitter {
    constructor(options) {
        super();
        this._debug = false;
        this._localPacketId = 0;
        this._port = 9910;
        this._shouldConnect = false;
        this._commandParser = new atemCommandParser_1.CommandParser();
        this._address = options.address || this._address;
        this._port = options.port || this._port;
        this._debug = options.debug || false;
        this.log = options.log || this.log;
        this._createSocketProcess();
        // When the parent process begins exiting, remove the listeners on our child process.
        // We do this to avoid throwing an error when the child process exits
        // as a natural part of the parent process exiting.
        exitHook(() => {
            if (this._socketProcess) {
                this._socketProcess.removeAllListeners();
            }
        });
    }
    connect(address, port) {
        this._shouldConnect = true;
        if (address) {
            this._address = address;
        }
        if (port) {
            this._port = port;
        }
        return this._sendSubprocessMessage({
            cmd: enums_1.IPCMessageType.Connect,
            payload: {
                address: this._address,
                port: this._port
            }
        });
    }
    disconnect() {
        this._shouldConnect = false;
        return this._sendSubprocessMessage({
            cmd: enums_1.IPCMessageType.Disconnect
        });
    }
    log(..._args) {
        // Will be re-assigned by the top-level ATEM class.
    }
    get nextPacketId() {
        if (this._localPacketId >= Number.MAX_SAFE_INTEGER) {
            this._localPacketId = 0;
        }
        return ++this._localPacketId;
    }
    _sendCommand(command, trackingId) {
        if (typeof command.serialize !== 'function') {
            return Promise.reject(new Error('Command is not serializable'));
        }
        const payload = command.serialize();
        if (this._debug)
            this.log('PAYLOAD', payload);
        return this._sendSubprocessMessage({
            cmd: enums_1.IPCMessageType.OutboundCommand,
            payload: {
                data: payload,
                trackingId
            }
        });
    }
    _createSocketProcess() {
        if (this._socketProcess) {
            this._socketProcess.removeAllListeners();
            this._socketProcess.kill();
            this._socketProcess = null;
        }
        this._socketProcess = child_process_1.fork(path.resolve(__dirname, '../socket-child.js'), [], {
            silent: !this._debug,
            stdio: this._debug ? [0, 1, 2, 'ipc'] : undefined
        });
        this._socketProcess.on('message', this._receiveSubprocessMessage.bind(this));
        this._socketProcess.on('error', error => {
            this.emit('error', error);
            this.log('socket process error:', error);
        });
        this._socketProcess.on('exit', (code, signal) => {
            process.nextTick(() => {
                this.emit('error', new Error(`The socket process unexpectedly closed (code: "${code}", signal: "${signal}")`));
                this.log('socket process exit:', code, signal);
                this._createSocketProcess();
            });
        });
        if (this._shouldConnect) {
            this.connect().catch(error => {
                const errorMsg = 'Failed to reconnect after respawning socket process';
                this.emit('error', error);
                this.log(errorMsg + ':', error && error.message);
            });
        }
    }
    _sendSubprocessMessage(message) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this._socketProcess) {
                throw new Error('Socket process process does not exist');
            }
            return atemUtil_1.Util.sendIPCMessage(this, '_socketProcess', message, this.log);
        });
    }
    _receiveSubprocessMessage(message) {
        if (typeof message !== 'object') {
            return;
        }
        if (typeof message.cmd !== 'string' || message.cmd.length <= 0) {
            return;
        }
        const payload = message.payload;
        switch (message.cmd) {
            case enums_1.IPCMessageType.Log:
                this.log(message.payload);
                break;
            case enums_1.IPCMessageType.CommandAcknowledged:
                this.emit(enums_1.IPCMessageType.CommandAcknowledged, message.payload);
                break;
            case enums_1.IPCMessageType.InboundCommand:
                this._parseCommand(Buffer.from(payload.packet.data), payload.remotePacketId);
                break;
            case enums_1.IPCMessageType.Disconnect:
                this.emit(enums_1.IPCMessageType.Disconnect);
                break;
        }
    }
    _parseCommand(buffer, packetId) {
        const length = buffer.readUInt16BE(0);
        const name = buffer.toString('ascii', 4, 8);
        if (name === 'InCm') {
            this.emit('connect');
        }
        // this.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))
        const cmd = this._commandParser.commandFromRawName(name);
        if (cmd && typeof cmd.deserialize === 'function') {
            try {
                cmd.deserialize(buffer.slice(0, length).slice(8));
                cmd.packetId = packetId || -1;
                this.emit('receivedStateChange', cmd);
            }
            catch (e) {
                this.emit('error', e);
            }
        }
        if (buffer.length > length) {
            this._parseCommand(buffer.slice(length), packetId);
        }
    }
}
exports.AtemSocket = AtemSocket;
//# sourceMappingURL=atemSocket.js.map