import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const typeDefs = `#graphql
  type Book {
    id: Int!
    title: String!
    author: Author!
    categorie: Categorie
    publicationDate: String!  # Ajoute ce champ
  }

  type Author {
    id: Int!
    name: String!
    books: [Book!]!
  }

  type Categorie {
    id: Int!
    name: String!
    books: [Book!]!
  }

  type Query {
    books: [Book!]!
    bookById(id: Int!): Book
    authors: [Author!]!
    authorById(id: Int!): Author
    categories: [Categorie!]!
  }

  input CreateBookInput {
    title: String!
    authorId: Int!
    categorieId: Int!
    publicationDate: String!
  }

  type Mutation {
    createBook(input: CreateBookInput): Book!
  }
`;

const resolvers = {
    Query: {
        books: () => prisma.book.findMany(),
        bookById: (_, { id }) => prisma.book.findUnique({
            where: { id },
        }),
        authors: () => prisma.author.findMany(),
        authorById: (_, { id }) => prisma.author.findUnique({
            where: { id },
        }),
        categories: () => prisma.categorie.findMany(),
    },

    Mutation: {
        createBook: (_, { input }) => {
            const { title, authorId, categorieId, publicationDate } = input;
            return prisma.book.create({
                data: {
                    title,
                    publicationDate: new Date(publicationDate),
                    author: { connect: { id: authorId } },
                    categorie: { connect: { id: categorieId } },
                },
            });
        }
    },

    Book: {
        author: ({ authorId }) => prisma.author.findUnique({
            where: { id: authorId },
        }),
        categorie: ({ categorieId }) => prisma.categorie.findUnique({
            where: { id: categorieId },
        }),
    },

    Author: {
        books: ({ id }) => prisma.book.findMany({
            where: { authorId: id },
        }),
    },

    Categorie: {
        books: ({ id }) => prisma.book.findMany({
            where: { categorieId: id },
        }),
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);