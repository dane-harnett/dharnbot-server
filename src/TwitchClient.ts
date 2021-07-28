import axios from "axios";

const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API_BASE_URL = "https://api.twitch.tv/helix";

export default class TwitchClient {
  accessToken: string;
  clientId: string;
  clientSecret: string;
  cache: { [key: string]: any };

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.cache = {};
  }

  async authorize() {
    const response = await axios.post(
      `${TWITCH_AUTH_URL}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`
    );
    this.accessToken = response.data.access_token;
  }

  async getUser(login: string) {
    const path = `/users?login=${login}`;

    if (this.cache[path]) {
      return this.cache[path];
    }

    const response = await axios.get(`${TWITCH_API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Client-ID": this.clientId,
      },
    });

    this.cache[path] = response.data.data[0];

    return this.cache[path];
  }

  async getUsersFollows(login: string, direction: "from" | "to") {
    const user = await this.getUser(login);
    const path = `/users/follows?${direction}_id=${user.id}`;

    const response = await axios.get(`${TWITCH_API_BASE_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        "Client-ID": this.clientId,
      },
    });

    return response.data;
  }
}
