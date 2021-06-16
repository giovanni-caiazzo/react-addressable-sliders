export const getMinAndMaxFromRanges = ranges => {
    if (!ranges || Object.keys(ranges).length === 0) {
        return { min: 0, max: 100 };
    }
    let extremes = { min: null, max: null };
    Object.values(ranges).forEach(range => {
        if ((!extremes.min && extremes.min !== 0) || range.min < extremes.min) {
            extremes.min = range.min;
        }
        if ((!extremes.max && extremes.max !== 0) || range.max > extremes.max) {
            extremes.max = range.max;
        }
    });
    return extremes;
};

const getPercent = (value, min, max) => Math.round(((value - min) / (max - min)) * 100);

export const updateRef = (range, extremes, rangesRef) => {
    const minPercent = getPercent(range.min, extremes.min, extremes.max);
    const maxPercent = getPercent(range.max, extremes.min, extremes.max);

    if (rangesRef.current && rangesRef.current[range.id]) {
        rangesRef.current[range.id].style.left = `${minPercent}%`;
        rangesRef.current[range.id].style.width = `${maxPercent - minPercent}%`;
    }
};

export const onThumbValueChange = (target_value, thumb, range, ranges, setRanges, options, emitChanges, labelsRef, extremes) => {
    let newValue;
    if (thumb === 'min') {
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
        newValue = Math.min(value, nearestRangeValue - (options?.rangePadding || 1));
    }
    if (emitChanges) {
        const result = emitChanges(range, newValue, thumb);
        if (!!result) {
            if (typeof result === 'object') {
                setRanges(prevState => ({
                    ...prevState,
                    [range.id]: {
                        ...range,
                        [thumb]: result[thumb === 'min' ? 'max' : 'min'],
                    },
                }));
            }
            return;
        }
    }

    changeTooltipPosition(range, thumb, labelsRef, extremes);

    setRanges(prevState => ({
        ...prevState,
        [range.id]: { ...range, [thumb]: newValue },
    }));
};

export const checkRanges = (init_ranges, options) => {
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

export const changeTooltipPosition = (range, thumb, labelsRef, extremes) => {
    if (labelsRef.current && labelsRef.current[range.id]) {
        const label_position = thumb === 'min' ? 'left' : 'right';
        const leftPosition = getPercent(range[thumb], extremes.min, extremes.max);

        if (leftPosition > 80) {
            labelsRef.current[range.id][label_position].style.right = `${100 - leftPosition}%`;
            labelsRef.current[range.id][label_position].style.left = null;
        } else {
            labelsRef.current[range.id][label_position].style.left = `${leftPosition}%`;
            labelsRef.current[range.id][label_position].style.right = null;
        }
    }
};

export const toggleTooltip = (action, range, thumb, labelsRef, extremes) => {
    if (labelsRef.current && labelsRef.current[range.id]) {
        const label_position = thumb === 'min' ? 'left' : 'right';
        labelsRef.current[range.id][label_position].style.visibility = action === 'show' ? 'visible' : 'hidden';
        changeTooltipPosition(range, thumb, labelsRef, extremes);
    }
};

export const toggleNameTooltip = (action, range_id, namesRef) => {
    if (namesRef.current && namesRef.current[range_id]) {
        namesRef.current[range_id].style.visibility = action === 'show' ? 'visible' : 'hidden';
        namesRef.current[range_id].style.left = action === 'show' ? `calc(50% - ${namesRef.current[range_id].clientWidth / 2}px) ` : 0;
    }
};

export const getClickedValueOnTrack = (event, extremes, ranges) => {
    const xPosition = event.clientX;
    const xTotal = event.target.clientWidth;
    const xOffset = event.target.offsetLeft;
    const relativePercentage = ((xPosition - xOffset) / xTotal) * 100;
    const relativeValue = parseInt(extremes.min + (relativePercentage / 100) * (extremes.max - extremes.min));
    let closestRanges = { min: relativeValue, max: relativeValue };
    Object.values(ranges).forEach(range => {
        if (range.max < closestRanges.min) {
            closestRanges.min = Math.max(range.max, closestRanges.min === relativeValue ? range.max : closestRanges.min);
        }
        if (range.min > closestRanges.max) {
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
