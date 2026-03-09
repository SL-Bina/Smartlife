const WebSocket = require('ws');
const http = require('http');
const https = require('https');

const CONFIG = {
    wsUrl: 'ws://api.smartlife.az:8080/app/rv_k8Xp2mNqL5vRtY9wZjH3sBcD',
    authUrl: 'https://api.smartlife.az/api/broadcasting/auth',
    loginUrl: 'https://api.smartlife.az/api/v1/auth/login',
    credentials: {
        login: 'root@smartlife.az',
        password: '12345678',
        login_type: 'web',
    },
    accountType: 'user',
    accountId: 1,
};

function httpPost(url, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const client = parsedUrl.protocol === 'https:' ? https : http;
        const bodyStr = JSON.stringify(body);

        const req = client.request(
            parsedUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Content-Length': Buffer.byteLength(bodyStr),
                    ...headers,
                },
            },
            (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    const contentType = res.headers['content-type'] || '';

                    console.log('\n--- HTTP DEBUG ---');
                    console.log('URL:', url);
                    console.log('Status:', res.statusCode);
                    console.log('Content-Type:', contentType);
                    console.log('Body preview:', data.slice(0, 300));
                    console.log('------------------\n');

                    if (!contentType.includes('application/json')) {
                        return reject(
                            new Error(
                                `JSON əvəzinə başqa cavab gəldi. Status: ${res.statusCode}, Content-Type: ${contentType}`
                            )
                        );
                    }

                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (err) {
                        reject(
                            new Error(
                                `JSON parse xətası: ${err.message}\nGələn body: ${data.slice(0, 500)}`
                            )
                        );
                    }
                });
            }
        );

        req.on('error', reject);
        req.write(bodyStr);
        req.end();
    });
}

async function getToken() {
    console.log('🔑 Login olunur...');
    const res = await httpPost(CONFIG.loginUrl, CONFIG.credentials);

    const token = res.token || res.data?.token || res.access_token;

    if (!token) {
        throw new Error('Token alınmadı: ' + JSON.stringify(res));
    }

    console.log('✅ Token alındı');
    return token;
}

async function getAuthToken(socketId, token) {
    const channelName = `private-notifications.${CONFIG.accountType}.${CONFIG.accountId}`;

    const res = await httpPost(
        CONFIG.authUrl,
        { socket_id: socketId, channel_name: channelName },
        { Authorization: `Bearer ${token}` }
    );

    if (!res.auth) {
        throw new Error('Broadcast auth alınmadı: ' + JSON.stringify(res));
    }

    return { auth: res.auth, channelName };
}

async function connect() {
    const token = await getToken();

    const channelName = `private-notifications.${CONFIG.accountType}.${CONFIG.accountId}`;
    const ws = new WebSocket(CONFIG.wsUrl);

    ws.on('open', () => {
        console.log('✅ WebSocket-ə qoşuldu');
    });

    ws.on('message', async (raw) => {
        try {
            const message = JSON.parse(raw.toString());

            if (message.event === 'pusher:connection_established') {
                const { socket_id } = JSON.parse(message.data);
                console.log('🔑 Socket ID:', socket_id);

                const { auth } = await getAuthToken(socket_id, token);
                console.log('🔐 Auth uğurlu');

                ws.send(
                    JSON.stringify({
                        event: 'pusher:subscribe',
                        data: {
                            channel: channelName,
                            auth,
                        },
                    })
                );
            }

            if (
                message.event === 'pusher_internal:subscription_succeeded' ||
                message.event === 'pusher:subscription_succeeded'
            ) {
                console.log(`✅ "${channelName}" channel-ə subscribe olundu!`);
                console.log('🎧 Notification gözlənilir...\n');
            }

            if (message.event === 'notification.sent') {
                const notifData =
                    typeof message.data === 'string'
                        ? JSON.parse(message.data)
                        : message.data;

                console.log('🔔 YENİ NOTİFİKASİYA!');
                console.log('📌 Başlıq:', notifData.title);
                console.log('💬 Mesaj:', notifData.message);
                console.log('🏷️ Tip:', notifData.type);
                if (notifData.data) console.log('🔗 Data:', notifData.data);
                console.log('----------------------------\n');
            } else {
                console.log('📨 Event:', message.event);
            }
        } catch (err) {
            console.error('❌ Message parse xətası:', err.message);
        }
    });

    ws.on('error', (err) => {
        console.error('❌ WebSocket xətası:', err.message);
    });

    ws.on('close', () => {
        console.log('🔌 Bağlantı kəsildi');
    });
}

connect().catch((err) => {
    console.error('❌ Ümumi xəta:', err.message);
});