/**
 * Decodifica um token JWT sem verificação (apenas para obter dados do payload)
 * @param {string} token 
 * @returns {object|null}
 */
export function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Obtém o role do usuário do token
 * @param {string} token 
 * @returns {string|null}
 */
export function getUserRole(token) {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

/**
 * Obtém o userId do token
 * @param {string} token 
 * @returns {number|null}
 */
export function getUserId(token) {
  const decoded = decodeToken(token);
  return decoded?.userId || null;
}

