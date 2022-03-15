import queryString from 'query-string';
import config from '../../config';
import I18n from '../i18n';

const requestBodyTypes = ['POST', 'PUT'];

function invoke(method, endpoint, testpoint, payload, onUploadProgress, onDownloadProgress) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': localeToLanguageTag(I18n.locale)
    };
    const options = {
        method,
        withCredentials: true,
        responseType: 'json',
        headers: Object.assign({}, defaultHeaders, payload.headers),
        onUploadProgress,
        onDownloadProgress
    };
    if (requestBodyTypes.indexOf(method) !== -1) {
        options.body = options.headers['Content-Type'] === 'application/x-www-form-urlencoded'
            ? queryString.stringify(payload.body || {})
            : JSON.stringify(payload.body || {});
    }

    return progressFetch(`${payload.isAuthCall ? `${config.authServer.url}/${endpoint}` : testpoint !== undefined ? testpoint : `${config.apiServer.url}/${endpoint}`}`, options)
        .then(validateResponse)
        .then(response => ({ response }))
        .catch(handleError);
}

function progressFetch(uri, options) {
    const { onUploadProgress, onDownloadProgress } = options;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method, uri);
        xhr.withCredentials = options.withCredentials;
        xhr.responseType = options.responseType;
        Object.entries(options.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
        xhr.onload = (e) => resolve(e.target);
        xhr.onerror = () => {
            reject({ message: I18n.t('network_unavailable') });
        }
        if (onDownloadProgress) {
            xhr.onprogress = (e) => {
                if (e.lengthComputable) {
                    const downloadProgress = Math.floor((e.loaded / e.total) * 100) / 100;
                    onDownloadProgress(downloadProgress);
                } else {
                    onDownloadProgress(0);
                }
            }
        }
        if (xhr.upload && onUploadProgress)
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const uploadProgress = Math.floor((e.loaded / e.total) * 100) / 100;
                    onUploadProgress(uploadProgress);
                } else {
                    onUploadProgress(0);
                }
            };
        xhr.send(options.body);
    });
}

export function get(endpoint, testpoint, payload, onUploadProgress, onDownloadProgress) {
    let endpointWithParams = undefined;
    if (endpoint !== undefined) {
        endpointWithParams = payload.params ? `${endpoint}?${queryString.stringify(payload.params, payload.options || {})}` : endpoint;
    }
    return invoke('GET', endpointWithParams, testpoint, payload, onUploadProgress, onDownloadProgress);
}

export function post(endpoint, testpoint, payload, onUploadProgress, onDownloadProgress) {
    return invoke('POST', endpoint, testpoint, payload, onUploadProgress, onDownloadProgress);
}

export function put(endpoint, testpoint, payload, onUploadProgress, onDownloadProgress) {
    return invoke('PUT', endpoint, testpoint, payload, onUploadProgress, onDownloadProgress);
}

export function del(endpoint, testpoint, payload) {
    return invoke('DELETE', endpoint, testpoint, payload);
}

function validateResponse(response) {
    const { status, response: json = {} } = response;
    if (status === 200) {
        if (json.access_token) {
            return Promise.resolve(json);
        }
        if (json.status_cd === 1) {
            return Promise.resolve(json.data);
        }
        if (json.status_cd === 0) {
            return Promise.reject({ message: json.error.message });
        }
        return Promise.reject({
            message: I18n.t('invalid_status_code', {
                statusCode: json.status_cd
            })
        });
    }
    if (status === 401) {
        const rejectResponse = { message: json.error_description ? I18n.t('invalid_user_credentials') : json.error.message };
        if (json.error.error_cd) {
            rejectResponse.error_cd = json.error.error_cd;
        }
        return Promise.reject(rejectResponse);
    }
    return Promise.reject({ message: json.error_description ? json.error_description : json.error.message });
}

function handleError(error) {
    if (error instanceof Promise) {
        return error
            .then(function (e) {
                return { error: e };
            }).catch(e => (
                { error: { message: I18n.t('unknown_error') } }));
    } else {
        return { error };
    }
}

function localeToLanguageTag(locale) {
    return locale.replace('_', '-');
}
