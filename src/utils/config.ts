import "dotenv/config";

export interface Config {
  discordToken: string;
  studentRoleId: string;
}

export const config: Config = {
  discordToken: process.env.DISCORD_TOKEN ?? "",
  studentRoleId: process.env.STUDENT_ROLE_ID ?? ""
};
