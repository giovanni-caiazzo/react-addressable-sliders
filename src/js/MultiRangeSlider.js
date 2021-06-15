import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { checkRanges, getClickedValueOnTrack, getMinAndMaxFromRanges, onThumbValueChange, toggleNameTooltip, toggleTooltip, updateRef } from './utils';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '16px',
    },
    mainTrack: {
        backgroundColor: '#ccc',
        width: '100%',
        zIndex: 1,
        position: 'relative',
        borderRadius: '3px',
        height: '5px',
        cursor: 'pointer',
        '&:hover, &$focusVisible': {
            boxShadow: '0 0 1px 1px #777',
        },
    },
    sliderRange: {
        position: 'absolute',
        borderRadius: '3px',
        height: '9px',
        width: '100%',
        marginTop: '-2px',
        cursor: 'default',
    },
    sliderName: {
        position: 'absolute',
        fontWeight: 'bold',
        fontSize: '12px',
        width: '100%',
        minWidth: 10,
        textAlign: 'center',
        top: '-20px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        zIndex: 1,
    },
    sliderNamePopup: {
        position: 'absolute',
        fontWeight: 'bold',
        fontSize: '12px',
        width: 'auto',
        zIndex: 1500,
        textAlign: 'center',
        top: '-35px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        visibility: 'hidden',
    },
    sliderValue: {
        position: 'absolute',
        fontSize: '12px',
        marginTop: '20px',
        width: 'auto',
        minWidth: '21px',
        maxWidth: '200px',
        textAlign: 'center',
        visibility: 'hidden',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        zIndex: 1500,
    },
    disabledThumb: {
        backgroundColor: '#ccc!important',
        '&::-webkit-slider-thumb': {
            backgroundColor: '#ccc!important',
        },
        '&::-moz-range-thumb': {
            backgroundColor: '#ccc!important',
        },
    },
    thumb: {
        pointerEvents: 'none',
        position: 'absolute',
        height: '0',
        width: '100%',
        outline: 'none',
        zIndex: 4,
        '&::-webkit-slider-thumb': {
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 0 1px 1px #ced4da',
            cursor: 'pointer',
            height: '18px',
            width: '18px',
            marginTop: '4px',
            pointerEvents: 'all',
            position: 'relative',
        },
        '&::-moz-range-thumb': {
            border: 'none',
            borderRadius: '50%',
            boxShadow: '0 0 1px 1px #ced4da',
            cursor: 'pointer',
            height: '18px',
            width: '18px',
            marginTop: '4px',
            pointerEvents: 'all',
            position: 'relative',
        },
    },
};

const MultiRangeSlider = ({ init_ranges = {}, options = {}, emptySpaceCallback, labelFormatFun, init_extremes, emitChanges, checkContinuousChanges }) => {
    const [extremes, setExtremes] = useState(init_extremes || getMinAndMaxFromRanges(init_ranges));
    const [ranges, setRanges] = useState(checkRanges(init_ranges, options));
    let rangesRef = useRef({});
    let labelsRef = useRef({});
    let namesRef = useRef({});

    useEffect(() => {
        if (init_extremes) {
            setExtremes(init_extremes);
        }
    }, [init_extremes]);

    useEffect(() => {
        setRanges(checkRanges(init_ranges, options));
        if (!init_extremes) {
            setExtremes(getMinAndMaxFromRanges(init_ranges));
        }
    }, [init_ranges]);

    useEffect(() => {
        Object.values(ranges).forEach(range => {
            updateRef(range, extremes, rangesRef);
        });
    }, [ranges]);

    return (
        <div style={styles.container}>
            <div style={styles.mainTrack} onClick={event => (emptySpaceCallback ? emptySpaceCallback(getClickedValueOnTrack(event, extremes, ranges)) : null)}>
                {Object.values(ranges).map(range => (
                    <div key={range.id}>
                        {['min', 'max'].map(thumb => {
                            const thumbPosition = thumb === 'min' ? 'left' : 'right';
                            const disabled = (options.hasOwnProperty('isImmovable') && options.isImmovable(range)) || (range.immovable && range.immovable[thumbPosition]);
                            return (
                                <div
                                    key={`${range.id}_${thumb}`}
                                    onMouseEnter={() => toggleTooltip('show', range, thumb, labelsRef, extremes)}
                                    onMouseLeave={() => toggleTooltip('hide', range, thumb, labelsRef, extremes)}
                                >
                                    <input
                                        type={'range'}
                                        min={extremes.min}
                                        max={extremes.max}
                                        disabled={disabled}
                                        value={range[thumb]}
                                        onChange={event => {
                                            !disabled ? onThumbValueChange(event.target.value, thumb, range, ranges, setRanges, options, checkContinuousChanges) : null;
                                        }}
                                        onMouseUp={event => {
                                            !disabled ? onThumbValueChange(event.target.value, thumb, range, ranges, setRanges, options, emitChanges) : null;
                                        }}
                                        onClick={event => event.stopPropagation()}
                                        style={!disabled ? styles.thumb : { ...styles.disabledThumb, ...styles.thumb }}
                                    />
                                    <span
                                        style={styles.sliderValue}
                                        ref={el => {
                                            labelsRef.current[range.id] = labelsRef.current[range.id] || {};
                                            labelsRef.current[range.id][thumbPosition] = el;
                                        }}
                                    >
                                        {labelFormatFun ? labelFormatFun(range[thumb]) : range[thumb]}
                                    </span>
                                </div>
                            );
                        })}
                        <div
                            style={{
                                ...styles.sliderRange,
                                backgroundColor: range.actualTrackColor || null,
                            }}
                            onClick={event => event.stopPropagation()}
                            ref={el => (rangesRef.current[range.id] = el)}
                            onMouseEnter={() => toggleNameTooltip('show', range.id, namesRef)}
                            onMouseLeave={() => toggleNameTooltip('hide', range.id, namesRef)}
                        >
                            <span style={styles.sliderNamePopup} ref={el => (namesRef.current[range.id] = el)}>
                                {range.name}
                            </span>
                            <span style={styles.sliderName}>{range.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    init_ranges: PropTypes.object.isRequired,
    options: PropTypes.object,
    emptySpaceCallback: PropTypes.func,
    labelFormatFun: PropTypes.func,
    emitChanges: PropTypes.func,
    checkContinuousChanges: PropTypes.func,
};

export default MultiRangeSlider;
