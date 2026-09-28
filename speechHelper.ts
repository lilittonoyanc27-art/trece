// Simple Web Speech API helper for Spanish pronunciation

export const speakSpanish = (
  text: string,
  rate = 0.9,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text of markdown/symbols
  const cleanText = text
    .replace(/[/]/g, " ")
    .replace(/[«»“”]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "es-ES";
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try to find a native Spanish voice if available
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice =
    voices.find((v) => v.lang === "es-ES" || v.lang.startsWith("es-")) ||
    voices.find((v) => v.lang.includes("es"));

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
