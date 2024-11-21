import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  TextChannel,
} from "discord.js";
import { Command } from "../interfaces/Command";

export default {
  data: new SlashCommandBuilder()
    .setName("anonymous-chat")
    .setDescription("익명으로 문의할 수 있습니다.")
    .addStringOption((role: SlashCommandStringOption) =>
      role
        .setName("message")
        .setDescription("익명으로 전달할 메시지를 입력해주세요.")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const logChannelId = process.env.LOG_CHANNEL ?? "";
    const logChannel = (await interaction.guild!.channels.fetch(
      logChannelId
    )) as TextChannel;

    const anonymousMessage = interaction.options.getString("message") ?? "";
    await logChannel.send({
      embeds: [
        {
          title: "익명의 문의",
          description: anonymousMessage,
        },
      ],
    });
  },
} as Command;
