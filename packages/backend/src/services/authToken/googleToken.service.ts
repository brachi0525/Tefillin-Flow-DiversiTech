import axios from "axios";
import { UserRepository } from "../../repositories/userRepository";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const googleAuthService = {
  exchangeCodeAndGetUser: async (code: string, redirectUri: string) => {
    const tokenResponse = await axios.post(
      GOOGLE_TOKEN_URL,
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, id_token } = tokenResponse.data;
    if (!access_token || !id_token) return null;

    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const googleUser = userInfoResponse.data;
    if (!googleUser?.sub || !googleUser?.email) return null;

    const userRepo = new UserRepository();

    // Try to find user by google_id
    let user = await userRepo.getByGoogleId(googleUser.sub);

    // If not found, try by email
    if (!user) {
      user = await userRepo.findOne({ email: googleUser.email });

      if (user) {
        user = await userRepo.update(user.id, {
          google_id: googleUser.sub,
          profileImageUrl: googleUser.picture,
        });
      }
    }

    // If user not found, reject
    if (!user) return null;

    // Update tokens and profile
    const updatedUser = await userRepo.update(user.id, {
      googleAccessToken: access_token,
      googleRefreshToken: refresh_token,
      google_id: googleUser.sub,
      profileImageUrl: googleUser.picture,
      lastLogin: new Date(),
      updatedAt: new Date(),
    });

    return {
      access_token,
      refresh_token,
      google_id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        name: updatedUser?.name,
        role: updatedUser?.role,
        profileImageUrl: updatedUser?.profileImageUrl,
        google_id: updatedUser?.google_id,
        phone: updatedUser?.phone,
        status: updatedUser?.status,
        locationId: updatedUser?.locationId,
      },
    };
  },

  refreshAccessToken: async (google_id: string) => {
    const userRepo = new UserRepository();
    const user = await userRepo.getByGoogleId(google_id);

    if (!user?.googleRefreshToken) {
      throw new Error('User not found or no refresh token available');
    }

    const params = new URLSearchParams();
    params.append("client_id", GOOGLE_CLIENT_ID);
    params.append("client_secret", GOOGLE_CLIENT_SECRET);
    params.append("refresh_token", user.googleRefreshToken);
    params.append("grant_type", "refresh_token");

    const response = await axios.post(GOOGLE_TOKEN_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token: new_refresh_token } = response.data;

    await userRepo.update(user.id, {
      googleAccessToken: access_token,
      googleRefreshToken: new_refresh_token || user.googleRefreshToken,
      updatedAt: new Date(),
    });

    return {
      access_token,
      expires_in: response.data.expires_in,
      refresh_token: new_refresh_token || user.googleRefreshToken,
    };
  },
};
