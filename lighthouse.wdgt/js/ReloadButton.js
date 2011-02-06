/**
 * @class  Reloadbutton
 * @see    AppleInfoButton
 * /System/Library/WidgetResources/AppleClasses/AppleInfoButton.js
 */
function ReloadButton(flipper, front, foregroundStyle, backgroundStyle, onclick) {
    this.button = new AppleInfoButton(flipper, front, foregroundStyle, backgroundStyle, 
        onclick);
    this.button._flipLabel.src = "css/img/reload.png";
    return this.button;
}