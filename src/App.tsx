import React, { useState, useEffect } from 'react';

export default function App() {
  // 💾 브라우저 기억 장치에서 설정값을 불러옵니다. (새로고침해도 안 날아감)
  const [adminPassword, setAdminPassword] = useState(() => localStorage.getItem('adminPassword') || 'admin123');
  const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('siteTitle') || '너고해 : 너의 고민을 해결할게');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState(''); 
  
  const [posts, setPosts] = useState([
    { id: 1, title: '첫 번째 의뢰건 (기밀)', content: '요즘 누군가 저를 미행하는 것 같습니다...', password: '1234', reply: '탐정이 사건에 착수했습니다. 안심하십시오.' }
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', password: '' });
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list');
  const [inputPassword, setInputPassword] = useState('');
  const [replyContent, setReplyContent] = useState('');

  // 💾 설정이 변경될 때마다 브라우저 기억 장치에 자동으로 영구 저장합니다.
  useEffect(() => {
    localStorage.setItem('adminPassword', adminPassword);
    localStorage.setItem('siteTitle', siteTitle);
    localStorage.setItem('theme', theme);
  }, [adminPassword, siteTitle, theme]);

  // 🕵️‍♂️ 숨겨진 로그인 처리 (엔터키 쳤을 때 작동)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminInput === adminPassword) {
      setIsAdmin(true);
      setAdminInput('');
      alert('관리자(탐정) 모드로 전환되었습니다.');
    } else {
      setAdminInput(''); // 틀리면 조용히 입력값만 지웁니다.
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setViewMode('list');
  };

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.password) return alert('모든 항목을 기입해 주십시오.');
    const post = { id: Date.now(), ...newPost, reply: '' };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', password: '' });
    setViewMode('list');
  };

  const openPost = (post: any) => {
    if (isAdmin) {
      setSelectedPost(post);
      setViewMode('read');
    } else {
      setSelectedPost(post);
      setViewMode('password-check');
    }
  };

  const checkPassword = () => {
    if (inputPassword === selectedPost.password) {
      setViewMode('read');
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

  // 🎨 고급 럭셔리 테마 색상 설정
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-[#0c0c0c]' : 'bg-[#f4f1ea]';
  const textClass = isDark ? 'text-stone-300' : 'text-stone-800';
  const cardClass = isDark ? 'bg-[#141414] border-stone-800' : 'bg-white border-stone-300';
  const inputClass = isDark ? 'bg-[#0a0a0a] border-stone-700 text-stone-200' : 'bg-[#faf9f6] border-stone-300 text-stone-900';
  const accentText = isDark ? 'text-amber-600/80' : 'text-amber-800';
  const accentBorder = isDark ? 'border-amber-600/30' : 'border-amber-800/30';

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

        <div className="max-w-5xl mx-auto p-6 md:p-10 relative z-10">
          
          {/* 헤더 (관리자 메뉴 가로 한 줄 고정) */}
          <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 border-b border-stone-700/50 pb-8">
            <div className="cursor-pointer text-center md:text-left whitespace-nowrap" onClick={() => setViewMode('list')}>
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
                <button onClick={() => setViewMode('settings')} className="text-stone-400 hover:text-amber-500 transition-colors uppercase tracking-widest text-xs">⚙️ 사무소 설정</button>
                <button onClick={handleAdminLogout} className="text-stone-400 hover:text-red-400 transition-colors uppercase tracking-widest text-xs">👤 퇴근하기</button>
              </div>
            )}
          </header>

          {/* 게시판 목록 */}
          {viewMode === 'list' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className={`text-2xl font-bold tracking-widest border-l-2 ${accentBorder} pl-4 uppercase`}>사건 기록부</h2>
                <button 
                  onClick={() => setViewMode('write')} 
                  className={`bg-stone-900 hover:bg-stone-800 text-amber-500/90 px-8 py-3 luxury-shadow transition-all border border-stone-700/50 tracking-widest whitespace-nowrap shrink-0`}
                >
                  ✉️ 새 의뢰 접수
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex px-6 py-3 opacity-40 text-xs tracking-widest border-b border-stone-800 mb-6 uppercase">
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
                        <span className="text-xs bg-amber-900/20 text-amber-500/80 border border-amber-900/30 px-3 py-1">수사중</span>
                      }
                    </span>
                    <span className="flex-1 font-bold text-lg tracking-wide group-hover:text-amber-500/90 transition-colors">{post.title}</span>
                    <span className="w-24 text-right opacity-40 text-sm">🔒 극비</span>
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

          {/* 글쓰기 */}
          {viewMode === 'write' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-10 text-center border-b border-stone-800 pb-6 tracking-widest">기밀 의뢰서 작성</h2>
              
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
                  <p className="text-xs opacity-40 mb-3 tracking-wider">※ 육하원칙에 따라 자세히 기재해주시면 수사에 큰 도움이 됩니다.</p>
                  <textarea 
                    placeholder="이곳에 기밀 내용을 작성하십시오. 철저히 비밀이 보장됩니다." 
                    required 
                    value={newPost.content} 
                    onChange={e => setNewPost({...newPost, content: e.target.value})} 
                    className={`w-full p-6 h-72 border ${inputClass} focus:outline-none focus:border-amber-700/50 resize-none leading-relaxed transition-colors luxury-shadow`} 
                  />
                </div>

                <div className="bg-[#120a0a] p-8 border border-red-900/20 luxury-shadow">
                  <label className="block text-sm tracking-widest font-bold text-red-800/80 mb-3 uppercase">의뢰서 열람 비밀번호</label>
                  <p className="text-xs opacity-50 mb-5 text-red-700/60 tracking-wider">※ 본 의뢰서를 다시 확인하거나 탐정의 답변을 열람할 때 필요합니다.</p>
                  <input 
                    type="password" 
                    placeholder="숫자/문자 등 자유롭게 설정" 
                    required 
                    value={newPost.password} 
                    onChange={e => setNewPost({...newPost, password: e.target.value})} 
                    className={`w-full max-w-sm p-4 border ${inputClass} focus:outline-none focus:border-red-900/50 bg-[#0a0505]`} 
                  />
                </div>

                <div className="flex justify-end gap-6 pt-8 border-t border-stone-800">
                  <button type="button" onClick={() => setViewMode('list')} className="px-6 py-4 opacity-40 hover:opacity-100 font-bold tracking-widest text-sm uppercase transition-opacity whitespace-nowrap">취소</button>
                  <button type="submit" className="bg-stone-900 hover:bg-stone-800 text-amber-500/90 px-10 py-4 font-bold tracking-widest shadow-2xl border border-stone-700/50 uppercase transition-all whitespace-nowrap">의뢰서 봉인 및 제출</button>
                </div>
              </form>
            </div>
          )}

          {/* 비밀번호 확인 */}
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
              <button onClick={() => setViewMode('list')} className="mt-10 text-xs opacity-30 hover:opacity-100 tracking-widest uppercase transition-opacity">돌아가기</button>
            </div>
          )}

          {/* 글 읽기 */}
          {viewMode === 'read' && selectedPost && (
            <div className="max-w-4xl mx-auto">
              <button onClick={() => setViewMode('list')} className="mb-8 opacity-40 hover:opacity-100 flex items-center gap-3 font-bold tracking-widest text-sm uppercase transition-opacity">
                ⬅ 사건 목록으로
              </button>
              
              <article className={`p-10 md:p-16 border ${cardClass} luxury-shadow relative bg-[#0f0f0f]`}>
                <div className="absolute top-0 right-0 p-6 opacity-10 text-4xl font-black italic tracking-tighter">CONFIDENTIAL</div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-8 border-b border-stone-800 pb-6 pr-12 tracking-wide leading-snug">{selectedPost.title}</h2>
                <div className="whitespace-pre-wrap min-h-[250px] text-lg leading-loose opacity-80 font-light">
                  {selectedPost.content}
                </div>
                
                {/* 탐정 답변 영역 */}
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

          {/* 설정 */}
          {viewMode === 'settings' && isAdmin && (
            <div className="max-w-2xl mx-auto mt-16 p-12 border border-stone-800 luxury-shadow bg-[#0f0f0f]">
              <h2 className="text-2xl font-bold mb-10 border-b border-stone-800 pb-5 tracking-widest uppercase">사무소 환경 설정</h2>
              
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
                
                <button onClick={() => setViewMode('list')} className="bg-stone-900 hover:bg-stone-800 text-amber-500/90 w-full py-5 mt-10 font-bold tracking-widest shadow-2xl border border-stone-700/50 uppercase transition-colors">
                  설정 저장 및 복귀
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 🕵🏻‍♂️ 아무것도 보이지 않는 완벽한 은신 로그인 영역 */}
        {!isAdmin && (
          <form 
            onSubmit={handleAdminLogin} 
            className="fixed bottom-0 right-0 p-6 z-50"
          >
            <input 
              type="password" 
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              // 글자색, 커서(깜빡이는 선), 배경색 모두 투명하게 처리하여 100% 감춤
              className="w-16 bg-transparent text-transparent border-none outline-none caret-transparent selection:bg-transparent" 
              autoComplete="off"
            />
          </form>
        )}
      </div>
    </>
  );
}