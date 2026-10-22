/**
 * Crypto Security Module for Geocache "Operation Schattentausch"
 * Uses Web Crypto API (AES-256-GCM) with SHA-256 Key Derivation.
 * Prevents inspection and cheating via browser DevTools (F12) or source code viewing.
 */

const CryptoEngine = {
    /**
     * Derive a 256-bit CryptoKey using SHA-256 from mission solution parameters
     */
    async deriveKey(startCode, triageCode, radioFreq, moleName, faction) {
        const seed = [
            String(startCode).trim().toUpperCase(),
            String(triageCode).trim().toUpperCase(),
            String(radioFreq).trim(),
            String(moleName).trim().toUpperCase(),
            String(faction).trim().toUpperCase(),
            "VERSTECKULES_COLDWAR_1983"
        ].join("::");

        const enc = new TextEncoder();
        const seedBuffer = enc.encode(seed);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", seedBuffer);

        return await window.crypto.subtle.importKey(
            "raw",
            hashBuffer,
            { name: "AES-GCM" },
            false,
            ["encrypt", "decrypt"]
        );
    },

    /**
     * Decrypt AES-256-GCM base64 payload
     * @param {Object} encryptedPayload { iv: string, data: string }
     * @param {CryptoKey} key
     * @returns {Promise<string>} decrypted plaintext
     */
    async decrypt(encryptedPayload, key) {
        try {
            const iv = Uint8Array.from(atob(encryptedPayload.iv), c => c.charCodeAt(0));
            const data = Uint8Array.from(atob(encryptedPayload.data), c => c.charCodeAt(0));

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                data
            );

            const dec = new TextDecoder();
            return dec.decode(decryptedBuffer);
        } catch (err) {
            console.warn("Kryptografische Entschlüsselung fehlgeschlagen (Falsche Missionsdaten)", err);
            return null;
        }
    },

    /**
     * Encrypt a plaintext string with a given key (used for testing and in encrypt_coords tool)
     */
    async encrypt(plaintext, key) {
        const enc = new TextEncoder();
        const data = enc.encode(plaintext);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            data
        );

        return {
            iv: btoa(String.fromCharCode(...iv)),
            data: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)))
        };
    }
};

window.CryptoEngine = CryptoEngine;
