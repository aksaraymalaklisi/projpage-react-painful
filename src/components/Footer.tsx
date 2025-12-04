import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaChevronRight
} from 'react-icons/fa';

const FooterSection = styled.footer`
  background: var(--verde-escuro);
  color: var(--branco);
  padding: 60px 0 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.95rem;

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr; /* Brand column is slightly wider */
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const BrandColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BrandLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--branco);

  svg {
    color: var(--verde-claro);
  }
`;

const FooterSectionTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: var(--verde-claro);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterText = styled.p`
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 15px;
  max-width: 300px;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1); // Thin consistent border
  border-radius: 50%;
  color: var(--branco);
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: var(--verde-medio);
    transform: translateY(-3px);
    border-color: var(--verde-claro);
    color: var(--branco);
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 12px;

  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 5px;

    svg {
      font-size: 0.7rem;
      opacity: 0;
      transform: translateX(-5px);
      transition: all 0.2s ease;
      color: var(--verde-claro);
    }

    &:hover {
      color: var(--verde-claro);
      transform: translateX(5px);

      svg {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
  color: rgba(255, 255, 255, 0.8);

  svg {
    color: var(--verde-medio);
    font-size: 1.1rem;
    margin-top: 3px;
    flex-shrink: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--verde-claro);
    }
  }
  
  span {
    line-height: 1.4;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  
  p {
    opacity: 0.6;
    font-size: 0.85rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-size: 0.85rem;
    transition: color 0.2s;

    &:hover {
      color: var(--branco);
    }
  }
`;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterSection>
      <FooterContainer>
        <FooterContent>
          {/* Column 1: Brand & Social */}
          <BrandColumn>
            <BrandLogo>
              <img src="/favicon.png" alt="Green Trail" style={{ width: '30px', height: '30px', borderRadius: '8px' }} /> Green Trail
            </BrandLogo>
            <FooterText>
              Conectando aventureiros à natureza. Explore as melhores trilhas da Região dos Lagos com segurança e preservação.
            </FooterText>
            <SocialContainer>
              <SocialIcon href="https://instagram.com" target="_blank" aria-label="Instagram">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" target="_blank" aria-label="Facebook">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="https://twitter.com" target="_blank" aria-label="Twitter">
                <FaTwitter />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
                <FaLinkedinIn />
              </SocialIcon>
            </SocialContainer>
          </BrandColumn>

          {/* Column 2: Navigation */}
          <div>
            <FooterSectionTitle>Explorar</FooterSectionTitle>
            <LinkList>
              <LinkItem>
                <Link to="/trilhas">
                  <FaChevronRight /> Trilhas
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/community">
                  <FaChevronRight /> Comunidade
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/favorites">
                  <FaChevronRight /> Favoritos
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/about">
                  <FaChevronRight /> Sobre Nós
                </Link>
              </LinkItem>
            </LinkList>
          </div>

          {/* Column 3: Legal/Support */}
          <div>
            <FooterSectionTitle>Suporte</FooterSectionTitle>
            <LinkList>
              <LinkItem>
                <Link to="/faq">
                  <FaChevronRight /> FAQ
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/privacy">
                  <FaChevronRight /> Política de Privacidade
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/terms">
                  <FaChevronRight /> Termos de Uso
                </Link>
              </LinkItem>
              <LinkItem>
                <Link to="/help">
                  <FaChevronRight /> Ajuda
                </Link>
              </LinkItem>
            </LinkList>
          </div>

          {/* Column 4: Contact */}
          <div id="footer-contato">
            <FooterSectionTitle>Contato</FooterSectionTitle>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <ContactItem>
                <FaMapMarkerAlt />
                <span>Av. Beira Mar, 123<br />Maricá, RJ - Brasil</span>
              </ContactItem>
              <ContactItem>
                <FaPhone />
                <a href="tel:+5521999999999">(21) 99999-9999</a>
              </ContactItem>
              <ContactItem>
                <FaEnvelope />
                <a href="mailto:contato@greentrail.com.br">contato@greentrail.com.br</a>
              </ContactItem>
            </ul>
          </div>
        </FooterContent>

        <FooterBottom>
          <p>&copy; {currentYear} Green Trail. Todos os direitos reservados.</p>
          <BottomLinks>
            <Link to="/privacy">Privacidade</Link>
            <Link to="/terms">Termos</Link>
            <Link to="/sitemap">Mapa do Site</Link>
          </BottomLinks>
        </FooterBottom>
      </FooterContainer>
    </FooterSection>
  );
}