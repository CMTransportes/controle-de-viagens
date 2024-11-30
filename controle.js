function getNextId() {
    let currentId = localStorage.getItem('currentId');
    if (!currentId) {
        currentId = 100;
        localStorage.setItem('currentId', currentId);
    } else {
        currentId = parseInt(currentId) + 1;
        localStorage.setItem('currentId', currentId);
    }
    return currentId;
}

function carregarPlanos() {
    const planos = JSON.parse(localStorage.getItem('planos')) || [];

    const tabelaAguardando = document.getElementById('tabelaAguardando');
    const tabelaEmViagem = document.getElementById('tabelaEmViagem');
    const tabelaFinalizada = document.getElementById('tabelaFinalizada');

    tabelaAguardando.innerHTML = '';
    tabelaEmViagem.innerHTML = '';
    tabelaFinalizada.innerHTML = '';

    planos.forEach((plano) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plano.id}</td>
            <td>${plano.statusCarregamento}</td>
            <td>${plano.placa}</td>
            <td>${plano.motorista}</td>
            <td>${plano.origem}</td>
            <td>${plano.destino}</td>
            <td>${new Date(plano.previsao).toLocaleDateString('pt-BR')}</td>
            <td><textarea onchange="atualizarObservacao(${plano.id}, this.value)">${plano.observacao || ''}</textarea></td>
            ${plano.status !== 'Fim de Viagem' ? ` 
            <td class="actions">
                ${plano.status === 'Aguardando Início' ? `
                <button class="iniciar" onclick="iniciarViagem(${plano.id})" aria-label="Iniciar Plano ${plano.id}">Iniciar Plano</button>
                <button class="cancelar" onclick="cancelarViagem(${plano.id})" aria-label="Cancelar Viagem ${plano.id}">Cancelar Viagem</button>` : ''}
                ${plano.status === 'Em Viagem' ? `<button class="finalizar" onclick="finalizarViagem(${plano.id})" aria-label="Finalizar Viagem ${plano.id}">Finalizar Viagem</button>` : ''}
            </td>` : `
            <td class="actions">
                <button class="voltar" onclick="voltarParaEmViagem(${plano.id})" aria-label="Voltar para Em Viagem ${plano.id}">Voltar para Em Viagem</button>
            </td>`}
            ${plano.status === 'Fim de Viagem' ? `<td>${new Date(plano.dataFinalizacao).toLocaleString('pt-BR')}</td>` : ''}
        `;

        if (plano.status === 'Aguardando Início') {
            tabelaAguardando.appendChild(row);
        } else if (plano.status === 'Em Viagem') {
            tabelaEmViagem.appendChild(row);
        } else if (plano.status === 'Fim de Viagem') {
            tabelaFinalizada.appendChild(row);
        }
    });
}

function iniciarViagem(id) {
    const planos = JSON.parse(localStorage.getItem('planos'));
    const plano = planos.find(p => p.id === id);
    plano.status = 'Em Viagem';
    localStorage.setItem('planos', JSON.stringify(planos));
    carregarPlanos();
}

function finalizarViagem(id) {
    const planos = JSON.parse(localStorage.getItem('planos'));
    const plano = planos.find(p => p.id === id);
    plano.status = 'Fim de Viagem';
    plano.dataFinalizacao = new Date();
    localStorage.setItem('planos', JSON.stringify(planos));
    carregarPlanos();
}

function voltarParaEmViagem(id) {
    const planos = JSON.parse(localStorage.getItem('planos'));
    const plano = planos.find(p => p.id === id);
    plano.status = 'Em Viagem';
    delete plano.dataFinalizacao; // Remove a data de finalização
    localStorage.setItem('planos', JSON.stringify(planos));
    carregarPlanos();
}

function cancelarViagem(id) {
    let planos = JSON.parse(localStorage.getItem('planos'));
    planos = planos.filter(plano => plano.id !== id);
    localStorage.setItem('planos', JSON.stringify(planos));
    carregarPlanos();
}

function atualizarObservacao(id, observacao) {
    const planos = JSON.parse(localStorage.getItem('planos'));
    const plano = planos.find(p => p.id === id);
    plano.observacao = observacao;
    localStorage.setItem('planos', JSON.stringify(planos));
}

document.addEventListener('DOMContentLoaded', carregarPlanos);
