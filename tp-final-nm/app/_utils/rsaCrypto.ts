import * as forge from "node-forge";

/**
 * Chiffre un texte en clair avec la clé publique RSA (OAEP + SHA-256).
 * Simule le chiffrement côté client avant envoi à l'API.
 */
export function rsaEncrypt(plaintext: string): string {
  const publicKeyB64 = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
  if (!publicKeyB64) throw new Error("NEXT_PUBLIC_RSA_PUBLIC_KEY manquante");

  const pem = Buffer.from(publicKeyB64, "base64").toString("utf8");
  const publicKey = forge.pki.publicKeyFromPem(pem);

  const encrypted = publicKey.encrypt(
    forge.util.encodeUtf8(plaintext),
    "RSA-OAEP",
    { md: forge.md.sha256.create() }
  );

  return forge.util.encode64(encrypted);
}

/**
 * Déchiffre un texte chiffré avec la clé privée RSA (OAEP + SHA-256).
 * Simule le déchiffrement côté serveur / AuthService.
 */
export function rsaDecrypt(ciphertext: string): string {
  const privateKeyB64 = process.env.NEXT_PUBLIC_RSA_PRIVATE_KEY;
  if (!privateKeyB64) throw new Error("NEXT_PUBLIC_RSA_PRIVATE_KEY manquante");

  const pem = Buffer.from(privateKeyB64, "base64").toString("utf8");
  const privateKey = forge.pki.privateKeyFromPem(pem);

  const decrypted = privateKey.decrypt(
    forge.util.decode64(ciphertext),
    "RSA-OAEP",
    { md: forge.md.sha256.create() }
  );

  return forge.util.decodeUtf8(decrypted);
}
