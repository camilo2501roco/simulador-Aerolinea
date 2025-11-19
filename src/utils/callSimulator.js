export class CallSimulator {
  constructor() {
    this.audioContext = null;
    this.holdMusic = null;
    this.isActive = false;
    this.voices = [];
    this.intervals = [];
    this.messageQueue = [];
    this.transferCount = 0;
    
    this.messagePools = {
      initial: [
        "Bienvenido a camilo Airlines. Su llamada es muy importante para nosotros.",
        "Gracias por llamar a AeroSim Airlines. Todos nuestros agentes están ocupados.",
        "Bienvenido al centro de servicio de AeroSim. Por favor, espere en la línea."
      ],
      waiting: [
        "Su llamada será atendida por el próximo agente disponible.",
        "Le agradecemos su paciencia. Un agente lo atenderá pronto.", 
        "No cuelgue, por favor. Su llamada está en cola.",
        "Todos nuestros representantes siguen ocupados. Permanezca en la línea.",
        "Su tiempo de espera aproximado es de cuarenta y cinco minutos.",
        "Estamos experimentando un volumen inusualmente alto de llamadas."
      ],
      transferring: [
        "Transferiendo su llamada al departamento correspondiente...",
        "Conectándolo con un especialista...", 
        "Por favor espere, lo estamos comunicando...",
        "Transfiriendo su llamada al área de soporte...",
        "Comunicando con el departamento de reservaciones...",
        "Transferencia en proceso al servicio al cliente..."
      ],
      menu: [
        "Para reservaciones, presione 1. Para cancelaciones, presione 2. Para reclamos, presione 3.",
        "Si desea hacer una nueva reserva, marque 1. Para modificar una existente, marque 2.",
        "Para hablar con un agente en español, permanezca en la línea. For English, press 9.",
        "Si conoce la extensión de su agente, puede marcarla en cualquier momento."
      ],
      frustration: [
        "Le reiteramos que su llamada es importante para nosotros...",
        "Sabemos que su tiempo es valioso. Gracias por esperar.",
        "Apreciamos su paciencia. Será atendido momentáneamente.",
        "No cuelgue. Estamos procesando su llamada."
      ]
    };
    
    this.init();
  }

  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.loadVoices();
      console.log('✅ Audio inicializado');
    } catch (error) {
      console.error('❌ Error con audio:', error);
    }
  }

  loadVoices() {
    this.voices = speechSynthesis.getVoices();
    if (this.voices.length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        this.voices = speechSynthesis.getVoices();
      });
    }
  }

  // Música de espera horrible
  playHorribleHoldMusic() {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(350, this.audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.start();
      
      // Cambios aleatorios para hacerlo más irritante
      const changeInterval = setInterval(() => {
        if (!this.isActive) {
          clearInterval(changeInterval);
          return;
        }
        const newFreq = 280 + Math.random() * 400;
        oscillator.frequency.setValueAtTime(newFreq, this.audioContext.currentTime);
        
        if (Math.random() > 0.7) {
          oscillator.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
        }
      }, 1800);
      
      this.holdMusic = { oscillator, gainNode, changeInterval };
      
    } catch (error) {
      console.error('Error con música:', error);
    }
  }

  // Hablar mensajes
  speakMessage(text) {
    if (!this.isActive || !('speechSynthesis' in window)) return Promise.resolve();
    
    this.pauseHoldMusic();
    
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.75;
      utterance.pitch = 0.4;
      utterance.volume = 0.9;
      
      const spanishVoice = this.voices.find(voice => 
        voice.lang.includes('es')
      );
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
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
    if (this.holdMusic && this.holdMusic.gainNode) {
      this.holdMusic.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }
  }

  resumeHoldMusic() {
    if (this.holdMusic && this.holdMusic.gainNode) {
      this.holdMusic.gainNode.gain.setValueAtTime(0.06, this.audioContext.currentTime);
    }
  }

  // Iniciar simulación completa
  async startCallSimulation() {
    if (this.isActive) return;
    
    this.isActive = true;
    this.transferCount = 0;
    
    console.log('📞 Iniciando simulación de audio...');
    this.playHorribleHoldMusic();
    
    // Esperar antes del primer mensaje
    setTimeout(async () => {
      if (!this.isActive) return;
      
      // Mensaje inicial
      await this.speakMessage(this.getRandomMessage('initial'));
      
      // Iniciar ciclos
      this.startMessageCycle();
      this.startTransferCycle();
      this.startMenuCycle();
      
    }, 3000);
  }

  startMessageCycle() {
    const messageInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(messageInterval);
        return;
      }
      
      const message = this.getRandomMessage('waiting');
      await this.speakMessage(message);
      
    }, 15000); // Cada 15 segundos
    
    this.intervals.push(messageInterval);
  }

  startTransferCycle() {
    const transferInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(transferInterval);
        return;
      }
      
      if (Math.random() > 0.6) { // 40% probabilidad
        this.transferCount++;
        const transferMsg = this.getRandomMessage('transferring');
        await this.speakMessage(transferMsg);
        
        // Ocasionalmente simular falla
        if (this.transferCount > 2 && Math.random() > 0.5) {
          setTimeout(async () => {
            if (this.isActive) {
              await this.speakMessage("Lo sentimos, esa extensión no está disponible. Transferiendo nuevamente...");
            }
          }, 2000);
        }
      }
      
    }, 25000); // Cada 25 segundos
    
    this.intervals.push(transferInterval);
  }

  startMenuCycle() {
    const menuInterval = setInterval(async () => {
      if (!this.isActive) {
        clearInterval(menuInterval);
        return;
      }
      
      if (Math.random() > 0.7) { // 30% probabilidad
        const menuMsg = this.getRandomMessage('menu');
        await this.speakMessage(menuMsg);
      }
      
    }, 30000); // Cada 30 segundos
    
    this.intervals.push(menuInterval);
  }

  getRandomMessage(category) {
    const messages = this.messagePools[category];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  stopAll() {
    this.isActive = false;
    
    // Detener música
    if (this.holdMusic) {
      this.holdMusic.oscillator.stop();
      if (this.holdMusic.changeInterval) {
        clearInterval(this.holdMusic.changeInterval);
      }
      this.holdMusic = null;
    }
    
    // Limpiar intervalos
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    // Detener speech
    speechSynthesis.cancel();
    
    console.log('🔇 Audio detenido');
  }
}