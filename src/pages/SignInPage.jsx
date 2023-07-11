import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext.jsx";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {user, setUser} = useContext(UserContext);
  const url = import.meta.env.VITE_API_URL;

  function signin(e){
    e.preventDefault();
    setLoading(true);

    axios.post(`${url}/`,{email, senha} )
    .then(resp =>{
      setLoading(false);
      console.log(resp.data);
      const token = resp.data;
      setUser(token);
      console.log(JSON.stringify(token));
      localStorage.setItem('user', JSON.stringify(token));
      navigate(`/home`);
    })
    .catch(error =>{
      if(error.response.status === 422){
        alert("O e-mail informado é inválido.");
        setLoading(false);
        return;
      }
      if(error.response.status === 404){
        alert("O e-mail informado não está cadastrado, cadastre-se primeiro.");
        setLoading(false);
        return;
      }
      if(error.response.status === 401){
        alert("Senha incorreta");
        setLoading(false);
        return;
      }
      setLoading(false);
    })
  }
  return (
    <SingInContainer>
      <form onSubmit={signin}>
        <MyWalletLogo />
        <input required placeholder="E-mail" type="email" onChange={(e) => setEmail(e.target.value)} disabled={loading} data-test="email" />
        <input required placeholder="Senha" type="password" autocomplete="new-password" onChange={(e) => setSenha(e.target.value)} disabled={loading} data-test="password" />
        <button type="submit" disabled={loading} data-test="sign-in-submit" >Entrar</button>
      </form>

      <Link to='/cadastro'>
        Primeira vez? Cadastre-se!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
