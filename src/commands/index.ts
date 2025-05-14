import { Logger } from "@nestjs/common";
import { CommandFactory } from "nest-commander";
import { CommandsModule } from "./commands.module";

async function bootstrap() {
  await CommandFactory.run(CommandsModule, { logger: new Logger() });
}
bootstrap().catch((error) => {
  console.error("Error during bootstrap:", error);
});
