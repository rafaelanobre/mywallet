import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useContext, useState } from "react";
import { BASEURL } from "../constants/urls";
import axios from "axios";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function signin(e){
    e.preventDefault();
    setLoading(true);

    axios.post(`${BASEURL}/`,{email, senha: password} )
    .then(resp =>{
      console.log(resp.data);
      setLoading(false);
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
        <input required placeholder="E-mail" type="email" onChange={(e) => setEmail(e.target.value)} disabled={loading} />
        <input required placeholder="Senha" type="password" autocomplete="new-password" onChange={(e) => setPassword(e.target.value)} disabled={loading} />
        <button type="submit" disabled={loading}>Entrar</button>
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
