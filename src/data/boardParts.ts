export const boardParts = [
  { id: 'usb', name: 'Puerto USB', position: [-1.82, 0.52, -0.58], description: 'Conecta la placa a una computadora para transferir un programa y alimentarla por USB.' },
  { id: 'chip', name: 'Microcontrolador', position: [0.15, 0.45, -0.02], description: 'El ATmega328P ejecuta las instrucciones del programa y controla las entradas y salidas.' },
  { id: 'analog', name: 'Entradas analógicas', position: [0.95, 0.5, 0.94], description: 'A0–A5 leen señales de sensores. En el UNO, analogRead devuelve valores entre 0 y 1023 para el rango de referencia configurado.' },
  { id: 'digital', name: 'Pines digitales', position: [0.1, 0.5, -0.91], description: 'D0–D13 pueden leer o producir estados LOW y HIGH. En esta lección, D13 controla el LED mediante una resistencia.' },
  { id: 'power', name: 'Alimentación', position: [-0.7, 0.5, 0.94], description: 'Los pines 5V y GND proporcionan alimentación regulada y referencia de tierra. GND es el retorno del circuito. Nunca unas 5V directamente con GND.' },
] as const;
export type BoardPartId = typeof boardParts[number]['id'];

export const boardChallenge = {
  question: '¿Qué parte ejecuta las instrucciones de un programa en Arduino UNO?',
  answers: ['El puerto USB', 'El microcontrolador ATmega328P', 'Los pines de alimentación'],
  explanation: 'El microcontrolador ejecuta el programa; el puerto USB permite transferirlo.',
};
export const blinkChallenge = {
  question: '¿Por qué utilizamos una resistencia en serie con el LED?',
  answers: ['Para aumentar el voltaje del pin', 'Para limitar la corriente y proteger el LED', 'Para que Arduino funcione sin energía'],
  explanation: 'La resistencia limita la corriente que pasa por el LED.',
};
