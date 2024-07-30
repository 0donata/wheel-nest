import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as TelegramBot from 'node-telegram-bot-api';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly bot: TelegramBot;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      this.logger.error('Telegram Bot Token not provided!');
      throw new Error('Telegram Bot Token not provided!');
    }
    this.bot = new TelegramBot(token, { polling: true });
  }

  async onModuleInit() {
    this.bot.on('message', (msg) => this.handleMessage(msg));
    this.bot.on('callback_query', (query) => this.handleCallbackQuery(query));
  }

  private async handleMessage(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const username = msg.from.username;

    this.logger.log(
      `Received message from ${username} (${chatId}): ${msg.text}`,
    );

    if (msg.text === '/start') {
      const webAppUrl = this.configService.get<string>('WEB_APP_URL');
      this.bot
        .sendMessage(
          chatId,
          'Welcome! Click the button below to start the app.',
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Open App',
                    web_app: { url: webAppUrl },
                  },
                ],
              ],
            },
          },
        )
        .catch((err) => {
          this.logger.error('Error sending message:', err);
        });
    }
  }

  private async handleCallbackQuery(query: TelegramBot.CallbackQuery) {
    const chatId = query.message.chat.id;
    const username = query.from.username;

    this.logger.log(`Received callback query from ${username} (${chatId})`);
  }
}
