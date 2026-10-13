import app from './app.js';
import env from './config/env.js';

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
