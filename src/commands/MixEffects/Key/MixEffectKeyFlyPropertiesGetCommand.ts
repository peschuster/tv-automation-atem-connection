import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlySettings } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyFlyPropertiesGetCommand extends DeserializedCommand<UpstreamKeyerFlySettings> {
	public static readonly rawName = 'KeFS'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, properties: UpstreamKeyerFlySettings) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		const properties = {
			isASet: rawCommand[2] === 1,
			isBSet: rawCommand[3] === 1,
			isAtKeyFrame: rawCommand[6],
			runToInfiniteIndex: rawCommand[7]
		}
		return new MixEffectKeyFlyPropertiesGetCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.flyProperties = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.flyProperties`
	}
}
