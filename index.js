const {PermissionsBitField, EmbedBuilder, ButtonStyle, Client, GatewayIntentBits, ChannelType, Partials, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder } = require("discord.js");

const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const db = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;

 const props = require(`./commands/${f}`);

 client.commands.push({
       name: props.name.toLowerCase(),
       description: props.description,
       options: props.options,
       dm_permission: props.dm_permission,
       type: 1
 });

console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });
console.log(`[EVENT] ${name} eventi yüklendi.`)
});

const destek = new ModalBuilder()
.setCustomId('form')
.setTitle('Destek Sistemi!')
  const a1 = new TextInputBuilder()
  .setCustomId('sebep')
  .setLabel('Destek açma sebebiniz nedir?')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setPlaceholder('Bir sebep gir.')
  .setRequired(true)
  const row = new ActionRowBuilder().addComponents(a1);
  
  destek.addComponents(row);
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "ticket"){
    await interaction.showModal(destek);
	}
})  

const uyeekle = new ModalBuilder()
.setCustomId('eklemenu')
.setTitle('Destek Sistemi')
  const e = new TextInputBuilder()
  .setCustomId('uyeid')
  .setLabel('Kullanıcı ID')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(10)
  .setPlaceholder('Eklemek istediğiniz kullanıcının id girin.')
  .setRequired(true)
  const row2 = new ActionRowBuilder().addComponents(e);
  
  uyeekle.addComponents(e);
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "ekle"){
    await interaction.showModal(uyeekle);
	}
})  

const uyecikar = new ModalBuilder()
.setCustomId('eklemenu2')
.setTitle('Destek Sistemi')
  const a = new TextInputBuilder()
  .setCustomId('cikarid')
  .setLabel('Kullanıcı ID')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(10)
  .setPlaceholder('Çıkarmak istediğiniz kullanıcı ID girin.')
  .setRequired(true)
  const row3 = new ActionRowBuilder().addComponents(a);
  
  uyecikar.addComponents(row3);
