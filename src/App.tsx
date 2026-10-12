import React, { useState } from 'react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState(''); // 우측 하단 로그인용 입력값
  const [adminPassword, setAdminPassword] = useState('admin123'); // 실제 관리자 비밀번호
  const [siteTitle, setSiteTitle] = useState('너고해 : 탐정 사무소');
  const [theme, setTheme] = useState('dark');
  
  const [posts, setPosts] = useState([
    { id: 1, title: '첫 번째 의뢰건 (기밀)', content: '요즘 누군가 저를 미행하는 것 같습니다...', password: '1234', reply: '탐정이 사건에 착수했습니다. 안심하십시오.' }
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', password: '' });
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list'); // list, write, read, settings, password-check
  const [inputPassword, setInputPassword] = useState('');
  const [replyContent, setReplyContent] = useState('');

  // 🕵️‍♂️ 숨겨진 로그인 처리
  const handleAdminLogin = () => {
    if (adminInput === adminPassword) {
      setIsAdmin(true);
      setAdminInput('');
      alert('관리자(탐정) 모드로 전환되었습니다.');
    } else {
      alert('접근 권한이 없습니다.');
      setAdminInput('');
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

  // 🎨 테마 설정
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-zinc-950' : 'bg-stone-200';
  const textClass = isDark ? 'text-stone-300' : 'text-stone-900';
  const cardClass = isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-stone-300';
  const inputClass = isDark ? 'bg-zinc-950 border-zinc-700 text-stone-200' : 'bg-stone-50 border-stone-300 text-stone-900';
  
  // 숨겨진 로그인 칸 색상 (배경과 동일하게 맞춤)
  const hiddenColor = isDark ? '#09090b' : '#e5e5e4';

  return (
    <>
      {/* 폰트 및 배경 특수 효과 스타일 삽입 */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
          .detective-font { font-family: 'Nanum Myeongjo', serif; }
          .bg-vignette {
            background-image: radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%);
          }
        `}
      </style>

      <div className={`min-h-screen ${bgClass} ${textClass} detective-font relative`}>
        {/* 비네팅 효과 (가장자리를 어둡게) */}
        <div className="absolute inset-0 bg-vignette pointer-events-none"></div>

        <div className="max-w-4xl mx-auto p-8 relative z-10">
          
          {/* 헤더 */}
          <header className="flex justify-between items-end mb-12 border-b border-stone-500 pb-6">
            <div className="cursor-pointer" onClick={() => setViewMode('list')}>
              <h1 className="text-4xl font-extrabold tracking-widest text-indigo-800/80 drop-shadow-sm flex items-center gap-3">
                <span className="text-5xl">🕵🏻‍♂️</span> {siteTitle}
              </h1>
              <p className="text-sm mt-2 opacity-70 italic tracking-wide">"모든 불가능을 제외하고 남은 것, 그것이 아무리 믿기 힘들지라도 진실이다."</p>
            </div>
            
            {/* 관리자 전용 상단 메뉴 */}
            {isAdmin && (
              <div className="flex gap-4 font-bold text-sm">
                <button onClick={() => setViewMode('settings')} className="hover:text-indigo-400">⚙️ 사무소 설정</button>
                <button onClick={handleAdminLogout} className="hover:text-red-400">👤 퇴근하기</button>
              </div>
            )}
          </header>

          {/* 📋 게시판 (사건 목록) */}
          {viewMode === 'list' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold tracking-wider border-l-4 border-indigo-800 pl-3">사건 기록부</h2>
                <button 
                  onClick={() => setViewMode('write')} 
                  className="bg-indigo-900 hover:bg-indigo-800 text-stone-200 px-6 py-2 shadow-lg transition-colors border border-indigo-700"
                >
                  ✉️ 새 의뢰 접수
                </button>
              </div>
              
              <div className="space-y-3">
                {/* 리스트 헤더 */}
                <div className="flex px-4 py-2 opacity-50 text-sm border-b border-stone-500 mb-4">
                  <span className="w-16">상태</span>
                  <span className="flex-1">사건명 (비밀글)</span>
                  <span className="w-24 text-right">보안</span>
                </div>

                {posts.map(post => (
                  <div 
                    key={post.id} 
                    onClick={() => openPost(post)} 
                    className={`${cardClass} p-4 shadow-md cursor-pointer hover:bg-indigo-900/10 flex items-center border transition-all duration-200`}
                  >
                    <span className="w-16">
                      {post.reply ? <span className="text-xs bg-stone-700 text-stone-300 px-2 py-1">종결</span> : <span className="text-xs border border-indigo-500 text-indigo-500 px-2 py-1">수사중</span>}
                    </span>
                    <span className="flex-1 font-bold text-lg tracking-wide">{post.title}</span>
                    <span className="w-24 text-right opacity-60">🔒 비밀글</span>
                  </div>
                ))}
                {posts.length === 0 && <p className="text-center opacity-50 py-16 text-lg">현재 조사 중인 사건이 없습니다.</p>}
              </div>
            </div>
          )}

          {/* 📝 의뢰하기 (세로형 정돈) */}
          {viewMode === 'write' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center border-b border-stone-500 pb-4">기밀 의뢰서 작성</h2>
              
              <form onSubmit={submitPost} className="space-y-8">
                {/* 1. 사건 제목 */}
                <div>
                  <label className="block text-lg font-bold mb-2">사건 제목</label>
                  <input 
                    type="text" 
                    placeholder="예) 누군가 제 뒤를 쫓고 있습니다." 
                    required 
                    value={newPost.title} 
                    onChange={e => setNewPost({...newPost, title: e.target.value})} 
                    className={`w-full p-4 text-lg border ${inputClass} focus:outline-none focus:border-indigo-600 transition-colors`} 
                  />
                </div>

                {/* 2. 상담 내용 */}
                <div>
                  <label className="block text-lg font-bold mb-2">사건 상세 정황</label>
                  <p className="text-sm opacity-60 mb-2">※ 육하원칙에 따라 자세히 기재해주시면 수사에 큰 도움이 됩니다.</p>
                  <textarea 
                    placeholder="이곳에 기밀 내용을 작성하십시오. 철저히 비밀이 보장됩니다." 
                    required 
                    value={newPost.content} 
                    onChange={e => setNewPost({...newPost, content: e.target.value})} 
                    className={`w-full p-4 h-64 border ${inputClass} focus:outline-none focus:border-indigo-600 resize-none leading-relaxed transition-colors`} 
                  />
                </div>

                {/* 3. 비밀번호 */}
                <div className="bg-red-900/10 p-6 border border-red-900/30">
                  <label className="block text-lg font-bold text-red-700/80 mb-2">의뢰서 열람 비밀번호</label>
                  <p className="text-sm opacity-80 mb-4 text-red-700/60">※ 본 의뢰서를 다시 확인하거나 탐정의 답변을 열람할 때 필요합니다.</p>
                  <input 
                    type="password" 
                    placeholder="숫자/문자 등 자유롭게 설정" 
                    required 
                    value={newPost.password} 
                    onChange={e => setNewPost({...newPost, password: e.target.value})} 
                    className={`w-full max-w-xs p-3 border ${inputClass} focus:outline-none focus:border-red-600`} 
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-stone-500">
                  <button type="button" onClick={() => setViewMode('list')} className="px-6 py-3 opacity-60 hover:opacity-100 font-bold">취소</button>
                  <button type="submit" className="bg-indigo-900 hover:bg-indigo-800 text-stone-200 px-8 py-3 font-bold tracking-widest text-lg shadow-lg">의뢰서 봉인 및 제출</button>
                </div>
              </form>
            </div>
          )}

          {/* 🔒 비밀번호 확인 화면 */}
          {viewMode === 'password-check' && (
            <div className="max-w-md mx-auto mt-20 p-10 border border-stone-500 text-center shadow-2xl relative bg-black/20">
              <div className="text-6xl mb-6 opacity-80">🗝️</div>
              <h2 className="text-2xl font-bold mb-2 tracking-widest">기밀문서 접근</h2>
              <p className="mb-8 opacity-60">설정하신 비밀번호를 입력하십시오.</p>
              
              <div className="flex flex-col gap-4">
                <input 
                  type="password" 
                  value={inputPassword} 
                  onChange={e => setInputPassword(e.target.value)} 
                  className={`p-3 text-center border ${inputClass}`} 
                  placeholder="비밀번호"
                />
                <button onClick={checkPassword} className="bg-indigo-900 text-white p-3 font-bold tracking-widest hover:bg-indigo-800 transition-colors">문서 열람</button>
              </div>
              <button onClick={() => setViewMode('list')} className="mt-8 text-sm opacity-50 underline">돌아가기</button>
            </div>
          )}

          {/* 📖 글 읽기 & 탐정 답변 */}
          {viewMode === 'read' && selectedPost && (
            <div className="max-w-3xl mx-auto">
              <button onClick={() => setViewMode('list')} className="mb-6 opacity-60 hover:opacity-100 flex items-center gap-2 font-bold">
                ⬅ 사건 목록으로
              </button>
              
              <article className={`p-8 md:p-12 border ${cardClass} shadow-xl relative`}>
                <div className="absolute top-0 right-0 p-4 opacity-30 text-4xl font-black italic">CONFIDENTIAL</div>
                
                <h2 className="text-3xl font-bold mb-6 border-b border-stone-500 pb-4 pr-10">{selectedPost.title}</h2>
                <div className="whitespace-pre-wrap min-h-[200px] text-lg leading-loose opacity-90">
                  {selectedPost.content}
                </div>
                
                {/* 탐정 답변 영역 */}
                <div className={`mt-16 p-6 md:p-8 border-t-4 border-indigo-900 ${isDark ? 'bg-zinc-950' : 'bg-stone-100'}`}>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-700">
                    <span className="text-2xl">🖋</span> 탐정의 회신
                  </h3>
                  
                  {selectedPost.reply ? (
                    <div className="whitespace-pre-wrap text-lg leading-relaxed font-bold opacity-80">
                      {selectedPost.reply}
                    </div>
                  ) : (
                    <p className="opacity-50 italic">아직 사건을 조사 중입니다. 단서를 수집하고 있습니다.</p>
                  )}

                  {/* 관리자 답변 폼 */}
                  {isAdmin && !selectedPost.reply && (
                    <div className="mt-6">
                      <textarea 
                        value={replyContent} 
                        onChange={e => setReplyContent(e.target.value)} 
                        placeholder="의뢰인에게 남길 해결책을 작성하십시오..." 
                        className={`w-full p-4 h-32 border mb-4 ${inputClass} resize-none`} 
                      />
                      <button onClick={submitReply} className="bg-indigo-900 hover:bg-indigo-800 text-white px-6 py-2 font-bold tracking-widest w-full">기록 남기기</button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          )}

          {/* ⚙️ 설정 (관리자 전용) */}
          {viewMode === 'settings' && isAdmin && (
            <div className="max-w-xl mx-auto mt-10">
              <h2 className="text-3xl font-bold mb-8 border-b border-stone-500 pb-4">사무소 환경 설정</h2>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-lg font-bold mb-2">탐정 사무소 이름 (타이틀)</label>
                  <input 
                    type="text" 
                    value={siteTitle} 
                    onChange={e => setSiteTitle(e.target.value)} 
                    className={`w-full p-3 border ${inputClass}`} 
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">관리자(탐정) 비밀번호 변경</label>
                  <p className="text-sm opacity-60 mb-2">우측 하단 로그인 시 사용할 새 비밀번호를 입력하세요.</p>
                  <input 
                    type="text" 
                    value={adminPassword} 
                    onChange={e => setAdminPassword(e.target.value)} 
                    className={`w-full p-3 border ${inputClass}`} 
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-2">배경 테마</label>
                  <select 
                    value={theme} 
                    onChange={e => setTheme(e.target.value)} 
                    className={`w-full p-3 border ${inputClass}`}
                  >
                    <option value="dark">어두운 테마 (심야의 사무실)</option>
                    <option value="light">밝은 테마 (햇살 드는 사무실)</option>
                  </select>
                </div>
                
                <button onClick={() => setViewMode('list')} className="bg-indigo-900 hover:bg-indigo-800 text-white w-full py-4 mt-8 font-bold tracking-widest text-lg shadow-lg">
                  설정 저장 및 복귀
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 🕵🏻‍♂️ 은밀한 로그인 영역 (우측 하단 고정) */}
        {!isAdmin && (
          <div className="fixed bottom-0 right-0 p-4 z-50 flex items-center">
            {/* 글자색을 배경색과 똑같이 맞추고, 드래그(선택) 했을 때만 보이게 설정 */}
            <input 
              type="password" 
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
              className="w-24 outline-none border-none text-xs selection:bg-indigo-500 selection:text-white"
              style={{ backgroundColor: 'transparent', color: hiddenColor }} 
              placeholder="secret"
            />
            <button 
              onClick={handleAdminLogin} 
              className="text-xs selection:bg-indigo-500 selection:text-white px-2 py-1"
              style={{ backgroundColor: 'transparent', color: hiddenColor }}
            >
              Enter
            </button>
          </div>
        )}
      </div>
    </>
  );
}