// Packages
import fastify from 'fastify';

// Helper
import Connection from './helpers/connection';
import dotEnv from 'dotenv';

// Configs
dotEnv.config();
const con = new Connection(fastify({ logger: false }));

// Server Up
con.server();
