// google
export const google_uri = process.env.GOOGLE_AUTH_URI;
export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
export const google_token_uri = process.env.GOOGLE_TOKEN_URI ?? "";

// redirect
export const redirect_uri = process.env.REDIRECT_URI ?? "";

// jwt
export const jwt_secret = process.env.JWT_SECRET ?? "";
const jwt_expiry_str = process.env.JWT_EXPIRY ?? "86400";
export const jwt_expiry = parseInt(jwt_expiry_str);
export const node_env = process.env.NODE_ENV ?? "development";

// github
export const github_client_id = process.env.GITHUB_CLIENT_ID ?? "";
export const github_client_secret = process.env.GITHUB_CLIENT_SECRET ?? "";
export const github_auth_uri = process.env.GITHUB_AUTH_URI ?? "";
export const github_token_uri = process.env.GITHUB_TOKEN_URI ?? "";
export const github_profile_uri = process.env.GITHUB_PROFILE_URI ?? "";

// supabase
export const supabase_url = process.env.SUPABASE_URL ?? "";
export const supabase_anon_key = process.env.SUPABASE_ANON_KEY ?? "";