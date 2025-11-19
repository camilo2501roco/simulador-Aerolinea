export class CallSimulator {
  constructor() {
    this.audios = {};
    this.timers = [];
    this.activo = false; 
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
    
  
    Object.values(this.audios).forEach(audio => {
      audio.addEventListener('ended', () => {
        audio.currentTime = 0; 
      });
    });
  }

  startCallSimulation() {
    if (this.activo) return; 
    this.activo = true;
    
    console.log('🔊 Iniciando simulación...');
    this.audios.musica.play();
    
    
    setTimeout(() => {
      this.reproducirMensaje('bienvenida');
    }, 3000);
    
    
    setTimeout(() => {
      this.iniciarMensajesAleatorios();
    }, 10000);
  }

  reproducirMensaje(tipoMensaje) {
    if (!this.activo) return;
    
    console.log('🎤 Reproduciendo:', tipoMensaje);
    

    this.audios.musica.pause();
    this.audios[tipoMensaje].currentTime = 0; 
    this.audios[tipoMensaje].play();
    
   
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
      
    
      if (Math.random() > 0.3) { 
        const mensajes = ['mensaje1', 'mensaje2', 'mensaje3'];
        const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
        console.log('🎲 Mensaje aleatorio seleccionado:', mensajeAleatorio);
        this.reproducirMensaje(mensajeAleatorio);
      }
    }, 10000); 
    
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