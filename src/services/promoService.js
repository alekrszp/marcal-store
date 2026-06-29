import httpClient from './httpClient';
import { USE_MOCK } from './config';
import { PROMO_VIDEO } from '../data/promo';

async function getPromo() {
  if (USE_MOCK) {
    return {
      title: PROMO_VIDEO.title,
      video: PROMO_VIDEO.video,
    };
  }

  const data = await httpClient.request('/promo', { requireAuth: false });
  return {
    title: data.title,
    video:   data.videoUrl,
  };
}

export default { getPromo };
