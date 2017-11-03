/**
 * Web viewer option class, sets default options
 */
export class WebViewerOptions {
    background      : string;
    rotation        : number;
    originToCenter  : boolean;

    /**
     * 
     * @param background Body background color
     * @param originToCenter Move scene origin to model center (calculated via bounding sphere)
     * @param rotation The speed of the model rotation, can be positive or negative, set to 0.0 to disable
     */
    constructor(
        background      : string    = "transparent",
        originToCenter  : boolean   = false,
        rotation        : number    = 0.0,
    ) {
        this.background = background;
        this.rotation = rotation;
        this.originToCenter = originToCenter;
    }
}