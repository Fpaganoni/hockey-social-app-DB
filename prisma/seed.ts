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
  await prisma.profile.deleteMany();
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
        location: "Barcelona, España",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Patín Alcorcón",
        location: "Alcorcón, Madrid, España",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Reus Deportiu",
        location: "Reus, Cataluña, España",
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "Liceo Coruña",
        location: "A Coruña, Galicia, España",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "HC Majadahonda",
        location: "Majadahonda, Madrid, España",
        isVerified: false,
      },
    }),

    // Argentinian clubs
    prisma.club.create({
      data: {
        name: "Club Atlético River Plate",
        location: "Buenos Aires, Argentina",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Arquitectura",
        location: "Buenos Aires, Argentina",
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "Gimnasia y Esgrima LP",
        location: "La Plata, Argentina",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Italiano",
        location: "Buenos Aires, Argentina",
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "San Fernando Bueno",
        location: "San Fernando, Argentina",
        isVerified: false,
      },
    }),
  ]);

  console.log(`✅ Created ${clubs.length} clubs\n`);

  // ========== PLAYERS ==========
  console.log("⛸️  Creating players...");

  const playerNames = [
    {
      username: "messi_hockey",
      email: "messi@hockey-test.com",
      displayName: "Lionel Messi H.",
    },
    {
      username: "pablo_alvarez",
      email: "pablo@hockey-test.com",
      displayName: "Pablo Álvarez",
    },
    {
      username: "lucas_martinez",
      email: "lucas@hockey-test.com",
      displayName: "Lucas Martínez",
    },
    {
      username: "diego_fernandez",
      email: "diego@hockey-test.com",
      displayName: "Diego Fernández",
    },
    {
      username: "juan_rodriguez",
      email: "juan@hockey-test.com",
      displayName: "Juan Rodríguez",
    },
    {
      username: "carlos_lopez",
      email: "carlos@hockey-test.com",
      displayName: " Carlos López",
    },
    {
      username: "mateo_garcia",
      email: "mateo@hockey-test.com",
      displayName: "Mateo García",
    },
    {
      username: "andres_sanchez",
      email: "andres@hockey-test.com",
      displayName: "Andrés Sánchez",
    },
    {
      username: "miguel_torres",
      email: "miguel@hockey-test.com",
      displayName: "Miguel Torres",
    },
    {
      username: "javier_ramirez",
      email: "javier@hockey-test.com",
      displayName: "Javier Ramírez",
    },
    {
      username: "alejandro_flores",
      email: "alejandro@hockey-test.com",
      displayName: "Alejandro Flores",
    },
    {
      username: "fernando_moreno",
      email: "fernando@hockey-test.com",
      displayName: "Fernando Moreno",
    },
    {
      username: "ricardo_gutierrez",
      email: "ricardo@hockey-test.com",
      displayName: "Ricardo Gutiérrez",
    },
    {
      username: "sergio_diaz",
      email: "sergio@hockey-test.com",
      displayName: "Sergio Díaz",
    },
    {
      username: "roberto_vazquez",
      email: "roberto@hockey-test.com",
      displayName: "Roberto Vázquez",
    },
    {
      username: "eduardo_castillo",
      email: "eduardo@hockey-test.com",
      displayName: "Eduardo Castillo",
    },
    {
      username: "francisco_ramos",
      email: "francisco@hockey-test.com",
      displayName: "Francisco Ramos",
    },
    {
      username: "daniel_mendoza",
      email: "daniel@hockey-test.com",
      displayName: "Daniel Mendoza",
    },
    {
      username: "manuel_ortiz",
      email: "manuel@hockey-test.com",
      displayName: "Manuel Ortiz",
    },
    {
      username: "antonio_silva",
      email: "antonio@hockey-test.com",
      displayName: "Antonio Silva",
    },
    {
      username: "rafael_nunez",
      email: "rafael@hockey-test.com",
      displayName: "Rafael Núñez",
    },
    {
      username: "hugo_jimenez",
      email: "hugo@hockey-test.com",
      displayName: "Hugo Jiménez",
    },
    {
      username: "oscar_cruz",
      email: "oscar@hockey-test.com",
      displayName: "Óscar Cruz",
    },
    {
      username: "ivan_reyes",
      email: "ivan@hockey-test.com",
      displayName: "Iván Reyes",
    },
    {
      username: "alberto_herrera",
      email: "alberto@hockey-test.com",
      displayName: "Alberto Herrera",
    },
    {
      username: "gabriel_medina",
      email: "gabriel@hockey-test.com",
      displayName: "Gabriel Medina",
    },
    {
      username: "raul_roman",
      email: "raul@hockey-test.com",
      displayName: "Raúl Román",
    },
    {
      username: "adrian_dominguez",
      email: "adrian@hockey-test.com",
      displayName: "Adrián Domínguez",
    },
    {
      username: "victor_navarro",
      email: "victor@hockey-test.com",
      displayName: "Víctor Navarro",
    },
    {
      username: "martin_ruiz",
      email: "martin@hockey-test.com",
      displayName: "Martín Ruiz",
    },
    {
      username: "cristian_vargas",
      email: "cristian@hockey-test.com",
      displayName: "Cristian Vargas",
    },
    {
      username: "leonardo_castro",
      email: "leonardo@hockey-test.com",
      displayName: "Leonardo Castro",
    },
    {
      username: "nicolas_perez",
      email: "nicolas@hockey-test.com",
      displayName: "Nicolás Pérez",
    },
    {
      username: "santiago_gomez",
      email: "santiago@hockey-test.com",
      displayName: "Santiago Gómez",
    },
    {
      username: "joaquin_molina",
      email: "joaquin@hockey-test.com",
      displayName: "Joaquín Molina",
    },
    {
      username: "emilio_ortega",
      email: "emilio@hockey-test.com",
      displayName: "Emilio Ortega",
    },
    {
      username: "pedro_aguilar",
      email: "pedro@hockey-test.com",
      displayName: "Pedro Aguilar",
    },
    {
      username: "jose_vega",
      email: "jose@hockey-test.com",
      displayName: "José Vega",
    },
    {
      username: "ignacio_campos",
      email: "ignacio@hockey-test.com",
      displayName: "Ignacio Campos",
    },
    {
      username: "marco_luna",
      email: "marco@hockey-test.com",
      displayName: "Marco Luna",
    },
  ];

  const players = await Promise.all(
    playerNames.map((player, index) =>
      prisma.user.create({
        data: {
          email: player.email,
          username: player.username,
          password: hashedPassword,
          role: "PLAYER",
          isVerified: index % 5 === 0, // Every 5th player is verified
          profile: {
            create: {
              displayName: player.displayName,
              bio: `Passionate hockey player. Training hard every day! 🏒`,
              avatarUrl: `https://i.pravatar.cc/150?u=${player.username}`,
            },
          },
        },
      })
    )
  );

  console.log(`✅ Created ${players.length} players\n`);

  // ========== COACHES ==========
  console.log("👔 Creating coaches...");

  const coachNames = [
    {
      username: "coach_pep",
      email: "pep@hockey-test.com",
      displayName: "Pep Guardiola H.",
    },
    {
      username: "coach_mourinho",
      email: "mourinho@hockey-test.com",
      displayName: "José Mourinho",
    },
    {
      username: "coach_simeone",
      email: "simeone@hockey-test.com",
      displayName: "Diego Simeone",
    },
    {
      username: "coach_bielsa",
      email: "bielsa@hockey-test.com",
      displayName: "Marcelo Bielsa",
    },
    {
      username: "coach_pochettino",
      email: "pochettino@hockey-test.com",
      displayName: "Mauricio Pochettino",
    },
    {
      username: "coach_ancelotti",
      email: "ancelotti@hockey-test.com",
      displayName: "Carlo Ancelotti",
    },
    {
      username: "coach_zidane",
      email: "zidane@hockey-test.com",
      displayName: "Zinedine Zidane",
    },
    {
      username: "coach_xavi",
      email: "xavi@hockey-test.com",
      displayName: "Xavi Hernández",
    },
    {
      username: "coach_valverde",
      email: "valverde@hockey-test.com",
      displayName: "Ernesto Valverde",
    },
    {
      username: "coach_sampaoli",
      email: "sampaoli@hockey-test.com",
      displayName: "Jorge Sampaoli",
    },
    {
      username: "coach_scaloni",
      email: "scaloni@hockey-test.com",
      displayName: "Lionel Scaloni",
    },
    {
      username: "coach_gallardo",
      email: "gallardo@hockey-test.com",
      displayName: "Marcelo Gallardo",
    },
    {
      username: "coach_berizzo",
      email: "berizzo@hockey-test.com",
      displayName: "Eduardo Berizzo",
    },
    {
      username: "coach_pellegrini",
      email: "pellegrini@hockey-test.com",
      displayName: "Manuel Pellegrini",
    },
    {
      username: "coach_alfaro",
      email: "alfaro@hockey-test.com",
      displayName: "Gustavo Alfaro",
    },
  ];

  const coaches = await Promise.all(
    coachNames.map((coach, index) =>
      prisma.user.create({
        data: {
          email: coach.email,
          username: coach.username,
          password: hashedPassword,
          role: "COACH",
          isVerified: index % 3 === 0, // Every 3rd coach is verified
          profile: {
            create: {
              displayName: coach.displayName,
              bio: `Professional hockey coach with ${
                10 + index
              } years of experience. Let's win together!`,
              avatarUrl: `https://i.pravatar.cc/150?u=${coach.username}`,
            },
          },
        },
      })
    )
  );

  console.log(`✅ Created ${coaches.length} coaches\n`);

  // ========== TEAMS ==========
  console.log("👥 Creating teams...");

  let teamCount = 0;
  for (const club of clubs) {
    // Each club gets 3-4 teams
    const numTeams = 3 + (Math.random() > 0.5 ? 1 : 0);

    for (let i = 0; i < numTeams; i++) {
      const categories = ["SUB18", "SUB21", "SENIOR", "VETERANOS"];
      await prisma.team.create({
        data: {
          name: `${club.name} ${categories[i]}`,
          category: categories[i] || "SENIOR",
          clubId: club.id,
        },
      });
      teamCount++;
    }
  }

  console.log(`✅ Created ${teamCount} teams\n`);

  // ========== CLUB MEMBERSHIPS ==========
  console.log("🤝 Creating club memberships...");

  let membershipCount = 0;
  for (const club of clubs) {
    // Each club gets 5-8 players and 2-3 coaches
    const numPlayers = 5 + Math.floor(Math.random() * 4);
    const numCoaches = 2 + (Math.random() > 0.5 ? 1 : 0);

    // Add players
    for (let i = 0; i < numPlayers; i++) {
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const existingMember = await prisma.clubMember.findUnique({
        where: {
          clubId_userId: {
            clubId: club.id,
            userId: randomPlayer.id,
          },
        },
      });

      if (!existingMember) {
        await prisma.clubMember.create({
          data: {
            clubId: club.id,
            userId: randomPlayer.id,
            roleInClub: Math.random() > 0.8 ? "CAPTAIN" : "MEMBER",
            status: "ACTIVE",
          },
        });
        membershipCount++;
      }
    }

    // Add coaches
    for (let i = 0; i < numCoaches; i++) {
      const randomCoach = coaches[Math.floor(Math.random() * coaches.length)];
      const existingMember = await prisma.clubMember.findUnique({
        where: {
          clubId_userId: {
            clubId: club.id,
            userId: randomCoach.id,
          },
        },
      });

      if (!existingMember) {
        await prisma.clubMember.create({
          data: {
            clubId: club.id,
            userId: randomCoach.id,
            roleInClub: "COACH",
            status: "ACTIVE",
          },
        });
        membershipCount++;
      }
    }
  }

  console.log(`✅ Created ${membershipCount} memberships\n`);

  // ========== POSTS ==========
  console.log("📝 Creating posts...");

  const postContents = [
    "Amazing training session today! Feeling stronger every day 💪🏒",
    "Game day tomorrow! Let's bring home the win! 🔥",
    "New season, new goals. Ready to give it all! ⚡",
    "Great team chemistry today. We're ready for the championship! 🏆",
    "Recovery day but the mind never rests. Studying game tapes 🎥",
    "Youth clinic this weekend! Can't wait to inspire the next generation 🌟",
    "Intense practice session. Love this team! ❤️",
    "Big announcement coming soon... stay tuned! 👀",
    "Grateful for another day doing what I love 🙏",
    "Tournament starts next week. Preparation mode activated! 💯",
    "New training equipment arrived! Time to level up 📈",
    "Team bonding dinner tonight. Family matters! 🍝",
    "Fitness test completed. Personal best! Let's go! 🚀",
    "Throwback to our championship victory. Hungry for more! 🥇",
    "Morning skate session. The ice is calling! ⛸️",
    "Tactical meeting today. Strategy is key! 🧠",
    "Community event was amazing! Thank you all for the support! 🤗",
    "Hard work beats talent when talent doesn't work hard! 💪",
    "Behind every success is a mountain of failures. Keep climbing! ⛰️",
    "New club merchandise available! Looking fresh! 👕",
  ];

  const postImages = [
    "https://images.unsplash.com/photo-1517649763962-0c623066013b",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
    "https://images.unsplash.com/photo-1461532257246-777de18cd58b",
    "https://images.unsplash.com/photo-1566085849139-df876562723c",
    "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4",
    "https://images.unsplash.com/photo-1511886929837-354d827aae26",
    "https://images.unsplash.com/photo-1519505907962-0a6cb0167c73",
    "https://images.unsplash.com/photo-1517650862521-d580d5348145",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38",
  ];

  const posts = [];

  // User posts (40 posts)
  for (let i = 0; i < 40; i++) {
    const randomPlayer = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];
    const post = await prisma.post.create({
      data: {
        content: postContents[Math.floor(Math.random() * postContents.length)],
        imageUrl: postImages[Math.floor(Math.random() * postImages.length)],
        authorType: "USER",
        authorId: randomPlayer.id,
      },
    });
    posts.push(post);
  }

  // Club posts (20 posts)
  for (let i = 0; i < 20; i++) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    const clubPostContents = [
      `🏒 Exciting news from ${randomClub.name}! New season tickets available now!`,
      `🎉 Welcome to our new players! Together we're unstoppable!`,
      `📅 Match schedule for this month is out! Check it on our website.`,
      `👏 Congratulations to our U18 team for their amazing victory!`,
      `🔴 Live match today at 18:00! Don't miss it!`,
      `💙 Thank you to all our fans for the incredible support!`,
      `🏆 Championship finals next week. We believe in our team!`,
      `📢 Tryouts next Saturday for all age categories. Join us!`,
      `🌟 Player of the month announcement coming soon!`,
      `⚡ Training camp registration is now open!`,
    ];

    const post = await prisma.post.create({
      data: {
        content:
          clubPostContents[Math.floor(Math.random() * clubPostContents.length)],
        imageUrl: `https://logo.clearbit.com/hockey.com`, // Club shield
        authorType: "CLUB",
        authorId: randomClub.id,
      },
    });
    posts.push(post);
  }

  console.log(
    `✅ Created ${posts.length} posts (40 from users, 20 from clubs)\n`
  );

  // ========== COMMENTS ==========
  console.log("💬 Creating comments...");

  const commentTexts = [
    "¡Increíble! 🔥",
    "Let's go team! 💪",
    "Amazing work! Keep it up!",
    "¡Vamos! 🏒",
    "This is what I'm talking about!",
    "Inspiring! 🌟",
    "Can't wait to see this!",
    "Proud of you all! ❤️",
    "Great job! 👏",
    "This team is going places! 🚀",
    "Absolutely brilliant!",
    "So excited for this season!",
    "Legend! 🙌",
    "You guys are the best!",
    "What a team! 💯",
  ];

  let commentCount = 0;
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 5) + 1; // 1-5 comments per post

    for (let i = 0; i < numComments; i++) {
      const randomUser = [...players, ...coaches][
        Math.floor(Math.random() * (players.length + coaches.length))
      ];
      await prisma.comment.create({
        data: {
          content:
            commentTexts[Math.floor(Math.random() * commentTexts.length)],
          postId: post.id,
          authorId: randomUser.id,
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
    const numLikes = Math.floor(Math.random() * 15) + 5; // 5-20 likes per post

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
        // Skip if user already liked this post
      }
    }
  }

  console.log(`✅ Created ${likeCount} likes\n`);

  // ========== FOLLOWS ==========
  console.log("👥 Creating follows...");

  let followCount = 0;

  // Users following users
  for (let i = 0; i < 50; i++) {
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
        // Skip if already following
      }
    }
  }

  // Users following clubs
  for (let i = 0; i < 30; i++) {
    const user = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];
    const club = clubs[Math.floor(Math.random() * clubs.length)];

    try {
      await prisma.follow.create({
        data: {
          followerType: "USER",
          followerId: user.id,
          followingType: "CLUB",
          followingId: club.id,
        },
      });
      followCount++;
    } catch (error) {
      // Skip if already following
    }
  }

  console.log(`✅ Created ${followCount} follow relationships\n`);

  // ========== JOB OPPORTUNITIES ==========
  console.log("💼 Creating job opportunities...");

  const jobOpportunities = [];
  const jobTitles = [
    {
      title: "Buscamos Delantero Senior",
      type: "PLAYER",
      desc: "Club busca delantero experimentado para temporada 2025.",
    },
    {
      title: "Entrenador Juvenil",
      type: "COACH",
      desc: "Se necesita entrenador para categoría Sub-18 con experiencia.",
    },
    {
      title: "Portero Suplente",
      type: "PLAYER",
      desc: "Buscamos portero para reforzar el plantel.",
    },
    {
      title: "Preparador Físico",
      type: "STAFF",
      desc: "Se requiere preparador físico titulado.",
    },
    {
      title: "Defensor Central",
      type: "PLAYER",
      desc: "Club de primera división busca defensor con experiencia.",
    },
    {
      title: "Entrenador Principal",
      type: "COACH",
      desc: "Buscamos entrenador con licencia UEFA Pro.",
    },
    {
      title: "Mediocampista Ofensivo",
      type: "PLAYER",
      desc: "Se busca mediocampista creativo para equipo competitivo.",
    },
    {
      title: "Asistente Técnico",
      type: "STAFF",
      desc: "Club busca asistente técnico  con experiencia en análisis táctico.",
    },
  ];

  for (let i = 0; i < 8; i++) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    const job = jobTitles[i];

    const jobOpp = await prisma.jobOpportunity.create({
      data: {
        title: job.title,
        description: job.desc,
        positionType: job.type as any,
        clubId: randomClub.id,
        country: randomClub.location?.includes("España")
          ? "España"
          : "Argentina",
        city: randomClub.location?.split(",")[0] || "Buenos Aires",
        salary:
          Math.random() > 0.5
            ? 30000 + Math.floor(Math.random() * 70000)
            : null,
        currency: randomClub.location?.includes("España") ? "EUR" : "ARS",
        benefits: "Seguro médico, equipamiento completo, viáticos de viaje",
        status: i % 4 === 0 ? "FILLED" : "OPEN",
      },
    });
    jobOpportunities.push(jobOpp);
  }

  console.log(`✅ Created ${jobOpportunities.length} job opportunities\n`);

  // ========== CONVERSATIONS & MESSAGES ==========
  console.log("💬 Creating conversations and messages...");

  const conversations = [];

  for (let i = 0; i < 15; i++) {
    const user1 = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];
    const user2 = [...players, ...coaches][
      Math.floor(Math.random() * (players.length + coaches.length))
    ];

    if (user1.id !== user2.id) {
      const conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: [{ id: user1.id }, { id: user2.id }],
          },
        },
      });
      conversations.push(conversation);

      // Add 3-6 messages to each conversation
      const numMessages = 3 + Math.floor(Math.random() * 4);
      const messageTexts = [
        "Hey! How's training going?",
        "Great! We have a match next week.",
        "Awesome! Good luck with that!",
        "Thanks! Want to practice together sometime?",
        "Sure, I'm free this weekend.",
        "Perfect! See you then! 🏒",
      ];

      for (let j = 0; j < numMessages; j++) {
        const sender = j % 2 === 0 ? user1 : user2;
        await prisma.message.create({
          data: {
            content: messageTexts[j % messageTexts.length],
            conversationId: conversation.id,
            senderId: sender.id,
            isRead: Math.random() > 0.3, // 70% of messages are read
          },
        });
      }
    }
  }

  console.log(
    `✅ Created ${conversations.length} conversations with messages\n`
  );

  // ========== SUMMARY ==========
  console.log("📊 SEED SUMMARY:");
  console.log(`   🏒 Clubs: ${clubs.length}`);
  console.log(`   ⛸️  Players: ${players.length}`);
  console.log(`   👔 Coaches: ${coaches.length}`);
  console.log(`   👥 Teams: ${teamCount}`);
  console.log(`   🤝 Memberships: ${membershipCount}`);
  console.log(`   📝 Posts: ${posts.length}`);
  console.log(`   💬 Comments: ${commentCount}`);
  console.log(`   ❤️  Likes: ${likeCount}`);
  console.log(`   👥 Follows: ${followCount}`);
  console.log(`   💼 Job Opportunities: ${jobOpportunities.length}`);
  console.log(`   💬 Conversations: ${conversations.length}\n`);

  console.log("✅ Database seeding completed successfully! 🎉\n");
  console.log("🔐 All users have password: password123\n");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
