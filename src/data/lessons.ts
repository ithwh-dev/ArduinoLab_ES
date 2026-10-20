export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  status: 'available' | 'upcoming';
}

export const lessons: Lesson[] = [
  { id: 'board', number: 1, title: 'Conoce Arduino', subtitle: 'La placa UNO', description: 'Descubre qué es un microcontrolador, para qué sirven sus pines y cómo se programa.', status: 'available' },
  { id: 'blink', number: 2, title: 'Enciende un LED', subtitle: 'Salidas digitales', description: 'Controla un LED con el pin 13 y comprende cómo influyen la resistencia y los tiempos de espera.', status: 'available' },
  { id: 'button', number: 3, title: 'Usa un pulsador', subtitle: 'Entradas digitales', description: 'Lee pulsaciones y cambia el estado de un LED.', status: 'upcoming' },
  { id: 'pot', number: 4, title: 'Gira un potenciómetro', subtitle: 'Entradas analógicas', description: 'Aprende a leer valores analógicos y regular una salida PWM.', status: 'upcoming' },
  { id: 'rgb', number: 5, title: 'Mezcla colores', subtitle: 'LED RGB', description: 'Mezcla luz roja, verde y azul.', status: 'upcoming' },
  { id: 'ldr', number: 6, title: 'Detecta la luz', subtitle: 'Fotorresistencia', description: 'Construye una lámpara que se enciende en la oscuridad.', status: 'upcoming' },
  { id: 'hcsr04', number: 7, title: 'Mide distancias', subtitle: 'HC-SR04', description: 'Calcula distancias utilizando ultrasonidos.', status: 'upcoming' },
  { id: 'buzzer', number: 8, title: 'Genera sonidos', subtitle: 'Buzzer', description: 'Reproduce notas musicales con tone().', status: 'upcoming' },
  { id: 'motor', number: 9, title: 'Controla un motor', subtitle: 'Motor DC', description: 'Regula un motor con un transistor y PWM.', status: 'upcoming' },
  { id: 'servo', number: 10, title: 'Mueve un servo', subtitle: 'Servomotor', description: 'Controla el ángulo de un servomotor.', status: 'upcoming' },
  { id: 'project', number: 11, title: 'Proyecto integrador', subtitle: 'Ponlo en práctica', description: 'Combina entradas, salidas y sensores.', status: 'upcoming' },
];
