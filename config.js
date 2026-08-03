/* =====================================================================
 * 全局配置 —— 全站唯一的 Supabase 配置入口
 * ---------------------------------------------------------------------
 * 修改 Supabase 地址 / 密钥时，只改这一个文件，全站所有页面都会同步生效。
 * 前端只用 anon 公钥；service_role 私钥绝不放进前端代码。
 * 数据安全由 Supabase 的 RLS（行级安全策略）保障。
 * ===================================================================== */

const SUPABASE_URL = 'https://vdkxbznzzkazzassxydd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__Wq6-zuT78CA1wV_on0T7A_v1T1qCch';

// 用 window.supabase 读取 UMD 全局命名空间，避免与本地 const supabase 的 TDZ 冲突。
// 顶层 const 在经典脚本中处于共享的全局词法环境，后续加载的 auth.js / 各页面脚本都能直接访问 `supabase`。
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 暴露给 window，方便在控制台调试（可选）。
window.SUPABASE_URL = SUPABASE_URL;
