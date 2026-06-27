import { useState } from 'react';
import { isRemoteUrl, isAppMediaUrl } from '../services/mediaHelpers';
import { parsePrice } from '../services/apiHelpers';

const EMPTY_FORM = {
  title: '', mentor: '', price: '', tag: '', category: '',
  image: '', descricao: '', cargaHoraria: '', modulos: [], video: '', videoLink: '',
};

function produtoToForm(produto) {
  const rawVideo = produto.video ?? '';
  const videoIsExternalLink = typeof rawVideo === 'string'
    && isRemoteUrl(rawVideo)
    && !isAppMediaUrl(rawVideo);

  return {
    title:        produto.title ?? '',
    mentor:       produto.mentor ?? '',
    price:        produto.price != null ? String(produto.price) : '',
    tag:          produto.tag ?? '',
    category:     produto.category ?? '',
    image:        produto.image ?? '',
    descricao:    produto.descricao ?? '',
    cargaHoraria: produto.cargaHoraria ?? '',
    modulos:      produto.modulos ?? [],
    video:        videoIsExternalLink ? '' : rawVideo,
    videoLink:    videoIsExternalLink ? rawVideo : '',
  };
}

export default function useProdutoForm(produto) {
  const [form,   setForm]   = useState(() => (produto ? produtoToForm(produto) : EMPTY_FORM));
  const [errors, setErrors] = useState({});

  function setField(field) {
    return (value) => setForm(prev => ({ ...prev, [field]: value }));
  }

  function setModulos(modulos) {
    setForm(prev => ({ ...prev, modulos }));
  }

  function validate() {
    const newErrors = {};
    if (!form.title.trim())                                   newErrors.title    = 'Informe o título do produto';
    if (!form.mentor.trim())                                   newErrors.mentor   = 'Informe o autor/mentor';
    const parsedPrice = parsePrice(form.price);
    if (!form.price.trim() || parsedPrice <= 0)                newErrors.price    = 'Informe um preço válido';
    else if (parsedPrice > 99999.99)                           newErrors.price    = 'Preço máximo: R$ 99.999,99';
    if (!form.category.trim())                                 newErrors.category = 'Selecione uma categoria';
    if (!form.image.trim())                                    newErrors.image    = 'Selecione uma imagem para o produto';

    const link = form.videoLink.trim();
    if (link && !isRemoteUrl(link)) {
      newErrors.videoLink = 'Informe um link válido (http:// ou https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function toProdutoData() {
    const videoFromLink = form.videoLink.trim();
    const videoFromGallery = typeof form.video === 'string' ? form.video.trim() : form.video;
    const video = videoFromLink || videoFromGallery || undefined;

    return {
      title:        form.title.trim(),
      mentor:       form.mentor.trim(),
      price:        parsePrice(form.price),
      tag:          form.tag.trim() || undefined,
      category:     form.category.trim(),
      image:        form.image.trim(),
      descricao:    form.descricao.trim() || undefined,
      cargaHoraria: form.cargaHoraria.trim() || undefined,
      modulos:      form.modulos,
      video,
    };
  }

  return { form, errors, setField, setModulos, validate, toProdutoData };
}
