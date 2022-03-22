import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = new DocumentBuilder()
		.setTitle('PRIVOZ_BOT API')
		.setDescription('intermediary between buyer and seller')
		.setVersion('1.0')
		.build()
	
	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('/', app, document)
	app.listen(3000)
}
bootstrap();