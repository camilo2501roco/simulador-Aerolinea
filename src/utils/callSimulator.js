export class CallSimulator {
  constructor() {
    this.audioContext = null;
    this.isActive = false;
    this.voices = [];
    this.intervals = [];
    this.currentAudio = null;
    
    // Archivos de audio
    this.audioFiles = {
      holdMusic: [
        '/audio/hold-music-1.mp3',
        '/audio/hold-music-2.mp3', 
        '/audio/hold-music-3.mp3'
      ],
      transferSound: '/audio/transfer.mp3',
      beep: '/audio/beep.mp3'
    };
    
    this.audioBuffers = new Map();
    
    // Mensajes
    this.messagePools = {
      initial: [
        "Bienvenido a AeroSim Airlines. Su llamada es muy importante para nosotros.",
        "Gracias por llamar a AeroSim Airlines. Todos nuestros agentes están ocupados.",
      ],
      waiting: [
        "Su llamada será atendida por el próximo agente disponible.",
        "Su llamada es muy importante para nosotros.", 
        "Su llamada es muy importante para nosotros.",
      ],
      transferring: [
        "Su llamada es muy importante para nosotros",
        "Su llamada es muy importante para nosotros", 
      ]
    };
    
    this.init();
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.loadVoices();
      console.log('✅ Audio listo');
    } catch (error) {
      console.error('❌ Error audio:', error);
    }
  }

  async playHoldMusic() {
    if (!this.isActive) return;
    
    try {
      const availableMusic = this.audioFiles.holdMusic.filter(url => url);
      
      if (availableMusic.length === 0) {
        this.playFallbackMusic();
        return;
      }
      
      const randomMusic = availableMusic[Math.floor(Math.random() * availableMusic.length)];
      
      const response = await fetch(randomMusic);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = audioBuffer;
      source.loop = true;
      
      gainNode.gain.value = 0.12;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
      
      this.currentAudio = { source, gainNode };
      
      // Cambiar música cada 60-90 segundos
      setTimeout(() => {
        if (this.isActive) {
          this.stopCurrentAudio();
          this.playHoldMusic();
        }
      }, 60000 + Math.random() * 30000);
      
    } catch (error) {
      this.playFallbackMusic();
    }
  }

  playFallbackMusic() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    gainNode.gain.value = 0.06;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    
    this.currentAudio = { source: oscillator, gainNode };
  }

  async playSoundEffect(soundUrl) {
    if (!this.isActive) return;
    
    try {
      const response = await fetch(soundUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
      
    } catch (error) {
      console.warn('No efecto:', soundUrl);
    }
  }

  async speakMessage(text) {
    if (!this.isActive || !('speechSynthesis' in window)) return;
    
    this.pauseHoldMusic();
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.pitch = 0.4;
      utterance.volume = 0.9;
      
      const spanishVoice = this.voices.find(voice => voice.lang.includes('es'));
      if (spanishVoice) utterance.voice = spanishVoice;
      
      utterance.onend = () => {
        setTimeout(() => {
          this.resumeHoldMusic();
          resolve();
        }, 500);
      };
      
      utterance.onerror = () => {
        this.resumeHoldMusic();
        resolve();
      };
      
      speechSynthesis.speak(utterance);
    });
  }

  pauseHoldMusic() {
    if (this.currentAudio && this.currentAudio.gainNode) {
      this.currentAudio.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
  }

  resumeHoldMusic() {
    if (this.currentAudio && this.currentAudio.gainNode) {
      this.currentAudio.gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
    }
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.source.stop();
      } catch (e) {}
      this.currentAudio = null;
    }
  }

  startCallSimulation() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('📞 Iniciando audio...');
    
    this.playHoldMusic();
    
    setTimeout(async () => {
      if (!this.isActive) return;
      
      await this.speakMessage(this.getRandomMessage('initial'));
      this.startMessageCycle();
      this.startTransferCycle();
      
    }, 3000);
  }

  startMessageCycle() {
    const messageInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(messageInterval);
        return;
      }
      
      if (Math.random() > 0.3) {
        await this.speakMessage(this.getRandomMessage('waiting'));
      }
      
    }, 15000);
    
    this.intervals.push(messageInterval);
  }

  startTransferCycle() {
    const transferInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(transferInterval);
        return;
      }
      
      if (Math.random() > 0.6) {
        await this.playSoundEffect(this.audioFiles.transferSound);
        await this.speakMessage(this.getRandomMessage('transferring'));
      }
      
    }, 25000);
    
    this.intervals.push(transferInterval);
  }

  getRandomMessage(category) {
    const messages = this.messagePools[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  loadVoices() {
    this.voices = speechSynthesis.getVoices();
    if (this.voices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        this.voices = speechSynthesis.getVoices();
      });
    }
  }

  stopAll() {
    this.isActive = false;
    this.stopCurrentAudio();
    
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    speechSynthesis.cancel();
    
    console.log('🔇 Audio detenido');
  }
}