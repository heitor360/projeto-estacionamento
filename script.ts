interface Veiculo {
  nome: string;
  placa: string;
  dataEntrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function calcularTempo(mil: number) {
    const minutes = Math.floor(mil / 60000);
    const seconds = Math.floor((mil % 60000) / 1000);

    return `${minutes}m e ${seconds}s`
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem('patio', JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement('tr');

      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('data-placa', veiculo.placa);
      deleteButton.id = 'delete';
      deleteButton.innerHTML = 'X';
      deleteButton.addEventListener('click', function () {
        remover(this.dataset.placa)
      })

      row.insertCell(0).innerHTML = veiculo.nome;
      row.insertCell(1).innerHTML = veiculo.placa;
      row.insertCell(2).innerHTML = `${veiculo.dataEntrada}`;
      row.insertCell(3).appendChild(deleteButton);

      $('#patio')?.appendChild(row);

      if (salva) salvar([...ler(), veiculo]);
    }

    function remover(placa: string) {
      const { dataEntrada, nome } = ler().find(v => v.placa === placa);
      const tempo = calcularTempo(new Date().getTime() - new Date(dataEntrada).getTime());

      if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
        return;

      salvar(ler().filter(v => v.placa !== placa));
      render();
    }

    function render() {
      const patio = $('#patio');
      if (patio) patio.innerHTML = '';

      const data = ler();

      if (data.length)
        data.forEach(veiculo => adicionar(veiculo, false));
    }

    return { ler, adicionar, remover, salvar, render };
  }

  patio().render();

  $('#cadastrar')?.addEventListener('click', () => {
    const nome = $('#nome')?.value;
    const placa = $('#placa')?.value;

    if (!nome || !placa) {
      alert('Campos obrigatórios!');
      return;
    }

    patio().adicionar({ nome, placa, dataEntrada: new Date().toISOString() }, true);
  })
})();