import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating new active stories...");
  
  // Get all users
  const users = await prisma.user.findMany({
    take: 50
  });
  
  if (users.length === 0) {
    console.log("No users found in the database. Please run the full seed first.");
    return;
  }
  
  const imageUrls = [
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796905/hockey-connect/posts/hockey_action.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796907/hockey-connect/posts/hockey_training.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796908/hockey-connect/posts/hockey_celebration.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796910/hockey-connect/posts/hockey_goalkeeper.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796913/hockey-connect/posts/hockey_equipment.jpg"
  ];
  
  let count = 0;
  for (const user of users) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    await prisma.story.create({
      data: {
        userId: user.id,
        imageUrl: imageUrls[count % imageUrls.length],
        text: "New story generated today! 🏑🔥",
        expiresAt
      }
    });
    count++;
  }
  
  console.log(`✅ Generated ${count} active stories for users. They will be visible for the next 24 hours.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
