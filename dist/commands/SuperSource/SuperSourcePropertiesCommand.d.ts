/// <reference types="node" />
import AbstractCommand from '../AbstractCommand';
import { AtemState } from '../../state';
import { SuperSourceProperties } from '../../state/video';
export declare class SuperSourcePropertiesCommand extends AbstractCommand {
    static MaskFlags: {
        artFillSource: number;
        artCutSource: number;
        artOption: number;
        artPreMultiplied: number;
        artClip: number;
        artGain: number;
        artInvertKey: number;
        borderEnabled: number;
        borderBevel: number;
        borderOuterWidth: number;
        borderInnerWidth: number;
        borderOuterSoftness: number;
        borderInnerSoftness: number;
        borderBevelSoftness: number;
        borderBevelPosition: number;
        borderHue: number;
        borderSaturation: number;
        borderLuma: number;
        borderLightSourceDirection: number;
        borderLightSourceAltitude: number;
    };
    rawName: string;
    boxId: number;
    properties: SuperSourceProperties;
    updateProps(newProps: Partial<SuperSourceProperties>): void;
    deserialize(rawCommand: Buffer): void;
    serialize(): Buffer;
    applyToState(state: AtemState): void;
}
