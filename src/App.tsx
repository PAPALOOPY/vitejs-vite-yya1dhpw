import React, { useState } from 'react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [siteTitle, setSiteTitle] = useState('너고해 : 너의 모든 고민을 해결할게');
  const [theme, setTheme] = useState('dark');
  
  const [posts, setPosts] = useState([
    { id: 1, title: '첫 번째 의뢰', content: '고민이 있습니다...', password: '1234', reply: '' }
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', password: '' });
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [viewMode, setViewMode] = useState('list'); // list, write, read, settings
  const [inputPassword, setInputPassword] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setAdminPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setViewMode('list');
  };

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.password) return alert('모두 입력해주세요.');
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

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const cardColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} p-8 font-sans`}>
      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <header className="flex justify-between items-center mb-10 border-b-2 border-gray-500 pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('list')}>
            🔎 {siteTitle}
          </h1>
          <div>
            {isAdmin ? (
              <div className="flex gap-4">
                <button onClick={() => setViewMode('settings')} className="flex items-center gap-1 hover:text-gray-400">⚙️ 설정</button>
                <button onClick={handleAdminLogout} className="flex items-center gap-1 hover:text-gray-400">👤 로그아웃</button>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input 
                  type="password" 
                  placeholder="관리자 비밀번호" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="px-2 py-1 text-black rounded text-sm w-32 border border-gray-300"
                />
                <button onClick={handleAdminLogin} className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm text-white">탐정 로그인</button>
              </div>
            )}
          </div>
        </header>

        {/* 게시판 목록 */}
        {viewMode === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">비밀 의뢰서 목록</h2>
              <button onClick={() => setViewMode('write')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow">
                의뢰하기
              </button>
            </div>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} onClick={() => openPost(post)} className={`${cardColor} p-4 rounded shadow cursor-pointer hover:opacity-80 flex justify-between items-center border border-gray-700`}>
                  <div className="flex items-center gap-3">
                    <span>🔒</span>
                    <span className="font-medium">{post.title}</span>
                  </div>
                  {post.reply && <span className="text-xs bg-green-800 text-green-100 px-2 py-1 rounded">해결 완료</span>}
                </div>
              ))}
              {posts.length === 0 && <p className="text-center text-gray-500 py-10">아직 접수된 의뢰가 없습니다.</p>}
            </div>
          </div>
        )}

        {/* 글쓰기 */}
        {viewMode === 'write' && (
          <div className={`${cardColor} p-6 rounded shadow border border-gray-700`}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">💬 새 의뢰 작성 (비밀보장)</h2>
            <form onSubmit={submitPost} className="space-y-4">
              <input type="text" placeholder="사건 제목" required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="w-full p-2 rounded text-black border border-gray-300" />
              <textarea placeholder="고민 내용을 상세히 적어주세요." required value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="w-full p-2 rounded text-black h-40 border border-gray-300" />
              <input type="password" placeholder="비밀번호 설정 (글 확인할 때 필요)" required value={newPost.password} onChange={e => setNewPost({...newPost, password: e.target.value})} className="w-full p-2 rounded text-black border border-gray-300" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setViewMode('list')} className="px-4 py-2 text-gray-400">취소</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">의뢰 접수</button>
              </div>
            </form>
          </div>
        )}

        {/* 비밀번호 확인 */}
        {viewMode === 'password-check' && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl mb-4">비밀 의뢰서입니다. 비밀번호를 입력하세요.</h2>
            <div className="flex justify-center gap-2">
              <input type="password" value={inputPassword} onChange={e => setInputPassword(e.target.value)} className="p-2 rounded text-black border border-gray-300" />
              <button onClick={checkPassword} className="bg-indigo-600 px-4 py-2 rounded text-white">확인</button>
            </div>
            <button onClick={() => setViewMode('list')} className="mt-4 text-gray-500 underline">돌아가기</button>
          </div>
        )}

        {/* 글 읽기 */}
        {viewMode === 'read' && selectedPost && (
          <div className={`${cardColor} p-6 rounded shadow border border-gray-700`}>
            <button onClick={() => setViewMode('list')} className="flex items-center gap-1 text-gray-400 mb-4 hover:text-gray-200">⬅️ 목록으로</button>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-600 pb-2">{selectedPost.title}</h2>
            <p className="whitespace-pre-wrap mb-10 min-h-[100px]">{selectedPost.content}</p>
            
            {/* 답변 영역 */}
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h3 className="font-bold flex items-center gap-2 mb-2">🔎 탐정의 답변</h3>
              {selectedPost.reply ? (
                <p className="text-indigo-300">{selectedPost.reply}</p>
              ) : (
                <p className="text-gray-500 italic">아직 탐정이 사건을 조사 중입니다.</p>
              )}

              {/* 관리자 답변 작성폼 */}
              {isAdmin && !selectedPost.reply && (
                <div className="mt-4 flex gap-2">
                  <textarea value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="해결책을 제시하세요..." className="w-full p-2 rounded text-black text-sm border border-gray-300" />
                  <button onClick={submitReply} className="bg-green-700 hover:bg-green-600 text-white px-4 rounded flex items-center gap-1">✉️ 등록</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 설정 (관리자 전용) */}
        {viewMode === 'settings' && isAdmin && (
          <div className={`${cardColor} p-6 rounded shadow border border-gray-700`}>
            <h2 className="text-xl font-semibold mb-6">사무소 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">탐정 사무소 이름</label>
                <input type="text" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} className="w-full p-2 rounded text-black border border-gray-300" />
              </div>
              <div>
                <label className="block text-sm mb-1">배경 테마</label>
                <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full p-2 rounded text-black border border-gray-300">
                  <option value="dark">어두운 테마 (탐정 스타일)</option>
                  <option value="light">밝은 테마 (일반 스타일)</option>
                </select>
              </div>
              <button onClick={() => setViewMode('list')} className="bg-indigo-600 w-full py-2 rounded text-white mt-4">저장하고 돌아가기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}