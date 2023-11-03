import { Injectable } from '@nestjs/common';

const NodeRSA = require('node-rsa');

@Injectable()
export class RsaService {
  encryptWithPublicKey(publicKey: string, text: string) {
    const key = new NodeRSA(publicKey, 'public');
    return key.encrypt(text, 'base64') as string;
  }

  decryptWithPrivateKey(privateKey: string, encryptedText: string) {
    const key = new NodeRSA(privateKey, 'private');
    return key.decrypt(encryptedText, 'utf8') as string;
  }
}
