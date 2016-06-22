function clamp(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}

export function convertColorToString(color) {
    const {type, values} = color;

    if (type.indexOf('rgb') > -1) {
        // Only convert the first 3 values to int (i.e. not alpha)
        for (let i = 0; i < 3; i++) {
            values[i] = parseInt(values[i]);
        }
    }

    let colorString;

    if (type.indexOf('hsl') > -1) {
        colorString = `${color.type}(${values[0]}, ${values[1]}%, ${values[2]}%`;
    } else {
        colorString = `${color.type}(${values[0]}, ${values[1]}, ${values[2]}`;
    }

    if (values.length === 4) {
        colorString += `, ${color.values[3]})`;
    } else {
        colorString += ')';
    }

    return colorString;
}

export function convertHexToRGB(color) {
    if (color.length === 4) {
        let extendedColor = '#';
        for (let i = 1; i < color.length; i++) {
            extendedColor += color.charAt(i) + color.charAt(i);
        }
        color = extendedColor;
    }

    const values = {
        r: parseInt(color.substr(1, 2), 16),
        g: parseInt(color.substr(3, 2), 16),
        b: parseInt(color.substr(5, 2), 16),
    };

    return `rgb(${values.r}, ${values.g}, ${values.b})`;
}

export function decomposeColor(color) {
    if (color.charAt(0) === '#') {
        return decomposeColor(convertHexToRGB(color));
    }

    const marker = color.indexOf('(');
    const type = color.substring(0, marker);
    let values = color.substring(marker + 1, color.length - 1).split(',');
    values = values.map((value) => parseFloat(value));

    return {type: type, values: values};
}

export function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    const contrastRatio = (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);

    return Number(contrastRatio.toFixed(2)); // Truncate at two digits
}

export function getLuminance(color) {
    color = decomposeColor(color);

    if (color.type.indexOf('rgb') > -1) {
        const rgb = color.values.map((val) => {
            val /= 255; // normalized
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3)); // Truncate at 3 digits
    } else if (color.type.indexOf('hsl') > -1) {
        return color.values[2] / 100;
    }
}

export function emphasize(color, coefficient = 0.15) {
    return getLuminance(color) > 0.5 ?
        darken(color, coefficient) :
        lighten(color, coefficient);
}

export function fade(color, value) {
    color = decomposeColor(color);
    value = clamp(value, 0, 1);

    if (color.type === 'rgb' || color.type === 'hsl') {
        color.type += 'a';
    }
    color.values[3] = value;

    return convertColorToString(color);
}

export function darken(color, coefficient) {
    color = decomposeColor(color);
    coefficient = clamp(coefficient, 0, 1);

    if (color.type.indexOf('hsl') > -1) {
        color.values[2] *= 1 - coefficient;
    } else if (color.type.indexOf('rgb') > -1) {
        for (let i = 0; i < 3; i++) {
            color.values[i] *= 1 - coefficient;
        }
    }
    return convertColorToString(color);
}

export function lighten(color, coefficient) {
    color = decomposeColor(color);
    coefficient = clamp(coefficient, 0, 1);

    if (color.type.indexOf('hsl') > -1) {
        color.values[2] += (100 - color.values[2]) * coefficient;
    } else if (color.type.indexOf('rgb') > -1) {
        for (let i = 0; i < 3; i++) {
            color.values[i] += (255 - color.values[i]) * coefficient;
        }
    }

    return convertColorToString(color);
}
