import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.jobOpportunity.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.clubMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Data cleared\n");

  // Hash password for all mock users
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ========== CLUBS ==========
  console.log("🏒 Creating clubs...");

  const clubs = await Promise.all([
    // Spanish clubs
    prisma.club.create({
      data: {
        name: "FC Barcelona Hockey",
        city: "Barcelona",
        country: "🇪🇸 España",
        league: "OK Liga",
        foundedYear: 1942,
        description:
          "One of the most successful hockey clubs in Spain with a rich history",
        bio: "Excellence in roller hockey since 1942",
        logo: "https://logo.clearbit.com/fcbarcelona.com",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Patín Alcorcón",
        city: "Alcorcón",
        country: "🇪🇸 España",
        league: "OK Liga",
        foundedYear: 1968,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Reus Deportiu",
        city: "Reus",
        country: "🇪🇸 España",
        league: "OK Liga",
        foundedYear: 1909,
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "Liceo Coruña",
        city: "A Coruña",
        country: "🇪🇸 España",
        league: "OK Liga",
        foundedYear: 1972,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "HC Majadahonda",
        city: "Majadahonda",
        country: "🇪🇸 España",
        league: "Segunda División",
        foundedYear: 1988,
        isVerified: false,
      },
    }),
    // Argentinian clubs
    prisma.club.create({
      data: {
        name: "Club Atlético River Plate",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Liga Nacional",
        foundedYear: 1931,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Arquitectura",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Liga Nacional",
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "Gimnasia y Esgrima LP",
        city: "La Plata",
        country: "🇦🇷 Argentina",
        league: "Liga Nacional",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Italiano",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Liga Nacional",
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "San Fernando Bueno",
        city: "San Fernando",
        country: "🇦🇷 Argentina",
        league: "Liga Metropolitana",
        isVerified: false,
      },
    }),
  ]);

  console.log(`✅ Created ${clubs.length} clubs\n`);

  // ========== PLAYERS ==========
  console.log("⛸️  Creating players...");

  const playerData = [
    {
      username: "messi_hockey",
      email: "messi@hockey-test.com",
      name: "Lionel Messi H.",
      position: "Forward",
    },
    {
      username: "pablo_alvarez",
      email: "pablo@hockey-test.com",
      name: "Pablo Álvarez",
      position: "Midfielder",
    },
    {
      username: "lucas_martinez",
      email: "lucas@hockey-test.com",
      name: "Lucas Martínez",
      position: "Defense",
    },
    {
      username: "diego_fernandez",
      email: "diego@hockey-test.com",
      name: "Diego Fernández",
      position: "Goalkeeper",
    },
    {
      username: "juan_rodriguez",
      email: "juan@hockey-test.com",
      name: "Juan Rodríguez",
      position: "Forward",
    },
    {
      username: "carlos_lopez",
      email: "carlos@hockey-test.com",
      name: "Carlos López",
      position: "Defense",
    },
    {
      username: "mateo_garcia",
      email: "mateo@hockey-test.com",
      name: "Mateo García",
      position: "Midfielder",
    },
    {
      username: "andres_sanchez",
      email: "andres@hockey-test.com",
      name: "Andrés Sánchez",
      position: "Forward",
    },
    {
      username: "miguel_torres",
      email: "miguel@hockey-test.com",
      name: "Miguel Torres",
      position: "Defense",
    },
    {
      username: "javier_ramirez",
      email: "javier@hockey-test.com",
      name: "Javier Ramírez",
      position: "Goalkeeper",
    },
    {
      username: "alejandro_flores",
      email: "alejandro@hockey-test.com",
      name: "Alejandro Flores",
      position: "Midfielder",
    },
    {
      username: "fernando_moreno",
      email: "fernando@hockey-test.com",
      name: "Fernando Moreno",
      position: "Forward",
    },
    {
      username: "ricardo_gutierrez",
      email: "ricardo@hockey-test.com",
      name: "Ricardo Gutiérrez",
      position: "Defense",
    },
    {
      username: "sergio_diaz",
      email: "sergio@hockey-test.com",
      name: "Sergio Díaz",
      position: "Midfielder",
    },
    {
      username: "roberto_vazquez",
      email: "roberto@hockey-test.com",
      name: "Roberto Vázquez",
      position: "Forward",
    },
    {
      username: "eduardo_castillo",
      email: "eduardo@hockey-test.com",
      name: "Eduardo Castillo",
      position: "Goalkeeper",
    },
    {
      username: "francisco_ramos",
      email: "francisco@hockey-test.com",
      name: "Francisco Ramos",
      position: "Defense",
    },
    {
      username: "daniel_mendoza",
      email: "daniel@hockey-test.com",
      name: "Daniel Mendoza",
      position: "Midfielder",
    },
    {
      username: "manuel_ortiz",
      email: "manuel@hockey-test.com",
      name: "Manuel Ortiz",
      position: "Forward",
    },
    {
      username: "antonio_silva",
      email: "antonio@hockey-test.com",
      name: "Antonio Silva",
      position: "Defense",
    },
  ];

  const players = await Promise.all(
    playerData.map((player, index) =>
      prisma.user.create({
        data: {
          email: player.email,
          username: player.username,
          name: player.name,
          password: hashedPassword,
          role: "PLAYER",
          position: player.position,
          bio: `Passionate hockey player. Training hard every day! 🏒`,
          avatar: `https://i.pravatar.cc/150?u=${player.username}`,
          country: index % 2 === 0 ? "🇪🇸" : "🇦🇷",
          city: index % 2 === 0 ? "Barcelona" : "Buenos Aires",
          yearsOfExperience: 5 + (index % 10),
          isVerified: index % 5 === 0,
        },
      })
    )
  );

  console.log(`✅ Created ${players.length} players\n`);

  // ========== COACHES ==========
  console.log("👔 Creating coaches...");

  const coachData = [
    {
      username: "coach_pep",
      email: "pep@hockey-test.com",
      name: "Pep Guardiola H.",
    },
    {
      username: "coach_mourinho",
      email: "mourinho@hockey-test.com",
      name: "José Mourinho",
    },
    {
      username: "coach_simeone",
      email: "simeone@hockey-test.com",
      name: "Diego Simeone",
    },
    {
      username: "coach_bielsa",
      email: "bielsa@hockey-test.com",
      name: "Marcelo Bielsa",
    },
    {
      username: "coach_pochettino",
      email: "pochettino@hockey-test.com",
      name: "Mauricio Pochettino",
    },
    {
      username: "coach_ancelotti",
      email: "ancelotti@hockey-test.com",
      name: "Carlo Ancelotti",
    },
    {
      username: "coach_zidane",
      email: "zidane@hockey-test.com",
      name: "Zinedine Zidane",
    },
    {
      username: "coach_xavi",
      email: "xavi@hockey-test.com",
      name: "Xavi Hernández",
    },
    {
      username: "coach_valverde",
      email: "valverde@hockey-test.com",
      name: "Ernesto Valverde",
    },
    {
      username: "coach_sampaoli",
      email: "sampaoli@hockey-test.com",
      name: "Jorge Sampaoli",
    },
  ];

  const coaches = await Promise.all(
    coachData.map((coach, index) =>
      prisma.user.create({
        data: {
          email: coach.email,
          username: coach.username,
          name: coach.name,
          password: hashedPassword,
          role: "COACH",
          bio: `Professional hockey coach with ${
            10 + index
          } years of experience. Let's win together!`,
          avatar: `https://i.pravatar.cc/150?u=${coach.username}`,
          country: index % 2 === 0 ? "🇪🇸" : "🇦🇷",
          city: index % 2 === 0 ? "Madrid" : "Buenos Aires",
          yearsOfExperience: 10 + index,
          isVerified: index % 3 === 0,
        },
      })
    )
  );

  console.log(`✅ Created ${coaches.length} coaches\n`);

  // ========== POSTS ==========
  console.log("📝 Creating posts...");

  const postContents = [
    "Amazing training session today! Feeling stronger every day 💪🏒",
    "Game day tomorrow! Let's bring home the win! 🔥",
    "New season, new goals. Ready to give it all! ⚡",
    "Great team chemistry today. We're ready for the championship! 🏆",
    "Recovery day but the mind never rests. Studying game tapes 🎥",
  ];

  const postImages = [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    "https://images.unsplash.com/photo-1461532257246-777de18cd58b",
    "https://images.unsplash.com/photo-1566085849139-df876562723c",
  ];

  const posts = [];

  // User posts (20 posts)
  for (let i = 0; i < 20; i++) {
    const randomUser = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];
    const post = await prisma.post.create({
      data: {
        content: postContents[Math.floor(Math.random() * postContents.length)],
        userId: randomUser.id,
        imageUrl: postImages[Math.floor(Math.random() * postImages.length)],
        images: [
          postImages[Math.floor(Math.random() * postImages.length)],
          postImages[Math.floor(Math.random() * postImages.length)],
        ], // Multiple images for carousel
        visibility: i % 5 === 0 ? "FRIENDS" : "PUBLIC",
        isPinned: i % 10 === 0,
      },
    });
    posts.push(post);
  }

  // Club posts (10 posts)
  for (let i = 0; i < 10; i++) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    const post = await prisma.post.create({
      data: {
        content: `🏒 Exciting news from ${randomClub.name}! New season tickets available now!`,
        userId: players[0].id, // Posted by a club admin user
        clubId: randomClub.id,
        isClubPost: true,
        imageUrl: "https://logo.clearbit.com/hockey.com",
        visibility: "PUBLIC",
        isPinned: i === 0, // Pin first club post
      },
    });
    posts.push(post);
  }

  console.log(`✅ Created ${posts.length} posts\n`);

  // ========== COMMENTS ==========
  console.log("💬 Creating comments...");

  const commentTexts = [
    "¡Increíble! 🔥",
    "Let's go team! 💪",
    "Amazing work!",
    "¡Vamos! 🏒",
  ];

  let commentCount = 0;
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments; i++) {
      const randomUser = [...players, ...coaches][
        Math.floor(Math.random() * (players.length + coaches.length))
      ];
      await prisma.comment.create({
        data: {
          content:
            commentTexts[Math.floor(Math.random() * commentTexts.length)],
          postId: post.id,
          userId: randomUser.id,
        },
      });
      commentCount++;
    }
  }

  console.log(`✅ Created ${commentCount} comments\n`);

  // ========== LIKES ==========
  console.log("❤️  Creating likes...");

  let likeCount = 0;
  for (const post of posts) {
    const numLikes = Math.floor(Math.random() * 10) + 3;
    for (let i = 0; i < numLikes; i++) {
      const randomUser = [...players, ...coaches][
        Math.floor(Math.random() * (players.length + coaches.length))
      ];
      try {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: randomUser.id,
          },
        });
        likeCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Created ${likeCount} likes\n`);

  // ========== FOLLOWS ==========
  console.log("👥 Creating follows...");

  let followCount = 0;
  for (let i = 0; i < 30; i++) {
    const follower = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];
    const following = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];

    if (follower.id !== following.id) {
      try {
        await prisma.follow.create({
          data: {
            followerType: "USER",
            followerId: follower.id,
            followingType: "USER",
            followingId: following.id,
          },
        });
        followCount++;
      } catch (error) {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Created ${followCount} follows\n`);

  // ========== JOB OPPORTUNITIES ==========
  console.log("💼 Creating job opportunities...");

  const jobData = [
    {
      title: "Delantero Senior",
      type: "PLAYER",
      desc: "Club busca delantero experimentado",
      salary: 25000,
      currency: "EUR",
    },
    {
      title: "Entrenador Juvenil",
      type: "COACH",
      desc: "Se necesita entrenador Sub-18",
      salary: 30000,
      currency: "EUR",
    },
    {
      title: "Portero Suplente",
      type: "PLAYER",
      desc: "Buscamos portero para reforzar plantel",
      salary: 20000,
      currency: "EUR",
    },
    {
      title: "Preparador Físico",
      type: "STAFF",
      desc: "Se requiere preparador físico titulado",
      salary: 22000,
      currency: "EUR",
    },
  ];

  for (const job of jobData) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    await prisma.jobOpportunity.create({
      data: {
        title: job.title,
        description: job.desc,
        positionType: job.type as any,
        clubId: randomClub.id,
        country: randomClub.country,
        city: randomClub.city,
        salary: job.salary,
        currency: job.currency as any, // Currency enum
        status: "OPEN",
        benefits: "Seguro médico, alojamiento, equipamiento completo",
      },
    });
  }

  console.log(`✅ Created ${jobData.length} job opportunities\n`);

  console.log("🎉 Database seeded successfully!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
