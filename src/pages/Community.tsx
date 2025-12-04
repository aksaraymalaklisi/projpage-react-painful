import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeart, FaComment, FaShare, FaImage, FaMapSigns, FaTrash, FaPaperPlane, FaEllipsisH } from 'react-icons/fa';
// ... existing imports

// ... existing components

const MenuContainer = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  padding: 8px;
  min-width: 150px;
  z-index: 10;
  border: 1px solid #eee;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e74c3c;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: #fff5f5;
  }
`;

// ... existing styled components
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { api } from '../services/api';
import type { Track, TrailResponse } from '../types';

// Reusable Image Component to prevent loops
const ImageWithFallback = ({ src, fallback, alt, ...props }: { src?: string | null, fallback: string, alt: string, [key: string]: any }) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setHasError(false);
  }, [src, fallback]);



  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 480px) {
    padding: 10px 5px;
  }
`;

const GlassContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 40px;
  padding: 40px;
  border: 1px solid rgba(13, 175, 22, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 20px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--verde-escuro);
  margin-bottom: 15px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
`;

const CreatePostCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 20px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #eee;
  border-radius: 15px;
  padding: 15px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 15px;
  font-family: inherit;
  background: #f8f9fa;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: var(--verde-medio);
    background: #fff;
    box-shadow: 0 0 0 3px rgba(13, 175, 22, 0.1);
  }

  @media (max-width: 480px) {
    font-size: 16px; // Prevent iOS zoom
    padding: 12px;
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;

    div {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }

    button {
      width: 100%;
      justify-content: center;
      padding: 10px;
    }
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    color: var(--verde-escuro);
    transform: translateY(-2px);
  }
  
  svg {
    color: var(--verde-medio);
  }
`;

const PostButton = styled.button`
  background: var(--verde-medio);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(13, 175, 22, 0.3);

  &:hover {
    background: var(--verde-escuro);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(13, 175, 22, 0.4);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 15px;
  border: 1px solid #eee;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #444;
  background: #f8f9fa;

  &:focus {
    outline: none;
    border-color: var(--verde-medio);
  }

  @media (max-width: 480px) {
    font-size: 16px; // Prevent iOS zoom
  }
`;

const SelectedInfo = styled.div`
  font-size: 0.9rem;
  color: var(--verde-medio);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(13, 175, 22, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  width: fit-content;
`;

const PostCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 15px;
    margin-bottom: 15px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Avatar = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--verde-claro);

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }
`;

const UserName = styled.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const PostTime = styled.span`
  font-size: 0.8rem;
  color: #888;
`;

const PostContent = styled.p`
  font-size: 1.05rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 15px;
  }
`;

const TrackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0fdf4;
  padding: 12px 15px;
  border-radius: 15px;
  text-decoration: none;
  color: var(--verde-escuro);
  margin-bottom: 20px;
  border: 1px solid rgba(13, 175, 22, 0.2);
  transition: all 0.2s;

  &:hover {
    background: #dcfce7;
    transform: translateX(5px);
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

const InteractionBar = styled.div`
  display: flex;
  gap: 25px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 10px;
    justify-content: space-between;
    
    button {
      flex: 1 1 45%; // Allow buttons to grow and wrap, taking roughly half width
      justify-content: center;
      background: #f8f9fa; // Add background for better touch targets
      padding: 10px;
      border-radius: 15px;
    }
  }
`;

const InteractionButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? 'var(--verde-medio)' : '#666'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    color: var(--verde-medio);
    transform: scale(1.05);
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const CommentsSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const Comment = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const CommentContent = styled.div`
  background: #f8f9fa;
  padding: 12px 18px;
  border-radius: 18px;
  border-top-left-radius: 4px;
  flex: 1;
  min-width: 0; // Crucial for text wrapping in flex children

  @media (max-width: 480px) {
    padding: 10px 14px;
  }
`;

const CommentUser = styled.span`
  font-weight: 700;
  font-size: 0.9rem;
  color: #333;
  margin-right: 10px;
  display: block; // Stack user name on small screens if needed, or keep inline
  margin-bottom: 4px;
`;

const CommentText = styled.span`
  font-size: 0.95rem;
  color: #555;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
  display: block; // Ensure it takes width to wrap
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

interface Comment {
  id: number;
  user: number;
  user_name: string;
  user_picture: string;
  content: string;
  created_at: string;
}

interface Post {
  id: number;
  user: number;
  user_name: string;
  user_picture: string;
  content: string;
  image?: string;
  created_at: string;
  reactions_summary: { reaction_type: string; count: number }[];
  comments: Comment[];
  track_info?: { id: number; label: string };
  user_reaction?: string;
}

