const admin = require("firebase-admin");
const serviceAccount = require("../ser-mais-7d338-firebase-adminsdk-fbsvc-286bdbbf34.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const courses = [
  {
    title: "Iniciando no Desenvolvimento Web",
    category: "Programação",
    description: "Aprenda as bases do HTML, CSS e JavaScript para criar seus primeiros sites profissionais.",
    modules: [
      {
        title: "Fundamentos",
        lessons: [
          { title: "O que é a Web?", videoUrl: "https://www.youtube.com/watch?v=sS_YVb-7q70" },
          { title: "HTML Básico", videoUrl: "https://www.youtube.com/watch?v=Ejkb_YpuHWs" }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    title: "Design UX/UI Masterclass",
    category: "Design",
    description: "Crie interfaces incríveis e entenda a jornada do usuário do início ao fim.",
    modules: [
      {
        title: "Introdução ao Figma",
        lessons: [
          { title: "Ferramentas Básicas", videoUrl: "https://www.youtube.com/watch?v=jk1T6baZ68k" }
        ]
      }
    ],
    createdAt: new Date().toISOString()
  }
];

async function seed() {
  console.log("Iniciando seed do Firebase...");
  
  const coursesRef = db.collection("courses");
  
  for (const course of courses) {
    const doc = await coursesRef.add(course);
    console.log(`Curso criado: ${course.title} (ID: ${doc.id})`);
  }

  // Create admin user
  const usersRef = db.collection("users");
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash("password123", 12);

  const adminUser = {
    name: "Administrador",
    email: "admin@sermais.com.br",
    password: hashedPassword,
    role: "ADMIN",
    nivel: 10,
    xp: 5000,
    createdAt: new Date().toISOString()
  };
  
  const existingAdmin = await usersRef.where("email", "==", "admin@sermais.com.br").get();
  if (existingAdmin.empty) {
    await usersRef.add(adminUser);
    console.log("Usuário Administrador criado: admin@sermais.com.br");
  } else {
    await usersRef.doc(existingAdmin.docs[0].id).update({ password: hashedPassword, role: "ADMIN" });
    console.log("Senha do Administrador atualizada!");
  }

  console.log("Seed finalizado com sucesso!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Erro no seed:", err);
  process.exit(1);
});
