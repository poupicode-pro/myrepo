import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const books = [
  {
    title: 'The Awakening',
    authorId: 1,
    categoryId: 1,
    publicationDate: new Date('1899-04-22'),
  },
  {
    title: 'City of Glass',
    authorId: 2,
    categoryId: 1,
    publicationDate: new Date('1985-03-12'),
  },
  {
    title: 'The Awakening2',
    authorId: 1,
    categoryId: 2,
    publicationDate: new Date('1899-04-22'),
  },
  {
    title: 'City of Glass2',
    authorId: 2,
    categoryId: 2,
    publicationDate: new Date('1985-03-12'),
  },
];

const categories = [
  {
    name: 'Fiction',
  },
  {
    name: 'Novel',
  },
];

const authors = [
  {
    name: 'Kate Chopin',
  },
  {
    name: 'Paul Auster',
  },
];

async function main() {
  // Seed Categories
  for (const category of categories) {
    await prisma.categorie.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
  }

  // Seed Authors
  for (const author of authors) {
    await prisma.author.upsert({
      where: { name: author.name },
      update: {},
      create: {
        name: author.name,
      },
    });
  }

  // Seed Books
  for (const book of books) {
    await prisma.book.create({
      data: {
        title: book.title,
        publicationDate: book.publicationDate,
        author: { connect: { id: book.authorId } },
        categorie: { connect: { id: book.categoryId } },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });