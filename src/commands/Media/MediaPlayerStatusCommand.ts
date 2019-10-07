import { AtemState } from '../../state'
import { MediaPlayer } from '../../state/media'
import AbstractCommand from '../AbstractCommand'
import { Util } from '../../lib/atemUtil'

export class MediaPlayerStatusCommand extends AbstractCommand {
	static MaskFlags = {
		playing: 1 << 0,
		loop: 1 << 1,
		atBeginning: 1 << 2,
		frame: 1 << 3
	}
	static readonly rawName = 'SCPS'

	readonly mediaPlayerId: number
	properties: Partial<MediaPlayer>

	constructor (mediaPlayerId: number) {
		super()

		this.mediaPlayerId = mediaPlayerId
		this.properties = {}
	}

	updateProps (newProps: Partial<MediaPlayer>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mediaPlayerId, 1)
		buffer.writeUInt8(this.properties.playing ? 1 : 0, 2)
		buffer.writeUInt8(this.properties.loop ? 1 : 0, 3)
		buffer.writeUInt8(this.properties.atBeginning ? 1 : 0, 4)
		buffer.writeUInt16BE(this.properties.clipFrame || 0, 6)
		return buffer
	}
}

export class MediaPlayerStatusUpdateCommand extends AbstractCommand {
	static readonly rawName = 'RCPS'

	readonly mediaPlayerId: number
	readonly properties: Readonly<MediaPlayer>

	constructor (mediaPlayerId: number, properties: MediaPlayer) {
		super()

		this.mediaPlayerId = mediaPlayerId
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const mediaPlayerId = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			playing: rawCommand[1] === 1,
			loop: rawCommand[2] === 1,
			atBeginning: rawCommand[3] === 1,
			clipFrame: rawCommand[4] << 8 | (rawCommand[5])
		}

		return new MediaPlayerStatusUpdateCommand(mediaPlayerId, properties)
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...state.media.players[this.mediaPlayerId],
			...this.properties
		}
		return `media.players.${this.mediaPlayerId}`
	}
}
