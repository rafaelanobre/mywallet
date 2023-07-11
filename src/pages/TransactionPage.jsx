import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { UserContext } from "../contexts/UserContext.jsx";
import axios from "axios";
import { NumericFormat } from "react-number-format";

export default function TransactionsPage() {
  const {tipo} = useParams();
  const [valor,setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const { user } = useContext(UserContext);
  const token = user;
  const config = {
    headers: {
        Authorization:`Bearer ${token}`
    }
  }

  useEffect(()=>{
    const lsUser = JSON.parse(localStorage.getItem('user'));
    if(!lsUser === null){
      alert ("Você foi desconectado, faça o login novamente.");
      navigate('/');
    }
}, [])

  function addTransaction(e){
    e.preventDefault();
    setLoading(true);

    const formattedValue = parseFloat(valor.replace(/\./g, '').replace(',', '.'));

    axios.post(`${url}/nova-transacao/${tipo}`, {valor: formattedValue,descricao}, config)
    .then(resp =>{
      setLoading(false);
      navigate('/home');
    })
    .catch(error=>{
      if(error.response.status === 422){
        alert("Preencha todos os campos");
        setLoading(false);
        return;
      }
      if(error.response.status === 401){
        alert("Você foi desconectado, faça o login novamente.");
        navigate('/')
        return;
      }
      if(error.response.status === 500){
        alert("Tente novamente em alguns instantes");
        setLoading(false);
        return;
      }
    })
  }

  return (
    <TransactionsContainer>
      <h1 >Nova {tipo}</h1>
      <form onSubmit={addTransaction}>
        <NumericFormat
          required
          disabled={loading}
          placeholder="Valor"
          onChange={(e) => setValor(e.target.value)}
          allowNegative={false}
          decimalScale={2}
          fixedDecimalScale={true}
          thousandSeparator="."
          decimalSeparator=","
          isNumericString={true}
          data-test="registry-amount-input"
        />
        <input placeholder="Descrição" type="text" onChange={(e) => setDescricao(e.target.value)} disabled={loading} data-test="registry-name-input" />
        <button type="submit" disabled={loading} data-test="registry-save">Salvar {tipo}</button>
      </form>
    </TransactionsContainer>
  )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
