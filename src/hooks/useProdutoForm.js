import { useState } from 'react';

const EMPTY_FORM = {
  title: '', mentor: '', price: '', tag: '', category: '',
  image: '', descricao: '', cargaHoraria: '', modulos: [], video: '',
};

function produtoToForm(produto) {
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
    video:        produto.video ?? '',
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
    if (!form.price.trim() || Number(form.price) <= 0)         newErrors.price    = 'Informe um preço válido';
    else if (Number(form.price) > 99999.99)                    newErrors.price    = 'Preço máximo: R$ 99.999,99';
    if (!form.category.trim())                                 newErrors.category = 'Selecione uma categoria';
    if (!form.image.trim())                                    newErrors.image    = 'Informe a URL da imagem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function toProdutoData() {
    return {
      title:        form.title.trim(),
      mentor:       form.mentor.trim(),
      price:        Number(form.price),
      tag:          form.tag.trim() || undefined,
      category:     form.category.trim(),
      image:        form.image.trim(),
      descricao:    form.descricao.trim() || undefined,
      cargaHoraria: form.cargaHoraria.trim() || undefined,
      modulos:      form.modulos.length ? form.modulos : undefined,
      video:        form.video.trim() || undefined,
    };
  }

  return { form, errors, setField, setModulos, validate, toProdutoData };
}
