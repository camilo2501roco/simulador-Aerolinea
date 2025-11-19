export class CallSimulator {
  constructor() {
    this.contextoAudio = null;
    this.activo = false;
    this.audioActual = null;
    this.intervalos = [];
    
    this.archivosAudio = {
      musicaEspera: [
        '/audio/hold-music-1.mp3',
        '/audio/hold-music-2.mp3', 
        '/audio/hold-music-3.mp3'
      ]
    };
    
    this.mensajes = {
      inicial: [
        "Bienvenido a Aero Gil. Su llamada es muy importante para nosotros.",
        "Gracias por llamar a Aero Gil. Todos nuestros agentes están ocupados.",
      ],
      espera: [
        "Su llamada será atendida por el próximo agente disponible.",
        "Su llamada es muy importante para nosotros.", 
      ]
    };
    
    this.inicializar();
  }

  async inicializar() {
    try {
      this.contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.error('Error audio:', error);
    }
  }

  async reproducirMusicaEspera() {
    if (!this.activo) return;
    
    try {
      const musicaAleatoria = this.archivosAudio.musicaEspera[
        Math.floor(Math.random() * this.archivosAudio.musicaEspera.length)
      ];
      
      const respuesta = await fetch(musicaAleatoria);
      const bufferAudio = await this.contextoAudio.decodeAudioData(await respuesta.arrayBuffer());
      
      const fuente = this.contextoAudio.createBufferSource();
      const ganancia = this.contextoAudio.createGain();
      
      fuente.buffer = bufferAudio;
      fuente.loop = true;
      ganancia.gain.value = 0.12;
      
      fuente.connect(ganancia).connect(this.contextoAudio.destination);
      fuente.start();
      
      this.audioActual = { fuente, ganancia };
      
      setTimeout(() => this.activo && this.reproducirMusicaEspera(), 60000 + Math.random() * 30000);
      
    } catch (error) {
      this.reproducirMusicaRespaldo();
    }
  }

  reproducirMusicaRespaldo() {
    const oscilador = this.contextoAudio.createOscillator();
    const ganancia = this.contextoAudio.createGain();
    
    oscilador.type = 'sine';
    oscilador.frequency.value = 440;
    ganancia.gain.value = 0.06;
    
    oscilador.connect(ganancia).connect(this.contextoAudio.destination);
    oscilador.start();
    
    this.audioActual = { fuente: oscilador, ganancia };
  }

  async hablarMensaje(texto) {
    if (!this.activo || !('speechSynthesis' in window)) return;
    
    this.pausarMusica();
    
    return new Promise((resolve) => {
      const enunciado = new SpeechSynthesisUtterance(texto);
      enunciado.rate = 0.70;
      enunciado.pitch = 0.8;
      enunciado.volume = 0.9;
      
      const vozEspanol = speechSynthesis.getVoices().find(voz => voz.lang.includes('es'));
      if (vozEspanol) enunciado.voice = vozEspanol;
      
      enunciado.onend = enunciado.onerror = () => {
        setTimeout(() => {
          this.reanudarMusica();
          resolve();
        }, 500);
      };
      
      speechSynthesis.speak(enunciado);
    });
  }

  pausarMusica() {
    this.audioActual?.ganancia.gain.setValueAtTime(0, this.contextoAudio.currentTime);
  }

  reanudarMusica() {
    this.audioActual?.ganancia.gain.setValueAtTime(0.12, this.contextoAudio.currentTime);
  }

  startCallSimulation() {
    if (this.activo) return;
    
    this.activo = true;
    this.reproducirMusicaEspera();
    
    setTimeout(async () => {
      if (!this.activo) return;
      await this.hablarMensaje(this.obtenerMensajeAleatorio('inicial'));
      this.iniciarCicloMensajes();
    }, 3000);
  }

  iniciarCicloMensajes() {
    const intervalo = setInterval(async () => {
      if (!this.activo) return clearInterval(intervalo);
      if (Math.random() > 0.3) {
        await this.hablarMensaje(this.obtenerMensajeAleatorio('espera'));
      }
    }, 15000);
    
    this.intervalos.push(intervalo);
  }

  obtenerMensajeAleatorio(categoria) {
    const mensajes = this.mensajes[categoria];
    return mensajes[Math.floor(Math.random() * mensajes.length)];
  }

  stopAll() {
    this.activo = false;
    this.audioActual?.fuente.stop();
    this.audioActual = null;
    this.intervalos.forEach(clearInterval);
    this.intervalos = [];
    speechSynthesis.cancel();
  }
}