import {Inject, Injectable, Scope} from '@nestjs/common';
import {CONTEXT} from '@nestjs/microservices';
import * as uuid from 'uuid/v4';
import {ApplicationConstants} from '../../helpers/application-constants';

@Injectable({scope: Scope.REQUEST})
export class RequestContextInjector {
    private readonly _REQUEST_ID: string;

    constructor(@Inject(CONTEXT) private readonly context) {
        this._REQUEST_ID = context.headers[ApplicationConstants.X_REQUEST_ID] || uuid();
    }

    public get requestId() {
        return this._REQUEST_ID || '';
    }
}
