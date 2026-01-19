import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.storyView.deleteMany();
  await prisma.story.deleteMany();
  await prisma.share.deleteMany();
  await prisma.commentLike.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.jobOpportunity.deleteMany();
  await prisma.statistics.deleteMany();
  await prisma.trajectory.deleteMany();
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

  // ========== FIELD HOCKEY CLUBS ==========
  console.log("🏑 Creating field hockey clubs...");

  const clubs = await Promise.all([
    // Spanish field hockey clubs
    prisma.club.create({
      data: {
        name: "Club de Campo Villa de Madrid",
        city: "Madrid",
        country: "🇪🇸 España",
        league: "División de Honor",
        foundedYear: 1929,
        description: "One of the most prestigious field hockey clubs in Spain",
        bio: "Excellence in field hockey since 1929",
        logo: "https://logo.clearbit.com/clubdecampo.es",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "RC Polo Barcelona",
        city: "Barcelona",
        country: "🇪🇸 España",
        league: "División de Honor",
        foundedYear: 1897,
        description:
          "Historic Barcelona field hockey club with multiple championships",
        bio: "Tradition and excellence in field hockey",
        logo: "https://logo.clearbit.com/rcpolo.com",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Real Club de Polo",
        city: "Barcelona",
        country: "🇪🇸 España",
        league: "División de Honor",
        foundedYear: 1942,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "CD Terrassa HC",
        city: "Terrassa",
        country: "🇪🇸 España",
        league: "División de Honor",
        foundedYear: 1952,
        description: "European champion field hockey club",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Atlètic Terrassa HC",
        city: "Terrassa",
        country: "🇪🇸 España",
        league: "División de Honor",
        foundedYear: 1952,
        isVerified: true,
      },
    }),
    // Argentinian field hockey clubs
    prisma.club.create({
      data: {
        name: "Club Atlético San Isidro",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Metropolitano A",
        foundedYear: 1902,
        description: "Historic Argentine field hockey powerhouse",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Atletico Belgrano",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Metropolitano A",
        foundedYear: 1896,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Gimnasia y Esgrima Buenos Aires",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Metropolitano A",
        foundedYear: 1880,
        description: "One of Argentina's oldest sports clubs",
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Club Italiano",
        city: "Buenos Aires",
        country: "🇦🇷 Argentina",
        league: "Metropolitano A",
        foundedYear: 1900,
        isVerified: false,
      },
    }),
    prisma.club.create({
      data: {
        name: "Lomas Athletic Club",
        city: "Lomas de Zamora",
        country: "🇦🇷 Argentina",
        league: "Metropolitano A",
        foundedYear: 1891,
        isVerified: true,
      },
    }),
    // International clubs
    prisma.club.create({
      data: {
        name: "HC Rotterdam",
        city: "Rotterdam",
        country: "🇳🇱 Netherlands",
        league: "Hoofdklasse",
        foundedYear: 1925,
        isVerified: true,
      },
    }),
    prisma.club.create({
      data: {
        name: "Amsterdam HC",
        city: "Amsterdam",
        country: "🇳🇱 Netherlands",
        league: "Hoofdklasse",
        foundedYear: 1892,
        isVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${clubs.length} clubs\n`);

  // ========== PLAYERS ==========
  console.log("🏃 Creating field hockey players...");

  const playerData = [
    {
      username: "lucia_jimenez",
      email: "lucia@hockey-test.com",
      name: "Lucía Jiménez",
      position: "Forward",
      country: "🇪🇸",
      city: "Madrid",
    },
    {
      username: "pablo_alvarez",
      email: "pablo@hockey-test.com",
      name: "Pablo Álvarez",
      position: "Midfielder",
      country: "🇪🇸",
      city: "Barcelona",
    },
    {
      username: "lucas_martinez",
      email: "lucas@hockey-test.com",
      name: "Lucas Martínez",
      position: "Defender",
      country: "🇦🇷",
      city: "Buenos Aires",
    },
    {
      username: "sofia_fernandez",
      email: "sofia@hockey-test.com",
      name: "Sofía Fernández",
      position: "Goalkeeper",
      country: "🇪🇸",
      city: "Madrid",
    },
    {
      username: "juan_rodriguez",
      email: "juan@hockey-test.com",
      name: "Juan Rodríguez",
      position: "Forward",
      country: "🇦🇷",
      city: "Buenos Aires",
    },
    {
      username: "maria_lopez",
      email: "maria@hockey-test.com",
      name: "María López",
      position: "Defender",
      country: "🇪🇸",
      city: "Barcelona",
    },
    {
      username: "mateo_garcia",
      email: "mateo@hockey-test.com",
      name: "Mateo García",
      position: "Midfielder",
      country: "🇦🇷",
      city: "Córdoba",
    },
    {
      username: "valentina_sanchez",
      email: "valentina@hockey-test.com",
      name: "Valentina Sánchez",
      position: "Forward",
      country: "🇦🇷",
      city: "Rosario",
    },
    {
      username: "miguel_torres",
      email: "miguel@hockey-test.com",
      name: "Miguel Torres",
      position: "Defender",
      country: "🇪🇸",
      city: "Valencia",
    },
    {
      username: "camila_ramirez",
      email: "camila@hockey-test.com",
      name: "Camila Ramírez",
      position: "Goalkeeper",
      country: "🇦🇷",
      city: "Mendoza",
    },
    {
      username: "alejandro_flores",
      email: "alejandro@hockey-test.com",
      name: "Alejandro Flores",
      position: "Midfielder",
      country: "🇪🇸",
      city: "Sevilla",
    },
    {
      username: "isabella_moreno",
      email: "isabella@hockey-test.com",
      name: "Isabella Moreno",
      position: "Forward",
      country: "🇦🇷",
      city: "La Plata",
    },
    {
      username: "ricardo_gutierrez",
      email: "ricardo@hockey-test.com",
      name: "Ricardo Gutiérrez",
      position: "Defender",
      country: "🇪🇸",
      city: "Bilbao",
    },
    {
      username: "martina_diaz",
      email: "martina@hockey-test.com",
      name: "Martina Díaz",
      position: "Midfielder",
      country: "🇦🇷",
      city: "Tucumán",
    },
    {
      username: "roberto_vazquez",
      email: "roberto@hockey-test.com",
      name: "Roberto Vázquez",
      position: "Forward",
      country: "🇪🇸",
      city: "Zaragoza",
    },
    {
      username: "florencia_castillo",
      email: "florencia@hockey-test.com",
      name: "Florencia Castillo",
      position: "Goalkeeper",
      country: "🇦🇷",
      city: "Salta",
    },
    {
      username: "francisco_ramos",
      email: "francisco@hockey-test.com",
      name: "Francisco Ramos",
      position: "Defender",
      country: "🇪🇸",
      city: "Granada",
    },
    {
      username: "catalina_mendoza",
      email: "catalina@hockey-test.com",
      name: "Catalina Mendoza",
      position: "Midfielder",
      country: "🇦🇷",
      city: "San Juan",
    },
    {
      username: "manuel_ortiz",
      email: "manuel@hockey-test.com",
      name: "Manuel Ortiz",
      position: "Forward",
      country: "🇪🇸",
      city: "Málaga",
    },
    {
      username: "delfina_silva",
      email: "delfina@hockey-test.com",
      name: "Delfina Silva",
      position: "Defender",
      country: "🇦🇷",
      city: "Mar del Plata",
    },
    {
      username: "diego_herrera",
      email: "diego@hockey-test.com",
      name: "Diego Herrera",
      position: "Midfielder",
      country: "🇪🇸",
      city: "Murcia",
    },
    {
      username: "agustina_navarro",
      email: "agustina@hockey-test.com",
      name: "Agustina Navarro",
      position: "Forward",
      country: "🇦🇷",
      city: "Neuquén",
    },
    {
      username: "carlos_ruiz",
      email: "carlos@hockey-test.com",
      name: "Carlos Ruiz",
      position: "Goalkeeper",
      country: "🇪🇸",
      city: "Santander",
    },
    {
      username: "milagros_vega",
      email: "milagros@hockey-test.com",
      name: "Milagros Vega",
      position: "Defender",
      country: "🇦🇷",
      city: "Santa Fe",
    },
    {
      username: "javier_castro",
      email: "javier@hockey-test.com",
      name: "Javier Castro",
      position: "Midfielder",
      country: "🇪🇸",
      city: "Oviedo",
    },
  ];

  // Helper function to determine gender from name
  const getGenderFromName = (name: string): "male" | "female" => {
    const femaleNames = [
      "Lucía",
      "Sofía",
      "María",
      "Valentina",
      "Camila",
      "Isabella",
      "Martina",
      "Florencia",
      "Catalina",
      "Delfina",
      "Agustina",
      "Milagros",
    ];
    const firstName = name.split(" ")[0];
    return femaleNames.includes(firstName) ? "female" : "male";
  };

  const players = await Promise.all(
    playerData.map((player, index) => {
      const gender = getGenderFromName(player.name);
      const genderPath = gender === "female" ? "women" : "men";
      const imageNumber = index % 80; // randomuser.me has 0-99, use 0-79 for variety

      return prisma.user.create({
        data: {
          email: player.email,
          username: player.username,
          name: player.name,
          password: hashedPassword,
          role: "PLAYER",
          position: player.position,
          bio: `Passionate field hockey player. Training hard every day! 🏑`,
          avatar: `https://randomuser.me/api/portraits/${genderPath}/${imageNumber}.jpg`,
          country: player.country,
          city: player.city,
          yearsOfExperience: 3 + (index % 12),
          isVerified: index % 4 === 0,
          isEmailVerified: index % 3 === 0, // ~33% have verified emails
        },
      });
    }),
  );

  console.log(`✅ Created ${players.length} players\n`);

  // ========== COACHES ==========
  console.log("👔 Creating field hockey coaches...");

  const coachData = [
    {
      username: "coach_martinez",
      email: "coach.martinez@hockey-test.com",
      name: "Carlos Martínez",
      country: "🇪🇸",
      city: "Madrid",
    },
    {
      username: "coach_perez",
      email: "coach.perez@hockey-test.com",
      name: "Ana Pérez",
      country: "🇪🇸",
      city: "Barcelona",
    },
    {
      username: "coach_gonzalez",
      email: "coach.gonzalez@hockey-test.com",
      name: "Roberto González",
      country: "🇦🇷",
      city: "Buenos Aires",
    },
    {
      username: "coach_fernandez",
      email: "coach.fernandez@hockey-test.com",
      name: "Laura Fernández",
      country: "🇦🇷",
      city: "Rosario",
    },
    {
      username: "coach_sanchez",
      email: "coach.sanchez@hockey-test.com",
      name: "Miguel Sánchez",
      country: "🇪🇸",
      city: "Valencia",
    },
    {
      username: "coach_rodriguez",
      email: "coach.rodriguez@hockey-test.com",
      name: "Patricia Rodríguez",
      country: "🇦🇷",
      city: "Córdoba",
    },
    {
      username: "coach_garcia",
      email: "coach.garcia@hockey-test.com",
      name: "Fernando García",
      country: "🇪🇸",
      city: "Sevilla",
    },
    {
      username: "coach_lopez",
      email: "coach.lopez@hockey-test.com",
      name: "Gabriela López",
      country: "🇦🇷",
      city: "Mendoza",
    },
  ];

  const coaches = await Promise.all(
    coachData.map((coach, index) => {
      const gender = getGenderFromName(coach.name);
      const genderPath = gender === "female" ? "women" : "men";
      const imageNumber = (index + 25) % 80; // Offset to avoid same images as players

      return prisma.user.create({
        data: {
          email: coach.email,
          username: coach.username,
          name: coach.name,
          password: hashedPassword,
          role: "COACH",
          bio: `Professional field hockey coach with ${
            10 + index * 2
          } years of experience. Developing champions on and off the field! 🏑`,
          avatar: `https://randomuser.me/api/portraits/${genderPath}/${imageNumber}.jpg`,
          country: coach.country,
          city: coach.city,
          yearsOfExperience: 10 + index * 2,
          isVerified: index % 2 === 0,
          isEmailVerified: index % 2 === 0, // 50% have verified emails
        },
      });
    }),
  );

  console.log(`✅ Created ${coaches.length} coaches\n`);

  // ========== POSTS ==========
  console.log("📝 Creating field hockey posts...");

  const postContents = [
    "Amazing training session today! Feeling stronger every day 💪🏑",
    "Game day tomorrow! Let's bring home the win! 🔥",
    "New season, new goals. Ready to give it all! ⚡",
    "Great team chemistry today. We're ready for the championship! 🏆",
    "Recovery day but the mind never rests. Studying game tapes 🎥",
    "Just scored the winning goal in overtime! What a rush! 🎯",
    "Proud of my team's performance today. Hard work pays off! 💯",
    "Early morning training hits different when you love what you do 🌅",
    "Shoutout to my teammates for the amazing assist! Teamwork makes the dream work! 🤝",
    "Working on penalty corners today. Precision is everything! 🎯",
    "First game of the season and we dominated! Let's keep this momentum! 🚀",
    "Tough loss today, but we'll come back stronger. That's the spirit! 💪",
    "Nothing beats the feeling of playing on home turf! 🏟️",
    "Training in the rain? No problem. We're built different! ☔🏑",
    "Celebrating our club's 100th anniversary! Proud to be part of this legacy! 🎉",
    "International tournament next week. Representing my country! 🌍",
    "Just had the best practice session with the national team! 🇦🇷🇪🇸",
    "Goalkeeper training is no joke! Respect to all my fellow keepers! 🧤",
    "Speed and agility drills today. Getting faster every week! ⚡",
    "Match day atmosphere is unbeatable! Thanks to all the fans! 👏",
    "Working with an amazing coach who pushes me to be my best! 🙏",
    "Summer hockey camp starts next week! Can't wait to meet the kids! 👶🏑",
    "Pre-season fitness test complete. Ready for the new season! 📊",
    "Beautiful day for outdoor training! Love this sport! ☀️",
    "Championship final in 3 days. The preparation is real! 🏆",
    "Honored to captain this amazing team! Leadership is a privilege! ©️",
    "Recovery session: ice baths and stretching. Taking care of the body! 🧊",
    "Watching game footage and learning from mistakes. Always improving! 📹",
    "New hockey sticks arrived! Can't wait to test them out! 🏑✨",
    "Team bonding dinner tonight. This squad is family! 🍽️❤️",
  ];

  // Field hockey images from Cloudinary CDN (production-ready)
  const postImages = [
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796905/hockey-connect/posts/hockey_action.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796907/hockey-connect/posts/hockey_training.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796908/hockey-connect/posts/hockey_celebration.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796910/hockey-connect/posts/hockey_goalkeeper.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796913/hockey-connect/posts/hockey_equipment.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796915/hockey-connect/posts/hockey_match.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796917/hockey-connect/posts/hockey_youth.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796918/hockey-connect/posts/hockey_stadium.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796920/hockey-connect/posts/hockey_victory.jpg",
    "https://res.cloudinary.com/dlv9qzhzr/image/upload/v1767796922/hockey-connect/posts/hockey_practice.jpg",
  ];

  const posts = [];
  const allUsers = [...players, ...coaches];

  // Create 40 varied user posts
  for (let i = 0; i < 40; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const hasImage = Math.random() > 0.2; // 80% of posts have images
    const hasMultipleImages = hasImage && Math.random() > 0.6; // 40% of image posts have multiple images

    const post = await prisma.post.create({
      data: {
        content: postContents[Math.floor(Math.random() * postContents.length)],
        userId: randomUser.id,
        imageUrl: hasImage
          ? postImages[Math.floor(Math.random() * postImages.length)]
          : null,
        images: hasMultipleImages
          ? [
              postImages[Math.floor(Math.random() * postImages.length)],
              postImages[Math.floor(Math.random() * postImages.length)],
              postImages[Math.floor(Math.random() * postImages.length)],
            ]
          : [],
        visibility: i % 7 === 0 ? "FRIENDS" : "PUBLIC",
        isPinned: i % 15 === 0,
      },
    });
    posts.push(post);
  }

  // Club posts (15 posts)
  const clubPostContents = [
    "🏑 Exciting news! Registration for the new season is now open!",
    "Congratulations to our U18 team for winning the regional championship! 🏆",
    "Join us this Saturday for our open training day! Everyone welcome! 🙌",
    "We're proud to announce our new partnership with [Sponsor]. Together we're stronger! 💪",
    "Match day! Come support our first team against our rivals! 🔥",
    "Throwback to our historic championship win 5 years ago! Great memories! 📸",
    "New club merchandise available now in our online store! 🛍️",
    "Thanks to all our volunteers who make this club special! ❤️",
    "Summer hockey camp registration opens next week! Limited spots! 🏕️",
    "Congratulations to [Player] for being selected for the national team! 🇪🇸🇦🇷",
    "Facilities upgrade complete! New state-of-the-art training ground! 🏟️",
    "Club trials next month! Looking for talented players to join our family! 🔍",
    "Celebrating 50 years of field hockey excellence! 🎉",
    "Important: Season schedule has been updated. Check the website for details! 📅",
    "Our women's team just qualified for the European Cup! Historic moment! 🌍",
  ];

  for (let i = 0; i < 15; i++) {
    const randomClub = clubs[Math.floor(Math.random() * clubs.length)];
    const randomAdmin =
      players[Math.floor(Math.random() * Math.min(5, players.length))];

    const post = await prisma.post.create({
      data: {
        content: clubPostContents[i],
        userId: randomAdmin.id,
        clubId: randomClub.id,
        isClubPost: true,
        imageUrl: postImages[Math.floor(Math.random() * postImages.length)],
        visibility: "PUBLIC",
        isPinned: i < 2,
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
    "¡Vamos! 🏑",
    "So proud of you!",
    "Keep it up! 👏",
    "Legendary performance!",
    "You're an inspiration! ⭐",
    "This is what dedication looks like!",
    "Can't wait for the next match!",
    "Love the energy! ⚡",
    "Best team in the league! 🏆",
    "Respect! 🙌",
    "Hard work paying off!",
    "Absolutely brilliant! 💯",
  ];

  let commentCount = 0;
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 5) + 1; // 1-5 comments per post
    for (let i = 0; i < numComments; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
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
    const numLikes = Math.floor(Math.random() * 15) + 5; // 5-20 likes per post
    const shuffledUsers = [...allUsers].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(numLikes, shuffledUsers.length); i++) {
      try {
        await prisma.like.create({
          data: {
            postId: post.id,
            userId: shuffledUsers[i].id,
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
  // Create a more realistic follow network
  for (let i = 0; i < 60; i++) {
    const follower = allUsers[Math.floor(Math.random() * allUsers.length)];
    const following = allUsers[Math.floor(Math.random() * allUsers.length)];

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
      title: "Forward Player Needed",
      type: "PLAYER",
      level: "PROFESSIONAL",
      desc: "Looking for an experienced forward to join our first team. Must have at least 3 years of competitive experience.",
      salary: 28000,
      currency: "EUR",
    },
    {
      title: "Youth Team Coach",
      type: "COACH",
      level: "AMATEUR",
      desc: "We need an enthusiastic coach for our U16 team. Experience with youth development preferred.",
      salary: 32000,
      currency: "EUR",
    },
    {
      title: "Defensive Player",
      type: "PLAYER",
      level: "AMATEUR",
      desc: "Defensive position open for the upcoming season. Strong tackling skills required.",
      salary: 24000,
      currency: "EUR",
    },
    {
      title: "Goalkeeper Required",
      type: "PLAYER",
      level: "PROFESSIONAL",
      desc: "First team goalkeeper position available. Must have national league experience.",
      salary: 30000,
      currency: "EUR",
    },
    {
      title: "Head Coach Position",
      type: "COACH",
      level: "PROFESSIONAL",
      desc: "Senior coaching role for our premier team. 5+ years experience required.",
      salary: 45000,
      currency: "EUR",
    },
    {
      title: "Fitness Trainer",
      type: "STAFF",
      level: "PROFESSIONAL",
      desc: "Certified fitness trainer needed for professional team preparation.",
      salary: 26000,
      currency: "EUR",
    },
    {
      title: "Midfielder - Professional Contract",
      type: "PLAYER",
      level: "PROFESSIONAL",
      desc: "Seeking creative midfielder with excellent passing ability.",
      salary: 25000,
      currency: "EUR",
    },
    {
      title: "Assistant Coach",
      type: "COACH",
      level: "PROFESSIONAL",
      desc: "Assistant coaching position for first team. Tactical knowledge essential.",
      salary: 28000,
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
        level: job.level as any,
        clubId: randomClub.id,
        country: randomClub.country,
        city: randomClub.city,
        salary: job.salary,
        currency: job.currency as any,
        status: Math.random() > 0.2 ? "OPEN" : "FILLED", // 80% open
        benefits:
          "Medical insurance, accommodation support, full equipment, training facilities",
      },
    });
  }

  console.log(`✅ Created ${jobData.length} job opportunities\n`);

  // ========== STATISTICS ==========
  console.log("📊 Creating statistics...");

  let statsCount = 0;

  // Create statistics for players
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const position = player.position;

    // Career stats (aggregate)
    const careerStats = await prisma.statistics.create({
      data: {
        userId: player.id,
        season: "Career",
        gamesPlayed: 120 + Math.floor(Math.random() * 100),
        goals:
          position === "Forward"
            ? 30 + Math.floor(Math.random() * 50)
            : position === "Midfielder"
              ? 15 + Math.floor(Math.random() * 30)
              : position === "Defender"
                ? 5 + Math.floor(Math.random() * 15)
                : 0, // Goalkeeper
        assists:
          position === "Midfielder"
            ? 40 + Math.floor(Math.random() * 30)
            : position === "Forward"
              ? 20 + Math.floor(Math.random() * 20)
              : position === "Defender"
                ? 10 + Math.floor(Math.random() * 15)
                : 0, // Goalkeeper
        points: 0, // Will be calculated
        wins: 0,
        losses: 0,
        draws: 0,
        cleanSheets:
          position === "Goalkeeper" ? 30 + Math.floor(Math.random() * 40) : 0,
        saves:
          position === "Goalkeeper" ? 400 + Math.floor(Math.random() * 300) : 0,
      },
    });

    // Update points
    await prisma.statistics.update({
      where: { id: careerStats.id },
      data: { points: careerStats.goals + careerStats.assists },
    });

    statsCount += 1;
  }

  // Create statistics for coaches
  for (const coach of coaches) {
    // Career stats only
    await prisma.statistics.create({
      data: {
        userId: coach.id,
        season: "Career",
        gamesPlayed: 200 + Math.floor(Math.random() * 150),
        goals: 0,
        assists: 0,
        points: 0,
        wins: 100 + Math.floor(Math.random() * 80),
        losses: 60 + Math.floor(Math.random() * 50),
        draws: 40 + Math.floor(Math.random() * 30),
        cleanSheets: 0,
        saves: 0,
      },
    });

    statsCount += 1; // Only 1 stat record per coach now
  }

  console.log(`✅ Created ${statsCount} statistics records\n`);

  // ========== TRAJECTORIES ==========
  console.log("🏆 Creating career trajectories...");

  let trajCount = 0;

  // Sample trajectory templates based on the image
  const trajectoryTemplates = [
    {
      organization: "Youth Academy",
      period: "2010-2015",
      description:
        "Beginning of my career - Started playing field hockey at the age of 10.",
      isCurrent: false,
      order: 0,
    },
    {
      organization: "Local Club",
      period: "2015-2020",
      description:
        "First professional experience - Developed fundamental skills and game understanding.",
      isCurrent: false,
      order: 1,
    },
    {
      organization: "National Team U21",
      period: "2018-2021",
      description:
        "Represented my country at youth level - Gained international experience.",
      isCurrent: false,
      order: 2,
    },
  ];

  // Create trajectories for ALL players (not just first 10)
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const playerClub = clubs[i % clubs.length];

    // Early career (youth)
    await prisma.trajectory.create({
      data: {
        userId: player.id,
        title: "Youth Player",
        organization: `${player.city} Youth Academy`,
        period: "2010-2016",
        description: `Beginning of my career as a ${player.position} - Started playing field hockey at the age of 10.`,
        startDate: new Date("2010-01-01"),
        endDate: new Date("2016-12-31"),
        isCurrent: false,
        order: 0,
      },
    });

    // Mid career (club)
    await prisma.trajectory.create({
      data: {
        userId: player.id,
        clubId: playerClub.id,
        title: player.position,
        organization: playerClub.name,
        period: "2017-2023",
        description:
          "First professional contract - Developed my skills and became a regular starter.",
        startDate: new Date("2017-01-01"),
        endDate: new Date("2023-12-31"),
        isCurrent: false,
        order: 1,
      },
    });

    // International experience (if applicable - every 3rd player)
    if (i % 3 === 0) {
      const intlClub = clubs[(i + 5) % clubs.length];
      await prisma.trajectory.create({
        data: {
          userId: player.id,
          clubId: intlClub.id,
          title: player.position,
          organization: intlClub.name,
          period: "2023-2024",
          description: `First international experience in ${intlClub.country} - First season, promotion to top division. Second season, competitive performance at elite level.`,
          startDate: new Date("2023-01-01"),
          endDate: new Date("2024-12-31"),
          isCurrent: false,
          order: 2,
        },
      });
      trajCount++;
    }

    // Current position
    const currentClub = clubs[(i + 2) % clubs.length];
    await prisma.trajectory.create({
      data: {
        userId: player.id,
        clubId: currentClub.id,
        title: player.position,
        organization: currentClub.name,
        period: "2024-Present",
        description: `Current club - Playing at ${currentClub.league || "professional"} level.`,
        startDate: new Date("2024-01-01"),
        isCurrent: true,
        order: 3,
      },
    });

    trajCount += 3; // At least 3 trajectories per player (4 for every 3rd player)
  }

  // Create trajectories for ALL coaches (not just first 5)
  for (let i = 0; i < coaches.length; i++) {
    const coach = coaches[i];
    const coachClub = clubs[i % clubs.length];

    // Playing career (many coaches were former players)
    await prisma.trajectory.create({
      data: {
        userId: coach.id,
        clubId: coachClub.id,
        title: "Professional Player",
        organization: coachClub.name,
        period: "2005-2012",
        description:
          "Professional playing career - Gained valuable experience as a player which now informs my coaching philosophy.",
        startDate: new Date("2005-01-01"),
        endDate: new Date("2012-12-31"),
        isCurrent: false,
        order: 0,
      },
    });

    // Assistant coach position
    const assistantClub = clubs[(i + 1) % clubs.length];
    await prisma.trajectory.create({
      data: {
        userId: coach.id,
        clubId: assistantClub.id,
        title: "Assistant Coach",
        organization: assistantClub.name,
        period: "2013-2018",
        description:
          "Started coaching career as assistant coach - Focused on tactical development and player training.",
        startDate: new Date("2013-01-01"),
        endDate: new Date("2018-12-31"),
        isCurrent: false,
        order: 1,
      },
    });

    // Youth team head coach (transition role)
    const youthClub = clubs[(i + 2) % clubs.length];
    await prisma.trajectory.create({
      data: {
        userId: coach.id,
        clubId: youthClub.id,
        title: "Youth Team Head Coach",
        organization: youthClub.name,
        period: "2019-2022",
        description:
          "Led youth development program - Focused on developing young talent and building strong team foundations.",
        startDate: new Date("2019-01-01"),
        endDate: new Date("2022-12-31"),
        isCurrent: false,
        order: 2,
      },
    });

    // Head coach position (current)
    const currentCoachClub = clubs[(i + 3) % clubs.length];
    await prisma.trajectory.create({
      data: {
        userId: coach.id,
        clubId: currentCoachClub.id,
        title: "Head Coach",
        organization: currentCoachClub.name,
        period: "2023-Present",
        description:
          "Promoted to head coach of first team - Leading the team to championships and developing young talent.",
        startDate: new Date("2023-01-01"),
        isCurrent: true,
        order: 3,
      },
    });

    trajCount += 4; // 4 trajectories per coach
  }

  console.log(`✅ Created ${trajCount} career trajectories\n`);

  console.log("🎉 Database seeded successfully!\n");
  console.log("📊 Summary:");
  console.log(`   - ${clubs.length} clubs`);
  console.log(`   - ${players.length} players`);
  console.log(`   - ${coaches.length} coaches`);
  console.log(`   - ${posts.length} posts`);
  console.log(`   - ${commentCount} comments`);
  console.log(`   - ${likeCount} likes`);
  console.log(`   - ${followCount} follows`);
  console.log(`   - ${jobData.length} job opportunities`);
  console.log(`   - ${statsCount} statistics records`);
  console.log(`   - ${trajCount} career trajectories\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
