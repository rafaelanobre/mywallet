import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState } from "react";
import axios from "axios";

export default function SignUpPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  function signup (e){
    e.preventDefault();
    setLoading(true);

    if(senha !== confirmSenha){
      alert("As senhas não são iguais");
      setLoading(false);
      return;
    }
  
    axios.post(`${url}/cadastro`, { nome, email, senha })
    .then(resp =>{
      setLoading(false);
      navigate(`/`)})
    .catch(error =>{
      if(error.response.status === 422){
        alert("O e-mail informado deve ser válido e a senha deve ter no mínimo 3 caracteres.");
        setLoading(false);
        return;
      }
      if(error.response.status === 409){
        alert("E-mail já vinculado a outro usuário, faça login.");
        setLoading(false);
        return;
      }
      setLoading(false);
    })
  }

  return (
    <SingUpContainer>
      <form onSubmit={signup}>
        <MyWalletLogo />
        <input required placeholder="Nome" type="text" onChange={(e) => setNome(e.target.value)} disabled={loading} data-test="name" />
        <input required placeholder="E-mail" type="email" onChange={(e) => setEmail(e.target.value)} disabled={loading} data-test="email" />
        <input required placeholder="Senha" type="password" autocomplete="new-password" onChange={(e) => setSenha(e.target.value)} disabled={loading} data-test="password" />
        <input required placeholder="Confirme a senha" type="password" autocomplete="new-password" onChange={(e) => setConfirmSenha(e.target.value)} disabled={loading} data-test="conf-password" />
        <button type="submit" data-test="sign-up-submit">Cadastrar</button>
      </form>

      <Link to='/'>
        Já tem uma conta? Entre agora!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  input .error {
    border: 1px solid rgb(255 0 0);
  }
`
