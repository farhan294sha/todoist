import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../db";
import { config } from "../secrets";

export function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        const userId = profile.id;
        let user = await prisma.user.findUnique({
          where: {
            googleId: userId,
          },
          select: {
            id: true,
            email: true,
            name: true,
            picture: true,
          },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile._json.email!,
              googleId: profile.id,
              picture: profile._json.picture,
            },
            select: {
              id: true,
              email: true,
              name: true,
              picture: true,
            },
          });
        }
        return cb(null, user)
      }
    )
  );
}
