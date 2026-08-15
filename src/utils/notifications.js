export async function requestBrowserNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function showBrowserNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body });
}

export function playQueueBeep() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const now = context.currentTime;
  const frequencies = [880, 660, 880];

  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = now + index * 0.18;

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.16);
  });

  setTimeout(() => context.close(), 800);
}
