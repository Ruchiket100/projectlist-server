"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    signup(name: String!, email:String!, password: String!) : AuthPayload
    login(username: String!, password: String!) : AuthPayload
    `;
