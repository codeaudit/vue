import {setOpacity, toRgbaString} from '@andrew-codes/color-functions';
import * as colors from './foundations/colors';

export default {
    _name: 'VersionOne Default Theme',
    altColor: colors.sunglow,
    basicColor: colors.cerulean,
    basicFontFamily: '\'Proxima Nova\', \'Lucida Sans Unicode\', \'Lucida Grande\', sans-serif',
    baseIconSize: 16,
    boldFont: 600,
    borderPrimaryColor: colors.black,
    darkInverseColor: colors.white,
    disabledPrimaryColor: colors.minBlack,
    errorPrimaryColor: colors.sunset,
    errorSecondaryColor: colors.lightSunset,
    fieldBorderColor: colors.aluminum,
    focusedPrimaryColor: colors.cerulean,
    focusedSecondaryColor: toRgbaString(setOpacity(colors.cerulean, 0.5)),
    gutter: 8,
    importantColor: colors.mango,
    largeFontSize: 22,
    largeGutter: 12,
    largeLineHeight: 2.285,
    lightInverseColor: colors.gunMetal,
    mediumFontSize: 16,
    normalBackground: colors.white,
    normalLineHeight: 1.285,
    normalRadius: 6,
    requiredPrimaryColor: colors.sunset,
    pendingPrimaryColor: colors.yellowAccent,
    smallFontSize: 14,
    smallGutter: 6,
    textPrimaryColor: colors.gunMetal,
    textSecondaryColor: colors.aluminum,
    textDisabledColor: colors.minBlack,
    xLargeFontSize: 24,
    xLargeGutter: 16,
    xMediumFontSize: 18,
    xSmallFontSize: 8,
    xxSmallGutter: 3
};