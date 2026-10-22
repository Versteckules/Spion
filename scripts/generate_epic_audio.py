#!/usr/bin/env python3
"""
Generate all audio speech files directly via gTTS as MP3
and generate authentic WAV sound effects (gunshot, sirens, geiger, heartbeat, morse, static).
All modern browsers natively play both MP3 and WAV via HTML5 Audio and Web Audio API.
"""

import os
import math
import struct
import wave
from gtts import gTTS

AUDIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio')
os.makedirs(AUDIO_DIR, exist_ok=True)

def create_synthetic_wav(filename, duration_sec, generator_fn, sample_rate=44100):
    num_samples = int(duration_sec * sample_rate)
    with wave.open(filename, 'wb') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        data = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            sample_val = generator_fn(t, duration_sec, sample_rate)
            int_val = int(max(min(sample_val, 1.0), -1.0) * 32767)
            data.extend(struct.pack('<h', int_val))
        wav_file.writeframes(data)

def synth_gunshot(t, duration, sr):
    import random
    if t < 0.04:
        envelope = math.exp(-t * 90)
        return (random.random() * 2 - 1) * envelope * 0.98
    elif t < 0.7:
        envelope = math.exp(-t * 7)
        noise = (random.random() * 2 - 1) * 0.4
        low_tone = math.sin(2 * math.pi * 85 * t) * 0.5
        return (noise + low_tone) * envelope
    return 0.0

def synth_siren(t, duration, sr):
    freq = 550 + 220 * math.sin(2 * math.pi * 0.75 * t)
    phase = 2 * math.pi * freq * t
    return 0.4 * math.sin(phase) + 0.15 * math.sin(2 * phase)

def synth_geiger(t, duration, sr):
    import random
    if random.random() < 0.005:
        return (random.random() * 2 - 1) * 0.9
    return 0.0

def synth_heartbeat(t, duration, sr):
    cycle = t % 0.70
    val = 0.0
    if cycle < 0.12:
        val += math.sin(2 * math.pi * 55 * cycle) * math.exp(-cycle * 25)
    elif 0.18 <= cycle < 0.30:
        val += math.sin(2 * math.pi * 65 * (cycle - 0.18)) * math.exp(-(cycle - 0.18) * 25) * 0.8
    return val * 0.75

def synth_morse(t, duration, sr):
    # SOS pattern in morse
    morse_pattern = [1,0,1,0,1,0,0, 1,1,1,0, 1,1,1,0, 1,1,1,0,0, 1,0,1,0,1,0,0,0,0]
    time_unit = 0.09
    index = int(t / time_unit) % len(morse_pattern)
    on = morse_pattern[index]
    if on:
        return 0.35 * math.sin(2 * math.pi * 850 * t)
    return 0.0

def synth_radio_static(t, duration, sr):
    import random
    # Soft, subtle background texture - never loud
    noise = (random.random() * 2 - 1) * 0.06
    hum = 0.02 * math.sin(2 * math.pi * 50 * t)
    whine = 0.01 * math.sin(2 * math.pi * 1150 * t)
    return noise + hum + whine

