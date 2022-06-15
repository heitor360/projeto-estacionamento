(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcularTempo(mil) {
        const minutes = Math.floor(mil / 60000);
        const seconds = Math.floor((mil % 60000) / 1000);
        return `${minutes}m e ${seconds}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem('patio', JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a;
            const row = document.createElement('tr');
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('data-placa', veiculo.placa);
            deleteButton.id = 'delete';
            deleteButton.innerHTML = 'X';
            deleteButton.addEventListener('click', function () {
                remover(this.dataset.placa);
            });
            row.insertCell(0).innerHTML = veiculo.nome;
            row.insertCell(1).innerHTML = veiculo.placa;
            row.insertCell(2).innerHTML = `${veiculo.dataEntrada}`;
            row.insertCell(3).appendChild(deleteButton);
            (_a = $('#patio')) === null || _a === void 0 ? void 0 : _a.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]);
        }
        function remover(placa) {
            const { dataEntrada, nome } = ler().find(v => v.placa === placa);
            const tempo = calcularTempo(new Date().getTime() - new Date(dataEntrada).getTime());
            if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter(v => v.placa !== placa));
            render();
        }
        function render() {
            const patio = $('#patio');
            if (patio)
                patio.innerHTML = '';
            const data = ler();
            if (data.length)
                data.forEach(veiculo => adicionar(veiculo, false));
        }
        return { ler, adicionar, remover, salvar, render };
    }
    patio().render();
    (_a = $('#cadastrar')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        var _a, _b;
        const nome = (_a = $('#nome')) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $('#placa')) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Campos obrigatórios!');
            return;
        }
        patio().adicionar({ nome, placa, dataEntrada: new Date().toISOString() }, true);
    });
})();
