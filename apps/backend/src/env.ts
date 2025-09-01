// google
export const google_uri = process.env.GOOGLE_AUTH_URI;
export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
export const google_token_uri = process.env.GOOGLE_TOKEN_URI || "";

// redirect
export const redirect_uri = process.env.REDIRECT_URI || "";

// jwt
export const jwt_secret = process.env.JWT_SECRET || "";
export const jwt_expiry = process.env.JWT_EXPIRY || "1h";
export const node_env = process.env.NODE_ENV || "development";

// github
export const github_client_id = process.env.GITHUB_CLIENT_ID || "";
export const github_client_secret = process.env.GITHUB_CLIENT_SECRET || "";
export const github_auth_uri = process.env.GITHUB_AUTH_URI || "";
export const github_token_uri = process.env.GITHUB_TOKEN_URI || "";