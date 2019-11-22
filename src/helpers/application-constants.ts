import {Viewport} from 'puppeteer';

export class ApplicationConstants {
    public static DEFAULT_VIEWPORT_OPTIONS: Viewport = {
        height: 1080,
        width: 1920,
        deviceScaleFactor: 2,
    };
    public static HIGH_CHARTS_EXPORT_HTML = `file://${process.env.PWD}/client/chart.html`;
    public static X_REQUEST_ID = 'x-request-id';
}
