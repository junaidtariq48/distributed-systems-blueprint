import jwt from 'jsonwebtoken';

export type PublicJwtPayload = {
  sub: string; // user id
  email: string;
};

export type InternalJwtPayload = {
  iss: 'api-gateway';
  aud: string; // INTERNAL_AUDIENCE
  sub: string; // gateway service identity
};

export function signPublicJwt(payload: PublicJwtPayload) {
  const secret = process.env.PUBLIC_JWT_SECRET!;
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '2h' });
}

export function verifyPublicJwt(token: string): PublicJwtPayload {
  const secret = process.env.PUBLIC_JWT_SECRET!;
  return jwt.verify(token, secret, { algorithms: ['HS256'] }) as PublicJwtPayload;
}

export function signInternalJwt() {
  const secret = process.env.INTERNAL_JWT_SECRET!;
  const aud = process.env.INTERNAL_AUDIENCE || 'internal-services';
  const payload: InternalJwtPayload = {
    iss: 'api-gateway',
    aud,
    sub: 'api-gateway',
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '5m' });
}

export function verifyInternalJwt(token: string): InternalJwtPayload {
  const secret = process.env.INTERNAL_JWT_SECRET!;
  const aud = process.env.INTERNAL_AUDIENCE || 'internal-services';
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
    audience: aud,
  }) as InternalJwtPayload;
}
