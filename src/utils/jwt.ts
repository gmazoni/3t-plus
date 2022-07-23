import { SignJWT, jwtVerify } from 'jose'

export function signJwt(payload: object) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 60 * 60 * 24 * 365 // 365

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.SECRET))
}

export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET))
  return payload
}
