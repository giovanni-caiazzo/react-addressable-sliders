import React from 'react';

export enum Thumb {
    MIN = 'min',
    MAX = 'max',
}
export enum Direction {
    LEFT = 'left',
    RIGHT = 'right',
}

export type Extremes = { [Thumb.MIN]: number; [Thumb.MAX]: number };
export type Range = {
    [Thumb.MIN]: number;
    [Thumb.MAX]: number;
    id: string;
    actualTrackColor?: string;
    trackColor?: string;
    ref_id: string;
    parent_id: string;
    immovable?: { [a in Direction]?: boolean };
    name: string;
};
export type Ranges = { [name: string]: Range };
export type ReactRef = React.RefObject<{ [name: string]: HTMLElement }>;
export type ReactLabelRef = React.RefObject<{ [name: string]: { [direction in Direction]: HTMLElement } }>;
export type ReactOnClickEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type Options = {
    rangePadding?: number;
    getTrackColor?: (a: Range) => string;
    isImmovable?: (a: Range) => boolean;
    sliderThumbStyles?: Object;
    sliderValueStyles?: Object;
    sliderNamePopupStyles?: Object;
    sliderNameStyles?: Object;
    isVertical?: boolean;
};

export const getMinAndMaxFromRanges = (ranges: Ranges): Extremes => {
    if (!ranges || Object.keys(ranges).length === 0) {
        return { min: 0, max: 100 };
    }
    let min = Object.values(ranges)[0].min;
    let max = Object.values(ranges)[0].max;
    Object.values(ranges).forEach(range => {
        if ((!min && min !== 0) || range.min < min) {
            min = range.min;
        }
        if ((!max && max !== 0) || range.max > max) {
            max = range.max;
        }
    });

    return { min: min, max: max };
};

const getPercent = (value: number, min: number, max: number): number => Math.round(((value - min) / (max - min)) * 100);

export const updateRef = (range: Range, extremes: Extremes, rangesRef: ReactRef) => {
    const minPercent = getPercent(range.min, extremes.min, extremes.max);
    const maxPercent = getPercent(range.max, extremes.min, extremes.max);

    if (rangesRef && rangesRef.current && rangesRef.current[range.id]) {
        rangesRef.current[range.id].style.left = `${minPercent}%`;
        rangesRef.current[range.id].style.width = `${maxPercent - minPercent}%`;
    }
};

export const onThumbValueChange = (
    target_value: string,
    thumb: Thumb,
    range: Range,
    ranges: Ranges,
    setRanges: Function,
    options: Options,
    emitChanges: Function,
    labelsRef: ReactLabelRef,
    extremes: Extremes,
) => {
    let newValue: number;
    if (thumb === Thumb.MIN) {
        const value = Math.min(Number(target_value), range.max - 1);
        const nearestRangeValue = Math.max(
            ...Object.values(ranges)
                .map(item => item.max)
                .filter(max => max <= range.min),
        );
        newValue = Math.max(value, nearestRangeValue + (options?.rangePadding || 0));
    } else {
        const value = Math.max(Number(target_value), range.min + 1);
        const nearestRangeValue = Math.min(
            ...Object.values(ranges)
                .map(item => item.min)
                .filter(min => min >= range.max),
        );
        newValue = Math.min(value, nearestRangeValue - (options?.rangePadding || 0));
    }
    if (emitChanges) {
        const result = emitChanges(range, newValue, thumb);
        if (!!result) {
            if (typeof result === 'object') {
                setRanges((prevState: Range) => ({
                    ...prevState,
                    [range.id]: {
                        ...range,
                        [thumb]: result[thumb === Thumb.MIN ? Thumb.MAX : Thumb.MIN],
                    },
                }));
            }
            return;
        }
    }

    changeTooltipPosition(range, thumb, labelsRef, extremes);

    setRanges((prevState: Range) => ({
        ...prevState,
        [range.id]: { ...range, [thumb]: newValue },
    }));
};

