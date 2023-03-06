const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const db = require("croxydb")

module.exports = {
  name: "destek-ayarla",
  description: "Destek Sistemi ayarlarsın.",
  type: 1,
  options: [
    {
      name:"yetkili-rol",
      description:"Bir yetkili rolü seç.",
      type:8,
      required:true
    },
    {
      name:"log-kanalı",
      description:"Bir log kanalı seç.",
      type:7,
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

  const rol = interaction.options.getRole("yetkili-rol")
  const kanal = interaction.options.getChannel("log-kanalı")

    
    
    const ayarlı = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek yetkili rolü zaten ayarlanmış.")
if(yetkili) return interaction.reply({embeds: [ayarlı], ephemeral: true})
    const ayarlı2 = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Destek log kanalı zaten ayarlanmış.")
if(log) return interaction.reply({embeds: [ayarlı2], ephemeral: true})

    
db.set(`destekyetkili_${interaction.guild.id}`, rol.id)
db.set(`desteklog_${interaction.guild.id}`, kanal.id)
    


			const embed2 = new EmbedBuilder()
			.setDescription(`Destek Sistemi başarıyla ayarlandı.\n\nDestek Log: ${kanal}\nDestek Yetkili: ${rol}`)
			.setColor("Green")
    
interaction.reply({embeds: [embed2]})
    
  }
};