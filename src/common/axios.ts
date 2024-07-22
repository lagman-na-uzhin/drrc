import axios from 'axios';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';

function createHttpsAgent(): https.Agent {
    return new https.Agent({
        rejectUnauthorized: false,
    });
}

export async function fetchDataThroughProxy(url: string, configService: ConfigService) {
    const proxyHost = configService.get<string>('proxy.host');
    const proxyPort = configService.get<number>('proxy.port');
    const proxyUsername = configService.get<string>('proxy.username');
    const proxyPassword = configService.get<string>('proxy.password');

    try {
        const agent = createHttpsAgent();

        const response = await axios.get(url, {
            proxy: {
                host: proxyHost,
                port: proxyPort,
                auth: {
                    username: proxyUsername,
                    password: proxyPassword,
                },
            },
            httpsAgent: agent,
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data through proxy:', error.message);
        throw error;
    }
}
