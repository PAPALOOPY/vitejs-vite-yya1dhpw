import React, { useState, useEffect } from 'react';

export default function App() {
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('adminPassword') || 'admin123');
  const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('siteTitle') || '너고해 : 너의 고민을 해결할게');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [announcement, setAnnouncement] = useState(() => localStorage.getItem('announcement') || '방문해 주셔서 감사합니다.\n이곳은 기밀이 철저히 보장되는 탐정 사무소입니다.\n\n허위 의뢰는 정중히 사양합니다.');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState(''); 
  
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem('detectivePosts');
    if (savedPosts) {
      return JSON.parse(savedPosts); 
    }
    return [
      { id: 1, title: '첫 번째 의뢰건 (기밀)', content: '요즘 누군가 저를 미행하는 것 같습니다...', password: '1234', reply: '탐정이 사건에 착수했습니다. 안심하십시오.', phone: '', kakao: '' }
    ];
  });
  
  const [newPost, setNewPost] = useState({ title: '', content: '', password: '', phone: '', kakao: '' });
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list');
  const [inputPassword, setInputPassword] = useState('');
  const [replyContent, setReplyContent] = useState('');

  // 💾 설정이나 게시글 영구 저장
  useEffect(() => {
    localStorage.setItem('adminPassword', adminPassword);
    localStorage.setItem('siteTitle', siteTitle);
    localStorage.setItem('theme', theme);
    localStorage.setItem('announcement', announcement);
    localStorage.setItem('detectivePosts', JSON.stringify(posts));
  }, [adminPassword, siteTitle, theme, announcement, posts]);

  // 🔄 브라우저 '뒤로 가기' 버튼 완벽 지원을 위한 마법의 코드
  useEffect(() => {
    // 처음에 홈페이지에 들어왔을 때 기본 상태를 기록합니다.
    window.history.replaceState({ view: 'list' }, '', '');

    // 사용자가 뒤로 가기를 눌렀을 때 실행되는 함수
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.view) {
        setViewMode(e.state.view); // 기록된 이전 화면으로 돌려줍니다.
      } else {
        setViewMode('list'); // 꼬였을 땐 무조건 목록으로!
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 🚀 화면을 이동할 때마다 브라우저 방문 기록에 발자국을 남깁니다.
  const navigate = (mode: string) => {
    window.history.pushState({ view: mode }, '', '');
    setViewMode(mode);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInput === adminPassword) {
      setIsAdmin(true);
      setAdminInput('');
      alert('관리자(탐정) 모드로 전환되었습니다.');
    } else {
      setAdminInput('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    navigate('list');
  };

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.password) return alert('모든 필수 항목을 기입해 주십시오.');
    const post = { id: Date.now(), ...newPost, reply: '' };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', password: '', phone: '', kakao: '' });
    navigate('list');
  };

  const openPost = (post: any) => {
    setSelectedPost(post);
    if (isAdmin) {
      navigate('read');
    } else {
      navigate('password-check');
    }
  };

  const checkPassword = () => {
    if (inputPassword === selectedPost.password) {
      navigate('read');
      setInputPassword('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const submitReply = () => {
    const updatedPosts = posts.map(p => 
      p.id === selectedPost.id ? { ...p, reply: replyContent } : p
    );
    setPosts(updatedPosts);
    setSelectedPost({ ...selectedPost, reply: replyContent });
    setReplyContent('');
  };

  const deletePost = (id: number) => {
    if (window.confirm('이 사건 기록을 영구적으로 말소하시겠습니까? (복구 불가)')) {
      const updatedPosts = posts.filter(p => p.id !== id);
      setPosts(updatedPosts);
      navigate('list');
      setSelectedPost(null);
    }
  };

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0c0c0c]' : 'bg-[#f4f1ea]';
  const textClass = isDark ? 'text-stone-300' : 'text-stone-800';
  const cardClass = isDark ? 'bg-[#141414] border-stone-800' : 'bg-white border-stone-300';
  const inputClass = isDark ? 'bg-[#0a0a0a] border-stone-700 text-stone-200' : 'bg-[#faf9f6] border-stone-300 text-stone-900';
  const accentText = isDark ? 'text-amber-600/80' : 'text-amber-800';

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
          .detective-font { font-family: 'Nanum Myeongjo', serif; }
          .bg-vignette {
            background-image: radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%);
          }
          .luxury-shadow {
            box-shadow: 0 10px 40px -10px rgba(0,0,0,0.6);
          }
        `}
      </style>

      <div className={`min-h-screen ${bgClass} ${textClass} detective-font relative selection:bg-amber-900/40`}>
        {isDark && <div className="absolute inset-0 bg-vignette pointer-events-none"></div>}

        <div className="max-w-4xl mx-auto p-6 md:p-10 relative z-10">
          
          <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-12 border-b border-stone-700/50 pb-8">
            <div className="cursor-pointer text-center md:text-left whitespace-nowrap" onClick={() => navigate('list')}>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-stone-100 drop-shadow-md flex justify-center md:justify-start items-center gap-4">
                <span className="text-4xl opacity-80">🕵🏻‍♂️</span> 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-stone-200 to-stone-400">{siteTitle}</span>
              </h1>
              <p className={`text-sm mt-4 ${accentText} italic tracking-widest`}>
                "모든 불가능을 제외하고 남은 것, 그것이 아무리 믿기 힘들지라도 진실이다."
              </p>
            </div>
            
            {isAdmin && (
              <div className="flex gap-6 font-bold text-sm whitespace-nowrap shrink-0">
                <button onClick={() => navigate('settings')} className="text-stone-400 hover:text-amber-500 transition-colors uppercase tracking-widest text-xs">⚙️ 사무소 설정</button>
                <button onClick={handleAdminLogout} className="text-stone-400 hover:text-red-400 transition-colors uppercase tracking-widest text-xs">👤 퇴근하기</button>
              </div>
            )}
          </header>

          {viewMode === 'list' && (
            <div>
              <div className={`mb-10 p-6 md:p-8 border ${cardClass} luxury-shadow relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-700/50"></div>
                <h3 className={`text-sm font-bold mb-4 tracking-widest ${accentText} flex items-center gap-2 uppercase`}>
                  <span>📢</span> 사무소 공지사항
                </h3>
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed opacity-80 font-light text-stone-300">
                  {announcement}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold tracking-widest uppercase">사건 기록부</h2>
                <button 
                  onClick={() => navigate('write')} 
                  className={`bg-stone-900 hover:bg-stone-800 text-amber-500/90 px-8 py-3 luxury-shadow transition-all border border-stone-700/50 tracking-widest whitespace-nowrap shrink-0`}
                >
                  ✉️ 새 의뢰 접수
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex px-6 py-2 opacity-8 text-xs tracking-widest border-b border-stone-500 mb-3 uppercase">
                  <span className="w-20">상태</span>
                  <span className="flex-1">사건명 (기밀)</span>
                  <span className="w-24 text-right">보안등급</span>
                </div>

                {posts.map(post => (
                  <div 
                    key={post.id} 
                    onClick={() => openPost(post)} 
                    className={`${cardClass} p-6 luxury-shadow cursor-pointer hover:bg-stone-800/50 flex items-center border transition-all duration-300 group`}
                  >
                    <span className="w-20">
                      {post.reply ? 
                        <span className="text-xs bg-stone-800 text-stone-400 px-3 py-1 border border-stone-700">종결</span> : 
                        <span className="text-xs bg-amber-900/20 text-amber-400/80 border border-amber-900/30 px-3 py-1">수사중</span>
                      }
                    </span>
                    <span className="flex-1 font-bold text-lg tracking-wide group-hover:text-amber-500/90 transition-colors">{post.title}</span>
                    <span className="w-24 text-right opacity-60 text-sm">🔒 극비</span>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-24 border border-stone-800/50 bg-[#0f0f0f]">
                    <p className="opacity-40 text-lg tracking-widest">현재 조사 중인 사건이 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {viewMode === 'write' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center border-b border-stone-800 pb-6 tracking-widest text-stone-200">기밀 의뢰서 작성</h2>
              
              <form onSubmit={submitPost} className="space-y-10">
                <div>
                  <label className={`block text-sm tracking-widest font-bold mb-3 ${accentText} uppercase`}>사건 제목</label>
                  <input 
                    type="text" 
                    placeholder="예) 누군가 제 뒤를 쫓고 있습니다." 
                    required 
                    value={newPost.title} 
                    onChange={e => setNewPost({...newPost, title: e.target.value})} 
                    className={`w-full p-5 text-lg border ${inputClass} focus:outline-none focus:border-amber-700/50 transition-colors luxury-shadow`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm tracking-widest font-bold mb-3 ${accentText} uppercase`}>사건 상세 정황</label>
                  <p className="text-xs opacity-40 mb-3 tracking-wider text-stone-300">※ 육하원칙에 따라 자세히 기재해주시면 수사에 큰 도움이 됩니다.</p>
                  <textarea 
                    placeholder="이곳에 기밀 내용을 작성하십시오. 철저히 비밀이 보장됩니다." 
                    required 
                    value={newPost.content} 
                    onChange={e => setNewPost({...newPost, content: e.target.value})} 
                    className={`w-full p-6 h-72 border ${inputClass} focus:outline-none focus:border-amber-700/50 resize-none leading-relaxed transition-colors luxury-shadow`} 
                  />
                </div>

                <div className="bg-[#120a0a] p-8 border border-red-900/30 luxury-shadow">
                  <label className="block text-sm tracking-widest font-bold text-red-500 mb-3 uppercase">의뢰서 열람 비밀번호</label>
                  <p className="text-xs opacity-80 mb-5 text-red-400 tracking-wider">※ 본 의뢰서를 다시 확인하거나 탐정의 답변을 열람할 때 필요합니다.</p>
                  <input 
                    type="password" 
                    placeholder="숫자/문자 등 자유롭게 설정" 
                    required 
                    value={newPost.password} 
                    onChange={e => setNewPost({...newPost, password: e.target.value})} 
                    className={`w-full max-w-sm p-4 border ${inputClass} focus:outline-none focus:border-red-900/50 bg-[#0a0505]`} 
                  />

                  <div className="mt-8 pt-8 border-t border-red-900/20">
                    <label className="block text-sm tracking-widest font-bold text-stone-300 mb-3 uppercase">회신 받으실 연락처 (선택)</label>
                    <p className="text-xs opacity-60 mb-5 text-stone-400 tracking-wider">※ 탐정의 은밀한 연락을 원하신다면 편하신 곳에 남겨주십시오.</p>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input 
                        type="text" 
                        placeholder="전화번호" 
                        value={newPost.phone} 
                        onChange={e => setNewPost({...newPost, phone: e.target.value})} 
                        className={`w-full p-4 border ${inputClass} focus:outline-none focus:border-amber-700/50 bg-[#0a0505] text-sm`} 
                      />
                      <input 
                        type="text" 
                        placeholder="카카오톡 아이디" 
                        value={newPost.kakao} 
                        onChange={e => setNewPost({...newPost, kakao: e.target.value})} 
                        className={`w-full p-4 border ${inputClass} focus:outline-none focus:border-amber-700/50 bg-[#0a0505] text-sm`} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-6 pt-8 border-t border-stone-800">
                  <button type="button" onClick={() => navigate('list')} className="px-6 py-4 opacity-40 hover:opacity-100 font-bold tracking-widest text-sm uppercase transition-opacity whitespace-nowrap">취소</button>
                  <button type="submit" className="bg-stone-900 hover:bg-stone-800 text-amber-500/90 px-10 py-4 font-bold tracking-widest shadow-2xl border border-stone-700/50 uppercase transition-all whitespace-nowrap">의뢰서 봉인 및 제출</button>
                </div>
              </form>
            </div>
          )}

          {viewMode === 'password-check' && (
            <div className="max-w-lg mx-auto mt-24 p-12 border border-stone-800 text-center luxury-shadow relative bg-[#0f0f0f]">
              <div className="text-5xl mb-8 opacity-60 text-amber-600/50">🗝️</div>
              <h2 className="text-2xl font-bold mb-4 tracking-widest">기밀문서 접근</h2>
              <p className="mb-10 opacity-40 text-sm tracking-wider">설정하신 비밀번호를 입력하십시오.</p>
              
              <div className="flex flex-col gap-5">
                <input 
                  type="password" 
                  value={inputPassword} 
                  onChange={e => setInputPassword(e.target.value)} 
                  className={`p-4 text-center border ${inputClass} text-xl tracking-widest`} 
                  placeholder="PASSWORD"
                />
                <button onClick={checkPassword} className="bg-stone-900 text-amber-500/90 p-4 font-bold tracking-widest hover:bg-stone-800 transition-colors border border-stone-700/50 uppercase">문서 열람</button>
              </div>
              <button onClick={() => navigate('list')} className="mt-10 text-xs opacity-30 hover:opacity-100 tracking-widest uppercase transition-opacity">돌아가기</button>
            </div>
          )}

          {viewMode === 'read' && selectedPost && (
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <button onClick={() => navigate('list')} className="opacity-40 hover:opacity-100 flex items-center gap-3 font-bold tracking-widest text-sm uppercase transition-opacity">
                  ⬅ 사건 목록으로
                </button>
                
                {isAdmin && (
                  <button 
                    onClick={() => deletePost(selectedPost.id)} 
                    className="text-red-500/80 hover:text-red-400 font-bold tracking-widest text-sm uppercase transition-colors flex items-center gap-2"
                  >
                    🗑️ 기록 말소
                  </button>
                )}
              </div>
              
              <article className={`p-10 md:p-16 border ${cardClass} luxury-shadow relative bg-[#0f0f0f]`}>
                <div className="absolute top-0 right-0 p-6 opacity-10 text-4xl font-black italic tracking-tighter">CONFIDENTIAL</div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-8 border-b border-stone-800 pb-6 pr-12 tracking-wide leading-snug text-stone-200">{selectedPost.title}</h2>
                
                {isAdmin && (selectedPost.phone || selectedPost.kakao) && (
                  <div className="mb-8 p-6 bg-[#0a0505] border border-amber-900/30 text-stone-300 text-sm tracking-widest">
                    <div className="font-bold text-amber-600/80 mb-4 flex items-center gap-2">
                      <span>👤</span> 의뢰인 연락망 (관리자 전용)
                    </div>
                    <div className="space-y-2 opacity-80">
                      {selectedPost.phone && <div>📞 전화번호: {selectedPost.phone}</div>}
                      {selectedPost.kakao && <div>💬 카카오톡: {selectedPost.kakao}</div>}
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap min-h-[250px] text-lg leading-loose opacity-80 font-light">
                  {selectedPost.content}
                </div>
                
                <div className={`mt-20 p-8 md:p-12 border-t border-stone-800 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0ece1]'}`}>
                  <h3 className={`text-xl font-bold mb-8 flex items-center gap-3 ${accentText} tracking-widest uppercase`}>
                    <span className="text-2xl">🖋</span> 탐정의 회신
                  </h3>
                  
                  {selectedPost.reply ? (
                    <div className="whitespace-pre-wrap text-lg leading-relaxed font-bold opacity-90 text-stone-200">
                      {selectedPost.reply}
                    </div>
                  ) : (
                    <p className="opacity-30 italic tracking-wider">아직 사건을 조사 중입니다. 단서를 수집하고 있습니다.</p>
                  )}

                  {isAdmin && !selectedPost.reply && (
                    <div className="mt-10">
                      <textarea 
                        value={replyContent} 
                        onChange={e => setReplyContent(e.target.value)} 
                        placeholder="의뢰인에게 남길 해결책을 작성하십시오..." 
                        className={`w-full p-6 h-40 border mb-6 ${inputClass} resize-none leading-relaxed bg-[#050505]`} 
                      />
                      <button onClick={submitReply} className="bg-stone-900 hover:bg-stone-800 text-amber-500/90 px-8 py-4 font-bold tracking-widest w-full uppercase border border-stone-700/50 transition-colors">기록 남기기</button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          )}

          {viewMode === 'settings' && isAdmin && (
            <div className="max-w-2xl mx-auto mt-16 p-12 border border-stone-800 luxury-shadow bg-[#0f0f0f]">
              <h2 className="text-2xl font-bold mb-10 border-b border-stone-800 pb-5 tracking-widest uppercase text-stone-200">사무소 환경 설정</h2>
              
              <div className="space-y-10">
                <div>
                  <label className={`block text-sm font-bold mb-3 tracking-widest ${accentText} uppercase`}>탐정 사무소 이름 (타이틀)</label>
                  <input 
                    type="text" 
                    value={siteTitle} 
                    onChange={e => setSiteTitle(e.target.value)} 
                    className={`w-full p-4 border ${inputClass}`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-3 tracking-widest ${accentText} uppercase`}>사무소 공지사항 (자유 양식)</label>
                  <p className="text-xs opacity-40 mb-3 tracking-wider">메인 화면에 노출될 공지사항입니다. 줄바꿈을 포함하여 자유롭게 작성하세요.</p>
                  <textarea 
                    value={announcement} 
                    onChange={e => setAnnouncement(e.target.value)} 
                    className={`w-full p-5 h-32 border ${inputClass} resize-none leading-relaxed`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-3 tracking-widest ${accentText} uppercase`}>관리자(탐정) 비밀번호 변경</label>
                  <p className="text-xs opacity-40 mb-3 tracking-wider">우측 하단 로그인 시 사용할 새 비밀번호를 입력하세요.</p>
                  <input 
                    type="text" 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    className={`w-full p-4 border ${inputClass}`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm font-bold mb-3 tracking-widest ${accentText} uppercase`}>배경 테마</label>
                  <select 
                    value={theme} 
                    onChange={e => setTheme(e.target.value)} 
                    className={`w-full p-4 border ${inputClass}`}
                  >
                    <option value="dark">어두운 테마 (심야의 사무실)</option>
                    <option value="light">밝은 테마 (햇살 드는 사무실)</option>
                  </select>
                </div>
                
                <button onClick={() => navigate('list')} className="bg-stone-900 hover:bg-stone-800 text-amber-500/90 w-full py-5 mt-10 font-bold tracking-widest shadow-2xl border border-stone-700/50 uppercase transition-colors">
                  설정 저장 및 복귀
                </button>
              </div>
            </div>
          )}

        </div>

        {!isAdmin && (
          <form 
            onSubmit={handleAdminLogin} 
            className="fixed bottom-0 right-0 p-6 z-50"
          >
            <input 
              type="password" 
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              className="w-32 bg-transparent text-transparent caret-transparent border-none outline-none focus:text-stone-600 focus:caret-stone-600 transition-colors placeholder-transparent selection:bg-transparent" 
              autoComplete="off"
            />
          </form>
        )}
      </div>
    </>
  );
}