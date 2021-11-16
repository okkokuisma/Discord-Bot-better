const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCourseNameFromCategory, updateInviteLinks } = require("../../services/service");
const { findUserByDiscordId } = require("../../../db/services/userService");
const { findCourseFromDb, isCourseCategory } = require("../../../db/services/courseService");
const { findCourseMember } = require("../../../db/services/courseMemberService");
const { editEphemeral, editErrorEphemeral, sendEphemeral } = require("../../services/message");
const { courseAdminRole, facultyRole } = require("../../../../config.json");

const execute = async (interaction, client, models) => {
  await sendEphemeral(interaction, "Adding instructor...");
  const guild = client.guild;
  const channel = await guild.channels.cache.get(interaction.channelId);
  const roleName = channel.parent ? getCourseNameFromCategory(channel.parent) : "";

  if (!await isCourseCategory(channel?.parent, models.Course)) {
    return editErrorEphemeral(interaction, "Command must be used in a course channel!");
  }


  let users = interaction.options.getString("list");
  const instructorRole = await guild.roles.cache.find(r => r.name === `${roleName} ${courseAdminRole}`);

  const userIdList = [];

  while (users.match(/(?<=<@!).*?(?=>)/)) {
    const userID = users.match(/(?<=<@!).*?(?=>)/)[0];
    userIdList.push(userID);
    users = users.replace("<@!" + userID + ">", "");
  }
  for (let i = 0; i < userIdList.length; i++) {
    const memberToPromote = guild.members.cache.get(parseInt(userIdList[i]));

    const userInstance = await findUserByDiscordId(memberToPromote.user.id, models.User);

    const courseInstance = await findCourseFromDb(roleName, models.Course);

    const courseMemberInstance = await findCourseMember(userInstance.id, courseInstance.id, models.CourseMember);

    if (!courseMemberInstance) {
      return editErrorEphemeral(interaction, "All listed users must be members of this course!");
    }

    courseMemberInstance.instructor = true;
    await courseMemberInstance.save();

    memberToPromote.roles.add(instructorRole);
  }

  await updateInviteLinks(guild, courseAdminRole, facultyRole, client);

  return await editEphemeral(interaction, `Gave role '${instructorRole.name}' to all.`);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add_instructors")
    .setDescription("Add instructors to the course.")
    .setDefaultPermission(false)
    .addStringOption(option =>
      option.setName("list")
        .setDescription("List all users you wish to add as instructors using @tags")
        .setRequired(true)),
  execute,
  usage: "/add_instructors [members]",
  description: "Add instructors to the course.*",
  roles: ["admin", facultyRole],
};