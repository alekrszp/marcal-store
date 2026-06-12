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
    // "video" normalmente é uma string (URI escolhida na galeria ou URL
    // remota já integrada). Os 2 cursos de exemplo do seed usam um número
    // (asset bundlado via require()) — nesse caso mantemos o valor como está
    // e o ProdutoVideoPicker mostra um rótulo fixo, sem permitir editar a
    // origem do arquivo (só remover).
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
    if (!form.image.trim())                                    newErrors.image    = 'Selecione uma imagem para o produto';
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
      // form.video pode ser string (URI/URL) ou number (asset require() dos
      // cursos de exemplo do seed, ver produtoToForm acima).
      video:        typeof form.video === 'string' ? (form.video.trim() || undefined) : form.video,
    };
  }

  return { form, errors, setField, setModulos, validate, toProdutoData };
}
