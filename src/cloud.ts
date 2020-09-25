import fetch from "isomorphic-fetch";
import { Dropbox } from "dropbox";
import { State, Snapshot } from "./model";

/**
 * This code is based on the dropbox API examples:
 * https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/auth/index.html
 */

const DROPBOX_APP_KEY = "31ybvx3rsag1cih";
const CLOUD_PATH = "/database.json";
const ACCESS_TOKEN_COOKIE = "dropbox_access_token"

// SOURCE: https://github.com/dropbox/dropbox-sdk-js/blob/master/examples/javascript/utils.js
function parseQueryString(str: string) {
    var ret = Object.create(null);

    if (typeof str !== "string") {
        return ret;
    }

    str = str.trim().replace(/^(\?|#|&)/, "");

    if (!str) {
        return ret;
    }

    str.split("&").forEach(function (param) {
        var parts = param.replace(/\+/g, " ").split("=");
        // Firefox (pre 40) decodes `%3D` to `=`
        // https://github.com/sindresorhus/query-string/pull/37
        var key = parts.shift();
        var val = parts.length > 0 ? parts.join("=") : undefined;

        key = decodeURIComponent(key!);

        // missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        var val2 = val === undefined ? null : decodeURIComponent(val);

        if (ret[key] === undefined) {
            ret[key] = val2;
        } else if (Array.isArray(ret[key])) {
            ret[key].push(val2);
        } else {
            ret[key] = [ret[key], val2];
        }
    });

    return ret;
}

function readBlob(blob: Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            if (evt && evt.target && evt.target.result) {
                resolve(evt.target.result);
            } else {
                reject(
                    "Blob had an unexpected format: blob.target.result is undefined\n" +
                    evt
                );
            }
        };
        reader.onerror = function (err) {
            reject(err);
        };
        reader.readAsText(blob);
    });
}

// Fetch the access token from local storage, or else check if
// it is in the URL as a result of OAuth
function getAccessToken() {
    const cached_token = localStorage.getItem(ACCESS_TOKEN_COOKIE)
    if (cached_token !== null) {
        return cached_token;
    }

    const url_token = parseQueryString(window.location.hash).access_token
    if (url_token) {
        localStorage.setItem(ACCESS_TOKEN_COOKIE, url_token)
    }
    return url_token
}

export function isAuthenticated() {
    return !!getAccessToken();
}

const dbx = isAuthenticated()
    ? new Dropbox({ fetch, accessToken: getAccessToken() })
    : new Dropbox({ fetch, clientId: DROPBOX_APP_KEY });

async function upload(state: State): Promise<void> {
    try {
        state.dirty = false;
        const result = await dbx.filesUpload({
            contents: JSON.stringify(state.snapshot),
            path: CLOUD_PATH,
            mode: { ".tag": "overwrite" },
            mute: true,
        })
        console.log("Upload successful");
        console.log(result);
    }
    catch (e) {
        console.error("Upload failed!");
        console.error(e);
        state.dirty = true;
    }
}

async function download(): Promise<Snapshot | null> {
    try {
        const result = await dbx.filesDownload({ path: CLOUD_PATH }) as any;
        const response = await readBlob(result.fileBlob) as string
        const snapshot = JSON.parse(response) as Snapshot;
        return snapshot;
    } catch (err) {
        console.error("Error fetching data from cloud:");
        console.error(err);
        return null;
    }
}

export type AuthenticatedCloud = {
    isAuthenticated: true,
    upload: (state: State) => Promise<void>,
    download: () => Promise<Snapshot | null>
}

export type UnauthenticatedCloud = {
    isAuthenticated: false,
    authenticationURL: string
}

export type Cloud = AuthenticatedCloud | UnauthenticatedCloud

const Cloud: Cloud = isAuthenticated() ?
    {
        isAuthenticated: true,
        upload, download
    }
    :
    {
        isAuthenticated: false,
        authenticationURL: dbx.getAuthenticationUrl(window.location.toString())
    }

export default Cloud


