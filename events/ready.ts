import { Client } from "discord.js";
import mongoose from 'mongoose';

module.exports = {
	name: 'ready',
	once: true,
	async execute(client: Client) {
		await mongoose.connect(process.env.MONGO_URI!,{keepAlive:true})
			.then(() => console.log('Conected to DB'))
			.catch((err) => console.log(err));
		console.log(`Ready! Logged in as ${client.user!.tag}`);
		
	},
};