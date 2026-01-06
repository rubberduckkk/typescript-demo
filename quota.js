import fs from 'fs';
import { google } from 'googleapis';
import path from 'path';

async function getServiceAccountQuota() {
    // 读取 service account 凭证
    const keyFile = path.join(__dirname, 'service-account.json');
    const key = JSON.parse(fs.readFileSync(keyFile, 'utf8'));

    const auth = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        [
            'https://www.googleapis.com/auth/drive'
        ]
    );

    const drive = google.drive({ version: 'v3', auth });

    try {
        const res = await drive.about.get({
            fields: 'storageQuota'
        });

        const quota = res.data.storageQuota;

        console.log('=== Service Account Drive Storage Quota ===');
        console.log(`Total Limit : ${quota.limit}`);
        console.log(`Usage Total : ${quota.usage}`);
        console.log(`Usage In Drive : ${quota.usageInDrive}`);
        console.log(`Usage In Trash : ${quota.usageInDriveTrash}`);

        // 转成人类可读
        function fmt(bytes) {
            return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
        }

        console.log('\nReadable:');
        console.log(`Total : ${fmt(quota.limit)}`);
        console.log(`Used  : ${fmt(quota.usage)}`);
        console.log(`Drive : ${fmt(quota.usageInDrive)}`);
        console.log(`Trash : ${fmt(quota.usageInDriveTrash)}`);

    } catch (err) {
        console.error('Failed to fetch quota');
        console.error(err.response?.data || err);
    }
}

getServiceAccountQuota();