interface PostResponse {
  results: Post[];
}

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);
  const [availableTracks, setAvailableTracks] = useState<Track[]>([]);
  const [showTrackSelector, setShowTrackSelector] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [activeMenu, setActiveMenu] = useState<{ type: 'post' | 'comment', id: number } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);



  const fetchPosts = async () => {
    try {
      const data = await api.get<PostResponse | Post[]>('community-posts/');
      if ('results' in data && data.results) {
        setPosts(data.results);
      } else if (Array.isArray(data)) {
        setPosts(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchTracks = async () => {
    try {
      const data = await api.get<TrailResponse>('tracks/');
      setAvailableTracks(data.results || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchTracks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as Element).closest('button')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() && !selectedImage && !selectedTrackId) return;
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      if (selectedTrackId) {
        formData.append('track', selectedTrackId.toString());
      }

      await api.post('community-posts/', formData, true, true);

      setNewPostContent('');
      setSelectedImage(null);
      setSelectedTrackId(null);
      setShowTrackSelector(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erro ao criar post. Tente novamente.');
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await api.delete(`community-posts/${postId}/`);
      setPosts(prev => prev.filter(p => p.id !== postId));
      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return;
    try {
      await api.delete(`comments/${commentId}/`);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      }));
      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleReaction = async (postId: number, type: string) => {
    if (!user) {
      alert('Faça login para interagir!');
      return;
    }

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    const isReacting = !post.user_reaction;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          user_reaction: isReacting ? type : undefined,
          reactions_summary: isReacting
            ? [{ reaction_type: type, count: (p.reactions_summary[0]?.count || 0) + 1 }]
            : [{ reaction_type: type, count: Math.max(0, (p.reactions_summary[0]?.count || 0) - 1) }]
        };
      }
      return p;
    }));

    try {
      if (isReacting) {
        await api.post(`community-posts/${postId}/react/`, { reaction_type: type }, true);
      } else {
        await api.delete(`community-posts/${postId}/react/`);
      }
      fetchPosts(); // Refresh to ensure sync
    } catch (error) {
      console.error('Error reacting:', error);
      fetchPosts(); // Revert on error
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    if (!commentText.trim() || !user) return;

    try {
      await api.post(`community-posts/${postId}/comment/`, { content: commentText }, true);
      setCommentText('');
      setActiveCommentBox(null);
      fetchPosts();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Erro ao enviar comentário.');
    }
  };

  return (
    <PageLayout>
      <Container>
        <GlassContainer>
          <Header>
            <Title>Comunidade</Title>
            <p style={{ fontSize: '1.1rem', color: '#444' }}>Compartilhe suas aventuras e conecte-se com outros exploradores.</p>
          </Header>

          {user && (
            <CreatePostCard>
              <UserInfo>
                <Avatar src={user.profile?.picture || '/default-avatar.svg'} alt="User" />
                <UserName>{user.username}</UserName>
              </UserInfo>
              <TextArea
                placeholder="No que você está pensando?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />

              {selectedImage && (
                <SelectedInfo>
                  <FaImage /> Imagem selecionada: {selectedImage.name}
                  <FaTrash style={{ cursor: 'pointer', color: '#666' }} onClick={() => setSelectedImage(null)} />
                </SelectedInfo>
              )}

              {selectedTrackId && (
                <SelectedInfo>
                  <FaMapSigns /> Trilha selecionada: {availableTracks.find(t => t.id === selectedTrackId)?.label}
                  <FaTrash style={{ cursor: 'pointer', color: '#666' }} onClick={() => setSelectedTrackId(null)} />
                </SelectedInfo>
              )}

              {showTrackSelector && (
                <Select
                  value={selectedTrackId || ''}
                  onChange={(e) => {
                    setSelectedTrackId(Number(e.target.value));
                    setShowTrackSelector(false);
                  }}
                >
                  <option value="">Selecione uma trilha...</option>
                  {availableTracks.map(track => (
                    <option key={track.id} value={track.id}>{track.label}</option>
                  ))}
                </Select>
              )}

              <HiddenInput
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedImage(e.target.files[0]);
                  }
                }}
              />

              <ActionRow>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <ActionButton onClick={() => fileInputRef.current?.click()}>
                    <FaImage /> Foto
                  </ActionButton>
                  <ActionButton onClick={() => setShowTrackSelector(!showTrackSelector)}>
                    <FaMapSigns /> Trilha
                  </ActionButton>
                </div>
                <PostButton onClick={handlePostSubmit} disabled={!newPostContent.trim() && !selectedImage && !selectedTrackId}>
                  Publicar
                </PostButton>
              </ActionRow>
            </CreatePostCard>
          )}

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--verde-escuro)', fontSize: '1.2rem' }}>Carregando feed...</p>
          ) : (

            posts.map(post => (
              <PostCard key={post.id}>
                <UserInfo>
                  <ImageWithFallback
                    src={post.user_picture}
                    fallback="/default-avatar.svg"
                    alt={post.user_name}
                    className="avatar"
                    style={{
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--verde-claro)'
                    }}
                  />
                  <div>
                    <UserName>{post.user_name}</UserName>
                    <PostTime>{new Date(post.created_at).toLocaleDateString()}</PostTime>
                  </div>
                </UserInfo>
                <PostContent>{post.content}</PostContent>
                {post.image && (
                  <ImageWithFallback
                    src={post.image}
                    fallback="/placeholder-trail.jpg"
                    alt="Post content"
                    style={{
                      width: '100%',
                      borderRadius: '15px',
                      marginBottom: '20px',
                      objectFit: 'cover',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                )}

                {post.track_info && (
                  <TrackLink to={`/trilhas/${post.track_info.id}`}>
                    <FaMapSigns color="var(--verde-medio)" />
                    <span>Trilha: {post.track_info.label}</span>
                  </TrackLink>
                )}

                <InteractionBar>
                  <InteractionButton
                    $active={!!post.user_reaction}
                    onClick={() => handleReaction(post.id, 'like')}
                  >
                    <FaHeart /> {post.reactions_summary.reduce((acc, curr) => acc + curr.count, 0)} Curtidas
                  </InteractionButton>
                  <InteractionButton onClick={() => {
                    if (!user) {
                      alert('Faça login para comentar!');
                      return;
                    }
                    setActiveCommentBox(activeCommentBox === post.id ? null : post.id);
                  }}>
                    <FaComment /> {post.comments.length} Comentários
                  </InteractionButton>
                  <InteractionButton disabled style={{ cursor: 'not-allowed', opacity: 0.5 }} title="Em breve">
                    <FaShare /> Compartilhar
                  </InteractionButton>

                  {user && Number(user.id) === post.user && (
                    <MenuContainer>
                      <MenuButton onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu?.type === 'post' && activeMenu.id === post.id ? null : { type: 'post', id: post.id });
                      }}>
                        <FaEllipsisH />
                      </MenuButton>
                      {activeMenu?.type === 'post' && activeMenu.id === post.id && (
                        <MenuDropdown>
                          <MenuItem onClick={() => handleDeletePost(post.id)}>
                            <FaTrash /> Excluir Post
                          </MenuItem>
                        </MenuDropdown>
                      )}
                    </MenuContainer>
                  )}
                </InteractionBar>

                {activeCommentBox === post.id && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                    <TextArea
                      placeholder="Escreva um comentário..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      style={{ minHeight: '60px', marginBottom: 0 }}
                    />
                    <PostButton
                      onClick={() => handleCommentSubmit(post.id)}
                      style={{
                        padding: '12px',
                        height: '46px',
                        width: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        marginBottom: '2px' // Align with textarea border
                      }}
                      title="Enviar comentário"
                    >
                      <FaPaperPlane size={16} />
                    </PostButton>
                  </div>
                )}

                {post.comments.length > 0 && (
                  <CommentsSection>
                    {post.comments.map(comment => (
                      <Comment key={comment.id}>
                        <Avatar src={comment.user_picture || '/default-avatar.svg'} style={{ width: 30, height: 30 }} />
                        <CommentContent>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <CommentUser>{comment.user_name}</CommentUser>
                            {user && Number(user.id) === comment.user && (
                              <MenuContainer>
                                <MenuButton onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(activeMenu?.type === 'comment' && activeMenu.id === comment.id ? null : { type: 'comment', id: comment.id });
                                }} style={{ padding: '4px', fontSize: '0.8rem' }}>
                                  <FaEllipsisH />
                                </MenuButton>
                                {activeMenu?.type === 'comment' && activeMenu.id === comment.id && (
                                  <MenuDropdown>
                                    <MenuItem onClick={() => handleDeleteComment(post.id, comment.id)}>
                                      <FaTrash /> Excluir
                                    </MenuItem>
                                  </MenuDropdown>
                                )}
                              </MenuContainer>
                            )}
                          </div>
                          <CommentText>{comment.content}</CommentText>
                        </CommentContent>
                      </Comment>
                    ))}
                  </CommentsSection>
                )}
              </PostCard>
            ))
          )}
        </GlassContainer>
      </Container>
    </PageLayout>
  );
};
