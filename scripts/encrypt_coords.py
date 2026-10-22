#!/usr/bin/env python3
"""
Hilfsskript für den Owner zum Verschlüsseln der Final-Koordinaten für config.js
Nutzt AES-256-GCM und SHA-256 Key-Derivation (100% kompatibel mit Web Crypto API).
"""

import os
import sys
import base64
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

def derive_key(start_code, triage_code, radio_freq, mole_name, faction):
    seed = "::".join([
        str(start_code).strip().upper(),
        str(triage_code).strip().upper(),
        str(radio_freq).strip(),
        str(mole_name).strip().upper(),
        str(faction).strip().upper(),
        "VERSTECKULES_COLDWAR_1983"
    ])
    return hashlib.sha256(seed.encode('utf-8')).digest()

def encrypt_payload(plaintext, key_bytes):
    aesgcm = AESGCM(key_bytes)
    iv = os.urandom(12)
    ciphertext = aesgcm.encrypt(iv, plaintext.encode('utf-8'), None)
    return {
        "iv": base64.b64encode(iv).decode('utf-8'),
        "data": base64.b64encode(ciphertext).decode('utf-8')
    }

def main():
    print("=== Geocache Koordinaten-Verschlüsseler (AES-256-GCM) ===")
    
    # Standard-Lösungen der Mission
    # West: Startcode "1983", Triage "SOS", Frequenz "462", Mole "RICHTER", Faction "WEST"
    key_west = derive_key("1983", "SOS", "462", "RICHTER", "WEST")
    coord_west = "N 50° 19.835' E 012° 04.160' (Dose West: Unter Wurzel alter Grenzbaum)"
    res_west = encrypt_payload(coord_west, key_west)
    
    # Ost: Startcode "1983", Triage "SOS", Frequenz "480", Mole "RICHTER", Faction "OST"
    key_ost = derive_key("1983", "SOS", "480", "RICHTER", "OST")
    coord_ost = "N 50° 19.905' E 012° 04.195' (Dose Ost: Hinter altem Grenzstein im Hohlraum)"
    res_ost = encrypt_payload(coord_ost, key_ost)
    
    print("\n--- Krypto-Payload für config.js (WEST) ---")
    print(f"ENCRYPTED_FINAL_WEST: {res_west}")
    
    print("\n--- Krypto-Payload für config.js (OST) ---")
    print(f"ENCRYPTED_FINAL_OST: {res_ost}")
    
    print("\nDiese Werte können direkt in js/config.js übernommen werden.")

if __name__ == '__main__':
    main()
