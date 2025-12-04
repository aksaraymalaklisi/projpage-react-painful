import { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaIdCard, FaSpinner } from 'react-icons/fa';

const PageContainer = styled.div`
  flex: 1;
  min-height: 85vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #e0f2f1;
  background-image: url('/topography.svg');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;

  /* Overlay to tint the SVG if needed, or just let it be */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(240, 242, 245, 0.8) 0%, rgba(224, 242, 241, 0.8) 100%);
    z-index: 0;
  }

  /* Decorative Orbs - Keeping them for extra flair, but adjusting opacity */
  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(13, 175, 22, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    z-index: 0;
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  padding: 50px 40px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(13, 175, 22, 0.3);
  display: flex;
  flex-direction: column;
  gap: 25px;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  color: var(--verde-escuro);
  font-size: 2.2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: -1px;
  position: relative;
  display: inline-block;
  align-self: center;

  /* Decorative Underline */
  &::after {
    content: '';
    display: block;
    width: 50px;
    height: 5px;
    background: var(--verde-medio);
    margin: 10px auto 0;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--verde-medio);
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border-radius: 15px;
  border: 1px solid rgba(13, 175, 22, 0.3);
  background: rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  color: #1a1a1a;
  outline: none;
  transition: all 0.3s ease;
  font-weight: 500;

  &:focus {
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 5px 15px rgba(46, 204, 113, 0.15);
    border-color: var(--verde-medio);
  }

  &::placeholder {
    color: #555;
    font-weight: 400;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, var(--verde-medio) 0%, var(--verde-escuro) 100%);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(13, 175, 22, 0.2);
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(13, 175, 22, 0.3);
    background: linear-gradient(135deg, var(--verde-claro) 0%, var(--verde-medio) 100%);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  text-align: center;
  font-size: 0.9rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px;
  border-radius: 10px;
`;

const FooterText = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;

  a {
    color: var(--verde-escuro);
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    phone: '',
    cpf: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      // Redirect to login after successful registration
      navigate('/login');
    } catch (err) {
      setError('Falha no registro. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <GlassCard>
        <Title>Criar Conta</Title>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon><FaUser /></InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Usuário"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaEnvelope /></InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaLock /></InputIcon>
            <Input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaUser /></InputIcon>
            <Input
              type="text"
              name="name"
              placeholder="Nome Completo"
              value={formData.name}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaPhone /></InputIcon>
            <Input
              type="text"
              name="phone"
              placeholder="Telefone"
              value={formData.phone}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon><FaIdCard /></InputIcon>
            <Input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={formData.cpf}
              onChange={handleChange}
            />
          </InputGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <FaSpinner className="animate-spin" /> : 'Registrar'}
          </Button>
        </Form>

        <FooterText>
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </FooterText>
      </GlassCard>
    </PageContainer>
  );
}
