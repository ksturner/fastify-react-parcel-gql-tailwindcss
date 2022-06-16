import path from 'path';
import fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';
import mercurius from 'mercurius';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';

const server: FastifyInstance = fastify({});

const schema = `
    type Query {
        add(x: Int, y: Int): Int
    }
`;
const resolvers = {
    Query: {
        add: async (_: any, { x, y }: any) => x + y,
    },
};
server.register(mercurius, { schema, resolvers }); // graphql plugin
server.register(fastifyCors, {
    origin: '*',
});
server.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    // prefix: '/public/', // optional, default '/'
});

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

server.get('/', {}, async (request, reply) => {
    return reply.sendFile('index.html');
});

server.get('/add', async (req, reply) => {
    const query = '{ add(x: 1, y: 2) }';
    return reply.graphql(query);
});

server.get('/ping', opts, async (request, reply) => {
    return { pong: 'it worked!' };
});

const start = async () => {
    try {
        await server.listen({ port: 3000 });

        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        console.log(`listening on http://localhost:${port}`);
    } catch (err) {
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
};
start();
