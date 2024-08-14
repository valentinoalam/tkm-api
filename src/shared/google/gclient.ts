import { auth, GoogleAuth } from 'google-auth-library'
import * as fs from 'fs';

const keys = JSON.parse(fs.readFileSync('./secret.json', 'utf8'));
const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
]

export default async function getAuthenticatedClient() {
  const auth = new GoogleAuth({
    credentials: keys,
    scopes: SCOPES,
  });
  const authClient = await auth.getClient();
  return authClient;
}
