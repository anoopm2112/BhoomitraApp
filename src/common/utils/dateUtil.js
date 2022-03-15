import moment from 'moment';
import I18n from '../i18n';
import { DATE_FORMAT, TIME_FORMAT, DATE_TIME_FORMAT, API_DATE_TIME_FORMAT, API_TIME_FORMAT, DATE_TIME_FORMAT_DATEPICKER } from '../constants';

export function convertToLocal(utcDate, format) {
    return utcDate && moment(utcDate).format(format || DATE_TIME_FORMAT);
}

export function convertToUTC(localDate, format) {
    return localDate ? moment.utc(moment(localDate, format || DATE_TIME_FORMAT)).format(API_DATE_TIME_FORMAT) : null;
}

export function convertToLocalDate(utcDate, format) {
    return utcDate && moment(utcDate).format(format || DATE_FORMAT);
}

export function convertToLocalTime(utcDate, format) {
    return utcDate && moment(utcDate).format(format || TIME_FORMAT);
}

export function convertToUTCTime(localTime) {
    return localTime ? moment.utc(moment(localTime, TIME_FORMAT)).format(API_TIME_FORMAT) : null;
}

export function toAPITimeFormat(localTime) {
    return localTime ? moment(localTime, TIME_FORMAT).format(API_TIME_FORMAT) : null;
}

export function toLocalTimeFormat(time) {
    return time ? moment(time, API_TIME_FORMAT).format(TIME_FORMAT) : null;
}

export function convertTimeStringToLocalTime(time) {
    return time ? moment(time + 'Z', API_TIME_FORMAT + 'Z').format(TIME_FORMAT) : null;
}

export function getViewFormattedDate(date) {
    return date && moment(date).format(DATE_FORMAT);
}

export function formatDate(date, format) {
    return date && moment(date).format(format);
}

export function formatUTCDateAndTime(date, time, format) {
    return date && time ? moment(
        moment.utc(
            moment(date).format(DATE_FORMAT) + ' ' + moment(time, TIME_FORMAT).format(TIME_FORMAT),
            `${DATE_FORMAT} ${TIME_FORMAT}`))
        .format(format) : null;
}

export function formatDateAndTimeToUTC({ date = {}, time = {}, format } = {}) {
    let dateValue = date.value;
    let dateFormat = date.format || DATE_FORMAT;
    let timeValue = time.value;
    let timeFormat = time.format || TIME_FORMAT;
    return dateValue && timeValue ?
        moment.utc(
            moment(`${dateValue} ${timeValue}`, `${dateFormat} ${timeFormat}`)).format(format) : null;
}

export function getDuration(endTime, startTime = moment.utc().format()) {
    let duration = moment.duration(moment(endTime).diff(moment(startTime)));
    let days = parseInt((duration && duration.asDays()) || 0);
    let hours = parseInt((duration && duration.asHours()) || 0) - (days * 24);
    let minutes = parseInt((duration && duration.asMinutes()) || 0) - ((days * 24 + hours) * 60);

    let daysString = `${days} ${(days == 1 ? I18n.t('day') : I18n.t('days')).toLowerCase()}`;
    let hoursString = `${hours} ${(hours == 1 ? I18n.t('hour') : I18n.t('hours')).toLowerCase()}`;
    let minutesString = `${minutes > 0 ? minutes : 0} ${(minutes === 1 ? I18n.t('minute') : I18n.t('minutes')).toLowerCase()}`;

    return (`${days > 0 ? daysString : ''} ${hours > 0 ? hoursString : ''} ${minutes > 0 ? minutesString : ''} ${days === 0 && hours === 0 && minutes === 0 ? minutesString : ''}`).trim()
}

export function getDurationInMinutes(endTime, startTime = moment.utc().format()) {
    let duration = moment.duration(moment(endTime).diff(moment(startTime)));
    return parseInt((duration && duration.asMinutes()) || 0);
}

export function getYear() {
    return moment().year();
}

export function getMonthName(month, inputMonthFormat, outputNameFormat) {
    return moment(month, inputMonthFormat).format(outputNameFormat);
}

export function getMonthDateRange(year, month) {
    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    var startDate = moment([year, month - 1]);

    // Clone the value before .endOf()
    var endDate = moment(startDate).endOf('month');

    // Format dates
    startDate = startDate.format(DATE_TIME_FORMAT);
    endDate = endDate.format(DATE_TIME_FORMAT);

    // make sure to call toDate() for plain JavaScript date type
    return { startDate, endDate };
}

export function toDatePickerFormat(date) {
    let newDate = new Date(date);
    let day = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()); // + 1 day in ms
    return day.toLocaleDateString();
}

export function toDatePickerMaxDate(date) {
    return date ? moment(date).format(DATE_TIME_FORMAT_DATEPICKER) : null;
}