export const checkRanges = (init_ranges: Ranges, options: Options) => {
    let checked_ranges = init_ranges || {};
    const range_intervals = Object.values(checked_ranges);
    const rangePadding = options?.rangePadding || 0;

    range_intervals.forEach(considered_range => {
        considered_range.actualTrackColor = considered_range.trackColor
            ? considered_range.trackColor
            : options?.getTrackColor
            ? options.getTrackColor(considered_range)
            : `#${considered_range.ref_id ? considered_range.ref_id.substr(0, 6) : considered_range.parent_id ? considered_range.parent_id.substr(0, 6) : 'CCC'}`;
        range_intervals.forEach(range => {
            if (considered_range.id !== range.id) {
                if (considered_range.min < range.max && considered_range.min > range.min) {
                    considered_range.min = range.max + rangePadding;
                }
                if (considered_range.max < range.max && considered_range.max > range.min) {
                    considered_range.max = range.min - rangePadding;
                }
            }
        });
    });

    return checked_ranges;
};

export const changeTooltipPosition = (range: Range, thumb: Thumb, labelsRef: ReactLabelRef, extremes: Extremes) => {
    if (labelsRef.current && labelsRef.current[range.id]) {
        const label_position = thumb === Thumb.MIN ? Direction.LEFT : Direction.RIGHT;
        const leftPosition = getPercent(range[thumb], extremes.min, extremes.max);

        if (leftPosition > 80) {
            labelsRef.current[range.id][label_position].style.right = `${100 - leftPosition}%`;
            labelsRef.current[range.id][label_position].style.left = '';
        } else {
            labelsRef.current[range.id][label_position].style.left = `${leftPosition}%`;
            labelsRef.current[range.id][label_position].style.right = '';
        }
    }
};

export const toggleTooltip = (action: string, range: Range, thumb: Thumb, labelsRef: ReactLabelRef, extremes: Extremes) => {
    if (labelsRef.current && labelsRef.current[range.id]) {
        const label_position = thumb === Thumb.MIN ? Direction.LEFT : Direction.RIGHT;
        labelsRef.current[range.id][label_position].style.visibility = action === 'show' ? 'visible' : 'hidden';
        changeTooltipPosition(range, thumb, labelsRef, extremes);
    }
};

export const toggleNameTooltip = (action: string, range_id: string, namesRef: ReactRef) => {
    if (namesRef.current && namesRef.current[range_id]) {
        namesRef.current[range_id].style.visibility = action === 'show' ? 'visible' : 'hidden';
        namesRef.current[range_id].style.left = action === 'show' ? `calc(50% - ${namesRef.current[range_id].clientWidth / 2}px) ` : '0';
    }
};

export const getClickedValueOnTrack = (event: ReactOnClickEvent, extremes: Extremes, ranges: Ranges) => {
    const xPosition = event.clientX;
    // @ts-ignore
    const xTotal = event.target.clientWidth;
    // @ts-ignore
    const xOffset = event.target.offsetLeft;
    const relativePercentage = ((xPosition - xOffset) / xTotal) * 100;
    const relativeValue = extremes.min + (relativePercentage / 100) * (extremes.max - extremes.min);
    let closestRanges = extremes;
    Object.values(ranges).forEach(range => {
        if (closestRanges.min <= range.max && range.max <= relativeValue) {
            closestRanges.min = Math.max(range.max, closestRanges.min === relativeValue ? range.max : closestRanges.min);
        }
        if (closestRanges.max >= range.min && range.min >= relativeValue) {
            closestRanges.max = Math.min(range.min, closestRanges.max === relativeValue ? range.min : closestRanges.max);
        }
    });
    return {
        relativePercentage,
        relativeValue,
        closestRanges: {
            min: closestRanges.min === relativeValue ? extremes.min : closestRanges.min,
            max: closestRanges.max === relativeValue ? extremes.max : closestRanges.max,
        },
    };
};
