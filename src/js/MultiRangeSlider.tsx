import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
    checkRanges,
    getClickedValueOnTrack,
    getMinAndMaxFromRanges,
    onThumbValueChange,
    Thumb,
    Direction,
    toggleNameTooltip,
    toggleTooltip,
    updateRef,
    ReactLabelRef,
    ReactRef,
    Extremes,
    Ranges,
    Options,
} from './utils';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '16px',
    } as React.CSSProperties,
    containerVertical: {
        transform: 'rotate(90deg)',
        transformOrigin: 'left center',
    } as React.CSSProperties,
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
    } as React.CSSProperties,
    sliderRange: {
        position: 'absolute',
        borderRadius: '3px',
        height: '9px',
        width: '100%',
        marginTop: '-2px',
        cursor: 'default',
    } as React.CSSProperties,
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
    } as React.CSSProperties,
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
    } as React.CSSProperties,
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
    } as React.CSSProperties,
    labelVertical: {
        transform: 'rotate(-90deg) translateX(10px)',
        left: '50%',
        transformOrigin: 'left',
        overflow: 'visible',
        textAlign: 'left',
    } as React.CSSProperties,
    labelPopupVertical: {
        transform: 'rotate(-90deg) translateX(50%)',
        transformOrigin: 'center',
    } as React.CSSProperties,
    numberPopupVertical: {
        transform: 'rotate(-90deg) translateX(50%)',
        transformOrigin: 'right'
    } as React.CSSProperties,
    disabledThumb: {
        backgroundColor: '#ccc!important',
        cursor: 'not-allowed',
        zIndex: 3,
        '&::WebkitSliderThumb': {
            backgroundColor: '#ccc!important',
        },
        '&::MozRangeThumb': {
            backgroundColor: '#ccc!important',
        },
    } as React.CSSProperties,
    thumb: {
        pointerEvents: 'all',
        cursor: 'pointer',
        backgroundColor: 'black',
        position: 'absolute',
        height: '0',
        width: '100%',
        outline: 'none',
        zIndex: 4,
        '&::WebkitSliderThumb': {
            border: 'none',
            borderRadius: '50%',
            backgroundColor: 'black',
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
            backgroundColor: 'black',
            boxShadow: '0 0 1px 1px #ced4da',
            cursor: 'pointer',
            height: '18px',
            width: '18px',
            marginTop: '4px',
            pointerEvents: 'all',
            position: 'relative',
        },
    } as React.CSSProperties,
};

type ComponentProps = {
    ranges: Ranges;
    options?: Options;
    emptySpaceCallback?: Function;
    labelFormatFun?: Function;
    extremes?: Extremes;
    emitChanges?: Function;
    checkContinuousChanges?: Function;
    isVertical?: boolean
};

const MultiRangeSlider: FunctionComponent<ComponentProps> = ({ ranges, options, emptySpaceCallback, labelFormatFun, extremes, emitChanges, checkContinuousChanges }) => {
    const [localExtremes, setLocalExtremes]: [Extremes, Function] = useState(extremes || getMinAndMaxFromRanges(ranges));
    const [localRanges, setLocalRanges]: [Ranges, Function] = useState(checkRanges(ranges, options || {}));
    let rangesRef: ReactRef = useRef({});
    let labelsRef: ReactLabelRef = useRef({});
    let namesRef: ReactRef = useRef({});

    useEffect(() => {
        if (extremes) {
            setLocalExtremes(extremes);
        }
    }, [extremes]);

    useEffect(() => {
        setLocalRanges(checkRanges(ranges, options || {}));
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
        <div style={{...styles.container, ...(options?.isVertical ? styles.containerVertical : {})}}>
            <div style={styles.mainTrack} onClick={event => (emptySpaceCallback ? emptySpaceCallback(getClickedValueOnTrack(event, localExtremes, localRanges)) : null)}>
                {Object.values(localRanges).map(range => (
                    <div key={range.id}>
                        {[Thumb.MIN, Thumb.MAX].map(thumb => {
                            const thumbPosition = thumb === Thumb.MIN ? Direction.LEFT : 'right';
                            const disabled = !!((options && options.isImmovable && options.isImmovable(range)) || (range.immovable && range.immovable[thumbPosition]));
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
                                            !disabled
                                                ? onThumbValueChange(
                                                      event.target.value,
                                                      thumb,
                                                      range,
                                                      localRanges,
                                                      setLocalRanges,
                                                      options || {},
                                                      checkContinuousChanges ? checkContinuousChanges : () => {},
                                                      labelsRef,
                                                      localExtremes,
                                                  )
                                                : null;
                                        }}
                                        onMouseUp={event => {
                                            !disabled
                                                ? onThumbValueChange(
                                                      (event.target as HTMLInputElement).value,
                                                      thumb,
                                                      range,
                                                      localRanges,
                                                      setLocalRanges,
                                                      options || {},
                                                      emitChanges ? emitChanges : () => {},
                                                      labelsRef,
                                                      localExtremes,
                                                  )
                                                : null;
                                        }}
                                        onClick={event => event.stopPropagation()}
                                        style={
                                            !disabled
                                                ? { ...styles.thumb, ...(options?.sliderThumbStyles || {}) }
                                                : { ...styles.thumb, ...styles.disabledThumb, ...(options?.sliderThumbStyles || {}) }
                                        }
                                    />
                                    <span
                                        style={{ ...styles.sliderValue, ...(options?.sliderValueStyles || {}), ...(options?.isVertical ? styles.numberPopupVertical : {}) }}
                                        ref={el => {
                                            if (labelsRef.current) {
                                                labelsRef.current[range.id] = labelsRef.current[range.id] || {};
                                                if (labelsRef.current[range.id] && el) {
                                                    labelsRef.current[range.id][thumbPosition] = el;
                                                }
                                            }
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
                                backgroundColor: range.actualTrackColor || '',
                            }}
                            onClick={event => event.stopPropagation()}
                            ref={el => {
                                if (rangesRef.current && el) {
                                    rangesRef.current[range.id] = el;
                                }
                            }}
                            onMouseEnter={() => toggleNameTooltip('show', range.id, namesRef)}
                            onMouseLeave={() => toggleNameTooltip('hide', range.id, namesRef)}
                        >
                            <span
                                style={{ ...styles.sliderNamePopup, ...(options?.sliderNamePopupStyles || {}), ...(options?.isVertical ? styles.labelPopupVertical : {}) }}
                                ref={el => {
                                    if (namesRef.current && el) {
                                        namesRef.current[range.id] = el;
                                    }
                                }}
                            >
                                {range.name}
                            </span>
                            <span style={{ ...styles.sliderName, ...(options?.sliderNameStyles || {}), ...(options?.isVertical ? styles.labelVertical : {}) }}>{range.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

MultiRangeSlider.defaultProps = {
    ranges: {},
    options: {},
};

export default MultiRangeSlider;
