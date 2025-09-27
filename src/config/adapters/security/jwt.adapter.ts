import { sign, verify } from 'jsonwebtoken';

export class JwtAdapter {
  public async generateToken(
    payload: Record<string, any>,
  ): Promise<string | null> {
    return new Promise((resolve) => {
      sign(
        payload,
        String(process.env.JWT_SECRET),
        { expiresIn: '1d' },
        (err, token: string) => {
          if (err) {
            resolve(null);
          }

          resolve(token);
        },
      );
    });
  }

  public async verifyToken<T>(token: string): Promise<T> {
    return new Promise((resolve) => {
      verify(token, String(process.env.JWT_SECRET), (err, decoded) => {
        if (err) {
          resolve(null as T);
        }

        resolve(decoded as T);
      });
    });
  }
}
