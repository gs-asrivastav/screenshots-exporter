import {Cluster} from 'puppeteer-cluster';

export const puppeteerCluster = [
    {
        provide: 'PUPPETEER_CLUSTER',
        useFactory: async () => {
            const puppeteerArguments = (process.env.PUPPETEER_ARGS || '')
                .split(',');
            const cluster = await Cluster.launch({
                concurrency: Cluster.CONCURRENCY_PAGE,
                maxConcurrency: 5,
                sameDomainDelay: 0,
                puppeteerOptions: {
                    executablePath: process.env.CHROME_BIN,
                    headless: true,
                    defaultViewport: null,
                    handleSIGINT: false,
                    args: puppeteerArguments,
                },
            });
            // In case of problems, log them
            cluster.on('taskerror', (err, data) => {
                this.logger.log(`Error crawling ${data}: ${err.message}`);
            });
            return cluster;
        }
    },
];
