import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Background } from './ShadowToolStyled';
import { ShadowToolTime } from './ShadowToolTime';
import { ShadowToolDate } from './ShadowToolDate';
import { validateDate, validateTime, sliderValueForDate, sliderValueForTime } from './ShadowToolUtil';
import moment from 'moment';

// Helper function using react-hooks to manipulate setInterval
function useInterval (callback, delay) {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick () {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export const ShadowTool = ({ controller, date, time }) => {
    const [timeValue, setTime] = useState(time);
    const [dateValue, setDate] = useState(date);
    const [sliderTimeValue, setSliderTime] = useState(sliderValueForTime(time));
    const [sliderDateValue, setSliderDate] = useState(sliderValueForDate(date));
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState('normal');

    useInterval(() => {
        let nextTime;
        let nextDate;
        switch (speed) {
        case 'normal':
            nextTime = addMinutes(6);
            nextDate = calculateNextDay(nextTime);
            break;
        case 'fast':
            nextTime = addMinutes(30);
            nextDate = calculateNextDay(nextTime);
            break;
        case 'slow':
        default:
            nextTime = addMinutes(1);
            nextDate = calculateNextDay(nextTime);
            break;
        }
        changeTimeAndDate(nextTime, nextDate);
    }, playing ? 50 : null);

    const calculateNextDay = (nextTime) => {
        const nextDate = nextTime < timeValue ? addDays(1) : dateValue;
        if (nextDate === '1/1' && nextDate !== dateValue) {
            setPlaying(false);
        }
        return nextDate;
    };

    const addMinutes = (minutes) => {
        return moment.utc(timeValue, 'HH:mm').add(minutes, 'minutes').format('HH:mm');
    };

    const addDays = (days) => {
        return moment.utc(dateValue, 'D/M').add(days, 'day').format('D/M');
    };

    const changeTime = val => {
        if (validateTime(val)) {
            controller.requestNewTime(val);
            setSliderTime(sliderValueForTime(val));
        }
        setTime(val);
    };

    const changeDate = val => {
        if (validateDate(val)) {
            controller.requestNewDate(val);
            setSliderDate(sliderValueForDate(val));
        }
        setDate(val);
    };

    const changeTimeAndDate = (t, d) => {
        setTime(t);
        setDate(d);
        setSliderDate(sliderValueForDate(d));
        setSliderTime(sliderValueForTime(t));
        controller.requestNewDateAndTime(d, t);
    };

    return (
        <Background>
            <ShadowToolDate
                changeHandler={changeDate}
                sliderDateValue={sliderDateValue}
                dateValue={dateValue}
                currentTimeHandler={changeTimeAndDate}
            />
            <ShadowToolTime
                changeHandler={changeTime}
                timeValue={timeValue}
                sliderTimeValue={sliderTimeValue}
                playing={playing}
                playHandler={setPlaying}
                speedHandler={setSpeed}
                speed={speed}
            />
        </Background>
    );
};

ShadowTool.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
};