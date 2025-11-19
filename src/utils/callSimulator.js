export class CallSimulator {
  constructor() {
    this.audios = {};
    this.timers = [];
    this.activo = false; // ← FALTABA ESTE FLAG
    this.cargarAudios();
  }

  cargarAudios() {
    this.audios = {
      musica: new Audio('/audio/hold-music-1.mp3'),
      bienvenida: new Audio('/audio/bienvenida.mp3'),
      mensaje1: new Audio('/audio/mensaje1.mp3'),
      mensaje2: new Audio('/audio/mensaje2.mp3'),
      mensaje3: new Audio('/audio/mensaje3.mp3')
    };
    
    this.audios.musica.loop = true;
    
    // Configurar todos los mensajes para que reinicien al terminar
    Object.values(this.audios).forEach(audio => {
      audio.addEventListener('ended', () => {
        audio.currentTime = 0; // Reiniciar para próxima reproducción
      });
    });
  }

  startCallSimulation() {
    if (this.activo) return; // ← EVITAR MÚLTIPLES INICIOS
    this.activo = true;
    
    console.log('🔊 Iniciando simulación...');
    this.audios.musica.play();
    
    // Mensaje de bienvenida después de 3 segundos
    setTimeout(() => {
      this.reproducirMensaje('bienvenida');
    }, 3000);
    
    // Iniciar mensajes aleatorios después de 10 segundos (no inmediatamente)
    setTimeout(() => {
      this.iniciarMensajesAleatorios();
    }, 10000);
  }

  reproducirMensaje(tipoMensaje) {
    if (!this.activo) return;
    
    console.log('🎤 Reproduciendo:', tipoMensaje);
    
    // Pausar música y reproducir mensaje
    this.audios.musica.pause();
    this.audios[tipoMensaje].currentTime = 0; // ← REINICIAR AUDIO
    this.audios[tipoMensaje].play();
    
    // Configurar el evento onended CADA VEZ
    this.audios[tipoMensaje].onended = () => {
      console.log('✅ Mensaje terminado, volviendo a música');
      if (this.activo) {
        this.audios.musica.play();
      }
    };
  }

  iniciarMensajesAleatorios() {
    if (!this.activo) return;
    
    console.log('🔄 Iniciando mensajes aleatorios...');
    
    const timer = setInterval(() => {
      if (!this.activo) {
        clearInterval(timer);
        return;
      }
      
      // 70% probabilidad de mensaje cada 20 segundos
      if (Math.random() > 0.3) { // ← CAMBIÉ A > 0.3 para más frecuencia
        const mensajes = ['mensaje1', 'mensaje2', 'mensaje3'];
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        console.log('🎲 Mensaje aleatorio seleccionado:', mensajeAleatorio);
        this.reproducirMensaje(mensajeAleatorio);
      }
    }, 10000); // ← 20 segundos entre chequeos
    
    this.timers.push(timer);
  }

  stopAll() {
    console.log('🛑 Deteniendo simulación...');
    this.activo = false;
    
    Object.values(this.audios).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    this.timers.forEach(clearInterval);
    this.timers = [];
  }
}