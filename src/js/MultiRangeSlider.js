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
        color: 'black',
        backgroundColor: 'white',
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
        color: 'black',
        backgroundColor: 'white',
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
        color: 'black',
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
        '&::WebkitSliderThumb': {
            backgroundColor: '#ccc!important',
        },
        '&::MozRangeThumb': {
            backgroundColor: '#ccc!important',
        },
    },
    thumb: {
        pointerEvents: 'none',
        backgroundColor: 'black',
        position: 'absolute',
        height: '0',
        width: '100%',
        outline: 'none',
        zIndex: 4,
        '&::WebkitSliderThumb': {
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
        '&::MozRangeThumb': {
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

const MultiRangeSlider = ({ ranges = {}, options = {}, emptySpaceCallback, labelFormatFun, extremes, emitChanges, checkContinuousChanges }) => {
    const [localExtremes, setLocalExtremes] = useState(extremes || getMinAndMaxFromRanges(ranges));
    const [localRanges, setLocalRanges] = useState(checkRanges(ranges, options));
    let rangesRef = useRef({});
    let labelsRef = useRef({});
    let namesRef = useRef({});

    useEffect(() => {
        if (extremes) {
            setLocalExtremes(extremes);
        }
    }, [extremes]);

    useEffect(() => {
        setLocalRanges(checkRanges(ranges, options));
        if (!extremes) {
            setLocalExtremes(getMinAndMaxFromRanges(ranges));
        }
    }, [ranges]);

    useEffect(() => {
        Object.values(localRanges).forEach(range => {
            updateRef(range, localExtremes, rangesRef);
        });
    }, [localRanges]);

    return (
        <div style={styles.container}>
            <div style={styles.mainTrack} onClick={event => (emptySpaceCallback ? emptySpaceCallback(getClickedValueOnTrack(event, localExtremes, localRanges)) : null)}>
                {Object.values(localRanges).map(range => (
                    <div key={range.id}>
                        {['min', 'max'].map(thumb => {
                            const thumbPosition = thumb === 'min' ? 'left' : 'right';
                            const disabled = (options.hasOwnProperty('isImmovable') && options.isImmovable(range)) || (range.immovable && range.immovable[thumbPosition]);
                            return (
                                <div
                                    key={`${range.id}_${thumb}`}
                                    onMouseEnter={() => toggleTooltip('show', range, thumb, labelsRef, localExtremes)}
                                    onMouseLeave={() => toggleTooltip('hide', range, thumb, labelsRef, localExtremes)}
                                >
                                    <input
                                        type={'range'}
                                        min={localExtremes.min}
                                        max={localExtremes.max}
                                        disabled={disabled}
                                        value={range[thumb]}
                                        onChange={event => {
                                            !disabled ? onThumbValueChange(event.target.value, thumb, range, localRanges, setLocalRanges, options, checkContinuousChanges) : null;
                                        }}
                                        onMouseUp={event => {
                                            !disabled ? onThumbValueChange(event.target.value, thumb, range, localRanges, setLocalRanges, options, emitChanges) : null;
                                        }}
                                        onClick={event => event.stopPropagation()}
                                        style={!disabled ? styles.thumb : { ...styles.disabledThumb, ...styles.thumb }}
                                    />
                                    <span
                                        style={{ ...styles.sliderValue, ...(options?.sliderValueStyles || {}) }}
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
                            <span style={{ ...styles.sliderNamePopup, ...(options?.sliderNamePopupStyles || {}) }} ref={el => (namesRef.current[range.id] = el)}>
                                {range.name}
                            </span>
                            <span style={{ ...styles.sliderName, ...(options?.sliderNameStyles || {}) }}>{range.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MultiRangeSlider.propTypes = {
    ranges: PropTypes.object.isRequired,
    extremes: PropTypes.object,
    options: PropTypes.object,
    emptySpaceCallback: PropTypes.func,
    labelFormatFun: PropTypes.func,
    emitChanges: PropTypes.func,
    checkContinuousChanges: PropTypes.func,
};

export default MultiRangeSlider;
