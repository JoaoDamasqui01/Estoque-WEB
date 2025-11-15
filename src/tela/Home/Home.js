// src/components/Home.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import './Home.css';

const api = "http://localhost:5000/ingredientes";
const LOCALIZACOES_OPCOES = ['ARMÁRIO', 'GELADEIRA', 'FREEZER'];

export default function App({ onNavigate }) {
    const [ingredientes, setIngredientes] = useState([]);
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('todos');
    const [termoBusca, setTermoBusca] = useState('');
    const textInputRef = useRef(null);

    // Buscar ingredientes da API
    const fetchIngredientes = async () => {
        try {
            const response = await fetch(api);

            if (response.status === 204) {
                setIngredientes([]);
                return;
            }

            const dados = await response.json();

            if (dados && Array.isArray(dados.ingredientes)) {
                setIngredientes(dados.ingredientes);
            } else {
                console.warn("Resposta da API em formato inesperado:", dados);
                setIngredientes([]);
            }
        } catch (error) {
            console.log("Erro na busca inicial:", error);
            setIngredientes([]);
        }
    };

    // Carregar ao montar componente
    useEffect(() => {
        fetchIngredientes();
    }, []);

    // Deletar ingrediente
    const EXCLUIRIngrediente = async (id_Ingrediente) => {
        if (!id_Ingrediente) {
            return console.error("ID do ingrediente inválido para exclusão.");
        }

        if (!window.confirm("Confirma a exclusão deste ingrediente?")) {
            return;
        }

        try {
            const response = await fetch(`${api}/${id_Ingrediente}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                throw new Error("Erro ao deletar ingrediente");
            }

            await fetchIngredientes();
        } catch (error) {
            console.error("Erro ao deletar ingrediente:", error);
            alert("Erro ao deletar ingrediente. Verifique o console.");
        }
    };

    // Filtrar lista
    const listaFiltrada = useMemo(() => {
        return ingredientes.filter(ingrediente => {
            const nomeIngredienteLower = ingrediente.nome.toLowerCase();
            const termoBuscaLower = termoBusca.toLowerCase();

            const passaNoFiltroBusca = nomeIngredienteLower.includes(termoBuscaLower);
            const passaNoFiltroLocalizacao = localizacaoSelecionada === 'todos' || 
                                            ingrediente.localizacao === localizacaoSelecionada;

            return passaNoFiltroBusca && passaNoFiltroLocalizacao;
        });
    }, [ingredientes, termoBusca, localizacaoSelecionada]);

    return (
        <div className="home-container">
            <div className="home-content">
                {/* Barra de Pesquisa */}
                <div className="search-bar">
                    <button 
                        className="search-icon-btn"
                        onClick={() => textInputRef.current?.focus()}
                    >
                        🔍
                    </button>
                    <input
                        ref={textInputRef}
                        type="text"
                        className="search-input"
                        placeholder="Buscar por um Ingrediente"
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                    />
                </div>

                {/* Botão Adicionar */}
                <button 
                    className="btn-add"
                    onClick={() => onNavigate('Formulario', { item: null, onRefresh: fetchIngredientes })}
                >
                    Adicionar novo Ingrediente
                </button>

                {/* Filtro de Localização */}
                <div className="filter-section">
                    <div className="filter-row">
                        <label className="filter-label">Localização:</label>
                        <select 
                            className="filter-select"
                            value={localizacaoSelecionada}
                            onChange={(e) => setLocalizacaoSelecionada(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            {LOCALIZACOES_OPCOES.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Lista de Ingredientes */}
                <h2 className="list-title">Itens no Estoque:</h2>
                <div className="items-list">
                    {listaFiltrada.map((ingrediente) => {
                        const isLowStock = ingrediente.quantidade <= ingrediente.ponto_pedido;
                        return (
                            <div 
                                key={ingrediente.id_Ingrediente}
                                className={`item-card ${isLowStock ? 'low-stock' : ''}`}
                            >
                                <div className="item-grid">
                                    <div className="item-column">
                                        <div className="detail-block">
                                            <span className="detail-label">Ingrediente:</span>
                                            <div className="detail-value-row">
                                                <span className="detail-value item-name">
                                                    {ingrediente.nome}
                                                </span>
                                                {isLowStock && <span className="warning-icon">⚠️</span>}
                                            </div>
                                        </div>
                                        <div className="detail-block">
                                            <span className="detail-label">Qtde atual:</span>
                                            <span className="detail-value qty-value">
                                                {ingrediente.quantidade} {ingrediente.unidade_medida}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="item-column">
                                        <div className="detail-block">
                                            <span className="detail-label">Localização:</span>
                                            <span className="detail-value">{ingrediente.localizacao}</span>
                                        </div>
                                        <div className="detail-block">
                                            <span className="detail-label">Ponto de pedido:</span>
                                            <span className="detail-value">{ingrediente.ponto_pedido}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-actions">
                                    <button 
                                        className="btn-edit"
                                        onClick={() => onNavigate('Formulario', { 
                                            item: ingrediente, 
                                            onRefresh: fetchIngredientes 
                                        })}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => EXCLUIRIngrediente(ingrediente.id_Ingrediente)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {listaFiltrada.length === 0 && (
                        <p className="no-results">
                            Nenhum ingrediente encontrado com os filtros aplicados.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}