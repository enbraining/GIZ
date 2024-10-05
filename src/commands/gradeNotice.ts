import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';

export default {
  data: new SlashCommandBuilder()
    .setName("grade-notice")
    .setDescription("(돌이킬 수 없습니다) 새 학기에 학년 변경을 위한 공지를 올립니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      embeds: [
        {
          description: `
          새 학기가 되었습니다! \`/update-grade\` 명령어를 사용해서 이름과 역할을 업데이트 해주세요.
          `
        }
      ]
    });
  },
} as Command;
