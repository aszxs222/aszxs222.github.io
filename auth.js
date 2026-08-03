/* =====================================================================
 * 认证逻辑集中层 —— 全站统一的登录 / 注册 / 退出 / 会话管理
 * ---------------------------------------------------------------------
 * 任何页面只需：
 *   <script src="...supabase.min.js"></script>
 *   <script src="/config.js"></script>
 *   <script src="/auth.js"></script>
 * 之后即可直接调用下面的函数，无需再写 supabase.auth.* 细节。
 *
 * 设计原则：
 *   - auth.js 只管「认证动作」，不碰页面 UI（加载态 / 消息提示由页面处理）。
 *   - 数据安全依赖 Supabase 的 RLS；前端只持有 anon 公钥，Token 的存储/刷新/
 *     销毁全部交给 Supabase SDK（存于浏览器 localStorage）。
 *   - cookie（asxs_logged_in）仅用作「即时 UI 门控」的快判标志；真正启用功能
 *     前，页面仍应以 isLoggedIn() / getCurrentUser()（基于 getSession）为准。
 * ===================================================================== */

const AUTH_COOKIE = 'asxs_logged_in';

/* ---------- cookie 辅助（仅存布尔标志，非 token）---------- */
function setLoggedInCookie() {
  // path=/ 让全站可读；max-age 7天，仅作 UI 快判
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}
function clearLoggedInCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/* ---------- 登录 ---------- */
// 返回 { error } —— error 为 null 表示成功
async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (!error) setLoggedInCookie();
  return { error };
}

/* ---------- 注册 ---------- */
// 返回 { data, error }。注意：若 Supabase 开启邮箱确认，signUp 不会立即产生
// session，需用户点邮件链接验证后才能登录。页面应据此给出提示，而非直接跳 dashboard。
async function register(email, username, password) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: username || email.split('@')[0] }
    }
  });
}

/* ---------- 退出 ---------- */
async function logout() {
  await supabase.auth.signOut();
  clearLoggedInCookie();
  window.location.href = '/';
}

/* ---------- 当前用户 ---------- */
// 基于 getSession()（权威），返回 user 或 null
async function getCurrentUser() {
  const { data } = await supabase.auth.getSession();
  return data.session ? data.session.user : null;
}

/* ---------- 是否已登录（权威，async）---------- */
async function isLoggedIn() {
  return (await getCurrentUser()) !== null;
}

/* ---------- 是否已登录（同步快判，仅 UI 用）---------- */
function isLoggedInSync() {
  return document.cookie.split(';').some(c => c.trim().startsWith(AUTH_COOKIE + '=1'));
}

/* ---------- 取展示用昵称 ---------- */
function displayName(user) {
  if (!user) return '游客';
  return user.user_metadata?.username || user.email?.split('@')[0] || '用户';
}
