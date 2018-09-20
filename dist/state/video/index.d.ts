import * as Enum from '../../enums';
import * as USK from './upstreamKeyers';
import { DownstreamKeyer } from './downstreamKeyers';
export interface DipTransitionSettings {
    rate: number;
    input: number;
}
export interface DVETransitionSettings {
    rate: number;
    logoRate: number;
    style: Enum.DVEEffect;
    fillSource: number;
    keySource: number;
    enableKey: boolean;
    preMultiplied: boolean;
    clip: number;
    gain: number;
    invertKey: boolean;
    reverse: boolean;
    flipFlop: boolean;
}
export interface MixTransitionSettings {
    rate: number;
}
export interface StingerTransitionSettings {
    source: number;
    preMultipliedKey: boolean;
    clip: number;
    gain: number;
    invert: boolean;
    preroll: number;
    clipDuration: number;
    triggerPoint: number;
    mixRate: number;
}
export interface WipeTransitionSettings {
    rate: number;
    pattern: number;
    borderWidth: number;
    borderInput: number;
    symmetry: number;
    borderSoftness: number;
    xPosition: number;
    yPosition: number;
    reverseDirection: boolean;
    flipFlop: boolean;
}
export interface TransitionProperties {
    style: Enum.TransitionStyle;
    selection: number;
    readonly nextStyle: Enum.TransitionStyle;
    readonly nextSelection: number;
}
export interface TransitionSettings {
    dip: DipTransitionSettings;
    DVE: DVETransitionSettings;
    mix: MixTransitionSettings;
    stinger: StingerTransitionSettings;
    wipe: WipeTransitionSettings;
}
export interface IMixEffect {
    programInput: number;
    previewInput: number;
    inTransition: boolean;
    transitionPreview: boolean;
    transitionPosition: number;
    transitionFramesLeft: number;
    fadeToBlack: boolean;
    numberOfKeyers: number;
    transitionProperties: TransitionProperties;
    transitionSettings: TransitionSettings;
    upstreamKeyers: {
        [index: number]: USK.UpstreamKeyer;
    };
}
export declare class MixEffect implements IMixEffect {
    index: number;
    programInput: number;
    previewInput: number;
    inTransition: boolean;
    transitionPreview: boolean;
    transitionPosition: number;
    transitionFramesLeft: number;
    fadeToBlack: boolean;
    numberOfKeyers: number;
    transitionProperties: TransitionProperties;
    transitionSettings: TransitionSettings;
    upstreamKeyers: {
        [index: number]: USK.UpstreamKeyer;
    };
    constructor(index: number);
    getUpstreamKeyer(index: number): USK.UpstreamKeyer;
}
export interface SuperSourceBox {
    enabled: boolean;
    source: number;
    x: number;
    y: number;
    size: number;
    cropped: boolean;
    cropTop: number;
    cropBottom: number;
    cropLeft: number;
    cropRight: number;
}
export interface SuperSourceProperties {
    artFillSource: number;
    artCutSource: number;
    artOption: Enum.SuperSourceArtOption;
    artPreMultiplied: boolean;
    artClip: number;
    artGain: number;
    artInvertKey: boolean;
    borderEnabled: boolean;
    borderBevel: Enum.BorderBevel;
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
}
export declare class AtemVideoState {
    ME: {
        [index: string]: MixEffect;
    };
    downstreamKeyers: {
        [index: string]: DownstreamKeyer;
    };
    auxilliaries: {
        [index: string]: number;
    };
    superSourceBoxes: {
        [index: string]: SuperSourceBox;
    };
    superSourceProperties: SuperSourceProperties;
    getMe(index: number): MixEffect;
    getDownstreamKeyer(index: number): DownstreamKeyer;
}
