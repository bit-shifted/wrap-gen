const DPI = 300;
const MM_TO_INCH = 1 / 25.4;

export const BATTERY_TYPES = {
    '18650': {
        widthMm: 60,
        heightMm: 65
    },
    '21700': {
        widthMm: 70.5,
        heightMm: 70
    },
    '18350': {
        widthMm: 60,
        heightMm: 35
    },
};

export const PAPER_TYPES = {
    'us-letter': {
        widthPx: 8.5 * DPI,
        heightPx: 11 * DPI
    },
    'a4': {
        widthPx: 8.3 * DPI,
        heightPx: 11.7 * DPI
    },
};

export function getDimensions(type) {
    const battery = BATTERY_TYPES[type];
    return {
        widthPx: Math.round(battery.widthMm * MM_TO_INCH * DPI),
        heightPx: Math.round(battery.heightMm * MM_TO_INCH * DPI)
    };
}