client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "çıkar"){
    await interaction.showModal(uyecikar);
	}
})  
client.on('interactionCreate', async interaction => {
  if (interaction.type !== InteractionType.ModalSubmit) return;
  if (interaction.customId === 'form') {
    const sebep = interaction.fields.getTextInputValue('sebep')
  
const row = new ActionRowBuilder()
.addComponents( 
  new SelectMenuBuilder()
  .setCustomId('del')
.setPlaceholder('Bilet Menüsü!')
.addOptions([
{
label: 'Destek Sil',
description: 'Destek Kanalını silersin',
value: 'delete',
},
{
label: "Üye Ekle/Üye Çıkar",
description: "Destek talebine üye ekleyip çıkarırsın.",
value: "panel"

}
])
);
  
  let yetkili =  db.fetch(`destekyetkili_${interaction.guild.id}`)
  let roleStaff = interaction.guild.roles.cache.get(yetkili)
    const zaten_var = new EmbedBuilder()
    .setColor("Red")
    .setDescription("Zaten açık bir talebiniz var.")
  let DejaUnChannel = interaction.guild.channels.cache.find(c => c.topic == interaction.user.id)
              if (DejaUnChannel) return interaction.reply({embeds: [zaten_var], ephemeral: true})
              interaction.guild.channels.create({
              name: `destek-${interaction.user.username}`,
                type: ChannelType.GuildText,
        
                permissionOverwrites: [
                  {   
                      id: interaction.guild.id,
                      deny: [PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: interaction.user.id,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                  },
                  {
                      id: roleStaff,
                      allow: [PermissionsBitField.Flags.ViewChannel]
                  }
              ]
            })
            
                  
                  .then((c)=>{
                 
                      const i1 = new EmbedBuilder()
                      .setTitle('Destek Sistemi')
                      .setDescription(`**${interaction.user.tag}** adlı kullanıcı **${sebep}** nedeniyle bir destel talebi oluşturdu.`)
                      .setColor("Green")
                      c.send({embeds: [i1], content: `${roleStaff} | ${interaction.user}`, components: [row]})
                      interaction.reply({content: `Biletiniz başarıyla açıldı. <#${c.id}>`, ephemeral: true})
                  })
          
          }
        })
        client.on('interactionCreate', async interaction => {
      if (!interaction.isSelectMenu()) return;
          if(interaction.customId === "del") {
            if (interaction.values[0] == "panel") {
              await interaction.deferUpdate()
const row2 = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setLabel("Ekle")
.setStyle(ButtonStyle.Success)
.setCustomId("ekle"),
new ButtonBuilder()
.setLabel("Çıkar")
.setStyle(ButtonStyle.Danger)
.setCustomId("çıkar"),
new ButtonBuilder()
.setLabel("Sil")
.setStyle(ButtonStyle.Secondary)
.setCustomId("sil")
)
const embed = new EmbedBuilder()
.setTitle("Kullanıcı Paneli")
.setDescription("Aşağıdaki butonlardan üye ekleyebilir veya çıkarabilirsin!")
.setColor("Random")
let message = await interaction.channel.messages.fetch(interaction.message.id)
await message.edit({embeds: [embed], components: [row2]})
          }
        }
        })
        client.on('interactionCreate', async interaction => {
          if (interaction.type !== InteractionType.ModalSubmit) return;
          if (interaction.customId === 'eklemenu') {
            const id = interaction.fields.getTextInputValue('uyeid')
            const channel = interaction.channel
                channel.permissionOverwrites.create(
                  id, {ViewChannel: true}
                  
                  )
                  
            const eklendi = new EmbedBuilder()
            .setTitle("Destek Sistemi")
            .setDescription(`<@${id}> adlı kullanıcı destek talebine eklendi.`)
            
            interaction.reply({embeds: [eklendi]})
                } else {
                
          }
        })
        client.on('interactionCreate', async interaction => {
          if (interaction.type !== InteractionType.ModalSubmit) return;
          if (interaction.customId === 'eklemenu2') {
            const id = interaction.fields.getTextInputValue('cikarid')
            const channel = interaction.channel
                channel.permissionOverwrites.create(
                  id, {ViewChannel: false}
                  
                  )
                  
            const atildi = new EmbedBuilder()
            .setTitle("Destek Sistemi")
            .setDescription(`<@${id}> adlı kullanıcı destek talebinden atıldı.`)
            
            interaction.reply({embeds: [atildi]})
                } else {
               
          }
        })
        client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return;
        if(interaction.customId === "del") {
          if (interaction.values[0] == "delete") {
            let log = db.fetch(`desteklog_${interaction.guild.id}`)
              const channel = interaction.channel
              channel.delete();
              const silindi = new EmbedBuilder()
            .setTitle("Destek Sistemi")
            .setDescription(`Bir destek talebi silindi.`)
            .addFields(
              { name: `Talep Kapatan:`, value: `<@${interaction.user.id}>`, inline: true },
              { name: `Kapatılan Talep:`, value: `**${interaction.channel.name}**`, inline: true }
            )
            
            client.channels.cache.get(log).send({embeds: [silindi]})
            
          }
        }
        })
        client.on('interactionCreate', async interaction => {
          if (!interaction.isButton()) return;
          if(interaction.customId === "sil") {
              let log = db.fetch(`desteklog_${interaction.guild.id}`)
                const channel = interaction.channel
                channel.delete();
                const silindi2 = new EmbedBuilder()
            .setTitle("Destek Sistemi")
            .setDescription(`Bir destek talebi silindi.`)
            .addFields(
              { name: `Talep Kapatan:`, value: `<@${interaction.user.id}>`, inline: true },
              { name: `Kapatılan Talep:`, value: `**${interaction.channel.name}**`, inline: true }
            )
            
            client.channels.cache.get(log).send({embeds: [silindi2]})
              
            
          }
          })
      

client.login(TOKEN)