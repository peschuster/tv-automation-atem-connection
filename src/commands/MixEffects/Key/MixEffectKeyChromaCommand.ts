import { WritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerChromaSettings } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyChromaCommand extends WritableCommand<UpstreamKeyerChromaSettings> {
	public static MaskFlags = {
		hue: 1 << 0,
		gain: 1 << 1,
		ySuppress: 1 << 2,
		lift: 1 << 3,
		narrow: 1 << 4
	}
	public static readonly rawName = 'CKCk'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(16)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt16BE(this.properties.hue || 0, 4)
		buffer.writeUInt16BE(this.properties.gain || 0, 6)
		buffer.writeUInt16BE(this.properties.ySuppress || 0, 8)
		buffer.writeUInt16BE(this.properties.lift || 0, 10)
		buffer.writeUInt8(this.properties.narrow ? 1 : 0, 12)

		return buffer
	}
}

export class MixEffectKeyChromaUpdateCommand extends DeserializedCommand<UpstreamKeyerChromaSettings> {
	public static readonly rawName = 'KeCk'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, properties: UpstreamKeyerChromaSettings) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		const properties = {
			hue: Util.parseNumberBetween(rawCommand.readUInt16BE(2), 0, 3599),
			gain: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
			ySuppress: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			lift: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
			narrow: rawCommand[10] === 1
		}

		return new MixEffectKeyChromaUpdateCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.chromaSettings = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.chromaSettings`
	}
}
