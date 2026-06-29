// Vídeo de divulgação exibido na Home (botão "VÍDEO").
// Com USE_MOCK = false, vem do backend: GET /promo (tb_promo + /media/videos/promo-pablo-marcal.mp4).
// Este fallback local é usado apenas em modo mock ou se a API falhar.
export const PROMO_VIDEO = {
  title: 'Pablo Marçal apresenta a Marçal Store',
  video: require('../../assets/videos/promo-pablo-marcal.mp4'),
};
