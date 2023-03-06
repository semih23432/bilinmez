const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const db = require("croxydb")

module.exports = {
  name: "destek-sistemi-sıfırla",
  description: "Destek Sistemi sıfırlarsın.",
  type: 1,
  options: [],

  run: async(client, interaction) => {

let yetkili = db.fetch(`destekyetkili_${interaction.guild.id}`)
let log = db.fetch(`desteklog_${interaction.guild.id}`)
    const yetki_yok = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.")
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({embeds: [yetki_yok], ephemeral: true})
    
    
    const ayarlı = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek yetkili rolü ayarlanmamış.")
if(!log) return interaction.reply({embeds: [ayarlı], ephemeral: true})
    const ayarlı2 = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek log kanalı ayarlanmamış..")
if(!yetkili) return interaction.reply({embeds: [ayarlı2], ephemeral: true})

    
db.delete(`destekyetkili_${interaction.guild.id}`)
db.delete(`desteklog_${interaction.guild.id}`)

			const embed2 = new EmbedBuilder()
			.setDescription(`Destek sistemi başarıyla sıfırlandı.`)
			.setColor("Green")
    
interaction.reply({embeds: [embed2]})
    
  }
};