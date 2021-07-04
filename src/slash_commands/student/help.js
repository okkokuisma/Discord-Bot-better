const prefix = "/";
const { sendEphemeral, slashCommands } = require("../utils");
const { client } = require("../../index");

const execute = async (interaction) => {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  const user = guild.members.cache.get(interaction.member.user.id);
  const data = [];
  const commandsReadyToPrint = slashCommands
    .filter(command => {
      if (!command.role) return true;
      return user.roles.cache.find(role => role.name === command.role);
    });

  if (!interaction.data.options) {
    data.push("Here's a list of all my commands:");
    data.push(commandsReadyToPrint.map(command => `${prefix}${command.name} - ${command.description}`).join("\n"));
    data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
    return sendEphemeral(client, interaction, data.join("\n"));
  }

  const name = interaction.data.options[0].value;
  const command = commandsReadyToPrint.find(c => c.name.includes(name));

  if (!command) {
    return sendEphemeral(client, interaction, "that's not a valid command!");
  }

  if (interaction.data.options) {
    data.push(`**Name:** ${command.name}`);
    data.push(`**Description:** ${command.description}`);
    data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
    return sendEphemeral(client, interaction, data.join(" \n"));
  }
};

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  usage: "[command name]",
  args: true,
  joinArgs: true,
  guide: true,
  options: [
    {
      name: "command",
      description: "command instructions",
      type: 3,
      required: false,
    },
  ],
  execute,
};
