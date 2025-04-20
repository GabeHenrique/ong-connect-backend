import {Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";
import {PrismaClient} from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    await this.createInitialData();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async createInitialData() {
    const userCount = await this.user.count();
    if (userCount > 0) return;

    const hashedPassword = await bcrypt.hash("123", 10);

    const ongUser = await this.user.create({
      data: {
        email: "john@ong.example.com",
        name: "John Doe",
        password: hashedPassword,
        role: "ONG",
      },
    });

    const volunteerUser = await this.user.create({
      data: {
        email: "john@volunteer.example.com",
        name: "John Doe",
        password: hashedPassword,
        role: "VOLUNTEER",
      },
    });

    const eventCount = await this.event.count();
    if (eventCount > 0) return;

    await this.event.create({
      data: {
        name: "Workshop de React",
        description: "Aprenda React do zero ao avançado",
        location: "São Paulo, SP",
        date: new Date("2024-03-15"),
        image: "https://placehold.co/300x200",
        creatorId: ongUser.id,
      },
    });
  }
}
