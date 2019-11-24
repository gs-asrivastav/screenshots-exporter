import {Pool} from 'generic-pool';
import {Browser} from 'puppeteer';
import {GenericPuppeteerPool} from './puppeteer-pool';
import {Logger} from '@nestjs/common';
import Signals = NodeJS.Signals;

const logger = new Logger();

function addCleanupTasks(pool: Pool<any>) {
    const cleanup = async (signal) => {
        if (pool) {
            logger.log('Starting draining of pooled resources. Signal = ' + signal);
            await pool.drain();
            logger.log('Completed draining of pooled resources.');
        }
    };

    if (pool) {
        pool.on('factoryCreateError', err => {
            logger.log('Failed to create a pool of puppeteer resources.', err);
            process.exit(1);
        });

        pool.on('factoryDestroyError', err => {
            logger.log('Failed to destroy puppeteer resources.', err);
        });
        ['exit', 'SIGINT', 'SIGUSR2', 'SIGUSR2', 'uncaughtException'].forEach((signal: Signals) => {
            process.once(signal, () => cleanup.apply(undefined, [signal]));
        });
    }
}

export const puppeteerPool = [
    {
        provide: 'PUPPETEER_POOL',
        useFactory: async () => {
            const puppeteerArguments = (process.env.PUPPETEER_ARGS || '')
                .split(',');
            const pool: Pool<Browser> = new GenericPuppeteerPool().getPool({
                executablePath: process.env.CHROME_BIN,
                headless: true,
                defaultViewport: null,
                handleSIGINT: false,
                args: puppeteerArguments,
            });
            pool.start();
            addCleanupTasks(pool);
            return pool;
        },
    },
];