def main():
    print("=== 1. Erzeuge Sound-Effekte (WAV) ===")
    create_synthetic_wav(os.path.join(AUDIO_DIR, "gunshot_echo.wav"), 1.2, synth_gunshot)
    create_synthetic_wav(os.path.join(AUDIO_DIR, "sirens_dogs.wav"), 6.0, synth_siren)
    create_synthetic_wav(os.path.join(AUDIO_DIR, "geiger_crackle.wav"), 8.0, synth_geiger)
    create_synthetic_wav(os.path.join(AUDIO_DIR, "heartbeat_loop.wav"), 8.0, synth_heartbeat)
    create_synthetic_wav(os.path.join(AUDIO_DIR, "morse_beacon.wav"), 5.0, synth_morse)
    create_synthetic_wav(os.path.join(AUDIO_DIR, "radio_static.wav"), 6.0, synth_radio_static)
    print("Sound-Effekte erfolgreich in assets/audio generiert.")

    print("=== 2. Erzeuge Sprachaufnahmen (gTTS -> MP3) ===")

    # 1. Incident Bavarian
    text_bav = (
        "Zefix noamoi! Ludwig, geh in d'Deckung! Um Himmels Willn, wer hodn do gschossn?! "
        "De drübm ham auf unsern Mo gschossn, mitten in Haxn neigschossn! "
        "Er robbt zruck ins Schilf, er bliad wia a Sau! Rumpeldipumpel zurück zu Posten zwoa, oba zackich! "
        "Pass auf de Suchscheinwerfer auf, sonst brennt da Huad!"
    )
    gTTS(text=text_bav, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "incident_bavarian.mp3"))
    print("- incident_bavarian.mp3 generiert")

    # 2. Incident Saxon
    text_sax = (
        "Zergobbl noch eemol! Halt, Deckung, Genosse! Was fürn Hirnie hat n da jeschossn?! "
        "De imperialistische Grenzpolizei hat unsre Zielperson voll ins Beene jetroffn! "
        "De Kacke dampft lichterloh! Mach de Glotzn uff, renn sofort zurück zur Schutzmulde bei Position zwo! "
        "Wenn dich de Suchscheinwerfer erwischen, machste Bekanntschaft mit Bautzen!"
    )
    gTTS(text=text_sax, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "incident_saxon.mp3"))
    print("- incident_saxon.mp3 generiert")

    # 3. Russian KGB Major Woronin
    text_kgb = (
        "Говорит майор Воронин, особый отдел Карлсхорст! Внимание! "
        "Товарищ Шенк, если этот физик попадет к империалистам, я лично отправлю вас в Сибирь! "
        "Приказ сорок девять: немедленно ликвидировать предателя! Выполнять приказ!"
    )
    gTTS(text=text_kgb, lang='ru').save(os.path.join(AUDIO_DIR, "kgb_woronin.mp3"))
    print("- kgb_woronin.mp3 generiert")

    # 4. Russian Numbers Station
    text_station = "Внимание! Говорит Центр! Семь. Ноль. Три. Один. Девять. Внимание! Раз. Два. Три. Прием!"
    gTTS(text=text_station, lang='ru').save(os.path.join(AUDIO_DIR, "russian_station.mp3"))
    print("- russian_station.mp3 generiert")

    # 5. Radio West (BND Abhörfunk)
    text_rad_w = (
        "Ludwig, mir ham eanane Kurzwellen aufgschnappt bei vier-sechs-zwoa Kiloherz. "
        "De redn wos vo na zerrissna Banknotn als Erkennungszeichn. "
        "Nimm dei Chiffrier-Scheim her, rechne de Quersumm vom Grenzstein dazu und gib ma de Losung durch!"
    )
    gTTS(text=text_rad_w, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "radio_bavarian.mp3"))
    print("- radio_bavarian.mp3 generiert")

    # 6. Radio East (MfS Abhörfunk)
    text_rad_e = (
        "Genosse, passense eemol uff! De Grenzpolizei drübm benutzt ne codierte Welle bei vier-acht-null Kiloherz. "
        "De faseln was von nem zerrissenen Zwanzsch-Mark-Schein als Erkennungsmarke! "
        "Jachn Se de Frequenz durch de Decodier-Matrix und gebn Se de Parole durch!"
    )
    gTTS(text=text_rad_e, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "radio_saxon.mp3"))
    print("- radio_saxon.mp3 generiert")

    # 7. Random Event: Patrol
    text_patrol = "Achtung! NVA Streife nähert sich auf dem Kolonnenweg! Motorengeräusch voraus! Sofort flach auf den Boden legen und keinen Millimeter rühren!"
    gTTS(text=text_patrol, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "event_patrol.mp3"))
    print("- event_patrol.mp3 generiert")

    # 8. Random Event: Dog
    text_dog = "Achtung! Hundegebell im Grenzstreifen! Sie haben Fährte aufgenommen! Stillhalten und Deckung halten!"
    gTTS(text=text_dog, lang='de', tld='de').save(os.path.join(AUDIO_DIR, "event_dog.mp3"))
    print("- event_dog.mp3 generiert")

    print("=== Alle Audio-Assets erfolgreich generiert! ===")

if __name__ == '__main__':
    main()
