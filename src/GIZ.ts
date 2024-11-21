import {
  Client,
  Events,
  GuildMember,
  Interaction,
  REST,
  Routes,
  TextChannel,
} from "discord.js";
import anonymousChat from "./commands/anonymousChatCommand";
import gradeNotice from "./commands/gradeNoticeCommand";
import updateGrade from "./commands/updateGradeCommand";
import { Command } from "./interfaces/Command";
import { config } from "./utils/config";

export class GIZ {
  private slashCommandMap = new Map<string, Command>();

  public constructor(private readonly client: Client) {
    this.client.login(config.discordToken);

    this.client.on("ready", () => {
      this.registerSlashCommands();
      console.log(`${this.client.user?.username ?? ""} ready!`);
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.onInteractionReceived();
    this.onGuildMemberAdd();
  }

  private async registerSlashCommands() {
    const discordREST = new REST({ version: "10" }).setToken(
      config.discordToken
    );
    const slashCommands: Array<Command> = [
      updateGrade,
      gradeNotice,
      anonymousChat,
    ];

    this.slashCommandMap = slashCommands.reduce((map, command) => {
      map.set(command.data.name, command);
      return map;
    }, new Map<string, Command>());

    await discordREST.put(
      Routes.applicationCommands(this.client.user?.id ?? ""),
      {
        body: slashCommands.map((command) => command.data.toJSON()),
      }
    );
  }

  private async onInteractionReceived() {
    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        const guildId = process.env.GUILD_ID;
        const logChannelId = process.env.LOG_CHANNEL ?? "";

        if (!interaction.isChatInputCommand()) return;
        if (interaction.guildId !== guildId) {
          await interaction.reply({
            content: "GSM 전용 봇 입니다.",
            ephemeral: true,
          });
          return;
        }

        const adminCommands = ["grade-notice"];
        if (adminCommands.includes(interaction.commandName)) {
          if (!interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({
              content: "이 명령어는 관리자만 사용할 수 있습니다.",
              ephemeral: true,
            });
            return;
          }
        }

        const userCommands = ["update-grade"];
        if (userCommands.includes(interaction.commandName)) {
          if (interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({
              content: "이 명령어는 유저만 사용할 수 있습니다.",
              ephemeral: true,
            });
            return;
          }
        }

        const command = this.slashCommandMap.get(interaction.commandName);
        if (!command) return;

        const logChannel = (await interaction.guild!.channels.fetch(
          logChannelId
        )) as TextChannel;
        const member = interaction.member as GuildMember;

        try {
          await command.execute(interaction);
          logChannel.send({
            embeds: [
              {
                description: `**Nickname**: ${member.nickname}\n**Command**: /${
                  interaction.commandName
                } ${interaction.options.data.map((v) => {
                  return `\`${v.name}=${v.value}\``;
                })}\n**Timestamp**: ${interaction.createdAt}`,
              },
            ],
          });
        } catch (error: any) {
          console.error(error);

          if (interaction.replied) {
            await interaction.followUp({
              content: error.toString(),
            });
          } else {
            await interaction.reply({
              content: error.toString(),
            });
          }
        }
      }
    );
  }

  private async onGuildMemberAdd() {
    this.client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
      const guildId = process.env.GUILD_ID ?? "";

      if (member.guild.id == guildId) {
        member.send(
          `GSM 서버에 들어오신 것을 환영합니다! 👋🏻\n\`/update-grade\` 명령어를 사용해서 학년 역할을 선택해주세요.\n(물론 GSM 서버 내에서...)`
        );
      }
    });
  }
}
