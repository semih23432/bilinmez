const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const db = require("croxydb")

module.exports = {
  name: "destek-sistemi",
  description: "Destek Sistemi ayarlarsın.",
  type: 1,
  options: [
    {
      name:"embed-mesaj",
      description:"Bir embed mesaj gir.",
      type:3,
      required:true
    },
    {
      name:"buton-mesaj",
      description:"Bir buton mesaj gir.",
      type:3,
      required:true
    }
  ],

  run: async(client, interaction) => {

let yetkili = db.fetch(`destekyetkili_${interaction.guild.id}`)
let log = db.fetch(`desteklog_${interaction.guild.id}`)
    const yetki_yok = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.")
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({embeds: [yetki_yok], ephemeral: true})

  const embed = interaction.options.getString("embed-mesaj")
  const buton = interaction.options.getString("buton-mesaj")

    
    
    const ayarlı = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek yetkili rolü ayarlanmamış.")
if(!yetkili) return interaction.reply({embeds: [ayarlı], ephemeral: true})
    const ayarlı2 = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek log kanalı ayarlanmamış.")
if(!log) return interaction.reply({embeds: [ayarlı2], ephemeral: true})


  const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
				.setLabel(`${buton}`)
				.setStyle(ButtonStyle.Primary)
				.setCustomId("ticket")
			)
			const embed2 = new EmbedBuilder()
			.setTitle("Destek Sistemi")
			.setDescription(`${embed}`)
			.setColor("Green")
    
interaction.reply({embeds: [embed2], components: [row]})
    
  }
};