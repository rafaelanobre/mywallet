import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import numeral from "numeral";


export default function HomePage() {
  const [nome, setNome] = useState('');
  const [transacoes, setTransacoes] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const token = user;
  const config = {
    headers: {
        Authorization:`Bearer ${token}`
    }
  }
  const url = import.meta.env.VITE_API_URL;
  console.log(config);
  console.log(UserContext);

  useEffect(() => {
      axios.get(`${url}/home`, config)
      .then((resp) =>{
          console.log(resp.data);
          setNome(resp.data.username);
          setTransacoes(resp.data.transacoes.reverse());
          setSaldo(resp.data.saldo);
      })
      .catch((error) =>{
          if (error.response.status === 401){
            alert ("Você foi desconectado, faça o login novamente.");
            navigate('/');
            return;
          }
          else alert (error.response.data);
          navigate('/');
      })
  }, []);

  function handleLogout(){
    localStorage.removeItem('user');

    axios.post(`${url}/logout`, config)
      .then(() => {
        localStorage.removeItem('user');
        setUser({});
        navigate('/');
      })
      .catch((error) => {
        if (error.response.status === 401) navigate('/');
        console.log(error);
      });
  }


  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Olá, {nome}</h1>
        <BiExit data-test="logout" onClick={handleLogout}/>
      </Header>

      <TransactionsContainer>
      {transacoes.length === 0 ? (
        <p>Não há registros de entrada ou saída</p>
      ) : (
        <>
          <ul>
            {transacoes.map((transacao, index) => (
              <ListItemContainer key={index}>
                <div>
                  <span>{transacao.data}</span>
                  <strong data-test="registry-name">{transacao.descricao}</strong>
                </div>
                <Value data-test="registry-amount" color={transacao.tipo === "entrada" ? "positivo" : "negativo"}>
                {`R$ ${numeral(transacao.valor).format('R$0,0.00')}`}
                </Value>
              </ListItemContainer>
            ))}
          </ul>

          <article>
            <strong>Saldo</strong>
            <Value data-test="total-amount" color={saldo >= 0 ? "positivo" : "negativo"}>
            {`R$ ${numeral(saldo).format('R$0,0.00')}`}
            </Value>
          </article>
        </>
      )}
      </TransactionsContainer>


      <ButtonsContainer>
        <Link to='/nova-transacao/entrada'>
          <button data-test="new-income">
            <AiOutlinePlusCircle />
            <p>Nova <br /> entrada</p>
          </button>
        </Link>
        <Link to='/nova-transacao/saida'>
          <button data-test="new-expense">
            <AiOutlineMinusCircle />
            <p>Nova <br />saída</p>
          </button>
        </Link>
      </ButtonsContainer>

    </HomeContainer>
  )
}


const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
`
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  p{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
    padding-left: 2em;
    padding-right: 2em;
    color: #868686;
    font-size: 20px;
    font-weight: 400;
    line-height: normal;
  }
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
`
const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;
  
  button {
    width: 5em;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: 18px;
    }
  }
  Link {
    width: 50%;
  }
`
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "positivo" ? "green" : "red")};
`
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`