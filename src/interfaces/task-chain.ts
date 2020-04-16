import {PDFOptions, SetCookie} from 'puppeteer';

export enum TaskType {
    ADD_SCRIPT_FILE = 'ADD_SCRIPT_FILE',
    SET_COOKIES = 'SET_COOKIES',
    EVENT_WAIT = 'EVENT_WAIT',
    FUNCTION_CALL = 'FUNCTION_CALL',
    DOM_INTERACTION = 'DOM_INTERACTION',
    ELEMENT_SCREENSHOT = 'ELEMENT_SCREENSHOT',
    ELEMENT_PDF = 'ELEMENT_PDF',
    VIEWPORT_SCREENSHOT = 'VIEWPORT_SCREENSHOT',
    VIEWPORT_PDF = 'VIEWPORT_PDF',
    NAVIGATION = 'NAVIGATION',
    SLEEP = 'SLEEP',
}

export enum DomInteraction {
    CLICK = 'click',
    HOVER = 'hover',
    SELECT = 'select',
    TYPE = 'type',
    TAP = 'tap',
}

export interface Task {
    type: TaskType;
    arguments: any[];
    timeout: number;
}

export enum TaskStatus {
    SUCCEEDED = 'SUCCEEDED',
    FAILED = 'FAILED',
}

export interface SleepTask extends Task {
    sleep: number;
}

export interface NavigationTask extends Task {
    url: string;
}

export interface TaskWithSelector extends Task {
    selector: string;
    useXPath: boolean;
}

export interface SetCookiesTask extends Task {
    arguments: SetCookie[];
}

export interface EventWaitTask extends Task {
    event: string;
    timeout: number;
}

export interface FunctionCallTask extends Task {
    name: string;
    args: any[];
}

export interface DomInteractionTask extends TaskWithSelector {
    interaction: DomInteraction;
}

export interface ElementScreenshotTask extends TaskWithSelector {
    padding?: number;
    viewport: {
        height?: number;
        width?: number;
    };
}

export interface PDFTask extends Task {
    padding: number;
    options: PDFOptions;
    evaluateFromWindow?: boolean;
    variableMap?: {
        width: string,
        height: string,
    };
}

export interface TaskChain {
    url: string;
    tasks: Task[];
}
