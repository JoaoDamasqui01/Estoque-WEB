// src/components/Formulario.jsx
import React, { useState } from 'react';
import './Formulario.css';

const api = "http://localhost:5000/ingredientes";
const LOCALIZACOES_OPCOES = ['ARMÁRIO', 'GELADEIRA', 'FREEZER'];

export default function Formulario({ routeParams, onNavigate }) {
    const { item, onRefresh } = routeParams || {};
    
    const [nome, setNome] = useState(item?.nome || '');
    const [quantidade, setQuantidade] = useState(item?.quantidade?.toString() || '');
    const [unidadeMedida, setUnidadeMedida] = useState(item?.unidade_medida || 'kg');
    const [pontoPedido, setPontoPedido] = useState(item?.ponto_pedido?.toString() || '');
    const [localizacao, setLocalizacao] = useState(item?.localizacao || 'ARMÁRIO');
    const [fornecedor, setFornecedor] = useState(item?.fornecedor || '');
    const [precoCusto, setPrecoCusto] = useState(item?.preco_custo?.toString() || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !quantidade || !pontoPedido) {
            alert('Preencha os campos obrigatórios: Nome, Quantidade e Ponto de Pedido');
            return;
        }

        const dados = {
            nome,
            quantidade: parseFloat(quantidade),
            unidade_medida: unidadeMedida,
            ponto_pedido: parseFloat(pontoPedido),
            localizacao,
            fornecedor,
            preco_custo: precoCusto ? parseFloat(precoCusto) : 0
        };

        try {
            const url = item ? `${api}/${item.id_Ingrediente}` : api;
            const method = item ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!response.ok) throw new Error('Erro ao salvar');

            alert(item ? 'Ingrediente atualizado!' : 'Ingrediente adicionado!');
            onRefresh && onRefresh();
            onNavigate('Home');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar ingrediente');
        }
    };

    return (
        <div className="form-container">
            <div className="form-content">
                <h1 className="form-title">
                    {item ? 'Editar' : 'Adicionar'} Ingrediente
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input 
                            type="text"
                            className="form-input" 
                            value={nome} 
                            onChange={(e) => setNome(e.target.value)} 
                            placeholder="Ex: Farinha de trigo"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Quantidade *</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="form-input" 
                            value={quantidade} 
                            onChange={(e) => setQuantidade(e.target.value)} 
                            placeholder="Ex: 10"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Unidade de Medida</label>
                        <select 
                            className="form-input"
                            value={unidadeMedida}
                            onChange={(e) => setUnidadeMedida(e.target.value)}
                        >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="L">L</option>
                            <option value="ml">ml</option>
                            <option value="un">un</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ponto de Pedido *</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="form-input" 
                            value={pontoPedido} 
                            onChange={(e) => setPontoPedido(e.target.value)} 
                            placeholder="Ex: 5"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Localização</label>
                        <select 
                            className="form-input"
                            value={localizacao}
                            onChange={(e) => setLocalizacao(e.target.value)}
                        >
                            {LOCALIZACOES_OPCOES.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Fornecedor</label>
                        <input 
                            type="text"
                            className="form-input" 
                            value={fornecedor} 
                            onChange={(e) => setFornecedor(e.target.value)} 
                            placeholder="Ex: Fornecedor XYZ"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Preço de Custo (R$)</label>
                        <input 
                            type="number"
                            step="0.01"
                            className="form-input" 
                            value={precoCusto} 
                            onChange={(e) => setPrecoCusto(e.target.value)} 
                            placeholder="Ex: 25.50"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="btn-save">
                            Salvar
                        </button>
                        <button 
                            type="button"
                            className="btn-cancel"
                            onClick={() => onNavigate('Home')}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}